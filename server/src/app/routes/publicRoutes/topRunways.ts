import express, { Router, Response } from 'express';

import { RunwayModel } from '@/app/database/models/Runway.js';
import { CustomRequest, RunwayItem, UserObject } from '@/types.js';
import { updateUser } from '@/app/database/services/userService.js';

export default express
	.Router()
	.get('/top-runways', async (req: CustomRequest, res: Response) => {
		try {
			let user = req.user;

			const response: {
				user?: UserObject;
				accessTopRunways: boolean;
				numRunwaysUntilAccess: number;
				topRunways?: RunwayItem[];
			} = {
				accessTopRunways: user?.accessTopRunways || false,
				numRunwaysUntilAccess: user?.numRunwaysUntilAccess || 0,
			};

			if (user) {
				response.user = user;

				if (user.accessTopRunways) {
					const topRunwaysData = await RunwayModel.find()
						.sort({ score: -1 })
						.limit(10)
						.select(
							'name queen_name franchise season episode score image_url'
						);

					response.topRunways = topRunwaysData;
				}
			}

			res.json(response);
		} catch (error) {
			console.error('Error fetching top runways:', error);
			res.status(500).json({
				message: 'An error occurred while fetching top runways',
				accessTopRunways: false,
				numRunwaysUntilAccess: 0,
			});
		}
	}) as Router;
