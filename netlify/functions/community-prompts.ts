import { query } from './_db';

export const handler = async (event: any) => {
    const { httpMethod, queryStringParameters, body, headers } = event;

    try {
        if (httpMethod === 'GET') {
            const page = parseInt(queryStringParameters?.page || '1');
            const perPage = parseInt(queryStringParameters?.perPage || '20');
            const searchQuery = queryStringParameters?.searchQuery || '';
            const offset = (page - 1) * perPage;

            let sql = `SELECT *, count(*) OVER() AS full_count FROM prompts_shared WHERE is_approved = true`;
            const params: any[] = [];

            if (searchQuery.trim()) {
                const searchTerm = `%${searchQuery.trim()}%`;
                params.push(searchTerm, searchQuery.trim());
                sql += ` AND (title ILIKE $1 OR content ILIKE $1 OR $2 = ANY(tags))`;
            }

            params.push(perPage, offset);
            sql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

            const rows = await query(sql, params);
            const total = rows.length > 0 ? parseInt(rows[0].full_count) : 0;

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
                body: JSON.stringify({ prompts: rows.map(({ full_count, ...r }: any) => r), total }),
            };
        }

        if (httpMethod === 'POST') {
            const data = JSON.parse(body);
            const { action, ...payload } = data;
            const jsonHeaders = { 'Content-Type': 'application/json' };

            if (action === 'like') {
                await query('UPDATE prompts_shared SET like_count = like_count + 1 WHERE id = $1 AND is_approved = true', [payload.id]);
                return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ success: true }) };
            }

            // Submit prompt — API key guard
            const apiKey = headers['x-api-key'];
            const expectedKey = process.env.ADMIN_API_KEY || 'phub-community-2025';
            if (apiKey !== expectedKey) {
                return { statusCode: 401, headers: jsonHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
            }

            const { title, content, tags, model } = payload;
            await query(
                'INSERT INTO prompts_shared (title, content, tags, model, is_approved) VALUES ($1, $2, $3, $4, false)',
                [title, content, tags, model]
            );
            return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };
    } catch (error: any) {
        console.error('Error in community-prompts:', error);
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
    }
};
