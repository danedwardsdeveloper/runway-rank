import mongoose from 'mongoose';
import { Queen } from '@/types.js';

const QueenSchema = new mongoose.Schema<Queen>({
	name: { type: String, required: true },
	former_name: String,
	runways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Runway' }],
});

export const QueenModel = mongoose.model<Queen>('Queen', QueenSchema);
