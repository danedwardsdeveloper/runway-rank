import { ObjectId } from 'mongoose';

export interface RunwayItem {
	_id: string;
	name: string;
	queen_id: string;
	queen_name: string;
	franchise?: string;
	season?: number;
	episode?: number;
	episode_name?: string;
	score: number;
	ratings_count: number;
	image_url: string;
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