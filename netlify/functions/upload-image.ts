import { parse } from 'lambda-multipart-parser';
import { supabaseAdmin } from './supabase-client';

// Supported image file types for upload
const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

// Maximum file size: 5MB
const maxSize = 5 * 1024 * 1024;

// Permitted Supabase Storage bucket names (must match Dashboard configuration)
// Anonymous users must NOT use these directly; all uploads go through this Netlify Function.
const PERMITTED_BUCKETS = ['image_of_day', 'prompt_images', 'community-prompt-images'] as const;

// Shape of a file parsed by lambda-multipart-parser.
// It is NOT a DOM File: it exposes filename/contentType/content instead of name/type/size.
interface ParsedFile {
  filename: string;
  contentType: string;
  content: Uint8Array;
  encoding?: string;
  fieldname?: string;
}

type PermittedBucket = 'image_of_day' | 'prompt_images' | 'community-prompt-images';

/**
 * Upload a file to Supabase Storage via trusted Netlify Function.
 * CRITICAL: Bucket name is validated server-side; clients must NOT supply bucket names.
 *
 * @param file - The parsed multipart file (filename/contentType/content)
 * @param bucket - Validated destination bucket
 * @returns The public URL of the uploaded file, or error object
 */
export const supabaseUpload = async (
  file: ParsedFile,
  bucket: PermittedBucket = 'image_of_day'
): Promise<{ url: string | null; error: any }> => {
  // Validate file type
  if (!allowedTypes.includes(file.contentType)) {
    return { url: null, error: 'Invalid file type. Only PNG, JPEG, and WEBP are allowed.' };
  }

  // Validate file size (content is a Buffer/Uint8Array, so .length is the byte size)
  if (file.content.length > maxSize) {
    return { url: null, error: 'File exceeds the 5MB size limit.' };
  }

  // Derive the extension from the validated content type (never trust the filename)
  const extensionByType: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
  };
  const extension = extensionByType[file.contentType] || 'png';

  // Generate a unique filename with timestamp
  const timestamp = Date.now();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const fileName = `image-of-day-${timestamp}-${uniqueId}.${extension}`;

  // Upload to Supabase Storage using the admin client
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file.content, {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType: file.contentType,
    });

  if (error) {
    console.error('Supabase Storage upload error:', error);
    return { url: null, error };
  }

  // Get the public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
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

    // Parse the multipart form data. lambda-multipart-parser's parse()
    // returns a Promise (it is not callback-based).
    const result = await parse(event);

    const file = result.files[0];
    console.log("File parsed:", file ? file.filename : "No file");

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No file uploaded" })
      };
    }

    // Determine which bucket to use based on the request query parameter.
    // Query parameters live on the event, not on the parsed multipart body.
    const requestedBucket = event.queryStringParameters?.bucket as
      | 'image_of_day'
      | 'prompt_images'
      | 'community-prompt-images'
      | undefined;

    // CRITICAL: Validate bucket against permitted list.
    // If the bucket is not permitted, default to 'image_of_day' and log a warning.
    let validatedBucket: 'image_of_day' | 'prompt_images' | 'community-prompt-images' = 'image_of_day';
    if (requestedBucket && PERMITTED_BUCKETS.includes(requestedBucket)) {
      validatedBucket = requestedBucket;
    } else if (requestedBucket) {
      console.warn(`⚠ Invalid bucket hint "${requestedBucket}" received. Defaulting to "image_of_day".`);
    }

    // Upload to Supabase Storage via the admin client using the validated bucket
    const uploadResult = await supabaseUpload(file, validatedBucket);

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