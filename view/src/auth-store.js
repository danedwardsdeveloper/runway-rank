import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		session: null,
	}),

	actions: {
		async login(email, password) {
			try {
				const response = await fetch(
					'http://localhost:3000/api/accounts/log-in',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
						body: JSON.stringify({ email, password }),
					}
				);

				if (!response.ok) {
					throw new Error('Login failed');
				}

				const data = await response.json();

				const token = data.token;

				if (token) {
					try {
						const decodedToken = jwt.decode(token);
						console.log('Decoded token:', decodedToken);

						this.token = token;
						this.user = jwtDecode(token);
						console.log('User after decoding token:', this.user);

						localStorage.setItem('token', token);
						localStorage.setItem('user', JSON.stringify(this.user));

						return {
							success: true,
							user: this.user,
							token,
						};
					} catch (parseError) {
						console.error('Failed to parse JWT token:', parseError);
						return {
							success: false,
							error: 'Failed to parse JWT token',
						};
					}
				} else {
					return {
						success: false,
						error: 'Token not found in response',
					};
				}
			} catch (error) {
				console.error('Login error:', error);
				return { success: false, error: error.message };
			}
		},

		async logout() {
			try {
				const response = await fetch(
					'http://localhost:3000/api/accounts/log-out',
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);

				if (!response.ok) {
					return false;
				}

				localStorage.removeItem('token');
				localStorage.removeItem('user');

				this.router.push('/');

				return true;
			} catch (error) {
				return false;
			}
		},

		checkAuth() {
			const token = localStorage.getItem('token');
			const user = localStorage.getItem('user');
			if (token && user) {
				this.token = token;
				this.user = JSON.parse(user);
			} else {
				this.token = null;
				this.user = null;
			}
		},
	},
});
