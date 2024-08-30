import { useState, useEffect } from 'react';
import axios from 'axios';

import { environment } from '../environment';
import ImageContainer from './ImageContainer';
import { RunwayItem } from '../../../types';
import { useApp } from '../contexts/AppContext';
import { logger } from '../utilities/logger';
import { ResultsRequestBody } from '../../../types';
import Banner from './Banner';
import NoMorePairs from './NoMorePairs';
import Metadata from './Metadata';

export default function RankRunways() {
	const { appData, setAppData } = useApp();
	const [isLoading, setIsLoading] = useState(false);

	const getNextPair = async (results?: ResultsRequestBody) => {
		logger.info('Fetching next pair', results);

		setIsLoading(true);
		try {
			const response = await axios.post(
				`${environment.apiBase}/get-next-pair`,
				results,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			logger.info('Next pair fetched successfully', { data: response.data });

			setAppData(response.data);
			logger.info(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message || 'Failed to fetch next pair';
				logger.warn('Failed to fetch next pair', { message });
				console.error('Error fetching next pair:', message);
			} else {
				logger.error('Unexpected error while fetching next pair', {
					error,
				});
				console.error('Unexpected error:', error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getNextPair();
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
			getNextPair({ winner, loser });
		} else {
			console.error('Error: Winner or loser is undefined.');
		}
	};

	return (
		<>
			<Metadata pageName="Home" slug="" title="Home" />
			<div>
				{!appData.isAuthenticated && <Banner />}
				{isLoading && (
					<h1 className="text-2xl text-blue-500">Loading...</h1>
				)}
				{appData.runways ? (
					<ImageContainer
						runways={currentRunways}
						onImageClick={handleImageClick}
						isAuthenticated={appData.isAuthenticated}
					/>
				) : (
					<NoMorePairs />
				)}
				)
			</div>
		</>
	);
}
