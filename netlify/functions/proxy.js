const axios = require('axios');

exports.handler = async function(event, context) {
  const API_URL = 'http://91.242.229.177';
  
  try {
    const { path, queryStringParameters } = event;
    const url = `${API_URL}${path}${queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''}`;
    
    const response = await axios({
      method: event.httpMethod,
      url,
      data: event.body,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data
      })
    };
  }
}; 