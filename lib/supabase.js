import { createClient } from "@supabase/supabase-js";


const supabaseUrl =
  "https://paacoensgaterdbbdtqw.supabase.co";


const supabaseKey =
  "sb_publishable_7lT8eLYHbWWWh0Wp8mAenA_jSwBgsii";


export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);