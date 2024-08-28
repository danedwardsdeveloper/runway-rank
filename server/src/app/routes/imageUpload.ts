import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

import { QueenModel } from '../database/models/Queen.js';
import { RunwayModel } from '../database/models/Runway.js';

function createSlug(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

const imageUploadRoute = express.Router();

const upload = multer({
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
				)
			);
		}
	},
});

imageUploadRoute.post('/', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		const { queenId, name, franchise, season, episode, episodeName } =
			req.body;

		const queen = await QueenModel.findById(queenId);
		if (!queen) {
			return res.status(404).json({ error: 'Queen not found' });
		}

		const image = sharp(req.file.buffer);
		const metadata = await image.metadata();

		if (!metadata.width || !metadata.height) {
			return res
				.status(404)
				.json({ error: `Failed to read image metadata` });
		}

		if (metadata.width > 2000 || metadata.height > 2000) {
			return res
				.status(400)
				.json({ error: 'Image dimensions exceed 2000px limit' });
		}

		const aspectRatio = metadata.width / metadata.height;
		if (aspectRatio < 0.5 || aspectRatio > 2) {
			return res.status(400).json({
				error: 'Image aspect ratio must be between 1:2 and 2:1',
			});
		}

		const resizedImage = await image
			.resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
			.webp()
			.toBuffer();

		const baseSlug = createSlug(`${queen.name}-${name}`);
		let uniqueSlug = baseSlug;
		let counter = 1;

		while (await RunwayModel.findOne({ imageSlug: uniqueSlug })) {
			uniqueSlug = `${baseSlug}-${counter}`;
			counter++;
		}

		const filename = `${uniqueSlug}.webp`;
		const imagePath = path.join(__dirname, '..', 'public', filename);

		await sharp(resizedImage).toFile(imagePath);

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

		await runway.save();

		await QueenModel.findByIdAndUpdate(queenId, {
			$push: { runways: runway._id },
		});

		res.status(201).json({
			message: 'Image uploaded and runway created successfully',
			runway: runway.toObject(),
		});
	} catch (error) {
		console.error('Error uploading image:', error);
		res.status(500).json({
			error: 'An error occurred while uploading the image',
		});
	}
});

export default imageUploadRoute;
