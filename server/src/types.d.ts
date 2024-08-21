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
	accessTopRunways: boolean;
	numRunwaysUntilAccess: number;
}

export interface TokenInput extends UserBase {
	_id: mongoose.Types.ObjectId;
}

export interface UserObject extends UserBase {
	id: string;
}

export interface UserDocument extends UserBase, mongoose.Document {
	_id: mongoose.Types.ObjectId;
	hashed_password: string;
	ranked_runway_ids: mongoose.Types.ObjectId[];
}

export interface CustomRequest extends Request {
	user?: UserObject;
}

export interface TopRunwayAccessResponse {
	accessTopRunways: boolean;
	numRunwaysUntilAccess: number;
}

export interface NextPairResponse {
	authenticated: boolean;
	user: UserObject | null;
	nextPair?: RunwayItem[];
	noMorePairs?: boolean;
	message?: string;
}

export interface Queen {
	name: string;
	former_name?: string;
	runways: ObjectId[];
}

export interface PairScores {
	winnerRating: number;
	loserRating: number;
}
