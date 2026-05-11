import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://qnsiyepnuenafwanutvv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuc2l5ZXBudWVuYWZ3YW51dHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzg4MDUsImV4cCI6MjA4ODkxNDgwNX0.1Yy3eRIarxfdPYZ1xxBCzjc7XbGIkNqNJVdFNPSOlO0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
