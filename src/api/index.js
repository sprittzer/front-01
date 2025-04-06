import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const API_URL = 'https://quartzcrystal.pythonanywhere.com/api/';

// Создаём экземпляр axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Добавляем интерсептор для авторизации
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Token ${authStore.token}`;
  }
  return config;
});

// Экспортируем готовый apiClient
export default apiClient;

// Экспортируем отдельные методы API
export const authAPI = {
  login: (credentials) => apiClient.post('login/', credentials),
  logout: () => apiClient.post('logout/'),
};