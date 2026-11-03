import { toggleLike } from './prompts';

const jsonHeaders = { 'Content-Type': 'application/json' };

// HTTP handler for /api/likes (POST toggle like)
export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const { promptId, userKey, currentLikedState } = payload;

    if (!promptId || !userKey) {
      return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'promptId and userKey are required' }) };
    }

    const result = await toggleLike(promptId, userKey, !!currentLikedState);
    return {
      statusCode: result.success ? 200 : 500,
      headers: jsonHeaders,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    console.error('Error in likes:', error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: error?.message || 'Internal error' }) };
  }
};
