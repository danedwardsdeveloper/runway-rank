import mongoose from 'mongoose';

import { UserDocument } from '@/types.js';

const UserSchema = new mongoose.Schema<UserDocument>({
	email: { type: String, unique: true, required: true },
	hashed_password: { type: String, required: true },
	name: { type: String, required: true },
	ranked_runway_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Runway' }],
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
