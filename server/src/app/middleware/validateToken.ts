import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '@/types.js';

const validateToken = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return next();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: string;
			email: string;
		};

		req.user = {
			id: decoded.id,
			email: decoded.email,
		};

		next();
	} catch (error) {
		next();
	}
};

export default validateToken;
