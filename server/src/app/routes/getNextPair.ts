import express, { Router, Response } from 'express';

import {
	CustomRequest,
	RunwayItem,
	TokenInput,
	AppData,
} from '../../../../types.js';
import {
	getNextPairService,
	updateRunwayScores,
} from '../database/services/runwayService.js';
import { updateUser } from '../database/services/userService.js';
import cleanUserObject from '../utilities/cleanUserObject.js';
import { logger } from '../middleware/logger.js';
import { generateToken } from '../middleware/jwtToken.js';

export default express
	.Router()
	.post('/get-next-pair', async (req: CustomRequest, res: Response) => {
		try {
			const { winner, loser } = req.body;
			let runways: RunwayItem[] | null = null;
			let noMorePairs = false;
			let scoresUpdated = false;

			const userId = req.user?.id || null;

			logger.info('Processing get-next-pair request', {
				userId,
				winner,
				loser,
			});

			if (userId && winner && loser) {
				await updateRunwayScores(winner, loser);
				const updatedUser = await updateUser({
					userId,
					newRunwayIds: [winner, loser],
				});
				req.user = cleanUserObject(updatedUser);
				scoresUpdated = true;
				logger.info('Scores updated', { userId, winner, loser });

				if (req.user) {
					const tokenInput: TokenInput = {
						_id: req.user.id.toString(),
						name: req.user.name,
						email: req.user.email,
						accessTopRunways: req.user.accessTopRunways,
						runwaysUntilAccess: req.user.runwaysUntilAccess,
					};
					generateToken(res, tokenInput);
					logger.info('New token generated for user', { userId });
				}
			}

			if (userId) {
				runways = await getNextPairService(userId);
				if (!runways) {
					noMorePairs = true;
					logger.info('No more pairs available for user', { userId });
				}
			} else {
				runways = await getNextPairService(null);
				logger.info('Retrieved next pair for anonymous user');
			}

			let message = scoresUpdated
				? 'Scores updated successfully'
				: 'Scores not updated';

			const responseObject: AppData = {
				message: {
					content: message,
					colour: 'blue',
				},
				isAuthenticated: !!userId,
				user: req.user ? cleanUserObject(req.user) : null,
				runways: runways,
				topRunways: null,
			};

			logger.info('Sending response', {
				authenticated: responseObject.isAuthenticated,
				hasNextPair: !!runways,
			});

			res.status(200).json(responseObject);
			return;
		} catch (error) {
			logger.error('Error in get-next-pair:', {
				error: error instanceof Error ? error.message : String(error),
				userId: req.user?.id,
			});

			res.status(500).json({
				message: 'Error processing request',
				authenticated: !!req.user,
				user: cleanUserObject(req.user),
			});
			return;
		}
	}) as Router;
