import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owjdeyiziyomlbarfkjw.supabase.co'
const supabaseKey = 'sb_publishable_ZDTeGrCNQqD7sUbKgYW0gg_WLe2uMYf'

export const supabase = createClient(supabaseUrl, supabaseKey)
