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
    .select('*, count(*) OVER() as full_count', { count: 'exact' })
    .eq('is_approved', true);

  if (searchQuery && searchQuery.trim()) {
    const searchTerm = `%${searchQuery.trim()}%`;
    query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.csplit.any.%${searchQuery.trim()}%`);
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
  const { error } = await supabaseAdmin
    .from('prompts_shared')
    .increment('like_count', 1)
    .eq('id', promptId);

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
  apiKey: string,
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