import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { QueenModel } from '../database/models/Queen.js';
import { RunwayModel } from '../database/models/Runway.js';
import { logger } from '../middleware/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createSlug(str: string): string {
	logger.info(`Creating slug for: ${str}`);
	const slug = str
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
	logger.info(`Created slug: ${slug}`);
	return slug;
}

const imageUploadRoute = express.Router();

const upload = multer({
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (
		req: Express.Request,
		file: Express.Multer.File,
		cb: multer.FileFilterCallback
	) => {
		logger.info(
			`Received file: ${file.originalname}, mimetype: ${file.mimetype}`
		);
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (allowedTypes.includes(file.mimetype)) {
			logger.info('File type allowed');
			cb(null, true);
		} else {
			logger.warn(`Invalid file type: ${file.mimetype}`);
			cb(
				new Error(
					'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
				)
			);
		}
	},
});

interface UploadRequestBody {
	queenId: string;
	name: string;
	franchise: string;
	season?: string;
	episode?: string;
	episodeName?: string;
}

interface MulterFile {
	buffer: Buffer;
	originalname: string;
	mimetype: string;
}

interface UploadRequest extends Request {
	body: UploadRequestBody;
	file?: Express.Multer.File;
}

imageUploadRoute.post(
	'/',
	upload.single('image'),
	async (req: UploadRequest, res: Response) => {
		logger.info('Received POST request to /upload');
		try {
			if (!req.file) {
				logger.warn('No file uploaded');
				return res.status(400).json({ error: 'No file uploaded' });
			}
			logger.info(`File uploaded: ${req.file.originalname}`);

			const { queenId, name, franchise, season, episode, episodeName } =
				req.body;
			logger.info(`Request body: ${JSON.stringify(req.body)}`);

			const queen = await QueenModel.findById(queenId);
			if (!queen) {
				logger.warn(`Queen not found for id: ${queenId}`);
				return res.status(404).json({ error: 'Queen not found' });
			}
			logger.info(`Found queen: ${queen.name}`);

			const image = sharp(req.file.buffer);
			logger.info('Created sharp instance from file buffer');
			const metadata = await image.metadata();
			logger.info(`Image metadata: ${JSON.stringify(metadata)}`);

			if (!metadata.width || !metadata.height) {
				logger.error('Failed to read image metadata');

				return res
					.status(404)
					.json({ error: `Failed to read image metadata` });
			}

			if (metadata.width > 2000 || metadata.height > 2000) {
				logger.warn(
					`Image dimensions exceed limit: ${metadata.width}x${metadata.height}`
				);
				return res
					.status(400)
					.json({ error: 'Image dimensions exceed 2000px limit' });
			}

			const aspectRatio = metadata.width / metadata.height;
			logger.info(`Image aspect ratio: ${aspectRatio}`);
			if (aspectRatio < 0.5 || aspectRatio > 2) {
				logger.warn(`Invalid aspect ratio: ${aspectRatio}`);
				return res.status(400).json({
					error: 'Image aspect ratio must be between 1:2 and 2:1',
				});
			}

			const resizedImage = await image
				.resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
				.webp()
				.toBuffer();
			logger.info('Image resized and converted to WebP');

			const baseSlug = createSlug(`${queen.name}-${name}`);
			let uniqueSlug = baseSlug;
			let counter = 1;

			while (await RunwayModel.findOne({ imageSlug: uniqueSlug })) {
				logger.info(
					`Slug ${uniqueSlug} already exists, incrementing counter`
				);

				uniqueSlug = `${baseSlug}-${counter}`;
				counter++;
			}
			logger.info(`Final unique slug: ${uniqueSlug}`);

			const filename = `${uniqueSlug}.webp`;
			const imagePath = path.join(
				__dirname,
				'..',
				'..',
				'..',
				'public',
				filename
			);
			logger.info(`Saving image to: ${imagePath}`);

			const directory = path.dirname(imagePath);
			await fs.promises.mkdir(directory, { recursive: true });

			await sharp(resizedImage).toFile(imagePath);
			logger.info('Image saved to file system');

			const runway = new RunwayModel({
				name,
				queenId,
				queenName: queen.name,
				franchise,
				season,
				episode,
				episodeName,
				score: 1600,
				ratingsCount: 0,
				imageSlug: uniqueSlug,
			});
			logger.info(`Created new runway model: ${JSON.stringify(runway)}`);

			await runway.save();
			logger.info(`Runway saved to database with id: ${runway._id}`);

			await QueenModel.findByIdAndUpdate(queenId, {
				$push: { runways: runway._id },
			});
			logger.info(`Updated queen ${queenId} with new runway ${runway._id}`);

			logger.info('Successfully processed image upload and created runway');
			res.status(201).json({
				message: 'Image uploaded and runway created successfully',
				runway: runway.toObject(),
			});
		} catch (error) {
			logger.error('Error uploading image:', error);
			res.status(500).json({
				error: 'An error occurred while uploading the image',
			});
		}
	}
);

export default imageUploadRoute;
