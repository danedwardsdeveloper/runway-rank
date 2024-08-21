import { RunwayModel } from '../models/Runway.js';
import { UserModel } from '../models/User.js';
import { RunwayItem } from '@/types.js';

export async function getNextPairService(
	userId: string | null
): Promise<RunwayItem[] | null> {
	try {
		let runways;

		if (userId) {
			const user = await UserModel.findById(userId);
			if (!user) throw new Error('User not found');

			runways = await RunwayModel.find({
				_id: { $nin: user.ranked_runway_ids },
			})
				.sort({ ratings_count: 1 })
				.limit(2);

			if (runways.length === 1) {
				const randomRunway = await RunwayModel.aggregate([
					{
						$match: {
							_id: { $nin: [...user.ranked_runway_ids, runways[0]._id] },
						},
					},
					{ $sample: { size: 1 } },
				]);
				runways.push(randomRunway[0]);
			}
		} else {
			runways = await RunwayModel.find().sort({ ratings_count: 1 }).limit(2);
		}

		if (runways.length < 2) {
			return null;
		}

		return runways;
	} catch (error) {
		console.error('Error in getNextPairService:', error);
		throw error;
	}
}

export async function updateRunwayScores(
	winnerId: string,
	loserId: string
): Promise<void> {
	try {
		await RunwayModel.findByIdAndUpdate(winnerId, {
			$inc: { score: 10, ratings_count: 1 },
		});
		await RunwayModel.findByIdAndUpdate(loserId, {
			$inc: { score: -10, ratings_count: 1 },
		});
	} catch (error) {
		console.error('Error in updateRunwayScores:', error);
		throw error;
	}
}
