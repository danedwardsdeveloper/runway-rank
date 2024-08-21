import express, { Router, Request, Response } from 'express';

import { environment } from '@/environment.js';

export default express
	.Router()
	.get('/sign-out', (req: Request, res: Response) => {
		try {
			if (!req.cookies.jwt) {
				return res.status(200).json({ message: 'Not signed in' });
			}

			res.clearCookie('jwt', {
				httpOnly: true,
				secure: environment.isProduction,
				sameSite: 'none',
			});

			res.status(200).json({ message: 'Sign out successful' });
		} catch (error) {
			console.error('Error signing out:', error);
			res.status(500).json({
				message: 'An error occurred while signing out',
			});
		}
	}) as Router;
