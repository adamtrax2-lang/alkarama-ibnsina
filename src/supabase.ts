import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Supabase connection.

  The two values below come from your Supabase project (Settings -> API):
    VITE_SUPABASE_URL       e.g. https://abcdefgh.supabase.co
    VITE_SUPABASE_ANON_KEY  the long "anon public" key

  Put them in a file named `.env.local` at the project root (see .env.example),
  and also in Vercel (Project Settings -> Environment Variables) for the live site.

  If they are missing, the app runs in LOCAL mode (edits save in the browser only),
  exactly like before. So nothing breaks while the project is not set up yet.
*/

const env = import.meta.env as Record<string, string | undefined>;
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

// The whole editable site lives in one row of the `site_content` table (see supabase/schema.sql).
export const CONTENT_TABLE = "site_content";
export const CONTENT_ROW_ID = "main";
