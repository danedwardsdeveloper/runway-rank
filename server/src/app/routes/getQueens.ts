import express, { Request, Response, Router } from 'express';
import { QueenModel } from '../database/models/Queen.js';

const getQueensRoute = express.Router();

getQueensRoute.get('/', async (req: Request, res: Response) => {
	try {
		const queens = await QueenModel.find().populate('runways');
		res.status(200).json(queens);
	} catch (error) {
		console.error('Error fetching drag queens:', error);
		res.status(500).json({
			error: 'An error occurred while fetching drag queens',
		});
	}
});

export default getQueensRoute as Router;
