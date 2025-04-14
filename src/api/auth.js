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

// Логируем конфигурацию API при инициализации
console.log('API Configuration:', {
  baseURL: API_URL,
  endpoints: {
    login: '/login/',
    logout: '/logout/'
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
    fullURL: config.baseURL + config.url,
    params: config.params
  });
  return config;
});

// Добавляем перехватчик для логирования ответов
api.interceptors.response.use(
  response => {
    console.log('Получен ответ:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
      config: {
        url: response.config.url,
        method: response.config.method,
        baseURL: response.config.baseURL,
        fullURL: response.config.baseURL + response.config.url
      }
    });
    return response;
  },
  error => {
    console.error('Ошибка запроса:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        fullURL: error.config?.baseURL + error.config?.url,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });
    return Promise.reject(error);
  }
);

// Функция входа
export async function login(username, password) {
  try {
    console.log('Попытка входа с данными:', { username, password });
    const endpoint = '/login/';
    console.log('Используемый эндпоинт:', {
      endpoint,
      fullURL: API_URL + endpoint
    });
    
    const response = await api.post(endpoint, {
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
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        fullURL: error.config?.baseURL + error.config?.url,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });
    throw error.response?.data || { error: 'Ошибка входа' };
  }
}

// Функция выхода
export async function logout() {
  try {
    console.log('Попытка выхода');
    const endpoint = '/logout/';
    console.log('Используемый эндпоинт:', {
      endpoint,
      fullURL: API_URL + endpoint
    });
    
    const response = await api.post(endpoint, {});
    localStorage.removeItem('token');
    console.log('Успешный выход:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка выхода:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        fullURL: error.config?.baseURL + error.config?.url,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });
    throw error;
  }
}