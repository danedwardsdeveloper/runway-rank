export interface ImageInfo {
	url: string;
	title: string;
	subtitle: string;
	model: string;
	description: string;
}

export const imageInfo: ImageInfo[] = [
	{
		url: '/temp/landscape1.webp',
		title: 'Sunset Beach',
		subtitle: 'Golden Hour',
		model: 'Canon EOS R5',
		description:
			'A breathtaking view of the sun setting over a tropical beach, painting the sky in vibrant hues.',
	},
	{
		url: '/temp/landscape2.webp',
		title: 'Mountain Range',
		subtitle: 'Alpine Peaks',
		model: 'Nikon Z7 II',
		description:
			'A majestic panorama of snow-capped mountains stretching across the horizon.',
	},
	{
		url: '/temp/square1.webp',
		title: 'Urban Geometry',
		subtitle: 'City Patterns',
		model: 'Sony A7R IV',
		description:
			'An abstract composition of modern architecture, showcasing clean lines and symmetry.',
	},
	{
		url: '/temp/square2.webp',
		title: 'Blooming Flower',
		subtitle: 'Macro Beauty',
		model: 'Fujifilm X-T4',
		description:
			'A close-up shot of a delicate flower, revealing intricate details and vivid colors.',
	},
	{
		url: '/temp/portrait1.webp',
		title: 'Mountain Climber',
		subtitle: 'Conquering Heights',
		model: 'Olympus OM-D E-M1 Mark III',
		description:
			'A determined climber scaling a challenging rock face, embodying human perseverance.',
	},
	{
		url: '/temp/portrait2.webp',
		title: 'Forest Path',
		subtitle: "Nature's Corridor",
		model: 'Panasonic Lumix S1R',
		description:
			'A serene pathway through a lush forest, dappled sunlight filtering through the canopy.',
	},
];
