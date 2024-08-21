import express, { Response } from 'express';
import jwt from 'jsonwebtoken';

import { CustomRequest, RunwayItem } from '@/types.js';
import {
	getNextPairService,
	updateRunwayScores,
} from '@/app/database/services/runwayService.js';
import { updateUserRankedRunways } from '@/app/database/services/userService.js';
import validateToken from '@/app/middleware/validateToken.js';

const getNextPair = express.Router();

getNextPair.post(
	'/get-next-pair',
	validateToken,
	async (req: CustomRequest, res: Response) => {
		try {
			const { winner, loser } = req.body;
			let nextPair: RunwayItem[] | null = null;
			let noMorePairs = false;

			const token = req.cookies.jwt;
			let userId: string | null = null;
			if (token) {
				try {
					const decoded = jwt.verify(
						token,
						process.env.JWT_SECRET as string
					) as { id: string; email: string };
					userId = decoded.id;
				} catch (error) {
					console.error('Invalid token:', error);
				}
			}

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
				...(nextPair ? { nextPair } : { noMorePairs: true }),
			});
		} catch (error) {
			console.error('Error in get-next-pair:', error);
			res.status(500).json({
				message: 'Error processing request',
				authenticated: !!req.user,
			});
		}
	}
);

export default getNextPair;
