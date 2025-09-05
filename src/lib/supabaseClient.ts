import { createClient } from '@supabase/supabase-js'

// Mengambil URL dan kunci dari environment variables yang telah kita buat
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Membuat dan mengekspor satu instance client Supabase yang akan kita gunakan di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseAnonKey)