// Supabase Storage upload utility
// NOTE: This file uses the client-side Supabase anonymous key (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY).
// 
// IMPORTANT Security Notice:
// - Anonymous keys cannot perform privileged Storage operations (upload, delete)
// - All privileged uploads, updates, and deletions MUST go through Netlify Functions
//   using the server-side supabaseAdmin client with the service role key.
// - This utility is suitable for limited use cases only (e.g., checking bucket existence,
//   reading public URLs if publicly enabled, etc.)
// - For actual image uploads, use the Netlify Function: /api/upload-image
//
// This utility is retained for reference and limited read-only operations.
// For new development, prefer the Netlify Function-based approach.

import { supabase } from '../supabase';

const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB limit

/**
 * Upload a file to Supabase Storage using the client-side anonymous key.
 * 
 * WARNING: This uses the client-side supabase key. Uploads may be restricted by RLS.
 * For production uploads, use the Netlify Function /api/upload-image which uses
 * the server-side supabaseAdmin client with the service role key.
 *
 * @param file - The File object to upload
 * @param bucket - The Supabase Storage bucket name ('image_of_day', 'prompt_images', 'community-prompt-images')
 * @returns The public URL of the uploaded file, or throws error
 */
export async function r2Upload(file: File, bucket: 'image_of_day' | 'prompt_images' | 'community-prompt-images' = 'image_of_day'): Promise<string> {
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only PNG, JPEG, and WEBP are allowed.');
  }

  // Validate file size
  if (file.size > maxSize) {
    throw new Error('File exceeds the 5MB size limit.');
  }

  // Generate a unique filename
  const timestamp = Date.now();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop() || 'png';
  const fileName = `image-of-day-${timestamp}-${uniqueId}.${extension}`;

  // Upload to Supabase Storage using client-side key
  // Note: This may fail if RLS policies restrict anonymous uploads.
  // For guaranteed upload, use the Netlify Function approach.
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType: file.type,
    });

  if (error) {
    console.error('Supabase Storage upload error (client key):', error);
    throw error;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Check if a bucket is accessible (read-only) using the client-side key.
 * This does not verify upload permissions.
 */
export async function checkBucketAccess(bucket: string): Promise<boolean> {
  try {
    const { _data, error } = await supabase.storage
      .from(bucket)
      .list('', { limit: 1 });
    return !error;
  } catch (err) {
    console.error('Bucket access check error:', err);
    return false;
  }
}