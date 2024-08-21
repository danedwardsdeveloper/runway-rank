import express, { Router, Response } from 'express';

import {
	CustomRequest,
	RunwayItem,
	NextPairResponse,
	UserObject,
} from '@/types.js';
import {
	getNextPairService,
	updateRunwayScores,
} from '@/app/database/services/runwayService.js';
import { updateUser } from '@/app/database/services/userService.js';

function sanitizeUser(user: any): UserObject {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		accessTopRunways: user.accessTopRunways,
		numRunwaysUntilAccess: user.numRunwaysUntilAccess,
	};
}

export default express
	.Router()
	.post('/get-next-pair', async (req: CustomRequest, res: Response) => {
		try {
			const { winner, loser } = req.body;
			let nextPair: RunwayItem[] | null = null;
			let noMorePairs = false;
			let scoresUpdated = false;

			const userId = req.user?.id || null;

			if (userId && winner && loser) {
				await updateRunwayScores(winner, loser);
				const updatedUser = await updateUser({
					userId,
					newRunwayIds: [winner, loser],
				});
				req.user = sanitizeUser(updatedUser);
				scoresUpdated = true;
			}

			if (userId) {
				nextPair = await getNextPairService(userId);
				if (!nextPair) {
					noMorePairs = true;
				}
			} else {
				nextPair = await getNextPairService(null);
			}

			let message = scoresUpdated
				? 'Scores updated successfully'
				: 'Scores not updated';

			const responseObject: NextPairResponse = {
				message: message,
				authenticated: !!userId,
				user: req.user ? sanitizeUser(req.user) : null,
				...(nextPair ? { nextPair } : { noMorePairs: true }),
			};

			res.status(200).json(responseObject);
			return;
		} catch (error) {
			console.error('Error in get-next-pair:', error);
			res.status(500).json({
				message: 'Error processing request',
				authenticated: !!req.user,
				user: sanitizeUser(req.user),
			});
			return;
		}
	}) as Router;
