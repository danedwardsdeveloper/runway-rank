import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IUser {
	email: string;
	hashed_password: string;
	name: string;
	runways_ranked: ObjectId[];
}

const UserSchema = new mongoose.Schema<IUser>({
	email: { type: String, unique: true, required: true },
	hashed_password: { type: String, required: true },
	name: { type: String, required: true },
	runways_ranked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Runway' }],
});

export const User = mongoose.model<IUser>('User', UserSchema);
