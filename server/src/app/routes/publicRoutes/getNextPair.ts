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
import { updateUserRankedRunways } from '@/app/database/services/userService.js';

function sanitizeUser(user: any): UserObject | null {
	if (!user) return null;
	return {
		id: user.id,
		name: user.name,
		email: user.email,
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
				await updateUserRankedRunways(userId, [winner, loser]);
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

			const responseObject: NextPairResponse = {
				...(scoresUpdated && { message: 'Scores updated successfully' }),
				authenticated: !!userId,
				user: sanitizeUser(req.user),
				...(nextPair ? { nextPair } : { noMorePairs: true }),
			};

			res.json(responseObject);
		} catch (error) {
			console.error('Error in get-next-pair:', error);
			res.status(500).json({
				message: 'Error processing request',
				authenticated: !!req.user,
				user: sanitizeUser(req.user),
			});
		}
	}) as Router;
