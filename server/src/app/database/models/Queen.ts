import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IQueen {
	name: string;
	former_name?: string;
	runways: ObjectId[];
}

const QueenSchema = new mongoose.Schema<IQueen>({
	name: { type: String, required: true },
	former_name: String,
	runways: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Runway' }],
});

export const Queen = mongoose.model<IQueen>('Queen', QueenSchema);
