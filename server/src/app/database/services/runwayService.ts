import { RunwayModel } from '../models/Runway.js';
import { RunwayItem } from '@/types.js';
import { getUserRankings } from './rankingService.js';

export async function getNextPairService(
	userId: string
): Promise<[RunwayItem, RunwayItem]> {
	try {
		let runways;

		if (userId) {
			const userRankings = await getUserRankings(userId);
			const rankedRunwayIds = userRankings.map(
				(ranking) => ranking.runwayId
			);

			runways = await RunwayModel.find({ _id: { $nin: rankedRunwayIds } })
				.sort({ ratings_count: 1 })
				.limit(2);
		} else {
			runways = await RunwayModel.find().sort({ ratings_count: 1 }).limit(2);
		}

		if (runways.length < 2) {
			throw new Error('Not enough runways available for ranking');
		}

		return [runways[0], runways[1]];
	} catch (error) {
		console.error('Error in getNextPairService:', error);
		throw error;
	}
}
