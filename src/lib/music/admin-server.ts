import "server-only";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { productionMusicEnabled } from "./runtime";
import { adminMusicSnapshot } from "./admin-protocol";

export async function loadAdminMusic() {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  if (!productionMusicEnabled()) return { available: false as const };
  const supabase = await createClient(); // Membership JWT + publishable key, not service role.
  const { data, error } = await supabase.rpc("music_admin_state", { p_tenant: access.establishment.id });
  const parsed = adminMusicSnapshot.safeParse(data);
  if (error || !parsed.success) return { available: false as const };
  return { available: true as const, snapshot: parsed.data, slug: access.establishment.slug };
}
