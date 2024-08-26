import { useState, useEffect } from 'react';

import ImageContainer from './components/ImageContainer';
import { NextPairResponse, RunwayItem } from '../../../../types';
import { initialPair } from './_tempData';

export default function Home() {
	const [nextPair, setNextPair] = useState<NextPairResponse>(initialPair);

	const fetchNextPair = async (winner: string, loser: string) => {
		try {
			const body = JSON.stringify({ winner, loser });
			console.log(body);

			const response = await fetch('http://localhost:3000/get-next-pair', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: body,
				credentials: 'include',
			});
			if (!response.ok) {
				throw new Error('Failed to fetch next pair');
			}
			const data: NextPairResponse = await response.json();
			setNextPair(data);
			console.log(data);
		} catch (error) {
			console.error('Error fetching next pair:', error);
		}
	};

	const handleImageClick = (clickedItem: RunwayItem) => {
		if (nextPair.nextPair && nextPair.nextPair.length === 2) {
			const winner = clickedItem._id;
			const loser = nextPair.nextPair.find(
				(item) => item._id !== winner
			)?._id;
			if (loser) {
				fetchNextPair(winner, loser);
			}
		}
	};

	useEffect(() => {
		fetchNextPair('', '');
	}, []);

	return (
		<div>
			<ImageContainer
				nextPairResponse={nextPair}
				onImageClick={handleImageClick}
			/>
		</div>
	);
}
