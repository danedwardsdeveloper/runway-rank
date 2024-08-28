import mongoose, { ObjectId } from 'mongoose';
import { Request } from 'express';

export type ObjectIdString = string;

export interface AppData {
	message: {
		content: string;
		colour: string;
	};
	isAuthenticated: boolean;
	user: {
		name: string;
		email: string;
		id: ObjectIdString;
		accessTopRunways: boolean;
		pairsUntilAccess: number;
	} | null;
	runways: RunwayItem[] | null;
	topRunways: RunwayItem[] | null;
}

export interface RunwayItem {
	_id: ObjectIdString;
	name: string;
	queenId?: ObjectIdString;
	queenName: string;
	franchise?: string;
	season?: number;
	episode?: number;
	episodeName?: string;
	score: number;
	ratingsCount: number;
	imageSlug: string;
}

export interface UserBase {
	email: string;
	name: string;
	accessTopRunways: boolean;
	numRunwaysUntilAccess: number;
}

export interface TokenInput extends UserBase {
	_id: ObjectIdString;
}

export interface UserObject extends UserBase {
	id: string;
}

export interface UserDocument extends UserBase, mongoose.Document {
	_id: mongoose.Types.ObjectId;
	hashed_password: string;
	ranked_runway_ids: mongoose.Types.ObjectId[];
	accessTopRunways: boolean;
	numRunwaysUntilAccess: number;
}

interface GetNextPairRequestBody {
	winner?: string;
	loser?: string;
}

export interface CustomRequest extends Request {
	user?: UserObject | null;
	body: {
		email?: string;
		password?: string;
		name?: string;
		winner?: string;
		loser?: string;
	};
	cookies: {
		[key: string]: string;
	};
}

export interface NextPairResponse {
	authenticated: boolean;
	user: UserObject | null;
	nextPair?: RunwayItem[];
	noMorePairs?: boolean;
	message?: string;
}

interface CreateAccountRequestBody {
	email: string;
	password: string;
	name: string;
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

export interface UpdateUserOptions {
	userId: string;
	newRunwayIds?: string[];
}

type Franchise =
	| "RuPaul's Drag Race"
	| 'All Stars'
	| 'Drag Race UK'
	| "Canada's Drag Race";

export interface NextPairResponse {
	authenticated: boolean;
	user: UserObject | null;
	nextPair?: RunwayItem[];
	noMorePairs?: boolean;
	message?: string;
}

export interface UserObject extends UserBase {
	id: string;
}

export interface UserBase {
	email: string;
	name: string;
	accessTopRunways: boolean;
	numRunwaysUntilAccess: number;
}

export interface UpdateUserOptions {
	userId: string;
	newRunwayIds?: string[];
}

export interface MetadataContent {
	siteName: string;
	defaultTitle: string;
	defaultDescription: string;
	author: string;
	siteUrl: string;
	defaultImage: string;
}

export interface MetadataProps {
	title?: string;
	description?: string;
	pageName?: string;
	slug?: string;
}

interface MenuItem {
	name: string;
	to: string;
}

export interface MenuItemsArray {
	menuItems: MenuItem[];
}

export interface ResultsRequestBody {
	winner: string;
	loser: string;
}
