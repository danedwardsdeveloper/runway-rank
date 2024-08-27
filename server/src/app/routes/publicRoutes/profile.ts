import express, { Response } from 'express';
import { validateToken } from '@/app/middleware/jwtToken.js';
import { AppData, RunwayItem, CustomRequest } from '../../../../../types.js';
import {
	getNextPairService,
	getTopRunways,
} from '@/app/database/services/runwayService.js';

export default express
	.Router()
	.get(
		'/profile',
		validateToken,
		async (req: CustomRequest, res: Response) => {
			try {
				const pairs: RunwayItem[] | null = await getNextPairService(
					req.user?.id || null
				);

				if (!req.user) {
					const appData: AppData = {
						message: { content: 'Not authenticated', colour: 'red' },
						isAuthenticated: false,
						user: null,
						runways: pairs || [],
						topRunways: null,
					};
					return res.status(401).json(appData);
				}

				let topRunways: RunwayItem[] | null = null;
				if (req.user.accessTopRunways) {
					topRunways = await getTopRunways();
				}
				const appData: AppData = {
					message: {
						content: 'Authentication successful',
						colour: 'green',
					},
					isAuthenticated: true,
					user: {
						name: req.user.name,
						email: req.user.email,
						id: req.user.id,
						accessTopRunways: req.user.accessTopRunways,
						pairsUntilAccess: req.user.numRunwaysUntilAccess,
					},
					runways: pairs || [],
					topRunways: topRunways,
				};

				res.json(appData);
			} catch (error) {
				console.error('Error in profile route:', error);
				res.status(500).json({
					message: { content: 'Server error', colour: 'red' },
					isAuthenticated: false,
					user: null,
					runways: [],
					topRunways: [],
				} as AppData);
			}
		}
	);
