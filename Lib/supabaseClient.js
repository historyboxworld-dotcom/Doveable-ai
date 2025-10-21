import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qntymvfuiedcpunishmu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFudHltdmZ1aWVkY3B1bmlzaG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTUwODMsImV4cCI6MjA3NjU3MTA4M30.LoWLp3ugeSoZmvgQ0YxDxQXKC_CD36FMTZ8tPmNk4_Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
