import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Admin client using SERVICE_ROLE_KEY
 * Bypasses RLS policies - use only in server-side actions and route handlers
 * NEVER expose SUPABASE_SERVICE_ROLE_KEY to client-side code
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
