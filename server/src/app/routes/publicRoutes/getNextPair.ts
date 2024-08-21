import express, { Router, Response } from 'express';

import { CustomRequest, RunwayItem } from '@/types.js';
import {
	getNextPairService,
	updateRunwayScores,
} from '@/app/database/services/runwayService.js';
import { updateUserRankedRunways } from '@/app/database/services/userService.js';

export default express
	.Router()
	.post('/get-next-pair', async (req: CustomRequest, res: Response) => {
		try {
			const { winner, loser } = req.body;
			let nextPair: RunwayItem[] | null = null;
			let noMorePairs = false;

			const userId = req.user?.id || null;

			if (userId && winner && loser) {
				await updateRunwayScores(winner, loser);
				await updateUserRankedRunways(userId, [winner, loser]);
			}

			if (userId) {
				nextPair = await getNextPairService(userId);
				if (!nextPair) {
					noMorePairs = true;
				}
			} else {
				nextPair = await getNextPairService(null);
			}

			res.json({
				authenticated: !!userId,
				user: req.user || null,
				...(nextPair ? { nextPair } : { noMorePairs: true }),
			});
		} catch (error) {
			console.error('Error in get-next-pair:', error);
			res.status(500).json({
				message: 'Error processing request',
				authenticated: !!req.user,
				user: req.user || null,
			});
		}
	}) as Router;
