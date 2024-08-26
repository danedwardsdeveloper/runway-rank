import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { UserModel } from '@/app/database/models/User.js';
import { generateToken } from '@/app/middleware/jwtToken.js';
import { getNextPairService } from '@/app/database/services/runwayService.js';
import { NextPairResponse } from '../../../../../types.js';
import { updateUser } from '@/app/database/services/userService.js';

export default express
	.Router()
	.post(
		'/sign-in',
		[body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
		async (req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { email, password } = req.body;

			try {
				let user = await UserModel.findOne({ email });
				if (!user) {
					return res
						.status(401)
						.json({ message: 'Invalid email or password' });
				}

				const isPasswordValid = await bcrypt.compare(
					password,
					user.hashed_password
				);
				if (!isPasswordValid) {
					return res
						.status(401)
						.json({ message: 'Invalid email or password' });
				}

				user = await updateUser({ userId: user._id.toString() });

				generateToken(res, {
					_id: user._id,
					name: user.name,
					email: user.email,
					accessTopRunways: user.accessTopRunways,
					numRunwaysUntilAccess: user.numRunwaysUntilAccess,
				});

				let nextPair;
				try {
					nextPair = await getNextPairService(user._id.toString());
				} catch (error) {
					console.error('Error getting next pair:', error);
					nextPair = null;
				}

				const response: NextPairResponse = {
					message: 'Sign in successful',
					authenticated: true,
					user: {
						name: user.name,
						email: user.email,
						id: user._id.toString(),
						accessTopRunways: user.accessTopRunways,
						numRunwaysUntilAccess: user.numRunwaysUntilAccess,
					},
					nextPair: nextPair || undefined,
					noMorePairs: !nextPair,
				};

				res.status(200).json(response);
			} catch (error) {
				console.error('Error signing in:', error);
				res.status(500).json({
					message: 'An error occurred while signing in',
				});
			}
		}
	) as Router;
