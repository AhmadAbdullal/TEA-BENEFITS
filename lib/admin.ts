import { getBrowserSupabase } from "@/lib/supabaseClient";

const ADMIN_TABLE = "المستخدمين_users";

export async function adminLogin(email: string, password: string) {
  const supabase = getBrowserSupabase();
  const { data, error } = await supabase
    .from(ADMIN_TABLE)
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Admin login failed", error);
    return { success: false as const, message: error.message };
  }

  if (!data) {
    return { success: false as const, message: "Invalid credentials" };
  }

  return { success: true as const };
}
