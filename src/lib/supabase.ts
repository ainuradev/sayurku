import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * 1. SUPABASE CLIENT (Frontend / Public)
 * Used for standard operations where Row Level Security (RLS) applies.
 * It uses the anon key, making it safe to use in client components (browser).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// We only initialize supabaseAdmin if the key exists (which is true on the server).
// This prevents crashes when this file is imported in client components.
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
