import { supabaseAdmin } from './supabase-client';

// Prompt interface
export interface PromptStats {
  count: number;
  hasLiked: boolean;
}

// GET /api/prompts?slug=&userKey= - Get prompt stats and like status
export const getPromptStats = async (slug: string, userKey: string | null) => {
  // Get like count for the prompt
  const { data: promptData, error: promptError } = await supabaseAdmin
    .from('prompts')
    .select('like_count')
    .eq('slug', slug)
    .single();

  const count = promptData ? (promptData.like_count || 0) : 0;

  // Check if user has liked this prompt
  let hasLiked = false;
  if (userKey) {
    const { data: likeData, error: likeError } = await supabaseAdmin
      .from('likes')
      .select('id')
      .eq('prompt_slug', slug)
      .eq('user_key', userKey)
      .single();

    if (likeData && !likeError) {
      hasLiked = true;
    }
  }

  return { count, hasLiked };
};

// POST /api/likes - Toggle like on a prompt
export const toggleLike = async (promptId: string, userKey: string, currentLikedState: boolean) => {
  const newLikedState = !currentLikedState;
  const jsonHeaders = { 'Content-Type': 'application/json' };

  if (newLikedState) {
    // Ensure prompt row exists
    const { error: promptError } = await supabaseAdmin
      .from('prompts')
      .upsert({ slug: promptId, title: `Prompt ${promptId}`, like_count: 0 })
      .select();

    if (promptError) {
      console.error('Error ensuring prompt exists:', promptError);
    }

    // Insert like — ignore duplicate
    const { error: likeError } = await supabaseAdmin
      .from('likes')
      .insert({ prompt_slug: promptId, user_key: userKey });

    if (likeError && likeError.code !== '23505') {
      // 23505 is the unique violation code - duplicate like is OK
      console.error('Error inserting like:', likeError);
      return { success: false, error: likeError.message };
    }

    // Increment like count
    const { error: countError } = await supabaseAdmin
      .from('prompts')
      .increment('like_count', 1)
      .eq('slug', promptId);

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

    // Decrement like count (minimum 0)
    const { error: countError } = await supabaseAdmin
      .from('prompts')
      .decrement('like_count', 1)
      .eq('slug', promptId)
      .gte('like_count', 1);

    if (countError) {
      console.error('Error decrementing like count:', countError);
      return { success: false, error: countError.message };
    }
  }

  return { success: true, newState: newLikedState };
};