import { UserModel } from '../models/User.js';
import mongoose from 'mongoose';

export async function updateUserRankedRunways(
	userId: string,
	runwayIds: string[]
): Promise<void> {
	try {
		await UserModel.findByIdAndUpdate(userId, {
			$addToSet: {
				ranked_runway_ids: {
					$each: runwayIds.map((id) => new mongoose.Types.ObjectId(id)),
				},
			},
		});
	} catch (error) {
		console.error('Error in updateUserRankedRunways:', error);
		throw error;
	}
}
