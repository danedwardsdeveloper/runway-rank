import express, { Router, Response } from 'express';

import { CustomRequest } from 'src/types.js';
import validateToken from 'src/app/middleware/validateToken.js';

const protectedRoute: Router = express.Router();

protectedRoute.get(
	'/protected-route',
	validateToken,
	(req: CustomRequest, res: Response) => {
		if (req.user) {
			res.json({ message: `Welcome, ${req.user.email}!` });
		} else {
			res.status(401).json({ message: 'Not authenticated' });
		}
	}
);

export default protectedRoute;
