import mongoose from 'mongoose';

import { environment } from 'src/environment.js';

export async function createIndexes() {
	const db = mongoose.connection.db;

	if (!db) {
		console.error('Database connection is not established');
		return;
	}

	try {
		await db.collection('users').createIndex({ email: 1 }, { unique: true });
		await db.collection('runways').createIndex({ name: 1 });
		await db.collection('runways').createIndex({ queen_name: 1 });
		await db.collection('runways').createIndex({ score: -1 });
		await db.collection('runways').createIndex({ ratings_count: 1 });
		await db.collection('queens').createIndex({ name: 1 });

		environment.isDevelopment && console.log('Indexes created successfully');
	} catch (error) {
		console.error('Error creating indexes:', error);
	}
}
