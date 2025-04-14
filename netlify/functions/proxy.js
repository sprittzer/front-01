const axios = require('axios');

exports.handler = async function(event, context) {
  const API_URL = 'http://91.242.229.177';
  
  try {
    // Получаем путь без префикса /api
    const path = event.path.replace(/^\/api/, '');
    const { queryStringParameters } = event;
    
    // Формируем полный URL
    const url = `${API_URL}${path}`;
    
    console.log('Original path:', event.path);
    console.log('Processed path:', path);
    console.log('Full URL:', url);
    console.log('Method:', event.httpMethod);
    console.log('Body:', event.body);
    console.log('Headers:', event.headers);
    console.log('Query params:', queryStringParameters);

    const response = await axios({
      method: event.httpMethod,
      url,
      data: event.body ? JSON.parse(event.body) : {},
      params: queryStringParameters,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(event.headers.authorization && { 'Authorization': event.headers.authorization })
      },
      validateStatus: function (status) {
        return status < 500; // Разрешаем все статусы меньше 500
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Proxy error:', error.message);
    console.error('Error details:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error config:', error.config);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data,
        status: error.response?.status
      })
    };
  }
}; 