import { supabase } from "./supabase";

export async function checkSupabaseHealth(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    if (!supabase) return { ok: false, error: "Supabase not configured" };
    const { error } = await supabase.auth.getSession();
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}
