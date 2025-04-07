import { defineStore } from 'pinia';
import { login, logout, initializeCSRF } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    username: localStorage.getItem('username') || null,
    isLoading: false,
    error: null,
    csrfInitialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async initialize() {
      if (!this.csrfInitialized) {
        try {
          await initializeCSRF();
          this.csrfInitialized = true;
        } catch (error) {
          console.error('CSRF initialization failed:', error);
        }
      }
    },

    async loginUser(username, password) {
      this.isLoading = true;
      this.error = null;

      try {
        await this.initialize(); // Убедимся, что CSRF инициализирован
        
        const data = await login(username, password);
        this.token = data.token;
        this.username = username;
        
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', username);
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Login failed';
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