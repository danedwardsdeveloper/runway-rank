import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { environment } from '@/environment.js';
import { CustomRequest } from '@/types.js';

interface UserData {
	_id: Types.ObjectId;
	email: string;
	name: string;
}

export function generateToken(res: Response, userData: UserData): void {
	const token = jwt.sign(
		{
			id: userData._id.toString(),
			name: userData.name,
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

export async function validateToken(
	req: CustomRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return next();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: string;
			name: string;
			email: string;
		};

		req.user = {
			id: decoded.id,
			name: decoded.name,
			email: decoded.email,
		};

		next();
	} catch (error) {
		next();
	}
}
