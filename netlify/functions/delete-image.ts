import { supabaseAdmin } from './supabase-client';

// Allowed Supabase Storage bucket names
// These must match the three public buckets created in the Supabase project.
const PERMITTED_BUCKETS = ['image_of_day', 'prompt_images', 'community-prompt-images'] as const;

/**
 * Delete an object from Supabase Storage via trusted Netlify Function.
 * 
 * Security:
 * - Bucket name is validated against PERMITTED_BUCKETS
 * - Object path is validated to prevent path traversal attacks
 * - The supabaseAdmin service role key is used (never exposed to browser)
 * - Anonymous users must not be able to delete objects directly
 * 
 * Expected request:
 *   - Method: DELETE (or POST with _method=DELETE)
 *   - Query parameters: bucket=bucket_name, path=object_path
 *   - Or JSON body with bucket and path
 * 
 * @returns Success/failure status
 */
export const handler = async (event: any) => {
  if (event.httpMethod !== "DELETE" && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Use DELETE or POST.' })
    };
  }

  try {
    let bucket: string;
    let path: string;

    // Try to get bucket and path from query string
    const queryBucket = event.queryStringParameters?.bucket;
    const queryPath = event.queryStringParameters?.path;

    // Try to get bucket and path from JSON body
    let bodyBucket: string | undefined;
    let bodyPath: string | undefined;
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      bodyBucket = body.bucket;
      bodyPath = body.path;
    } catch (e) {
      // Not JSON body, continue with query params only
    }

    // Determine bucket: prefer query param, then body, then default
    if (queryBucket && PERMITTED_BUCKETS.includes(queryBucket as any)) {
      bucket = queryBucket;
    } else if (bodyBucket && PERMITTED_BUCKETS.includes(bodyBucket as any)) {
      bucket = bodyBucket;
    } else {
      // Default to image_of_day for backward compatibility, but log warning
      console.warn('⚠ Invalid or missing bucket. Defaulting to "image_of_day".');
      bucket = 'image_of_day';
    }

    // Determine object path: prefer body path, then query path
    path = bodyPath || queryPath || '';

    // Validate path exists and doesn't contain path traversal attempts
    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing object path.' })
      };
    }

    // Basic path traversal protection: reject paths with '..'
    if (path.includes('..')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid path: path traversal detected.' })
      };
    }

    // CRITICAL: Use supabaseAdmin to delete the object
    // The service role key bypasses RLS, so the bucket's RLS policies
    // for public read don't affect deletion (deletion requires service role).
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('✗ Error deleting Supabase Storage object:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error?.message || error || 'Failed to delete image' })
      };
    }

    console.log(`✓ Successfully deleted ${bucket}/${path}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        bucket,
        path,
        message: 'Image deleted successfully' 
      })
    };

  } catch (err: any) {
    console.error('✗ Error in delete-image function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err?.message || 'Internal server error' })
    };
  }
};