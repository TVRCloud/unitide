import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

export const supabaseServer = createClient(
  config.supabase.url,
  config.supabase.key
);
