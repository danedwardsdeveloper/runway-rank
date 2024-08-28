import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default express
	.Router()
	.get('/images/:imageId', (req: Request, res: Response) => {
		const imageId = req.params.imageId;
		const imagePath = path.join('public', `${imageId}.webp`);

		console.log(`Attempting to access image: ${imagePath}`);

		fs.readFile(imagePath, (err, data) => {
			if (err) {
				res.status(404).send('Image not found');
			} else {
				res.contentType('image/jpeg');
				res.send(data);
			}
		});
	}) as Router;
