const { createChatResponse } = require('./lib');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { message, context = {} } = payload;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) };
    }

    const { mood = 5, hiddenTriggers = [] } = context;
    const chatResponse = await createChatResponse(message, {
      mood: Number(mood) || 5,
      hiddenTriggers: Array.isArray(hiddenTriggers) ? hiddenTriggers : [],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response: chatResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process chat message', message: error.message }),
    };
  }
};