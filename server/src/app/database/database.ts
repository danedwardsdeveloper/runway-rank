import mongoose from 'mongoose';

import { environment } from '@/environment.js';
import { createIndexes } from '@/app/database/createIndexes.js';

export async function connectToDatabase(): Promise<void> {
	try {
		await mongoose.connect(environment.MONGO_STRING);
		environment.isDevelopment &&
			console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}

	await createIndexes();
}
