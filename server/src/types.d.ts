import mongoose, { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface RunwayItem {
	name: string;
	queen_id: ObjectId;
	queen_name: string;
	franchise?: string;
	season?: number;
	episode?: number;
	episode_name?: string;
	score: number;
	ratings_count: number;
	image_url: string;
}

export interface User {
	email: string;
	hashed_password: string;
	name: string;
	ranked_runway_ids: mongoose.Types.ObjectId[];
}

export interface JwtPayload {
	id: string;
	email: string;
}

export interface CustomRequest extends Request {
	user?: {
		id: string;
		name: string;
		email: string;
	};
	accessTopRunways?: boolean;
	numRunwaysUntilAccess?: number;
}

export interface Queen {
	name: string;
	former_name?: string;
	runways: ObjectId[];
}
