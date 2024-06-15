import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await fetch('http://localhost:3000/api/accounts/log-in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        const session = Cookies.get('Session');
        const decodedSession = decodeURIComponent(session);
        const parsedSession = JSON.parse(decodedSession);
        console.log('Session cookie content after login:', parsedSession);

        this.user = data.user;
        this.session = parsedSession;

        console.log('User after login:', this.user);
        console.log('Session after login:', this.session);
      } catch (error) {
        console.error('Login error:', error);
      }
    },

    async logout() {
      try {
        const response = await fetch('http://localhost:3000/api/accounts/log-out', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Logout failed');
        }

        Cookies.remove('Session');
        this.user = null;
        this.session = null;
      } catch (error) {
        console.error('Logout error:', error);
      }
    },

    checkAuth() {
      const session = Cookies.get('Session');
      if (session) {
        const decodedSession = decodeURIComponent(session);
        const userData = JSON.parse(decodedSession);
        this.user = userData;
        this.session = decodedSession;
        console.log('Auth check - User found:', this.user);
        console.log('Auth check - Session found:', this.session);
      } else {
        this.user = null;
        this.session = null;
        console.log('Auth check - No user found');
        console.log('Auth check - No session found');
      }
    },
  },
});
