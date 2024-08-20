import express, { Router, Request, Response } from 'express';
import { RunwayModel } from '../../database/models/Runway.js';

const topRunways: Router = express.Router();

topRunways.get('/top-runways', async (req: Request, res: Response) => {
	try {
		const topRunways = await RunwayModel.find()
			.sort({ score: -1 })
			.limit(10)
			.select('name queen_name franchise season episode score image_url');

		res.json(topRunways);
	} catch (error) {
		console.error('Error fetching top runways:', error);
		res.status(500).json({
			message: 'An error occurred while fetching top runways',
		});
	}
});

export default topRunways;
