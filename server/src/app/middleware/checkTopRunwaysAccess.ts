import { Response, NextFunction } from 'express';
import { CustomRequest } from '@/types.js';
import { UserModel } from '@/app/database/models/User.js';
import { RunwayModel } from '@/app/database/models/Runway.js';

export const checkTopRunwaysAccess = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const totalRunways = await RunwayModel.countDocuments();

		if (!req.user) {
			req.accessTopRunways = false;
			req.numRunwaysUntilAccess = totalRunways;
			return next();
		}

		const user = await UserModel.findById(req.user.id);
		if (!user) {
			req.accessTopRunways = false;
			req.numRunwaysUntilAccess = totalRunways;
			return next();
		}

		const userRankedRunways = user.ranked_runway_ids.length;
		req.accessTopRunways = userRankedRunways >= totalRunways;
		req.numRunwaysUntilAccess = Math.max(0, totalRunways - userRankedRunways);
		next();
	} catch (error) {
		console.error('Error checking top runways access:', error);
		req.accessTopRunways = false;
		req.numRunwaysUntilAccess = 0;
		next();
	}
};
