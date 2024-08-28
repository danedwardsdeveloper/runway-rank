import express, { Response, Router } from 'express';
import mongoose from 'mongoose';
import { MongoError } from 'mongodb';

import { QueenModel } from '../database/models/Queen.js';
import { AddQueenRequest } from '../../../../types.js';
import { logger } from '../middleware/logger.js';

const addQueenRoute = express.Router();

addQueenRoute.post('/', async (req: AddQueenRequest, res: Response) => {
	logger.info('Received request to add a new queen', { body: req.body });

	try {
		const { name, formerName } = req.body;

		const existingQueen = await QueenModel.findOne({
			name: name.toLowerCase(),
		});
		if (existingQueen) {
			logger.warn('Attempted to add queen with existing name', { name });
			return res.status(400).json({
				error: 'A queen with this name already exists',
			});
		}

		logger.debug('Creating new queen model', { name, formerName });
		const newQueen = new QueenModel({
			name,
			formerName,
		});

		logger.debug('Attempting to save new queen to database');
		await newQueen.save();

		logger.info('Queen added successfully', { queenId: newQueen._id });
		res.status(201).json({
			message: 'Drag queen added successfully',
			queen: newQueen,
		});
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			logger.warn('Validation error while adding queen', {
				error: error.message,
			});
			res.status(400).json({
				error: 'Invalid queen data',
				details: error.errors,
			});
		} else if (error instanceof MongoError && (error as any).code === 11000) {
			// This shouldn't happen due to our pre-check, but just in case
			logger.warn('Attempted to add queen with duplicate name', {
				error: error.message,
			});
			res.status(400).json({
				error: 'A queen with this name already exists',
			});
		} else {
			logger.error('Unexpected error while adding queen', { error });
			res.status(500).json({
				error: 'An unexpected error occurred while adding the drag queen',
			});
		}
	}
});

export default addQueenRoute as Router;
