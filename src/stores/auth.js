import { defineStore } from 'pinia';
import { login, logout } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    username: null,
  }),
  actions: {
    async loginUser(username, password) {
      const data = await login(username, password);
      this.token = data.token;
      this.username = username;
      localStorage.setItem('token', data.token);
    },
    async logoutUser() {
      if (this.token) {
        await logout(this.token);
        this.token = null;
        this.username = null;
        localStorage.removeItem('token');
      }
    },
  },
});
