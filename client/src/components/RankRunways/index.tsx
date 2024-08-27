import { useEffect } from 'react';

import ImageContainer from './components/ImageContainer';
import { RunwayItem, AppData } from '../../../../types';
import { useApp } from '../../contexts/AppContext';
import { logger } from '../../utilities/logger';
import { Link } from 'react-router-dom';

interface Results {
	winner: string;
	loser: string;
}

export default function Home() {
	const { appData, setAppData } = useApp();

	const fetchNextPair = async (results?: Results) => {
		try {
			const url = 'http://localhost:3000/get-next-pair';
			const options: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			};

			if (results) {
				const body = JSON.stringify(results);
				console.log(body);
				options.body = body;
			}

			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error('Failed to fetch next pair');
			}
			const data: AppData = await response.json();
			setAppData(data);
			console.log(data);
		} catch (error) {
			console.error('Error fetching next pair:', error);
		}
	};

	useEffect(() => {
		fetchNextPair();
	}, []);

	const currentRunways =
		appData.runways && appData.runways.length >= 2
			? appData.runways.slice(0, 2)
			: null;

	const handleImageClick = (clickedItem: RunwayItem) => {
		if (!appData.isAuthenticated) {
			logger.info('Image click prevented: User not authenticated');
			return;
		}

		logger.info('Image clicked');
		if (!currentRunways) {
			console.error('Error: No current runways available.');
			return;
		}

		const winner = clickedItem._id.toString();
		logger.debug(`Winner: ${winner}`);
		const loser = currentRunways
			.find((item) => item._id !== winner)
			?._id.toString();

		if (winner && loser) {
			fetchNextPair({ winner, loser });
		} else {
			console.error('Error: Winner or loser is undefined.');
		}
	};

	return (
		<div>
			{currentRunways ? (
				<ImageContainer
					runways={currentRunways}
					onImageClick={handleImageClick}
					isAuthenticated={appData.isAuthenticated}
				/>
			) : (
				<div className="text-center mt-5">
					<p className="text-lg text-green-500">Thank you for voting! </p>
					<p className="text-lg text-green-500">
						Now check out the{' '}
						<Link
							to="/top-runways"
							className="font-semibold leading-6 text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
						>
							top runways
						</Link>
					</p>
				</div>
			)}
		</div>
	);
}
