import express, { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { UserModel } from '@/app/database/models/User.js';
import { generateToken } from '@/app/middleware/jwtToken.js';
import { TokenInput, CustomRequest, AppData } from '../../../../../types.js';
import { getNextPairService } from '@/app/database/services/runwayService.js';
import { updateUser } from '@/app/database/services/userService.js';
import { logger } from '@/app/middleware/logger.js';

export default express
	.Router()
	.post(
		'/create-account',
		[
			body('email').isEmail().normalizeEmail(),
			body('password').isString().isLength({ min: 6 }),
			body('name').trim().notEmpty(),
		],
		async (req: CustomRequest, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				logger.warn('Validation failed for create account', errors.array());
				return res.status(400).json({ errors: errors.array() });
			}

			const { email, password, name } = req.body;

			if (typeof password !== 'string' || password.length < 6) {
				logger.warn('Invalid password provided');
				return res.status(400).json({
					errors: [
						{
							msg: 'Invalid password. Must be a string with at least 6 characters.',
						},
					],
				});
			}

			try {
				let user = await UserModel.findOne({ email });
				let isNewUser = false;

				if (!user) {
					logger.info(`Creating new user with email: ${email}`);
					const hashedPassword = await bcrypt.hash(password, 10);

					user = new UserModel({
						email,
						hashed_password: hashedPassword,
						name,
						accessTopRunways: false,
						numRunwaysUntilAccess: await UserModel.countDocuments(),
						ranked_runway_ids: [],
					});

					await user.save();
					isNewUser = true;
					logger.info(`New user created with ID: ${user._id}`);
				} else {
					logger.info(`User with email ${email} already exists`);
				}

				user = await updateUser({ userId: user._id.toString() });
				logger.info(`User updated: ${user._id}`);

				req.user = {
					name: user.name,
					email: user.email,
					id: user._id.toString(),
					accessTopRunways: user.accessTopRunways,
					numRunwaysUntilAccess: user.numRunwaysUntilAccess,
				};

				const tokenUser: TokenInput = {
					name: user.name,
					email: user.email,
					_id: user._id.toString(),
					accessTopRunways: req.user.accessTopRunways,
					numRunwaysUntilAccess: req.user.numRunwaysUntilAccess,
				};

				generateToken(res, tokenUser);
				logger.info(`Token generated for user: ${user._id}`);

				let nextPair;
				try {
					nextPair = await getNextPairService(user._id.toString());
					logger.info(`Next pair fetched for user: ${user._id}`);
				} catch (error) {
					logger.error('Error getting next pair:', error);
					nextPair = null;
				}

				const response: AppData = {
					message: {
						content: isNewUser
							? 'Account created successfully'
							: 'User already exists',
						colour: isNewUser ? 'green' : 'blue',
					},
					isAuthenticated: true,
					user: {
						id: user._id.toString(),
						name: user.name,
						email: user.email,
						accessTopRunways: req.user.accessTopRunways,
						pairsUntilAccess: req.user.numRunwaysUntilAccess,
					},
					runways: nextPair || null,
					topRunways: null,
				};

				res.status(isNewUser ? 201 : 200).json(response);
				logger.info(
					`Response sent for user: ${user._id}, status: ${
						isNewUser ? 201 : 200
					}`
				);
			} catch (error) {
				logger.error('Error in create account route:', error);
				res.status(500).json({
					message: {
						content: 'An error occurred while processing the request',
						colour: 'red',
					},
					isAuthenticated: false,
					user: null,
					runways: [],
				});
			}
		}
	) as Router;
