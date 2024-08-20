import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { UserModel } from 'src/app/database/models/User.js';
import { generateToken } from 'src/app/middleware/generateToken.js';
import { getNextPairService } from 'src/app/database/services/runwayService.js';

const signIn: Router = express.Router();

signIn.post(
	'/sign-in',
	[body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			const user = await UserModel.findOne({ email });
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

			generateToken(res, { _id: user._id, email: user.email });

			let nextPair;
			try {
				nextPair = await getNextPairService(user._id.toString());
			} catch (error) {
				console.error('Error getting next pair:', error);
				nextPair = null;
			}

			res.status(200).json({
				message: 'Sign in successful',
				user: {
					email: user.email,
					name: user.name,
					id: user._id,
				},
				nextPair: nextPair,
			});
		} catch (error) {
			console.error('Error signing in:', error);
			res.status(500).json({
				message: 'An error occurred while signing in',
			});
		}
	}
);

export default signIn;
