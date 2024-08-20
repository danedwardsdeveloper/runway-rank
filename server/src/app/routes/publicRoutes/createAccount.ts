import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { User } from 'src/app/database/models/User.js';

import { generateToken } from 'src/app/middleware/generateToken.js';

const createAccount: Router = express.Router();

createAccount.post(
	'/create-account',
	[
		body('email').isEmail().normalizeEmail(),
		body('password').isLength({ min: 6 }),
		body('name').trim().notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password, name } = req.body;

		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res
					.status(400)
					.json({ message: 'User with this email already exists' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = new User({
				email,
				hashed_password: hashedPassword,
				name,
				runways_ranked: [],
			});

			await newUser.save();

			// Generate token and set cookie
			generateToken(res, { _id: newUser._id, email: newUser.email });

			res.status(201).json({
				message: 'Account created successfully',
				user: {
					email: newUser.email,
					name: newUser.name,
					id: newUser._id,
				},
			});
		} catch (error) {
			console.error('Error creating account:', error);
			res.status(500).json({
				message: 'An error occurred while creating the account',
			});
		}
	}
);

export default createAccount;