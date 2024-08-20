import { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface IUser {
	email: string;
	hashed_password: string;
	name: string;
	ranked_runway_ids: ObjectId[];
}

export interface JwtPayload {
	id: string;
	email: string;
}

export interface CustomRequest extends Request {
	user?: {
		id: string;
		email: string;
	};
}
