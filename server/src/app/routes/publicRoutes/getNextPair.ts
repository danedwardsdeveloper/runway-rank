import express, { Response } from 'express';

import { CustomRequest } from '../../../types.js';
import { getNextPairService } from '../../database/services/runwayService.js';
import validateToken from '../../middleware/validateToken.js';

const getNextPair = express.Router();

getNextPair.get(
	'/get-next-pair',
	validateToken,
	async (req: CustomRequest, res: Response) => {
		try {
			let nextPair;

			if (req.user && req.user.id) {
				nextPair = await getNextPairService(req.user.id);
			} else {
				nextPair = await getNextPairService('');
			}

			if (req.user) {
				res.json({
					authenticated: true,
					user: {
						id: req.user.id,
						name: req.user.name,
						email: req.user.email,
					},
					nextPair,
				});
			} else {
				res.json({
					authenticated: false,
					nextPair,
				});
			}
		} catch (error) {
			console.error('Error fetching next pair:', error);
			res.status(500).json({
				message: 'Error fetching next pair of runways',
				authenticated: !!req.user,
			});
		}
	}
);

export default getNextPair;
