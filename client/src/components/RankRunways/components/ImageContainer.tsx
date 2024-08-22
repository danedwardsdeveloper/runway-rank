import { useState, useEffect } from 'react';

import { RunwayPhoto, runwayPhotos } from '../_tempData';

export default function ImageContainer() {
	const [selectedImages, setSelectedImages] = useState<RunwayPhoto[]>([]);

	const shuffleImages = () => {
		const shuffled = [...runwayPhotos].sort(() => 0.5 - Math.random());
		setSelectedImages(shuffled.slice(0, 2));
	};

	useEffect(() => {
		shuffleImages();
	}, []);

	return (
		<div className="flex justify-center items-start p-4 w-full max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-center items-stretch gap-20 sm:gap-8 w-full">
				{selectedImages.map((img, index) => (
					<div
						key={index}
						className={`w-full md:w-1/2 flex flex-col items-center md:items-start ${
							index === 0 ? 'md:items-end' : 'md:items-start'
						}`}
					>
						<div className="flex-grow flex flex-col justify-end mb-4">
							<img
								src={`/runways/${img.slug}.webp`}
								alt={img.description}
								onClick={shuffleImages}
								className="w-full h-auto md:max-w-[400px] md:max-h-[400px] object-contain cursor-pointer rounded-lg border-4 border-transparent hover:border-pink-500 transition-all duration-200"
							/>
						</div>
						<div
							className={`w-full max-w-[400px] md:min-h-32 ${
								index === 0 ? 'md:text-right' : 'md:text-left'
							}`}
						>
							<h2 className="text-xl font-bold">{img.queenName}</h2>
							<h3 className="text-lg text-gray-600">
								{img.description}
							</h3>
							<p className="text-sm mt-2">
								{img.franchise}
								{img.season && ` S${img.season}`}
								{img.episode && ` E${img.episode}`}
							</p>
							<p className="text-sm mt-2">{img.episodeName}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
