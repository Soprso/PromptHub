import { query } from './_db';

export const handler = async (event: any) => {
    const { httpMethod, queryStringParameters } = event;

    try {
        if (httpMethod === 'GET') {
            const slug = queryStringParameters?.slug;
            const userKey = queryStringParameters?.userKey;

            if (!slug) {
                return { statusCode: 400, body: JSON.stringify({ error: 'Slug is required' }) };
            }

            const promptRows = await query('SELECT like_count FROM prompts WHERE slug = $1', [slug]);
            const count = promptRows.length > 0 ? (promptRows[0].like_count || 0) : 0;

            let hasLiked = false;
            if (userKey) {
                const likeRows = await query('SELECT id FROM likes WHERE prompt_slug = $1 AND user_key = $2', [slug, userKey]);
                hasLiked = likeRows.length > 0;
            }

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
                body: JSON.stringify({ count, hasLiked }),
            };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };
    } catch (error: any) {
        console.error('Error in prompts:', error);
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
    }
};
