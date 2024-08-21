import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app/app';

describe('MongoDB Express Tests', () => {
	let server;

	beforeAll(() => {
		server = app.listen(3000);
	});

	afterAll((done) => {
		server.close(done);
	});

	it('should return Welcome message', async () => {
		const response = await request(server).get('/');
		expect(response.status).toBe(200);
		expect(response.text).toBe('Welcome to the Runway Rank API');
	});

	it('should return nextPair without user object', async () => {
		const response = await request(server).get('/get-next-pair');

		expect(response.status).toBe(200);
		expect(response.body).not.toHaveProperty('user');
		expect(response.body).toHaveProperty('nextPair');
		expect(Array.isArray(response.body.nextPair)).toBe(true);
		expect(response.body.nextPair).toHaveLength(2);

		const expectedProperties = [
			'_id',
			'name',
			'queen_id',
			'queen_name',
			'franchise',
			'season',
			'episode',
			'episode_name',
			'score',
			'ratings_count',
			'image_url',
		];

		response.body.nextPair.forEach((item) => {
			expect(typeof item).toBe('object');
			expectedProperties.forEach((prop) => {
				expect(item).toHaveProperty(prop);
			});
		});
	});
});
