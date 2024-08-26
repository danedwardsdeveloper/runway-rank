import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { environment } from '@/environment.js';
import { CustomRequest, TokenInput, UserObject } from '../../../../types.js';
import { logger } from './logger.js';

export function generateToken(res: Response, user: TokenInput): void {
	const payload: UserObject = {
		id: user._id.toString(),
		name: user.name,
		email: user.email,
		accessTopRunways: user.accessTopRunways,
		numRunwaysUntilAccess: user.numRunwaysUntilAccess,
	};

	const token = jwt.sign(payload, environment.JWT_SECRET, { expiresIn: '1h' });

	res.cookie('token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		maxAge: 60 * 60 * 1000,
	});

	logger.info('JWT cookie set:', {
		token: token.substring(0, 10) + '...',
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
		const token = req.cookies.token;

		if (!token) {
			logger.info('No JWT token found in request cookies');
			req.user = null;
			return next();
		}

		try {
			const decoded = jwt.verify(
				token,
				environment.JWT_SECRET
			) as UserObject;
			req.user = decoded;
			logger.info('JWT token validated successfully', {
				userId: decoded.id,
			});
			next();
		} catch (jwtError) {
			logger.warn('Invalid JWT token', {
				error:
					jwtError instanceof Error ? jwtError.message : String(jwtError),
			});
			req.user = null;
			res.clearCookie('jwt');
			next();
		}
	} catch (error) {
		logger.error('Error in token validation', {
			error: error instanceof Error ? error.message : String(error),
		});
		req.user = null;
		next();
	}
}
