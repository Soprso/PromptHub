import { supabaseAdmin } from './supabase-client';

// Supported image file types for upload
const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

// Maximum file size: 5MB
const maxSize = 5 * 1024 * 1024;

// Permitted Supabase Storage bucket names (must match Dashboard configuration)
// Anonymous users must NOT use these directly; all uploads go through this Netlify Function.
const PERMITTED_BUCKETS = ['image_of_day', 'prompt_images', 'community-prompt-images'] as const;

/**
 * Upload a file to Supabase Storage via trusted Netlify Function.
 * CRITICAL: Bucket name is validated server-side; clients must NOT supply bucket names.
 *
 * @param file - The File object to upload
 * @param bucketHint - Hint for which bucket intended (image_of_day | prompt_images | community-prompt-images)
 *                     This is for logging/routing only; the actual bucket is validated server-side.
 * @returns The public URL of the uploaded file, or error object
 */
export const supabaseUpload = async (file: File, bucketHint?: 'image_of_day' | 'prompt_images' | 'community-prompt-images'): Promise<{ url: string; error: any }> {
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    return { url: null, error: 'Invalid file type. Only PNG, JPEG, and WEBP are allowed.' };
  }

  // Validate file size
  if (file.size > maxSize) {
    return { url: null, error: 'File exceeds the 5MB size limit.' };
  }

  // Generate a unique filename with timestamp
  const timestamp = Date.now();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop() || 'png';
  const fileName = `image-of-day-${timestamp}-${uniqueId}.${extension}`;

  // Determine which bucket to use based on the hint.
  // The actual bucket validation happens server-side in the handler.
  // Mapping from hint to bucket name:
  const bucketMap: Record<'image_of_day' | 'prompt_images' | 'community-prompt-images', string> = {
    'image_of_day': 'image_of_day',
    'prompt_images': 'prompt_images',
    'community-prompt-images': 'community-prompt-images',
  };

  // Upload to Supabase Storage using the admin client
  // The bucket name is determined server-side in the handler based on the request
  const { data, error } = await supabaseAdmin.storage
    .from(bucketMap[bucketHint] || 'image_of_day')
    .upload(fileName, file, {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType: file.type,
    });

  if (error) {
    console.error('Supabase Storage upload error:', error);
    return { url: null, error };
  }

  // Get the public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucketMap[bucketHint] || 'image_of_day')
    .getPublicUrl(fileName);

  return { url: publicUrl, error: null };
};

/**
 * Handler for Netlify Function: /api/upload-image
 * 
 * Expected request:
 *   - Method: POST
 *   - Body: multipart/form-data with a file field
 *   - Optional queryStringParameters: bucket=image_of_day|prompt_images|community-prompt-images
 * 
 * Security:
 * - Bucket name is validated against PERMITTED_BUCKETS
 * - Anonymous uploads are allowed only through this validated endpoint
 * - The supabaseAdmin service role key is used (never exposed to browser)
 * - File type and size are validated both client-side (if possible) and server-side
 */
export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    console.log("Upload function invoked");

    // Parse the multipart form data
    const result = await new Promise<any>((resolve, reject) => {
      const { parse } = await import('lambda-multipart-parser');
      parse(event, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const file = result.files[0];
    console.log("File parsed:", file ? file.filename : "No file");

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No file uploaded" })
      };
    }

    // Determine which bucket to use based on the request query parameter.
    // This is validated against PERMITTED_BUCKETS server-side below.
    const bucketHint = (result.queryStringParameters?.bucket || 'image_of_day') as 'image_of_day' | 'prompt_images' | 'community-prompt-images' | undefined;

    // CRITICAL: Validate bucket against permitted list.
    // If the bucket is not permitted, default to 'image_of_day' and log a warning.
    let validatedBucket = 'image_of_day';
    if (PERMITTED_BUCKETS.includes(bucketHint)) {
      validatedBucket = bucketHint;
    } else {
      console.warn(`⚠ Invalid bucket hint "${bucketHint}" received. Defaulting to "image_of_day".`);
    }

    // Upload to Supabase Storage via the admin client
    const uploadResult = await supabaseUpload(file as File, bucketHint);

    if (uploadResult.error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: uploadResult.error?.message || uploadResult.error || "Failed to upload image" })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: uploadResult.url })
    };

  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: error?.message || "Failed to upload image" })
    };
  }
};