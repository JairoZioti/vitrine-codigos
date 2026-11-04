import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uiphdqpqdgfpcetremgp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pTfjnOvSaajeBgesV7eDcA_NPnWlVRX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

