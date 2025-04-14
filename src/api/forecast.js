import axios from 'axios';

const API_URL = '/api';

export const forecastService = {
  async getForecast(startDate, endDate) {
    try {
      const response = await axios.get(`${API_URL}/forecast/`, {
        params: {
          start: startDate,
          end: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }
}; 