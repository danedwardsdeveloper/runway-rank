import { useState, useEffect } from 'react';
import axios from 'axios';
import { AppData, RunwayItem } from '../../../types';

export default function TopRunways() {
	const [appData, setAppData] = useState<AppData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTopRunways = async () => {
			try {
				const response = await axios.get<AppData>(
					'http://localhost:3000/profile',
					{
						withCredentials: true,
					}
				);
				setAppData(response.data);
				setLoading(false);
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError('An unknown error occurred');
				}
				setLoading(false);
			}
		};

		fetchTopRunways();
	}, []);

	if (loading) {
		return (
			<div className="w-full flex justify-center items-center p-4">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full flex justify-center items-center p-4 text-red-500">
				Error: {error}
			</div>
		);
	}

	if (!appData?.isAuthenticated || !appData.user?.accessTopRunways) {
		return (
			<div className="w-full flex justify-center items-center p-4">
				<p className="text-red-500 text-lg">
					You don't have access to view the top runways yet. Keep ranking
					to unlock this page.
				</p>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col p-4">
			<h2 className="text-2xl font-bold mb-4">Top Runways</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{appData.topRunways?.map((runway: RunwayItem) => (
					<div
						key={runway._id}
						className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col max-w-80"
					>
						<div className="relative w-full p-4 h-auto">
							<img
								src={`/runways/${runway.imageSlug}.webp`}
								alt={`${runway.queenName} - ${runway.name}`}
								className="w-full h-full rounded"
							/>
						</div>
						<div className="p-4">
							<h3 className="font-bold text-lg mb-2">{runway.name}</h3>
							<p className="text-sm text-gray-600 mb-1">
								{runway.queenName}
							</p>
							<p className="text-sm text-gray-500 mb-1">
								{runway.franchise} Season {runway.season}
								{runway.episode && `, Episode ${runway.episode}`}
							</p>
							{runway.episodeName && (
								<p className="text-sm text-gray-500 mb-2">
									"{runway.episodeName}"
								</p>
							)}
							<div className="flex justify-between items-center mt-2">
								<span className="text-sm font-semibold">
									Score: {runway.score}
								</span>
								<span className="text-sm text-gray-500">
									Ratings: {runway.ratingsCount}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
