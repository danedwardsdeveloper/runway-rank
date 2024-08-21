import express, { Router, Response } from 'express';

import { environment } from '@/environment.js';
import { UserModel } from '@/app/database/models/User.js';
import { CustomRequest } from '@/types.js';

export default express
	.Router()
	.delete('/delete-account', async (req: CustomRequest, res: Response) => {
		try {
			const userId = req.user?.id;

			if (!userId) {
				return res.status(401).json({ message: 'Unauthorized' });
			}

			const deletedUser = await UserModel.findByIdAndDelete(userId);

			if (!deletedUser) {
				return res.status(404).json({ message: 'User not found' });
			}

			res.clearCookie('jwt', {
				httpOnly: true,
				secure: environment.isProduction,
				sameSite: 'none',
			});

			res.status(200).json({
				message: `Account '${req.user?.email}' deleted successfully`,
			});
		} catch (error) {
			console.error('Error deleting account:', error);
			res.status(500).json({
				message: 'An error occurred while deleting the account',
			});
		}
	}) as Router;
