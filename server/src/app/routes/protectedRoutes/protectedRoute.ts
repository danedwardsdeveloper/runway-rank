import express, { Router, Response } from 'express';

import { CustomRequest } from '@/types.js';

export default express
	.Router()
	.get('/protected-route', (req: CustomRequest, res: Response) => {
		if (req.user) {
			res.json({ message: `Welcome, ${req.user.email}!` });
		} else {
			res.status(401).json({ message: 'Not authenticated' });
		}
	}) as Router;
