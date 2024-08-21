import { Response, NextFunction } from 'express';

import { CustomRequest, TopRunwayAccessResponse } from '@/types.js';
import { UserModel } from '@/app/database/models/User.js';
import { RunwayModel } from '@/app/database/models/Runway.js';

export const checkTopRunwaysAccess = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const totalRunways = await RunwayModel.countDocuments();

		const response: TopRunwayAccessResponse = {
			accessTopRunways: false,
			numRunwaysUntilAccess: totalRunways,
		};

		if (!req.user) {
			next();
			return;
		}

		const user = await UserModel.findById(req.user.id);
		if (!user) {
			next();
			return;
		}

		const userRankedRunways = user.ranked_runway_ids.length;
		response.accessTopRunways = userRankedRunways >= totalRunways;
		response.numRunwaysUntilAccess = Math.max(
			0,
			totalRunways - userRankedRunways
		);

		await UserModel.findByIdAndUpdate(user._id, {
			accessTopRunways: response.accessTopRunways,
			numRunwaysUntilAccess: response.numRunwaysUntilAccess,
		});

		req.user.accessTopRunways = response.accessTopRunways;
		req.user.numRunwaysUntilAccess = response.numRunwaysUntilAccess;

		next();
	} catch (error) {
		console.error('Error checking top runways access:', error);
		next(error);
	}
};
