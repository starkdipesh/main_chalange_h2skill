const { analyzeJournal } = require('./lib');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { text, mood } = payload;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Journal text is required' }) };
    }

    const moodValue = Number(mood);
    if (!moodValue || moodValue < 1 || moodValue > 10) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Mood must be between 1 and 10' }) };
    }

    const analysis = await analyzeJournal(text, moodValue);
    const payloadResponse = {
      timestamp: new Date().toISOString(),
      mood: moodValue,
      ...analysis,
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, analysis: payloadResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze journal entry', message: error.message }),
    };
  }
};
