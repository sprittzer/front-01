import axios from 'axios';

const API_URL = 'http://localhost:8000'; // или адрес твоего бэкенда

export async function login(username, password) {
  try {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    return response.data; // { token: '...' }
  } catch (error) {
    throw error.response.data;
  }
}

export async function logout(token) {
  try {
    await axios.post(`${API_URL}/logout/`, null, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  } catch (error) {
    throw error.response?.data || { error: 'Logout failed' };
  }
}
