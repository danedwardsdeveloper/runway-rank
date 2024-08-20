import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IRanking {
	type: 'score' | 'ratings';
	runways: ObjectId[];
}

const RankingSchema = new mongoose.Schema<IRanking>({
	type: { type: String, enum: ['score', 'ratings'], required: true },
	runways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Runway' }],
});

export const Ranking = mongoose.model<IRanking>('Ranking', RankingSchema);
