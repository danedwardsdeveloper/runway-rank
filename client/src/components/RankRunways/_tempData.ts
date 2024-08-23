export interface RunwayPhoto {
	description: string;
	queenName: string;
	franchise?: Franchise;
	season?: number;
	episode?: number;
	episodeName?: string;
	slug: string;
}

type Franchise =
	| "RuPaul's Drag Race"
	| 'All Stars'
	| 'Drag Race UK'
	| "Canada's Drag Race";

export const runwayPhotos: RunwayPhoto[] = [
	{
		description: 'Amoeba Bacteria',
		queenName: 'Bimini Bon Boulash',
		franchise: `Drag Race UK`,
		season: 2,
		slug: 'bimini-bacteria',
	},
	{
		description: 'Tartan',
		queenName: 'Violet Chachki',
		franchise: `RuPaul's Drag Race`,
		slug: 'chachki-tartan',
	},
	{
		description: 'Freddy Krueger',
		queenName: 'Crystal Methyd',
		franchise: `RuPaul's Drag Race`,
		season: 12,
		slug: 'crystal-krueger',
	},
	{
		description: 'Black and White',
		queenName: 'Detox',
		franchise: `All Stars`,
		season: 2,
		episode: 1,
		episodeName: 'All Star Talent Show Extravaganza',
		slug: 'detox-black-white',
	},
	{
		description: 'Pirate Entrance',
		queenName: 'Gigi Goode',
		franchise: `RuPaul's Drag Race`,
		season: 12,
		episode: 1,
		slug: 'gigi-pirate',
	},
	{
		description: 'All Stars Promo',
		queenName: 'Gottmik',
		franchise: `All Stars`,
		slug: 'gottmik-promo',
	},
	{
		description: 'Scream Dress',
		queenName: 'Gottmik',
		franchise: `RuPaul's Drag Race`,
		season: 13,
		slug: 'gottmik-scream',
	},
	{
		description: 'Promo',
		queenName: 'Jimbo',
		franchise: `All Stars`,
		slug: 'jimbo-promo',
	},
	{
		description: 'Pearl',
		queenName: 'Plastique Tiara',
		franchise: `RuPaul's Drag Race`,
		season: 11,
		slug: 'plastique-pearl',
	},
	{
		description: 'All Stars Promo',
		queenName: 'Plastique Tiara',
		franchise: `All Stars`,
		slug: 'plastique-promo',
	},
	{
		description: 'Finale',
		queenName: 'Priyanka',
		franchise: `Canada's Drag Race`,
		season: 1,
		slug: 'priyanka-finale',
	},
	{
		description: 'Finale',
		queenName: 'Sasha Colby',
		franchise: `RuPaul's Drag Race`,
		season: 15,
		slug: 'sasha-colby-finale',
	},
	{
		description: `Love the Skin You're In`,
		queenName: 'Shea Couleé',
		franchise: `All Stars`,
		season: 5,
		episode: 5,
		episodeName: 'Snatch Game of Love',
		slug: 'shea-love-skin',
	},
	{
		description: 'Sleeping Bag Dress',
		queenName: 'Utica Queen',
		franchise: `RuPaul's Drag Race`,
		season: 13,
		episode: 7,
		episodeName: 'Bossy Rossy: The RuBoot',
		slug: 'utica-sleeping-bag',
	},
	{
		description: 'Entrance',
		queenName: 'Starlet',
		franchise: `Drag Race UK`,
		season: 4,
		episode: 1,
		slug: 'starlet-entrance',
	},
	{
		description: 'Season 8 Finale',
		queenName: 'Violet Chachki',
		franchise: `RuPaul's Drag Race`,
		season: 8,
		episode: 12,
		episodeName: 'Grand Finale',
		slug: 'violet-chachki-finale',
	},
	{
		description: 'Three Heads Finale',
		queenName: 'Willow Pill',
		franchise: `RuPaul's Drag Race`,
		season: 14,
		slug: 'willow-pill-heads',
	},
	{
		description: 'Mushroom',
		queenName: 'Willow Pill',
		franchise: `RuPaul's Drag Race`,
		season: 14,
		slug: 'willow-pill-mushroom',
	},
];

export const initialPair = {
	message: 'Scores not updated',
	authenticated: false,
	user: null,
	nextPair: [
		{
			_id: '66c5001eb804fda11a916db6',
			name: 'Snatch Game',
			queen_id: '507f1f77bcf86cd799439012',
			queen_name: 'Jinkx Monsoon',
			franchise: "RuPaul's Drag Race",
			season: 5,
			episode: 5,
			episode_name: 'Snatch Game',
			score: 1978,
			ratings_count: 47,
			image_url: 'https://example.com/images/jinkx_snatch_game.jpg',
		},
		{
			_id: '66c5001eb804fda11a916dba',
			name: 'Drag on a Dime',
			queen_id: '507f1f77bcf86cd799439016',
			queen_name: 'Temp data',
			franchise: "RuPaul's Drag Race",
			season: 4,
			episode: 1,
			episode_name: 'RuPocalypse Now!',
			score: 1865,
			ratings_count: 47,
			image_url: 'https://example.com/images/sharon_drag_on_a_dime.jpg',
		},
	],
};
