import { RunwayItem } from '../../../types';
import { environment } from '../environment';

interface ImageContainerProps {
	runways: RunwayItem[] | null;
	onImageClick: (clickedItem: RunwayItem) => void;
	isAuthenticated: boolean;
}

export default function ImageContainer({
	runways,
	onImageClick,
	isAuthenticated,
}: ImageContainerProps) {
	if (!runways || runways.length === 0) {
		return null;
	}

	return (
		<div className="flex justify-center items-start p-4 w-full max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-center items-stretch gap-20 sm:gap-8 w-full ">
				{runways.map((img, index) => (
					<div
						key={img._id.toString()}
						className={`w-full md:w-1/2 flex flex-col items-center  ${
							index === 0 ? 'md:items-end' : 'md:items-start'
						}`}
					>
						<div className="flex-grow flex flex-col justify-end mb-4 ">
							<img
								onClick={() => isAuthenticated && onImageClick(img)}
								src={`${environment.apiBase}/images/${img.imageSlug}.webp`}
								alt={`${img.queenName} - ${img.name}`}
								data-testid="runway-image"
								className={`w-full h-auto md:max-w-[400px] md:max-h-[400px] object-contain rounded-lg border-4 border-transparent transition-all duration-200 ${
									isAuthenticated
										? 'cursor-pointer hover:border-pink-500'
										: 'cursor-not-allowed opacity-50'
								}`}
							/>
						</div>
						<div
							className={`w-full ${
								index === 0 ? 'sm:text-right' : 'sm:text-left'
							}`}
						>
							<h2 className="text-xl font-bold">{img.queenName}</h2>
							<h3 className="text-lg text-gray-600">{img.name}</h3>
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
