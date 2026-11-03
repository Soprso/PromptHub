import { supabaseAdmin } from './supabase-client';

// Image of the day interface matching the Supabase schema
export interface ImageOfDay {
  id: string;
  image_url: string;
  prompt: string;
  likes: number;
  created_at: string;
  is_active: boolean;
}

// GET /api/image-of-day?type=featured - Get featured image of the day
export const getFeaturedImage = async () => {
  const { data, error } = await supabaseAdmin
    .from('image_of_day')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching featured image:', error);
    return null;
  }
  return data as ImageOfDay | null;
};

// GET /api/image-of-day?type=latest - Get latest images
export const getLatestImages = async (limit = 5) => {
  const { data, error } = await supabaseAdmin
    .from('image_of_day')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest images:', error);
    return [];
  }
  return (data as ImageOfDay[]) || [];
};

// GET /api/image-of-day?type=paginated - Get paginated images
export const getPaginatedImages = async (page: number, limit = 10, search = '') => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from('image_of_day')
    .select('*, count(*) OVER() as full_count', { count: 'exact' })
    .eq('is_active', true);

  if (search) {
    query = query.or(`prompt.ilike.%${search}%,content.ilike.%${search}%`);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching paginated images:', error);
    return { data: [] as any, count: 0 };
  }

  return {
    data: (data as ImageOfDay[]).map((r: any) => {
      const { full_count, ...rest } = r;
      return rest;
    }),
    count: count || 0,
  };
};

// GET /api/image-of-day?type=search - Search images
export const searchImages = async (query: string, limit = 20) => {
  const { data, error } = await supabaseAdmin
    .from('image_of_day')
    .select('*')
    .eq('is_active', true)
    .or(`prompt.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching images:', error);
    return [];
  }
  return (data as ImageOfDay[]) || [];
};

// POST /api/image-of-day - Insert new image of the day
export const insertImageOfDay = async (image: { image_url: string; prompt: string; likes?: number }) => {
  const { data, error } = await supabaseAdmin
    .from('image_of_day')
    .insert([{ ...image, is_active: true, likes: image.likes || 0 }])
    .select()
    .single();

  if (error) {
    console.error('Error inserting image of the day:', error);
    return false;
  }
  return true;
};

// POST /api/image-of-day?action=like - Like image of the day
export const likeImageOfDay = async (id: string) => {
  // First try to increment the like count
  const { error } = await supabaseAdmin
    .from('image_of_day')
    .increment('likes', 1)
    .eq('id', id);

  if (error) {
    console.error('Error liking image of the day:', error);
    return false;
  }
  return true;
};