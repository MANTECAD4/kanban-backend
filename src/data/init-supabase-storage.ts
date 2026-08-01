// @noImplicitAny: false

// ---cut---
import { createClient } from "@supabase/supabase-js";
import { envs } from "../configs/envs";
const { SUPABASE_URL, SUPABASE_SECRET_KEY } = envs();
// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
