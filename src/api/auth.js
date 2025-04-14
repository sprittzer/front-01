import axios from 'axios';

const API_URL = '/api';

// Создаем экземпляр Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Добавляем перехватчик для добавления токена авторизации
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

// Добавляем перехватчик для логирования запросов
api.interceptors.request.use(config => {
  console.log('Отправка запроса:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers,
    baseURL: config.baseURL,
    fullURL: config.baseURL + config.url
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
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Функция входа
export async function login(username, password) {
  try {
    console.log('Попытка входа с данными:', { username, password });
    const response = await api.post('/auth/login/', {
      username,
      password
    });
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    console.log('Успешный вход:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка входа:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    throw error.response?.data || { error: 'Ошибка входа' };
  }
}

// Функция выхода
export async function logout() {
  try {
    console.log('Попытка выхода');
    const response = await api.post('/auth/logout/', {});
    localStorage.removeItem('token');
    console.log('Успешный выход:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка выхода:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    throw error;
  }
}