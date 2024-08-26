import { NextPairResponse, RunwayItem } from '../../../../../types';

interface ImageContainerProps {
	nextPairResponse: NextPairResponse;
	onImageClick: (clickedItem: RunwayItem) => void;
}

export default function ImageContainer({
	nextPairResponse,
	onImageClick,
}: ImageContainerProps) {
	const runwayItems = nextPairResponse.nextPair || [];

	return (
		<div className="flex justify-center items-start p-4 w-full max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-center items-stretch gap-20 sm:gap-8 w-full">
				{nextPairResponse &&
					runwayItems.map((img, index) => (
						<div
							key={index}
							className={`w-full md:w-1/2 flex flex-col items-center md:items-start ${
								index === 0 ? 'md:items-end' : 'md:items-start'
							}`}
						>
							<div className="flex-grow flex flex-col justify-end mb-4">
								<img
									onClick={() => onImageClick(img)}
									src={`/runways/${img.image_url}.webp`}
									alt={img.name}
									className="w-full h-auto md:max-w-[400px] md:max-h-[400px] object-contain cursor-pointer rounded-lg border-4 border-transparent hover:border-pink-500 transition-all duration-200"
								/>
							</div>
							<div
								className={`w-full max-w-[400px] md:min-h-32 ${
									index === 0 ? 'md:text-right' : 'md:text-left'
								}`}
							>
								<h2 className="text-xl font-bold">{img.queen_name}</h2>
								<h3 className="text-lg text-gray-600">{img.name}</h3>
								<p className="text-sm mt-2">
									{img.franchise}
									{img.season && ` S${img.season}`}
									{img.episode && ` E${img.episode}`}
								</p>
								<p className="text-sm mt-2">{img.episode_name}</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
