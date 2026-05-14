import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oifxmzonwaxrkdvusbpu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZnhtem9ud2F4cmtkdnVzYnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3Nzg0MTksImV4cCI6MjA5NDM1NDQxOX0.e0dGv6L6_jrGTPgC24_XiKzodR-gNSNDjStqQi_b9_U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
