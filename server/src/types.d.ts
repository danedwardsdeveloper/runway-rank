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

export interface UserBase {
	email: string;
	name: string;
}

export interface UserDocument extends UserBase, mongoose.Document {
	_id: mongoose.Types.ObjectId;
	hashed_password: string;
	ranked_runway_ids: mongoose.Types.ObjectId[];
}

export interface JwtPayload extends UserBase {
	id: string;
}

export type DecodedToken = JwtPayload;

export interface CustomRequest extends Request {
	user?: JwtPayload;
	accessTopRunways?: boolean;
	numRunwaysUntilAccess?: number;
}

export type SafeUser = Omit<UserDocument, 'hashed_password'>;

export interface Queen {
	name: string;
	former_name?: string;
	runways: ObjectId[];
}
