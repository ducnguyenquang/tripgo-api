import { createClient } from "@supabase/supabase-js";

const databaseUrl = process.env.DATABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? "";

export const supabase = createClient(databaseUrl, serviceKey);
