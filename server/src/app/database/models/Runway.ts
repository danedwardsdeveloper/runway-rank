import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IRunway {
	name: string;
	queen_id: ObjectId;
	queen_name: string;
	franchise?: string;
	season?: number;
	episode?: number;
	episode_name?: string;
	score: number;
	ratings_count: number;
	image_url: string;
}

const RunwaySchema = new mongoose.Schema<IRunway>({
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

export const Runway = mongoose.model<IRunway>('Runway', RunwaySchema);
