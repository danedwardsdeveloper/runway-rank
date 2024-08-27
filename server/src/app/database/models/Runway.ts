import mongoose from 'mongoose';

import { RunwayItem } from '../../../../../types.js';

const RunwaySchema = new mongoose.Schema<RunwayItem>({
	name: { type: String, required: true },
	queenId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Queen',
		required: true,
	},
	queenName: { type: String, required: true },
	franchise: String,
	season: Number,
	episode: Number,
	episodeName: String,
	score: { type: Number, default: 1600 },
	ratingsCount: { type: Number, default: 0 },
	imageSlug: { type: String, required: true },
});

export const RunwayModel = mongoose.model<RunwayItem>('Runway', RunwaySchema);
