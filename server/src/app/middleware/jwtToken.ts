import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { environment } from '@/environment.js';
import { CustomRequest, TokenInput, UserObject } from '@/types.js';

export function generateToken(res: Response, user: TokenInput): void {
	const payload: UserObject = {
		id: user._id.toString(),
		name: user.name,
		email: user.email,
	};

	const token = jwt.sign(payload, environment.JWT_SECRET, { expiresIn: '1h' });

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

		const decoded = jwt.verify(token, environment.JWT_SECRET) as UserObject;
		req.user = decoded;
		next();
	} catch (error) {
		next();
	}
}
