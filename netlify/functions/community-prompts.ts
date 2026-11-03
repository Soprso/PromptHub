import { supabaseAdmin } from './supabase-client';

// Community prompt interface
export interface SharedPrompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  model: string;
  like_count: number;
  created_at: string;
}

// GET /api/community-prompts?page=&perPage=&searchQuery= - Get community prompts
export const getCommunityPrompts = async (page: number = 1, perPage: number = 20, searchQuery?: string) => {
  const offset = (page - 1) * perPage;

  let query = supabaseAdmin
    .from('prompts_shared')
    .select('*', { count: 'exact' })
    .eq('is_approved', true);

  const term = searchQuery?.trim();
  if (term) {
    const like = `%${term}%`;
    query = query.or(`title.ilike.${like},content.ilike.${like}`);
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + perPage - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching community prompts:', error);
    return { prompts: [] as SharedPrompt[], total: 0 };
  }

  return {
    prompts: (data as any[]).map((r: any) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      tags: r.tags || [],
      model: r.model || '',
      like_count: r.like_count || 0,
      created_at: r.created_at,
    })),
    total: count || 0,
  };
};

// POST /api/community-prompts?action=like - Like a community prompt
export const likeCommunityPrompt = async (promptId: string) => {
  // Atomic increment via RPC (PostgREST has no .increment() method)
  const { error } = await supabaseAdmin
    .rpc('increment_shared_prompt_like', { row_id: promptId });

  if (error) {
    console.error('Error liking community prompt:', error);
    return false;
  }
  return true;
};

// POST /api/community-prompts - Submit a new community prompt
export const submitCommunityPrompt = async (prompt: {
  title: string;
  content: string;
  tags: string[];
  model: string;
  apiKey?: string;
}) => {
  // Verify API key
  if (prompt.apiKey !== process.env.ADMIN_API_KEY) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabaseAdmin
    .from('prompts_shared')
    .insert([{
      title: prompt.title,
      content: prompt.content,
      tags: prompt.tags,
      model: prompt.model,
      is_approved: false,
      like_count: 0,
    }])
    .select();

  if (error) {
    console.error('Error submitting community prompt:', error);
    return { error: error.message };
  }

  return { success: true, data };
};

const jsonHeaders = { 'Content-Type': 'application/json' };

// HTTP handler for /api/community-prompts (GET list, POST like/submit)
export const handler = async (event: any) => {
  const { httpMethod, queryStringParameters, body, headers } = event;

  try {
    if (httpMethod === 'GET') {
      const page = parseInt(queryStringParameters?.page || '1', 10);
      const perPage = parseInt(queryStringParameters?.perPage || '20', 10);
      const searchQuery = queryStringParameters?.searchQuery || '';

      const result = await getCommunityPrompts(page, perPage, searchQuery);
      return {
        statusCode: 200,
        headers: { ...jsonHeaders, 'Cache-Control': 'public, max-age=60' },
        body: JSON.stringify(result),
      };
    }

    if (httpMethod === 'POST') {
      const payload = body ? JSON.parse(body) : {};
      const { action, ...rest } = payload;

      if (action === 'like') {
        if (!rest.id) {
          return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'id is required' }) };
        }
        const ok = await likeCommunityPrompt(rest.id);
        return { statusCode: ok ? 200 : 500, headers: jsonHeaders, body: JSON.stringify({ success: ok }) };
      }

      // Submit prompt — API key guard
      const apiKey = headers?.['x-api-key'];
      const result = await submitCommunityPrompt({ ...rest, apiKey });

      if ('error' in result) {
        const statusCode = result.error === 'Unauthorized' ? 401 : 500;
        return { statusCode, headers: jsonHeaders, body: JSON.stringify({ error: result.error }) };
      }

      return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (error: any) {
    console.error('Error in community-prompts:', error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: error?.message || 'Internal error' }) };
  }
};
