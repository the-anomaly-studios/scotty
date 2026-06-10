import type { SupabaseClient } from "@supabase/supabase-js";

export async function getIsAdmin(supabase: SupabaseClient): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("user_meta")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();
  return data?.is_admin === true;
}
