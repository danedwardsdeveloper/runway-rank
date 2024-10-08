import mongoose from 'mongoose';

import { UserModel } from '../models/User.js';
import { RunwayModel } from '../models/Runway.js';
import { UpdateUserOptions } from '../../../../../types.js';

export async function updateUser({ userId, newRunwayIds }: UpdateUserOptions) {
	try {
		let updateQuery: any = {};

		if (newRunwayIds && newRunwayIds.length > 0) {
			updateQuery.$addToSet = {
				ranked_runway_ids: {
					$each: newRunwayIds.map((id) => new mongoose.Types.ObjectId(id)),
				},
			};
		}

		const user = await UserModel.findByIdAndUpdate(userId, updateQuery, {
			new: true,
		});

		if (!user) {
			throw new Error('User not found');
		}

		const totalRunways = await RunwayModel.countDocuments();
		const userRankedRunways = user.ranked_runway_ids.length;

		const accessTopRunways = userRankedRunways >= totalRunways;
		const runwaysUntilAccess = Math.max(0, totalRunways - userRankedRunways);

		if (
			user.accessTopRunways !== accessTopRunways ||
			user.runwaysUntilAccess !== runwaysUntilAccess
		) {
			user.accessTopRunways = accessTopRunways;
			user.runwaysUntilAccess = runwaysUntilAccess;
			await user.save();
		}

		return user;
	} catch (error) {
		console.error('Error in updateUser:', error);
		throw error;
	}
}
