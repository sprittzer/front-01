import axios from 'axios';

const API_URL = 'https://quartzcrystal.pythonanywhere.com';

// Создаем экземпляр Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Добавляем перехватчик для логирования запросов
api.interceptors.request.use(config => {
  console.log('Отправка запроса:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  return config;
});

// Добавляем перехватчик для логирования ответов
api.interceptors.response.use(
  response => {
    console.log('Получен ответ:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('Ошибка запроса:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Функция входа
export async function login(username, password) {
  try {
    console.log('Попытка входа с данными:', { username, password });
    const response = await api.post('/login/', {
      username,
      password
    });
    console.log('Успешный вход:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка входа:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { error: 'Ошибка входа' };
  }
}

// Функция выхода
export async function logout() {
  try {
    console.log('Попытка выхода');
    await api.post('/logout/');
    console.log('Успешный выход');
  } catch (error) {
    console.error('Ошибка выхода:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}