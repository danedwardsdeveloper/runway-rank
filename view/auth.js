import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    session: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await fetch("http://localhost:3000/api/accounts/log-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const session = Cookies.get("Session");
        const data = await response.json();
        this.user = data.user;
        this.session = session;
      } catch (error) {
        console.error("Login error:", error);
      }
    },

    async logout() {
      try {
        const response = await fetch("http://localhost:3000/accounts/log-out", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Logout failed");
        }

        Cookies.remove("Session");
        this.user = null;
        this.session = null;
      } catch (error) {
        console.error("Logout error:", error);
      }
    },

    checkAuth() {
      const session = Cookies.get("Session");
      if (session) {
        const userData = JSON.parse(session);
        this.user = userData;
        this.session = session;
      } else {
        this.user = null;
        this.session = null;
      }
    },
  },
});
