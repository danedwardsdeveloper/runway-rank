import mongoose from 'mongoose';

import { RunwayItem } from '@/types.js';

const RunwaySchema = new mongoose.Schema<RunwayItem>({
	name: { type: String, required: true },
	queen_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Queen',
		required: true,
	},
	queen_name: { type: String, required: true },
	franchise: String,
	season: Number,
	episode: Number,
	episode_name: String,
	score: { type: Number, default: 1600 },
	ratings_count: { type: Number, default: 0 },
	image_url: { type: String, required: true },
});

export const RunwayModel = mongoose.model<RunwayItem>('Runway', RunwaySchema);
