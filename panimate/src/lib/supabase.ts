import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uysovxqtxhacuhjcgdjn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5c292eHF0eGhhY3VoamNnZGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDA3NDAsImV4cCI6MjA4ODIxNjc0MH0.swt8v4wh9hKXJRuF2Fz9CEfauOAV0XUhAyEWRPlE3YQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
