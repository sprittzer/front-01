import { defineStore } from 'pinia';
import { login, logout } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  actions: {
    async loginUser(username, password) {
      try {
        const response = await login(username, password);
        this.token = response.token;
        this.isAuthenticated = true;
        localStorage.setItem('token', response.token);
        return response;
      } catch (error) {
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        throw error;
      }
    },

    async logoutUser() {
      try {
        await logout();
      } finally {
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
      }
    }
  }
});