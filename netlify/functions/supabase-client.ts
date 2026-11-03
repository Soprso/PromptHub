// Supabase client for Netlify Functions (server-side)
// Uses service role key for full database access
// The SUPABASE_SERVICE_ROLE_KEY should be set in Netlify environment variables

import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabase;
}

export const supabaseAdmin = getSupabase();