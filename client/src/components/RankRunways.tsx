import { useEffect } from 'react';

import ImageContainer from './ImageContainer';
import { RunwayItem, AppData } from '../../../types';
import { useApp } from '../contexts/AppContext';
import { logger } from '../utilities/logger';
import { ResultsRequestBody } from '../../../types';
import Banner from './Banner';
import NoMorePairs from './NoMorePairs';
import Metadata from './Metadata';

export default function RankRunways() {
	const { appData, setAppData } = useApp();

	const fetchNextPair = async (results?: ResultsRequestBody) => {
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
		<>
			<Metadata pageName="Home" slug="" title="Home" />
			<div>
				{!appData.isAuthenticated && <Banner />}
				{appData.runways ? (
					<ImageContainer
						runways={currentRunways}
						onImageClick={handleImageClick}
						isAuthenticated={appData.isAuthenticated}
					/>
				) : (
					<NoMorePairs />
				)}
			</div>
		</>
	);
}
