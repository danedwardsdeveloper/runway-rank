import { useState, useEffect } from 'react';

const imageUrls = [
	'landscape1',
	'landscape2',
	'square1',
	'square2',
	'portrait1',
	'portrait2',
].map((slug) => `/temp/${slug}.webp`);

export default function ImageContainer() {
	const [selectedImages, setSelectedImages] = useState<string[]>([]);

	const shuffleImages = () => {
		const shuffled = [...imageUrls].sort(() => 0.5 - Math.random());
		setSelectedImages(shuffled.slice(0, 2));
	};

	useEffect(() => {
		shuffleImages();
	}, []);

	return (
		<>
			<button
				onClick={shuffleImages}
				className="bg-pink-400 hover:bg-pink-300 text-black hover:text-gray-900 rounded py-1 px-2 hover:outline-gray-600 outline-2 hover:shadow-lg"
			>
				Shuffle Images
			</button>

			<div className="flex-row ">
				{selectedImages.map((img, index) => (
					<div>
						<img
							key={index}
							src={img}
							alt={`Random image ${index + 1}`}
							className="max-w-96 max-h-96 object-cover rounded"
						/>
					</div>
				))}
			</div>
		</>
	);
}
