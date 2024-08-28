import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app/app';

function isValidMongoId(id: string): boolean {
	return /^[0-9a-fA-F]{24}$/.test(id);
}

function expectValidMongoId(id: string) {
	expect(isValidMongoId(id)).toBe(true);
}

const expectedRunwayProperties = [
	'_id',
	'name',
	'score',
	'ratingsCount',
	'imageSlug',
];

describe('MongoDB Express Tests', () => {
	let server;
	let userId;
	let runwayIds;
	let numRunwaysUntilAccess;
	let agent;

	async function deleteTestAccount(agent) {
		try {
			const signInResponse = await agent.post('/sign-in').send({
				email: 'test@gmail.com',
				password: 'SecurePassword',
			});

			if (signInResponse.status === 401) {
				console.log('No existing test account found');
			} else if (signInResponse.status === 200) {
				const deleteAccountResponse = await agent.delete('/delete-account');
				if (deleteAccountResponse.status === 200) {
					console.log('Existing test account deleted');
				} else {
					console.log('Failed to delete existing test account');
				}
			} else {
				console.log(
					`Unexpected response during sign-in: ${signInResponse.status}`
				);
			}
		} catch (error) {
			console.error('Error during account cleanup:', error.message);
		} finally {
			await agent.get('/sign-out');
		}
	}

	beforeAll(async () => {
		server = app.listen(3001);
		agent = request.agent(server);

		await deleteTestAccount(agent);
	});

	afterAll((done) => {
		server.close(done);
	});

	it('should return a welcome message', async () => {
		const response = await request(server).get('/');
		expect(response.status).toBe(200);
		expect(response.text).toBe('Welcome to the Runway Rank API');
	});

	it('should return nextPair with null user if logged out', async () => {
		const response = await request(server).post('/get-next-pair');

		expect(response.status).toBe(200);
		expect(response.body.user).toBe(null);
		expect(response.body).toHaveProperty('runways');
		expect(Array.isArray(response.body.runways)).toBe(true);
		expect(response.body.runways.length).toBeGreaterThanOrEqual(2);

		response.body.runways.forEach((item) => {
			expect(typeof item).toBe('object');
			expectedRunwayProperties.forEach((prop) => {
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
		expect(numRunwaysUntilAccess).toBeGreaterThan(8);
	});

	it('should fail to create an account with the same email', async () => {
		const response = await agent.post('/create-account').send({
			email: 'test@gmail.com',
			password: 'SecurePassword',
			name: 'Test',
		});

		expect(response.status).toBe(200);
		expect(response.body.message).toMatch('User already exists');
	});

	it('should sign out', async () => {
		const response = await agent.get('/sign-out');
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

		response.body.nextPair.forEach((item) => {
			expect(typeof item).toBe('object');
			expectedRunwayProperties.forEach((prop) => {
				expect(item).toHaveProperty(prop);
			});
		});
	});

	it('should return correct user data for authenticated user without top runways access', async () => {
		const response = await agent.get('/top-runways');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('user');

		const user = response.body.user;

		expect(user).toMatchObject({
			name: 'Test',
			email: 'test@gmail.com',
			accessTopRunways: false,
			numRunwaysUntilAccess: numRunwaysUntilAccess,
		});
		expectValidMongoId(user.id);
		expect(response.body).not.toHaveProperty('topRunways');
	});

	it('should continuously update scores until top runways access is granted', async () => {
		let currentRunwayIds;
		let previousRunwayIds = [];

		const initialResponse = await agent.post('/get-next-pair');
		let localNumRunwaysUntilAccess =
			initialResponse.body.user.numRunwaysUntilAccess;
		currentRunwayIds = initialResponse.body.nextPair.map((item) => item._id);

		console.log(
			`Initial runways until access: ${localNumRunwaysUntilAccess}`
		);

		while (localNumRunwaysUntilAccess > 1) {
			const response = await agent.post('/get-next-pair').send({
				winner: currentRunwayIds[0],
				loser: currentRunwayIds[1],
			});

			expect(response.status).toBe(200);

			if (response.body.nextPair) {
				let queenOne = response.body.nextPair[0].queen_name;
				let queenTwo = response.body.nextPair[1].queen_name;

				console.log(queenOne, queenTwo);

				currentRunwayIds = response.body.nextPair.map((item) => item._id);
				expect(previousRunwayIds).not.toContain(currentRunwayIds[0]);
				expect(previousRunwayIds).not.toContain(currentRunwayIds[1]);
				previousRunwayIds = currentRunwayIds;
			} else {
				console.log('No more pairs available');
				break;
			}

			localNumRunwaysUntilAccess = response.body.user.numRunwaysUntilAccess;

			expect(response.body.user.numRunwaysUntilAccess).toBeLessThanOrEqual(
				localNumRunwaysUntilAccess
			);
			expect(
				response.body.user.numRunwaysUntilAccess
			).toBeGreaterThanOrEqual(localNumRunwaysUntilAccess - 4);

			localNumRunwaysUntilAccess = response.body.user.numRunwaysUntilAccess;

			console.log(
				`After update: Runways until access: ${localNumRunwaysUntilAccess}`
			);

			if (localNumRunwaysUntilAccess === 0) {
				expect(response.body.user.accessTopRunways).toBe(true);
			} else {
				expect(response.body.user.accessTopRunways).toBe(false);
			}
		}

		const finalResponse = await agent.post('/get-next-pair').send({
			winner: currentRunwayIds[0],
			loser: currentRunwayIds[1],
		});
		expect(finalResponse.body.user.numRunwaysUntilAccess).toBe(0);
		expect(finalResponse.body.user.accessTopRunways).toBe(true);
		expect(finalResponse.body.noMorePairs).toBe(true);

		numRunwaysUntilAccess = localNumRunwaysUntilAccess;
	});

	it('should sign out successfully', async () => {
		const response = await agent.get('/sign-out');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			message: 'Sign out successful',
		});
	});

	it('should fail to sign out when not signed in', async () => {
		const response = await agent.get('/sign-out');
		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Not signed in',
		});
	});

	it('should fail to delete account when not signed in', async () => {
		const response = await agent.delete('/delete-account');
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
		const response = await agent.delete('/delete-account');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			message: "Account 'test@gmail.com' deleted successfully",
		});
	});

	it('should fail to delete account again', async () => {
		const response = await agent.delete('/delete-account');
		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: 'Unauthorized',
		});
	});

	it('should fail to sign in with deleted the account', async () => {
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
