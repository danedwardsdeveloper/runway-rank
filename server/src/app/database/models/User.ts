import mongoose from 'mongoose';

import { IUser } from 'src/types.js';

const UserSchema = new mongoose.Schema<IUser>({
	email: { type: String, unique: true, required: true },
	hashed_password: { type: String, required: true },
	name: { type: String, required: true },
	ranked_runway_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Runway' }],
});

export const User = mongoose.model<IUser>('User', UserSchema);
