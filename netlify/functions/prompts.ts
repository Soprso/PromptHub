import { supabaseAdmin } from './supabase-client';

// Prompt interface
export interface PromptStats {
  count: number;
  hasLiked: boolean;
}

// GET /api/prompts?slug=&userKey= - Get prompt stats and like status
export const getPromptStats = async (slug: string, userKey: string | null) => {
  // Get like count for the prompt
  const { data: promptData } = await supabaseAdmin
    .from('prompts')
    .select('like_count')
    .eq('slug', slug)
    .maybeSingle();

  const count = promptData ? (promptData.like_count || 0) : 0;

  // Check if user has liked this prompt
  let hasLiked = false;
  if (userKey) {
    const { data: likeData } = await supabaseAdmin
      .from('likes')
      .select('id')
      .eq('prompt_slug', slug)
      .eq('user_key', userKey)
      .maybeSingle();

    hasLiked = !!likeData;
  }

  return { count, hasLiked };
};

// POST /api/likes - Toggle like on a prompt
export const toggleLike = async (promptId: string, userKey: string, currentLikedState: boolean) => {
  const newLikedState = !currentLikedState;

  if (newLikedState) {
    // Ensure prompt row exists without clobbering an existing like_count
    const { error: promptError } = await supabaseAdmin
      .from('prompts')
      .upsert(
        { slug: promptId, title: `Prompt ${promptId}`, like_count: 0 },
        { onConflict: 'slug', ignoreDuplicates: true }
      );

    if (promptError) {
      console.error('Error ensuring prompt exists:', promptError);
    }

    // Insert like — ignore duplicate (unique violation is OK)
    const { error: likeError } = await supabaseAdmin
      .from('likes')
      .insert({ prompt_slug: promptId, user_key: userKey });

    if (likeError && likeError.code !== '23505') {
      console.error('Error inserting like:', likeError);
      return { success: false, error: likeError.message };
    }

    // Atomic increment via RPC (PostgREST has no .increment() method)
    const { error: countError } = await supabaseAdmin
      .rpc('increment_like_count', { row_slug: promptId });

    if (countError) {
      console.error('Error incrementing like count:', countError);
      return { success: false, error: countError.message };
    }
  } else {
    // Unlike: remove like record and decrement count
    const { error: unlikeError } = await supabaseAdmin
      .from('likes')
      .delete()
      .eq('prompt_slug', promptId)
      .eq('user_key', userKey);

    if (unlikeError) {
      console.error('Error removing like:', unlikeError);
      return { success: false, error: unlikeError.message };
    }

    // Atomic decrement via RPC (clamped to a minimum of 0 in SQL)
    const { error: countError } = await supabaseAdmin
      .rpc('decrement_like_count', { row_slug: promptId });

    if (countError) {
      console.error('Error decrementing like count:', countError);
      return { success: false, error: countError.message };
    }
  }

  return { success: true, newState: newLikedState };
};

const jsonHeaders = { 'Content-Type': 'application/json' };

// HTTP handler for /api/prompts (GET stats, POST toggle)
export const handler = async (event: any) => {
  const { httpMethod, queryStringParameters, body } = event;

  try {
    if (httpMethod === 'GET') {
      const slug = queryStringParameters?.slug;
      const userKey = queryStringParameters?.userKey || null;

      if (!slug) {
        return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'Slug is required' }) };
      }

      const stats = await getPromptStats(slug, userKey);
      return {
        statusCode: 200,
        headers: { ...jsonHeaders, 'Cache-Control': 'public, max-age=60' },
        body: JSON.stringify({ count: stats.count, hasLiked: stats.hasLiked }),
      };
    }

    if (httpMethod === 'POST') {
      const payload = body ? JSON.parse(body) : {};
      const { promptId, userKey, currentLikedState } = payload;

      if (!promptId || !userKey) {
        return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'promptId and userKey are required' }) };
      }

      const result = await toggleLike(promptId, userKey, !!currentLikedState);
      return { statusCode: result.success ? 200 : 500, headers: jsonHeaders, body: JSON.stringify(result) };
    }

    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (error: any) {
    console.error('Error in prompts:', error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: error?.message || 'Internal error' }) };
  }
};
