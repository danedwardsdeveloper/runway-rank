import mongoose from 'mongoose';
import { RankingModel } from '../models/Ranking.js';
import { UserModel } from '../models/User.js';
import { RunwayModel } from '../models/Runway.js';
import { User, Ranking, RunwayItem } from 'src/types.js';

interface UserRanking {
	runwayId: mongoose.Types.ObjectId;
	count: number;
}

export async function getUserRankings(userId: string): Promise<UserRanking[]> {
	try {
		const userRankings = await RankingModel.aggregate([
			{ $match: { user: new mongoose.Types.ObjectId(userId) } },
			{ $unwind: '$runways' },
			{
				$group: {
					_id: '$runways',
					count: { $sum: 1 },
				},
			},
			{
				$project: {
					runwayId: '$_id',
					count: 1,
					_id: 0,
				},
			},
		]);

		return userRankings;
	} catch (error) {
		console.error('Error in getUserRankings:', error);
		throw error;
	}
}

export async function updateRankingsService(
	userId: string,
	winnerId: string,
	loserId: string
): Promise<void> {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const userObjectId = new mongoose.Types.ObjectId(userId);
		const winnerObjectId = new mongoose.Types.ObjectId(winnerId);
		const loserObjectId = new mongoose.Types.ObjectId(loserId);

		await RankingModel.findOneAndUpdate(
			{ user: userObjectId },
			{
				$push: {
					runways: {
						$each: [winnerObjectId, loserObjectId],
						$position: 0,
					},
				},
			},
			{ upsert: true, session, new: true }
		);

		await UserModel.findByIdAndUpdate(
			userObjectId,
			{
				$addToSet: {
					ranked_runway_ids: {
						$each: [winnerObjectId, loserObjectId],
					},
				},
			},
			{ session, new: true }
		);

		await RunwayModel.updateMany(
			{ _id: { $in: [winnerObjectId, loserObjectId] } },
			{ $inc: { ratings_count: 1 } },
			{ session }
		);

		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		console.error('Error updating rankings:', error);
		throw error;
	} finally {
		session.endSession();
	}
}
