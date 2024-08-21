import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app/app';

describe('MongoDB Express Tests', () => {
	let server;
	let userId;
	let numRunwaysUntilAccess;
	let firstPairIds;
	let agent;

	beforeAll(() => {
		server = app.listen(3000);
		agent = request.agent(server);
	});

	afterAll((done) => {
		server.close(done);
	});

	const logResponse = (response) => {
		console.log(`Status: ${response.status}`);
		console.log(`Headers: ${JSON.stringify(response.headers, null, 2)}`);
		console.log(`Body: ${JSON.stringify(response.body, null, 2)}`);
	};

	it('should return a welcome message', async () => {
		const response = await request(server).get('/');
		expect(response.status).toBe(200);
		expect(response.text).toBe('Welcome to the Runway Rank API');
	});

	it('should return nextPair with null user if logged out', async () => {
		const response = await request(server).post('/get-next-pair');

		expect(response.status).toBe(200);
		expect(response.body.user).toBe(null);
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

	it('should fail to sign in with non-existent account', async () => {
		const response = await agent.post('/sign-in').send({
			email: 'fakeAccount@gmail.com',
			password: 'SecurePassword',
		});

		expect(response.body).toEqual({
			message: 'Invalid email or password',
		});
	});

	it('should create an account', async () => {
		const response = await agent.post('/create-account').send({
			email: 'test@gmail.com',
			password: 'SecurePassword',
			name: 'Test',
		});

		expect(response.status).toBe(201);
		expect(response.body).toMatchObject({
			message: 'Account created successfully',
			authenticated: true,
			user: {
				name: 'Test',
				email: 'test@gmail.com',
				accessTopRunways: false,
				numRunwaysUntilAccess: expect.any(Number),
			},
		});

		expect(response.body.user.id).toMatch(/^[0-9a-fA-F]{24}$/);
		expect(response.body.user.numRunwaysUntilAccess).toBeGreaterThan(0);
		expect(Array.isArray(response.body.nextPair)).toBe(true);
		expect(response.body.nextPair).toHaveLength(2);

		userId = response.body.user.id;
		numRunwaysUntilAccess = response.body.user.numRunwaysUntilAccess;
	});

	it('should fail to create an account with the same email', async () => {
		const response = await agent.post('/create-account').send({
			email: 'test@gmail.com',
			password: 'SecurePassword',
			name: 'Test',
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toMatch(
			'User with this email already exists'
		);
	});

	it('should sign out', async () => {
		const response = await agent.post('/sign-out');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			message: 'Sign out successful',
		});
	});

	it('should fail to sign in with wrong password', async () => {
		const response = await agent.post('/sign-in').send({
			email: 'test@gmail.com',
			password: 'WrongPassword',
		});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Invalid email or password',
		});
	});

	it('should sign in with correct credentials', async () => {
		const response = await agent.post('/sign-in').send({
			email: 'test@gmail.com',
			password: 'SecurePassword',
		});

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			message: 'Sign in successful',
			user: {
				id: userId,
				name: 'Test',
				email: 'test@gmail.com',
			},
		});

		expect(Array.isArray(response.body.nextPair)).toBe(true);
		expect(response.body.nextPair).toHaveLength(2);

		firstPairIds = response.body.nextPair.map((item) => item._id);
	});

	it('should check top runways access', async () => {
		const response = await agent.get('/top-runways');

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			accessTopRunways: false,
			numRunwaysUntilAccess: expect.any(Number),
		});
		expect(response.body.numRunwaysUntilAccess).toBeGreaterThan(0);
	});

	it('should update scores and get next pair', async () => {
		const response = await agent.post('/get-next-pair').send({
			winner: firstPairIds[0],
			loser: firstPairIds[1],
		});

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			message: 'Scores updated successfully',
		});
		expect(firstPairIds).not.toContain(response.body.nextPair[0]._id);
		expect(firstPairIds).not.toContain(response.body.nextPair[1]._id);

		firstPairIds = response.body.nextPair.map((item) => item._id);
	});

	it('should update top runways access', async () => {
		const response = await agent.get('/top-runways');

		expect(response.status).toBe(200);
		if (numRunwaysUntilAccess <= 2) {
			expect(response.body.accessTopRunways).toBe(true);
		} else {
			expect(response.body.accessTopRunways).toBe(false);
			expect(response.body.numRunwaysUntilAccess).toBe(
				numRunwaysUntilAccess - 2
			);
		}
	});

	it('should sign out successfully', async () => {
		const response = await agent.post('/sign-out');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			message: 'Sign out successful',
		});
	});

	it('should fail to sign out when not signed in', async () => {
		const response = await agent.post('/sign-out');
		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			message: 'Not signed in',
		});
	});

	it('should fail to delete account when not signed in', async () => {
		const response = await agent.post('/delete-account');
		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Unauthorized',
		});
	});

	it('should sign in again', async () => {
		const response = await agent.post('/sign-in').send({
			email: 'test@gmail.com',
			password: 'SecurePassword',
		});
		expect(response.status).toBe(200);
	});

	it('should delete the account', async () => {
		const response = await agent.post('/delete-account');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			message: "Account 'test@gmail.com' deleted successfully",
		});
	});

	it('should fail to delete account again', async () => {
		const response = await agent.post('/delete-account');
		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Unauthorized',
		});
	});

	it('should fail to sign in with deleted account', async () => {
		const response = await agent.post('/sign-in').send({
			email: 'test@gmail.com',
			password: 'SecurePassword',
		});

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Invalid email or password',
		});
	});
});
