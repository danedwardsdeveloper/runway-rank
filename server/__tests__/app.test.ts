import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app/app';

describe('Express Server Tests', () => {
	let server;

	beforeAll(() => {
		server = app.listen(3000);
	});

	afterAll((done) => {
		server.close(done);
	});

	it('GET / should return Welcome message', async () => {
		const response = await request(server).get('/');
		expect(response.status).toBe(200);
		expect(response.text).toBe('Welcome to the Runway Rank API');
	});
});
