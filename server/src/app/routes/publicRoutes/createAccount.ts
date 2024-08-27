import express, { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { UserModel } from '@/app/database/models/User.js';
import { generateToken } from '@/app/middleware/jwtToken.js';
import {
	TokenInput,
	NextPairResponse,
	CustomRequest,
} from '../../../../../types.js';
import { getNextPairService } from '@/app/database/services/runwayService.js';
import { updateUser } from '@/app/database/services/userService.js';

export default express
	.Router()
	.post(
		'/create-account',
		[
			body('email').isEmail().normalizeEmail(),
			body('password').isLength({ min: 6 }),
			body('name').trim().notEmpty(),
		],
		async (req: CustomRequest, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { email, password, name } = req.body;

			try {
				let user = await UserModel.findOne({ email });
				let isNewUser = false;

				if (!user) {
					const hashedPassword = await bcrypt.hash(password, 10);

					user = new UserModel({
						email,
						hashed_password: hashedPassword,
						name,
						accessTopRunways: false,
						numRunwaysUntilAccess: await UserModel.countDocuments(),
						runways_ranked: [],
					});

					await user.save();
					isNewUser = true;
				}

				user = await updateUser({ userId: user._id.toString() });

				req.user = {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					accessTopRunways: user.accessTopRunways,
					numRunwaysUntilAccess: user.numRunwaysUntilAccess,
				};

				const tokenUser: TokenInput = {
					name: user.name,
					email: user.email,
					_id: user._id,
					accessTopRunways: req.user.accessTopRunways,
					numRunwaysUntilAccess: req.user.numRunwaysUntilAccess,
				};

				generateToken(res, tokenUser);

				let nextPair;
				try {
					nextPair = await getNextPairService(user._id.toString());
				} catch (error) {
					console.error('Error getting next pair:', error);
					nextPair = null;
				}

				const response: NextPairResponse = {
					message: isNewUser
						? 'Account created successfully'
						: 'User already exists',
					authenticated: true,
					user: {
						id: user._id.toString(),
						name: user.name,
						email: user.email,
						accessTopRunways: req.user.accessTopRunways,
						numRunwaysUntilAccess: req.user.numRunwaysUntilAccess,
					},
					nextPair: nextPair || undefined,
				};

				res.status(isNewUser ? 201 : 200).json(response);
			} catch (error) {
				console.error('Error creating account:', error);
				res.status(500).json({
					message: 'An error occurred while processing the request',
				});
			}
		}
	) as Router;
