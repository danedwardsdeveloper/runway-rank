import mongoose, { Types } from 'mongoose';
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

export interface NextPairResponse {
	authenticated: boolean;
	user: UserObject | null;
	nextPair?: RunwayItem[];
	noMorePairs?: boolean;
	message?: string;
}

export interface Queen {
	name: string;
	formerName?: string;
	runways: Types.ObjectId[];
}

export interface PairScores {
	winnerRating: number;
	loserRating: number;
}

export interface UpdateUserOptions {
	userId: string;
	newRunwayIds?: string[];
}

export type Franchise =
	| "RuPaul's Drag Race"
	| `RuPaul's Drag Race All Stars`
	| 'Drag Race UK'
	| "Canada's Drag Race"
	| 'Drag Race Down Under'
	| 'Drag Race España'
	| 'Drag Race Italia'
	| 'Drag Race France'
	| 'Drag Race Philippines'
	| 'Drag Race Thailand'
	| 'Drag Race Holland'
	| 'Drag Race Belgique'
	| 'Drag Race Sverige'
	| 'Drag Race Brasil'
	| 'Drag Race Deutschland'
	| 'Drag Race México'
	| 'The Switch Drag Race'
	| "RuPaul's Secret Celebrity Drag Race"
	| 'UK vs the World'
	| 'Canada vs the World'
	| 'Global All Stars'
	| 'Other';

export interface FranchiseData {
	name: Franchise;
	seasons: number | undefined;
}

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

export interface MetadataContent {
	siteName: string;
	defaultTitle: string;
	defaultDescription: string;
	author: string;
	siteUrl: string;
	defaultImage: string;
}

interface MenuItem {
	name: string;
	to: string;
}

export interface MenuItemsArray {
	menuItems: MenuItem[];
}

export interface UploadFormInterface {
	description: string;
	queen: string;
	franchise: string;
	season?: string;
	episodeNumber?: string;
	episodeName?: string;
	image?: File;
}

// Requests
export interface AddQueenRequest extends Request {
	body: {
		name: string;
		formerName?: string;
	};
}

export interface ResultsRequestBody {
	winner: string;
	loser: string;
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

interface CreateAccountRequestBody {
	email: string;
	password: string;
	name: string;
}
