import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { UserModel } from '@/app/database/models/User.js';
import { generateToken } from '@/app/middleware/jwtToken.js';
import { TokenInput, NextPairResponse, CustomRequest } from '@/types.js';
import { getNextPairService } from '@/app/database/services/runwayService.js';

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
				const existingUser = await UserModel.findOne({ email });
				if (existingUser) {
					return res
						.status(400)
						.json({ message: 'User with this email already exists' });
				}

				const hashedPassword = await bcrypt.hash(password, 10);

				const newUser = new UserModel({
					email,
					hashed_password: hashedPassword,
					name,
					accessTopRunways: false,
					numRunwaysUntilAccess: await UserModel.countDocuments(),
					runways_ranked: [],
				});

				await newUser.save();

				req.user = {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					accessTopRunways: false,
					numRunwaysUntilAccess: 0,
				};

				const tokenUser: TokenInput = {
					name: newUser.name,
					email: newUser.email,
					_id: newUser._id,
					accessTopRunways: (req as CustomRequest).user!.accessTopRunways,
					numRunwaysUntilAccess: (req as CustomRequest).user!
						.numRunwaysUntilAccess,
				};

				generateToken(res, tokenUser);

				let nextPair;
				try {
					nextPair = await getNextPairService(newUser._id.toString());
				} catch (error) {
					console.error('Error getting next pair:', error);
					nextPair = null;
				}

				const response: NextPairResponse = {
					message: 'Account created successfully',
					authenticated: true,
					user: {
						id: newUser._id.toString(),
						name: newUser.name,
						email: newUser.email,
						accessTopRunways: (req as CustomRequest).user!
							.accessTopRunways,
						numRunwaysUntilAccess: (req as CustomRequest).user!
							.numRunwaysUntilAccess,
					},
					nextPair: nextPair || undefined,
				};

				res.status(201).json(response);
			} catch (error) {
				console.error('Error creating account:', error);
				res.status(500).json({
					message: 'An error occurred while creating the account',
				});
			}
		}
	) as Router;
