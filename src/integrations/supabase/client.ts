
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wsywtdxkxznowdmtfbiy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeXd0ZHhreHpub3dkbXRmYml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDcxNjUsImV4cCI6MjA1NzY4MzE2NX0.k4fbxfqTAPXtmXed1VkXgk-eOiWBu2B6raV1Oq1OYIw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
