import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { dirname } from 'dirname-filename-esm';

import { logger } from '../middleware/logger.js';

const __dirname = dirname(import.meta);
const PUBLIC_DIR = path.join(__dirname, '..', '..', '..', 'public');
logger.info(`Public directory: ${PUBLIC_DIR}`);

const imagesRoute = express.Router();

imagesRoute.get('/:imageId', (req: Request, res: Response) => {
	const imageId = req.params.imageId;
	const imagePath = path.join(PUBLIC_DIR, imageId);

	logger.info(`Attempting to access image: ${imagePath}`);

	fs.promises
		.readFile(imagePath)
		.then((data) => {
			logger.info(`Successfully read image: ${imageId}`);
			res.contentType('image/webp');
			res.send(data);
		})
		.catch((err) => {
			logger.error(`Error reading image ${imageId}: ${err.message}`);
			res.status(404).send('Image not found');
		});
});

export default imagesRoute as Router;
