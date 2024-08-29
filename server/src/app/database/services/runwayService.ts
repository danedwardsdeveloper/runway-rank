import { Types } from 'mongoose';

import { RunwayModel } from '../models/Runway.js';
import { UserModel } from '../models/User.js';
import { RunwayItem } from '../../../../../types.js';
import calculateEloRatings from '../../utilities/eloRating.js';
import { logger } from '../../middleware/logger.js';

// Split this into userService/getNextPair and runwayService/getDefaultPair
export async function getNextPairService(
	userId: string | null
): Promise<RunwayItem[] | null> {
	logger.info(`getNextPairService called with userId: ${userId}`);

	try {
		let runways;

		if (userId) {
			const userObjectId = new Types.ObjectId(userId);
			logger.info(`Fetching user with id: ${userObjectId}`);
			const user = await UserModel.findById(userObjectId);
			if (!user) {
				logger.warn(`User not found for id: ${userObjectId}`);
				throw new Error('User not found');
			}
			logger.info(`User found: ${user._id}`);

			logger.info(`Fetching runways not ranked by user`);
			runways = await RunwayModel.find({
				_id: { $nin: user.ranked_runway_ids },
			}).sort({ ratingsCount: 1 });
			logger.info(`Found ${runways.length} unranked runways`);

			if (runways.length === 1) {
				logger.info(
					`Less than 2 unranked runways found, fetching from all runways`
				);
				const additionalRunways = await RunwayModel.find({
					_id: { $nin: runways.map((r) => r._id) },
				})
					.sort({ ratingsCount: 1 })
					.limit(2 - runways.length);

				runways.push(...additionalRunways);
				logger.info(`Added ${additionalRunways.length} additional runways`);
			}
		} else {
			logger.info(`No userId provided, fetching default pair of runways`);
			runways = await RunwayModel.find().sort({ ratingsCount: 1 }).limit(2);
			logger.info(`Fetched ${runways.length} default runways`);
		}

		if (runways.length < 2) {
			logger.warn(
				`Not enough runways found. Only ${runways.length} available.`
			);
			return null;
		}

		logger.info(
			`Returning pair of runways: ${runways.map((r) => r._id).join(', ')}`
		);
		return runways;
	} catch (error) {
		logger.error('Error in getNextPairService:', error);
		throw error;
	}
}

export async function updateRunwayScores(
	winnerId: string,
	loserId: string
): Promise<void> {
	logger.info(
		`updateRunwayScores called with winnerId: ${winnerId}, loserId: ${loserId}`
	);

	try {
		logger.info(`Fetching winner runway: ${winnerId}`);
		const winner = await RunwayModel.findById(winnerId);
		logger.info(`Fetching loser runway: ${loserId}`);
		const loser = await RunwayModel.findById(loserId);

		if (!winner || !loser) {
			logger.warn(
				`Winner or loser runway not found. Winner: ${!!winner}, Loser: ${!!loser}`
			);
			throw new Error('Winner or loser runway not found');
		}

		logger.info(
			`Calculating new Elo ratings. Winner score: ${winner.score}, Loser score: ${loser.score}`
		);
		const { winnerRating, loserRating } = calculateEloRatings({
			winnerRating: winner.score,
			loserRating: loser.score,
		});
		logger.info(
			`New ratings calculated. Winner: ${winnerRating}, Loser: ${loserRating}`
		);

		logger.info(`Updating winner runway: ${winnerId}`);
		await RunwayModel.findByIdAndUpdate(winnerId, {
			$set: { score: winnerRating },
			$inc: { ratingsCount: 1 },
		});

		logger.info(`Updating loser runway: ${loserId}`);
		await RunwayModel.findByIdAndUpdate(loserId, {
			$set: { score: loserRating },
			$inc: { ratingsCount: 1 },
		});

		logger.info(`Runway scores updated successfully`);
	} catch (error) {
		logger.error('Error in updateRunwayScores:', error);
		throw error;
	}
}

export async function getTopRunways(): Promise<RunwayItem[]> {
	logger.info(`getTopRunways called`);
	try {
		logger.info(`Fetching top 10 runways by score`);
		const topRunways = await RunwayModel.find()
			.sort({ score: -1 })
			.limit(10)
			.lean();

		logger.info(`Found ${topRunways.length} top runways`);
		logger.info(
			`Top runway scores: ${topRunways.map((r) => r.score).join(', ')}`
		);

		return topRunways;
	} catch (error) {
		logger.error('Error in getTopRunways:', error);
		throw error;
	}
}
