import express, { Response } from 'express';

import { CustomRequest } from '@/types.js';

import { getNextPairService } from '@/app/database/services/runwayService.js';
import validateToken from '@/app/middleware/validateToken.js';

const initialData = express.Router();

initialData.get(
	'/initial-data',
	validateToken,
	async (req: CustomRequest, res: Response) => {
		try {
			const nextPair = await getNextPairService(req.user?.id || '');

			if (req.body.authenticated && req.user) {
				res.json({
					name: req.user.name,
					id: req.user.id,
					email: req.user.email,
					accessTopRunways: req.user.accessTopRunways,
					authenticated: true,
					nextPair,
				});
			} else {
				res.json({
					authenticated: false,
					nextPair,
				});
			}
		} catch (error) {
			console.error('Error fetching initial data:', error);
			res.status(500).json({
				message: 'Error fetching initial data',
				authenticated: req.body.authenticated,
			});
		}
	}
);

export default initialData;
