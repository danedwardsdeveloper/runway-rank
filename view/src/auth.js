import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

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

				const session = this.getCookie('session');

				if (session) {
					try {
						const decodedSession = decodeURIComponent(session);
						console.log('Decoded session:', decodedSession);

						const parsedSession = JSON.parse(decodedSession);
						console.log('Parsed session:', parsedSession);

						this.user = data.user;
						this.session = parsedSession;

						// this.router.push('/dashboard');
						return {
							success: true,
							user: data.user,
							session: parsedSession,
						};
					} catch (parseError) {
						console.error('Failed to parse session cookie:', parseError);
						return {
							success: false,
							error: 'Failed to parse session cookie',
						};
					}
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
						// body: JSON.stringify({ email, password }),
					}
				);

				if (!response.ok) {
					// console.error('Login failed:', response.statusText);
					return false;
				}

				this.deleteCookie('Session');
				this.user = null;
				this.session = null;

				this.router.push('/');

				return true;
			} catch (error) {
				// console.error('Login failed:');
				return false;
			}
		},

		checkAuth() {
			const session = this.getCookie('Session');
			if (session) {
				const decodedSession = decodeURIComponent(session);
				const userData = JSON.parse(decodedSession);
				this.user = userData;
				this.session = decodedSession;
			} else {
				this.user = null;
				this.session = null;
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
