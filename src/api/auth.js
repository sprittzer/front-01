import axios from 'axios';

const API_URL = 'https://quartzcrystal.pythonanywhere.com';

// Создаем экземпляр Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRFToken'] = 'zTQ9ubZqezwPXR2QjDSK5gZGch4S1RFx';
  }
  return config;
});

// Функция входа
export async function login(username, password) {
  try {
    const response = await api.post('/login/', {
      username,
      password
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка входа:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Ошибка входа' };
  }
}

// Функция выхода
export async function logout() {
  try {
    await api.post('/logout/');
  } catch (error) {
    console.error('Ошибка выхода:', error);
    throw error;
  }
}