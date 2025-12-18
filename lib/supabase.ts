
import { createClient } from '@supabase/supabase-js';

// Use environment variables if present, otherwise use stable fallback strings.
// This prevents initialization errors if process.env is empty.
const supabaseUrl = (process.env as any).NEXT_PUBLIC_SUPABASE_URL || 'https://iubzutuilytmcanbgcyi.supabase.co';
const supabaseAnonKey = (process.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Ynp1dHVpbHl0bWNhbmJnY3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzcwMjksImV4cCI6MjA4MTUxMzAyOX0.SPYAmTQn63BNIjq_pfBZbvR0Zbl9Q8qbyIy5Y2iXLCA';

if (!supabaseUrl || supabaseUrl === '') {
  console.error('Supabase URL is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
