import { useState, useEffect } from 'react';

import { imageInfo, ImageInfo } from '../_tempData';

export default function ImageContainer() {
	const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);

	const shuffleImages = () => {
		const shuffled = [...imageInfo].sort(() => 0.5 - Math.random());
		setSelectedImages(shuffled.slice(0, 2));
	};

	useEffect(() => {
		shuffleImages();
	}, []);

	return (
		<div className="flex justify-center items-start p-4 w-full max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-center items-start gap-8 w-full">
				{selectedImages.map((img, index) => (
					<div
						key={index}
						onClick={shuffleImages}
						className={`w-full md:w-1/2 flex flex-col items-center md:items-start cursor-pointer transition-transform duration-300 ${
							index === 0 ? 'md:items-end' : 'md:items-start'
						}`}
					>
						<div className="relative inline-block">
							<img
								src={img.url}
								alt={img.title}
								className="w-full h-auto max-w-[400px] max-h-[400px] object-contain rounded-lg"
							/>
							<div className="absolute inset-0 transition-all duration-200 border-4 border-transparent hover:border-pink-500 rounded-lg pointer-events-none" />

							<div
								className={`mt-4 ${
									index === 0 ? 'md:text-right' : 'md:text-left'
								}`}
							></div>
							<h2 className="text-xl font-bold">{img.title}</h2>
							<h3 className="text-lg text-gray-600">{img.subtitle}</h3>
							<p className="text-sm text-gray-500 mt-1">{img.model}</p>
							<p className="text-sm mt-2">{img.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
