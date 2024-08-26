import express, { Router, Response } from 'express';

import {
	CustomRequest,
	RunwayItem,
	NextPairResponse,
	TokenInput,
} from '../../../../../types.js';
import {
	getNextPairService,
	updateRunwayScores,
} from '@/app/database/services/runwayService.js';
import { updateUser } from '@/app/database/services/userService.js';
import cleanUserObject from '@/app/utilities/cleanUserObject.js';
import { logger } from '@/app/middleware/logger.js';
import { generateToken } from '@/app/middleware/jwtToken.js';

export default express
	.Router()
	.post('/get-next-pair', async (req: CustomRequest, res: Response) => {
		try {
			const { winner, loser } = req.body;
			let nextPair: RunwayItem[] | null = null;
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
						_id: req.user.id,
						name: req.user.name,
						email: req.user.email,
						accessTopRunways: req.user.accessTopRunways,
						numRunwaysUntilAccess: req.user.numRunwaysUntilAccess,
					};
					generateToken(res, tokenInput);
					logger.info('New token generated for user', { userId });
				}
			}

			if (userId) {
				nextPair = await getNextPairService(userId);
				if (!nextPair) {
					noMorePairs = true;
					logger.info('No more pairs available for user', { userId });
				}
			} else {
				nextPair = await getNextPairService(null);
				logger.info('Retrieved next pair for anonymous user');
			}

			let message = scoresUpdated
				? 'Scores updated successfully'
				: 'Scores not updated';

			const responseObject: NextPairResponse = {
				message: message,
				authenticated: !!userId,
				user: req.user ? cleanUserObject(req.user) : null,
				...(nextPair ? { nextPair } : { noMorePairs: true }),
			};

			logger.info('Sending response', {
				authenticated: responseObject.authenticated,
				hasNextPair: !!nextPair,
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
