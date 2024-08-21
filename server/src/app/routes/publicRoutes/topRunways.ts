import express, { Router, Response } from 'express';

import { RunwayModel } from '@/app/database/models/Runway.js';
import { CustomRequest, RunwayItem, UserObject } from '@/types.js';
import cleanUserObject from '@/app/utilities/cleanUserObject.js';

export default express
	.Router()
	.get('/top-runways', async (req: CustomRequest, res: Response) => {
		try {
			const user = req.user;

			if (!user) {
				res.status(401).json({
					message: 'User not authenticated',
					user: null,
				});
				return;
			}

			const cleanedUser = cleanUserObject(user);

			const response: {
				user: UserObject;
				topRunways?: RunwayItem[];
			} = {
				user: cleanedUser,
			};

			if (cleanedUser.accessTopRunways) {
				const topRunwaysData = await RunwayModel.find()
					.sort({ score: -1 })
					.limit(10)
					.select(
						'name queen_name franchise season episode score image_url'
					);

				response.topRunways = topRunwaysData;
			}

			res.status(200).json(response);
			return;
		} catch (error) {
			console.error('Error fetching top runways:', error);
			res.status(500).json({
				message: 'An error occurred while fetching top runways',
				user: null,
			});
			return;
		}
	}) as Router;
