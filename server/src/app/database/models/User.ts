import mongoose, { Schema } from 'mongoose';

import { User } from '@/types.js';

const UserSchema = new mongoose.Schema<User>({
	email: { type: String, unique: true, required: true },
	hashed_password: { type: String, required: true },
	name: { type: String, required: true },
	ranked_runway_ids: [{ type: Schema.Types.ObjectId, ref: 'Runway' }],
});

export const UserModel = mongoose.model<User>('User', UserSchema);
