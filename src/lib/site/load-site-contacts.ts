import "server-only";
import { createPublicClient } from "@/lib/supabase/public";

export async function loadSiteContacts() {
  try {
    const { data, error } = await createPublicClient()
      .from("establishments")
      .select("whatsapp, instagram")
      .eq("slug", "relicas")
      .eq("active", true)
      .abortSignal(AbortSignal.timeout(1500))
      .maybeSingle();

    return error ? null : data;
  } catch {
    return null;
  }
}
