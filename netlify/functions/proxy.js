const axios = require('axios');

exports.handler = async function(event, context) {
  const API_URL = 'http://91.242.229.177';
  
  try {
    // Удаляем префикс /api из пути
    const path = event.path.replace(/^\/api/, '');
    const { queryStringParameters } = event;
    const url = `${API_URL}${path}${queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''}`;
    
    console.log('Proxying request to:', url);
    console.log('Method:', event.httpMethod);
    console.log('Body:', event.body);
    console.log('Headers:', event.headers);

    const response = await axios({
      method: event.httpMethod,
      url,
      data: event.body ? JSON.parse(event.body) : {},
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(event.headers.authorization && { 'Authorization': event.headers.authorization })
      }
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Proxy error:', error.message);
    console.error('Error details:', error.response?.data);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data
      })
    };
  }
}; 