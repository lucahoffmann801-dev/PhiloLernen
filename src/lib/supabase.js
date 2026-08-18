import { createClient } from "@supabase/supabase-js";

const URL = "https://jgagydnklkdakywcqmgb.supabase.co";
const KEY = "sb_publishable_k2sfHxJdtlLxFKpctBD2qA_nMdD2I1I";

export const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

export async function pullProgress(code) {
  try {
    const { data, error } = await supabase.from("progress").select("data, updated_at").eq("code", code).maybeSingle();
    if (error) return null;
    return data ? data.data : null;
  } catch { return null; }
}

export async function pushProgress(code, payload) {
  try {
    const { error } = await supabase.from("progress")
      .upsert({ code, data: payload, updated_at: new Date().toISOString() }, { onConflict: "code" });
    return !error;
  } catch { return false; }
}
