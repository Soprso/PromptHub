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
    .maybeSingle();

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
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (search && search.trim()) {
    query = query.ilike('prompt', `%${search.trim()}%`);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching paginated images:', error);
    return { data: [] as ImageOfDay[], count: 0 };
  }

  return { data: (data as ImageOfDay[]) || [], count: count || 0 };
};

// GET /api/image-of-day?type=search - Search images
export const searchImages = async (query: string, limit = 20) => {
  const { data, error } = await supabaseAdmin
    .from('image_of_day')
    .select('*')
    .eq('is_active', true)
    .ilike('prompt', `%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching images:', error);
    return [];
  }
  return (data as ImageOfDay[]) || [];
};

// POST /api/image-of-day - Insert new image of the day
export const insertImageOfDay = async (image: { image_url: string; prompt: string; likes?: number }) => {
  const { error } = await supabaseAdmin
    .from('image_of_day')
    .insert([{ ...image, is_active: true, likes: image.likes || 0 }]);

  if (error) {
    console.error('Error inserting image of the day:', error);
    return false;
  }
  return true;
};

// POST /api/image-of-day?action=like - Like image of the day
export const likeImageOfDay = async (id: string) => {
  // Read current count then update (PostgREST has no .increment() method)
  const { data, error } = await supabaseAdmin
    .from('image_of_day')
    .select('likes')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error reading image of the day likes:', error);
    return false;
  }

  const { error: updateError } = await supabaseAdmin
    .from('image_of_day')
    .update({ likes: (data.likes || 0) + 1 })
    .eq('id', id);

  if (updateError) {
    console.error('Error liking the image of the day:', updateError);
    return false;
  }
  return true;
};

const jsonHeaders = { 'Content-Type': 'application/json' };
const cacheHeaders = { ...jsonHeaders, 'Cache-Control': 'public, max-age=60' };

// HTTP handler for /api/image-of-day
export const handler = async (event: any) => {
  const { httpMethod, queryStringParameters, body } = event;

  try {
    if (httpMethod === 'GET') {
      const type = queryStringParameters?.type || 'featured';

      if (type === 'featured') {
        const image = await getFeaturedImage();
        return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(image) };
      }

      if (type === 'latest') {
        const limit = parseInt(queryStringParameters?.limit || '5', 10);
        const images = await getLatestImages(limit);
        return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(images) };
      }

      if (type === 'paginated') {
        const page = parseInt(queryStringParameters?.page || '1', 10);
        const limit = parseInt(queryStringParameters?.limit || '10', 10);
        const search = queryStringParameters?.query || '';
        const result = await getPaginatedImages(page, limit, search);
        return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(result) };
      }

      if (type === 'search') {
        const search = queryStringParameters?.query || '';
        const limit = parseInt(queryStringParameters?.limit || '20', 10);
        const images = await searchImages(search, limit);
        return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(images) };
      }

      return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'Unknown type' }) };
    }

    if (httpMethod === 'POST') {
      const payload = body ? JSON.parse(body) : {};
      const { action, ...rest } = payload;

      if (action === 'like') {
        if (!rest.id) {
          return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'id is required' }) };
        }
        const ok = await likeImageOfDay(rest.id);
        return { statusCode: ok ? 200 : 500, headers: jsonHeaders, body: JSON.stringify({ success: ok }) };
      }

      if (action === 'insert') {
        const { image_url, prompt, likes } = rest;
        if (!image_url || !prompt) {
          return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'image_url and prompt are required' }) };
        }
        const ok = await insertImageOfDay({ image_url, prompt, likes });
        return { statusCode: ok ? 200 : 500, headers: jsonHeaders, body: JSON.stringify({ success: ok }) };
      }

      return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'Unknown action' }) };
    }

    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (error: any) {
    console.error('Error in image-of-day:', error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ error: error?.message || 'Internal error' }) };
  }
};
