import axios from 'axios';

const API_URL = 'https://quartzcrystal.pythonanywhere.com';

// Создаем экземпляр Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Функция для извлечения CSRF-токена из cookies
function getCSRFToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
}

// Интерцептор для автоматической подстановки CSRF-токена
api.interceptors.request.use(config => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRFToken'] = getCSRFToken();
  }
  return config;
});

// Инициализация CSRF
export async function initializeCSRF() {
  try {
    await api.get('/');  // Используем корневой endpoint вместо /csrf-endpoint/
    console.log('CSRF токен инициализирован');
    return true;
  } catch (error) {
    console.error('Ошибка инициализации CSRF:', error);
    throw error;
  }
}

// Функция входа
export async function login(username, password) {
  try {
    if (!getCSRFToken()) {
      await initializeCSRF();
    }

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