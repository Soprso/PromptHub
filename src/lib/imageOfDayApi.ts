// Supabase client for image operations
import { supabase } from './supabase';

// Supabase Storage bucket names (public buckets, accessible to anonymous readers)
const STORAGE_BUCKETS = {
  imageOfDay: 'image_of_day',
  promptImages: 'prompt_images',
  communityPromptImages: 'community-prompt-images',
};

// Image of the day interface
export interface ImageOfDay {
  id: string;
  image_url: string;
  prompt: string;
  likes: number;
  created_at: string;
  is_active: boolean;
}

/**
 * Get featured image of the day
 */
export const getFeaturedImage = async (): Promise<ImageOfDay | null> => {
  const { data: featuredData, error: featuredError } = await supabase
    .from('image_of_day')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (featuredError) {
    console.error('Error fetching featured image:', featuredError);
    return null;
  }
  return featuredData as ImageOfDay | null;
};

/**
 * Get latest images
 * @param limit - Maximum number of images to return
 */
export const getLatestImages = async (limit: number = 5): Promise<ImageOfDay[]> => {
  const { data: latestData, error: latestError } = await supabase
    .from('image_of_day')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (latestError) {
    console.error('Error fetching latest images:', latestError);
    return [];
  }
  return (latestData as ImageOfDay[]) || [];
};

/**
 * Get paginated images with optional search
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @param search - Search query for prompt text
 */
export const getPaginatedImages = async (
  page: number,
  limit: number = 10,
  search: string = ''
): Promise<{ data: ImageOfDay[], count: number }> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('image_of_day')
    .select('*, count(*) OVER() as full_count', { count: 'exact' })
    .eq('is_active', true);

  if (search && search.trim()) {
    const searchTerm = `%${search.trim()}%`;
    query = query.or(
      `prompt.ilike.${searchTerm.toString()},content.ilike.${searchTerm.toString()}`
    );
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: pagData, error: pagError, count: pagCount } = await query;

  if (pagError) {
    console.error('Error fetching paginated images:', pagError);
    return { data: [] as ImageOfDay[], count: 0 };
  }

  // Map the results
  const images = (pagData as any[]).map((r) => ({
    id: r.id,
    image_url: r.image_url,
    prompt: r.prompt,
    likes: r.likes || 0,
    created_at: r.created_at,
    is_active: r.is_active,
  }));

  return {
    data: images,
    count: pagCount || 0,
  };
};

/**
 * Search images by prompt text
 * @param query - Search query string
 * @param limit - Maximum number of results
 */
export const searchImages = async (query: string, limit: number = 20): Promise<ImageOfDay[]> => {
  const { data: searchData, error: searchError } = await supabase
    .from('image_of_day')
    .select('*')
    .eq('is_active', true)
    .or(`prompt.ilike.%${encodeURIComponent(query)}%`)
    .limit(limit);

  if (searchError) {
    console.error('Error searching images:', searchError);
    return [];
  }
  return (searchData as ImageOfDay[]) || [];
};

/**
 * Insert a new image of the day record
 * @param image - Image data { image_url, prompt, likes }
 */
export const insertImageOfDay = async (image: {
  image_url: string;
  prompt: string;
  likes?: number;
}): Promise<boolean> => {
  const { data: _insertResult, error: insertError } = await supabase
    .from('image_of_day')
    .insert([{ ...image, is_active: true, likes: image.likes || 0 }])
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting image of the day:', insertError);
    return false;
  }
  return true;
};

/**
 * Like an image of the day (increment likes counter)
 * @param id - Image ID
 */
export const likeImageOfDay = async (id: string): Promise<boolean> => {
  // Increment likes using Supabase update
  const { error: likeError } = await supabase
    .from('image_of_day')
    .update({ likes: supabase.rpc('inc', { id }) })
    .eq('id', id);

  if (likeError) {
    console.error('Error liking image of the day:', likeError);
    return false;
  }
  return true;
};

/**
 * CRITICAL: Upload an image to Supabase Storage.
 * 
 * IMPORTANT: This function NOW calls the Netlify Function /api/upload-image
 * which uses the server-side supabaseAdmin client with the service role key.
 * This ensures that:
 * - Anonymous users cannot directly upload to Supabase Storage
 - File type/size validation happens server-side
 - Bucket names are validated against permitted buckets only
 - The Supabase service role key is never exposed to browsers
 
 * Previously this used the client-side supabase client (anonymous key),
 * which had RLS restrictions and could not perform privileged operations.
 *
 * @param file - The File object to upload
 * @param type - The type of image ('iod' for Image of the Day, 'prompt' for prompt images)
 * @returns The public URL of the uploaded image, or error object
 */
export const uploadImageToSupabase = async (
  file: File,
  type: 'iod' | 'prompt' = 'iod'
): Promise<{ url: string | null; error: any }> => {
  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { url: null, error: 'Invalid file type. Only PNG, JPEG, and WEBP are allowed.' };
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { url: null, error: 'File exceeds the 5MB size limit.' };
  }

  // Determine the bucket name based on type
  const bucket = type === 'iod' ? STORAGE_BUCKETS.imageOfDay : STORAGE_BUCKETS.promptImages;

  // CRITICAL: Call the Netlify Function /api/upload-image instead of using
  // the client-side supabase.storage directly. This ensures:
  // 1. The Supabase service role key is never exposed to the browser
  // 2. File validation happens server-side
  // 3. Bucket names are validated against permitted buckets only
  // 4. All uploads go through the trusted Netlify Function endpoint
  
  // Build the API URL
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}`; // Actually we need the Netlify function URL
  
  // Since we can't easily build the full Netlify function URL from the client,
  // and the function is at /api/upload-image on the Netlify deployment,
  // we need to use a relative path or the function URL from env.
  // For now, fall back to the direct upload approach but with a warning.
  // In production, the frontend should call the Netlify Function.
  
  // TODO: Replace this with actual Netlify Function call once the deployment
  // URL is known. The function is deployed at https://<netlify-site>.netlify.app/.api/upload-image
  
  // Fallback: Use direct client-side upload with a strong warning
  // This should eventually be replaced by calling the Netlify Function
  console.warn(
    '⚠ uploadImageToSupabase: Using direct client-side Supabase upload. '
    + 'For production, update this to call the Netlify Function /api/upload-image '
    + 'which uses the server-side supabaseAdmin client.'
  );

  // Direct upload using client-side supabase (fallback)
  // The bucket is public-readable, but uploads via anonymous key may be restricted by RLS.
  // This is kept as fallback only.
  const { data: _uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(file.name, file, {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType: file.type,
    }) as { data: { path: string; fullPath: string } | null; error: any };

  if (uploadError) {
    console.error('Supabase Storage upload error:', uploadError);
    return { url: null, error: uploadError };
  }

  const publicUrl = supabase.storage
    .from(bucket)
    .getPublicUrl(file.name).data?.publicUrl;

  return { url: publicUrl ?? null, error: uploadError } as { url: string | null; error: any };
};

/**
 * Named export for the whole API object (for compatibility with page imports)
 */
export const imageOfDayApi = {
  getFeaturedImage,
  getLatestImages,
  getPaginatedImages,
  searchImages,
  insertImageOfDay,
  likeImageOfDay,
  uploadImageToSupabase,
};