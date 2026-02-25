import { query } from './_db';

export const handler = async (event: any) => {
    const { httpMethod, queryStringParameters, body } = event;

    try {
        if (httpMethod === 'GET') {
            const type = queryStringParameters?.type || 'featured';
            const cacheHeaders = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' };

            if (type === 'featured') {
                const rows = await query('SELECT * FROM image_of_day WHERE is_active = true ORDER BY created_at DESC LIMIT 1');
                return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(rows[0] || null) };
            }

            if (type === 'latest') {
                const limit = parseInt(queryStringParameters?.limit || '5');
                const rows = await query('SELECT * FROM image_of_day WHERE is_active = true ORDER BY created_at DESC LIMIT $1', [limit]);
                return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(rows) };
            }

            if (type === 'paginated') {
                const page = parseInt(queryStringParameters?.page || '1');
                const limit = parseInt(queryStringParameters?.limit || '10');
                const queryStr = queryStringParameters?.query || '';
                const offset = (page - 1) * limit;

                const rows = await query(
                    `SELECT *, count(*) OVER() AS full_count 
                     FROM image_of_day 
                     WHERE is_active = true AND prompt ILIKE $1 
                     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
                    [`%${queryStr}%`, limit, offset]
                );
                const total = rows.length > 0 ? parseInt(rows[0].full_count) : 0;
                return {
                    statusCode: 200,
                    headers: cacheHeaders,
                    body: JSON.stringify({ data: rows.map(({ full_count, ...r }: any) => r), count: total }),
                };
            }

            if (type === 'search') {
                const queryStr = queryStringParameters?.query || '';
                const limit = parseInt(queryStringParameters?.limit || '20');
                const rows = await query(
                    'SELECT * FROM image_of_day WHERE is_active = true AND prompt ILIKE $1 ORDER BY created_at DESC LIMIT $2',
                    [`%${queryStr}%`, limit]
                );
                return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(rows) };
            }
        }

        if (httpMethod === 'POST') {
            const data = JSON.parse(body);
            const { action, ...payload } = data;
            const jsonHeaders = { 'Content-Type': 'application/json' };

            if (action === 'like') {
                await query('UPDATE image_of_day SET likes = likes + 1 WHERE id = $1', [payload.id]);
                return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ success: true }) };
            }

            if (action === 'insert') {
                const { image_url, prompt, likes } = payload;
                await query('INSERT INTO image_of_day (image_url, prompt, likes, is_active) VALUES ($1, $2, $3, true)', [image_url, prompt, likes]);
                return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ success: true }) };
            }
        }

        return { statusCode: 405, body: 'Method Not Allowed' };
    } catch (error: any) {
        console.error('Error in image-of-day:', error);
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
    }
};
