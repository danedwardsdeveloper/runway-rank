import express, { Router, Response } from 'express';

import { UserModel } from '@/app/database/models/User.js';
import { CustomRequest } from '../../../../../types.js';
import { logger } from '@/app/middleware/logger.js';
import { environment } from '@/environment.js';

export default express
	.Router()
	.delete('/', async (req: CustomRequest, res: Response) => {
		logger.info('Delete account request received');
		try {
			const userId = req.user?.id;

			if (!userId) {
				logger.info('Unauthorized deletion attempt, missing user ID');
				return res.status(401).json({ message: 'Unauthorized' });
			}

			logger.info(`Attempting to delete user with ID: ${userId}`);
			const deletedUser = await UserModel.findByIdAndDelete(userId);

			if (!deletedUser) {
				logger.info(`User with ID: ${userId} not found`);
				return res.status(404).json({ message: 'User not found' });
			}

			logger.info(`User with ID: ${userId} deleted successfully`);
			res.clearCookie('token', {
				httpOnly: true,
				// secure: environment.isProduction,
				secure: true,
				sameSite: 'none',
			});

			res.status(200).json({
				message: `Account '${req.user?.email}' deleted successfully`,
			});
		} catch (error) {
			console.error('Error deleting account:', error);
			logger.error('Error deleting account:', error);
			res.status(500).json({
				message: 'An error occurred while deleting the account',
			});
		}
	}) as Router;
