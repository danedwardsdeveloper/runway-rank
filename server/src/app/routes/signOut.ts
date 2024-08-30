import express, { Router, Request, Response } from 'express';
import { logger } from '../middleware/logger.js';
import { environment } from '../../environment.js';

export default express
	.Router()
	.get('/sign-out', (req: Request, res: Response) => {
		logger.info('Sign-out route accessed', {
			ip: req.ip,
			userAgent: req.get('User-Agent'),
		});
		try {
			logger.info('Checking for JWT cookie');
			if (!req.cookies.token) {
				logger.info('JWT cookie not found, user not signed in');
				res.status(401).json({ message: 'Not signed in' });
				return;
			}

			logger.info('JWT cookie found, proceeding with sign-out');

			logger.info('Attempting to clear token cookie');
			res.clearCookie('token', {
				httpOnly: true,
				secure: environment.isProduction,
				sameSite: 'strict',
			});
			logger.info('Token cookie cleared successfully');

			logger.info('Sign-out process completed successfully');
			res.status(200).json({ message: 'Sign out successful' });
			return;
		} catch (error) {
			logger.error('Error during sign-out process', { error });
			console.error('Error signing out:', error);
			res.status(500).json({
				message: 'An error occurred while signing out',
			});
			return;
		} finally {
			logger.info('Sign-out route handler completed');
		}
	}) as Router;
