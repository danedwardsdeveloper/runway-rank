import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { environment } from '@/environment.js';

interface UserData {
	_id: Types.ObjectId;
	email: string;
}

export function generateToken(res: Response, userData: UserData): void {
	const token = jwt.sign(
		{
			id: userData._id.toString(),
			email: userData.email,
		},
		environment.JWT_SECRET,
		{ expiresIn: '1h' }
	);

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: environment.isProduction,
		sameSite: 'none',
		maxAge: 60 * 60 * 1000,
	});
}
