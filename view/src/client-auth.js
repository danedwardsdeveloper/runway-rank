import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';
import jwt from 'jsonwebtoken';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		session: null,
	}),

	setup() {
		const router = useRouter();
		return { router };
	},

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

						this.setCookie('Session', token, 1 / 6);

						localStorage.setItem('token', token);

						return {
							success: true,
							user: data.user,
							session: token,
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

				this.deleteCookie('Session'); // Delete the JWT token from cookies
				this.user = null;
				this.session = null;

				this.router.push('/');

				return true;
			} catch (error) {
				return false;
			}
		},

		checkAuth() {
			const token = localStorage.getItem('token');
			if (token) {
				this.token = token;
			} else {
				this.token = null;
				this.user = null;
			}
		},

		getCookie(name) {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop().split(';').shift();
		},

		setCookie(name, value, days) {
			let expires = '';
			if (days) {
				const date = new Date();
				date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
				expires = `; expires=${date.toUTCString()}`;
			}
			document.cookie = `${name}=${value || ''}${expires}; path=/`;
		},

		deleteCookie(name) {
			document.cookie = `${name}=; Max-Age=-99999999;`;
		},
	},
});
