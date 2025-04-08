import { defineStore } from 'pinia';
import { login, logout } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    username: localStorage.getItem('username') || null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async loginUser(username, password) {
      this.isLoading = true;
      this.error = null;

      try {
        
        const data = await login(username, password);
        this.token = data.token;
        this.username = username;
        
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', username);
        
        return true;
      } catch (error) {
        this.error = error.message || 'Ошибка входа';
        this.clearAuthData();
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logoutUser() {
      try {
        if (this.token) {
          await logout();
        }
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      } finally {
        this.clearAuthData();
      }
    },

    clearAuthData() {
      this.token = null;
      this.username = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    }
  }
});