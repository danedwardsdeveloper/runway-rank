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
