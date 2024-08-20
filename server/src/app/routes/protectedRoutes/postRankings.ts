import express, { Response } from 'express';
import { isValidObjectId } from 'mongoose';

import { CustomRequest } from 'src/types.js';

import validateToken from '../../middleware/validateToken.js';
import { updateRankingsService } from 'src/app/database/services/rankingService.js';

const postRankings = express.Router();

postRankings.post(
	'/post-rankings',
	validateToken,
	async (req: CustomRequest, res: Response) => {
		try {
			if (!req.user || !req.user.id) {
				return res.status(401).json({ message: 'Unauthorized' });
			}

			const { winner, loser } = req.body;

			if (!winner || !loser) {
				return res
					.status(400)
					.json({ message: 'Winner and loser IDs are required' });
			}

			if (!isValidObjectId(winner) || !isValidObjectId(loser)) {
				return res
					.status(400)
					.json({ message: 'Invalid runway ID format' });
			}

			if (winner === loser) {
				return res
					.status(400)
					.json({ message: 'Winner and loser cannot be the same' });
			}

			await updateRankingsService(req.user.id, winner, loser);

			res.status(200).json({ message: 'Ratings updated successfully' });
		} catch (error) {
			console.error('Error posting ratings:', error);
			res.status(500).json({ message: 'Error updating ratings' });
		}
	}
);

export default postRankings;
