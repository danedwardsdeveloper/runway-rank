import { useState, useEffect } from 'react';

import ImageContainer from './components/ImageContainer';
import { NextPairResponse } from '../../../../types';
import { initialPair } from './_tempData';

export default function Home() {
	const [nextPair, setNextPair] = useState<NextPairResponse>(initialPair);

	const fetchNextPair = async () => {
		try {
			const response = await fetch('http://localhost:3000/get-next-pair', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
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

	useEffect(() => {
		fetchNextPair();
	}, []);

	return (
		<div>
			<ImageContainer nextPair={nextPair} />
		</div>
	);
}
