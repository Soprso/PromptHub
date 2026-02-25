import { query } from './_db';

export const handler = async (event: any) => {
    const { httpMethod, body } = event;

    try {
        if (httpMethod === 'POST') {
            const { promptId, userKey, currentLikedState } = JSON.parse(body);
            const newLikedState = !currentLikedState;
            const jsonHeaders = { 'Content-Type': 'application/json' };

            if (newLikedState) {
                // Ensure prompt row exists
                await query(
                    'INSERT INTO prompts (slug, title) VALUES ($1, $1) ON CONFLICT (slug) DO NOTHING',
                    [promptId]
                );
                // Insert like — ignore duplicate
                try {
                    await query('INSERT INTO likes (prompt_slug, user_key) VALUES ($1, $2)', [promptId, userKey]);
                } catch (err: any) {
                    if (err.code !== '23505') throw err;
                }
                await query('UPDATE prompts SET like_count = like_count + 1 WHERE slug = $1', [promptId]);
            } else {
                await query('DELETE FROM likes WHERE prompt_slug = $1 AND user_key = $2', [promptId, userKey]);
                await query('UPDATE prompts SET like_count = GREATEST(0, like_count - 1) WHERE slug = $1', [promptId]);
            }

            return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, newState: newLikedState }) };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };
    } catch (error: any) {
        console.error('Error in likes:', error);
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
    }
};
