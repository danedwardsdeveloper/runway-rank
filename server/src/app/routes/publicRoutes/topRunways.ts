import express, { Router, Response } from 'express';

import { RunwayModel } from '@/app/database/models/Runway.js';
import { CustomRequest, RunwayItem } from '@/types.js';
import { checkTopRunwaysAccess } from '@/app/middleware/checkTopRunwaysAccess.js';

export default express
	.Router()
	.get(
		'/top-runways',
		checkTopRunwaysAccess,
		async (req: CustomRequest, res: Response) => {
			try {
				const user = req.user;
				const accessTopRunways = req.accessTopRunways || false;
				const numRunwaysUntilAccess = req.numRunwaysUntilAccess ?? 0;

				const response: {
					user?: { id: string; name: string; email: string };
					accessTopRunways: boolean;
					numRunwaysUntilAccess: number;
					topRunways?: RunwayItem[];
				} = {
					accessTopRunways,
					numRunwaysUntilAccess,
				};

				if (user) {
					response.user = {
						id: user.id,
						name: user.name,
						email: user.email,
					};

					if (accessTopRunways) {
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
				});
			}
		}
	) as Router;
