import axios from 'axios';

const API_URL = 'https://quartzcrystal.pythonanywhere.com';

// Создаем экземпляр Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Важно для работы с cookies
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
async function initializeCSRF() {
  try {
    // Делаем GET-запрос для установки CSRF cookie
    await api.get('/csrf-endpoint/');  // Может быть любой публичный endpoint
    console.log('CSRF токен инициализирован');
  } catch (error) {
    console.error('Ошибка инициализации CSRF:', error);
  }
}

// Функция входа
export async function login(username, password) {
  try {
    // Убедимся, что CSRF-токен получен
    if (!getCSRFToken()) {
      await initializeCSRF();
    }

    const response = await api.post('/login/', {
      username,
      password
    });

    return response.data.token;
  } catch (error) {
    console.error('Ошибка входа:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Ошибка входа' };
  }
}

// Пример использования
async function authExample() {
  await initializeCSRF();  // Инициализируем CSRF при загрузке приложения
  
  try {
    const token = await login('admin', 'admin');
    console.log('Токен авторизации:', token);
    localStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
  }
}

// Вызываем при загрузке приложения
authExample();