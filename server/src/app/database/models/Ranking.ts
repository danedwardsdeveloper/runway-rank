import mongoose, { Schema } from 'mongoose';

import { Ranking } from '../../../types.js';

const RankingSchema = new mongoose.Schema<Ranking>({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	type: { type: String, enum: ['score', 'ratings'], required: true },
	runways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Runway' }],
});

export const RankingModel = mongoose.model<Ranking>('Ranking', RankingSchema);
