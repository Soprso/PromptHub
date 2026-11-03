// Supabase client configuration
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Client-side Supabase client - uses anonymous key
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY should be set in .env
export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Server-side Supabase client - uses service role key for admin operations
// This should ONLY be used in Netlify Functions or server-side code
// The service role key has full database access and should NOT be exposed to browsers
export const createSupabaseServer = (url: string, serviceRoleKey: string): SupabaseClient => {
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Helper to get supabase server client from Netlify Functions
// Usage: const supa = createSupabaseServer(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);