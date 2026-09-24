import { createPublicClient } from "@/lib/supabase/public";
import { resolvePublicHubResult } from "@/lib/hub/resolve-public-hub-result";

export async function loadPublicHub(slug: string) {
  const supabase = createPublicClient();
  const result = await supabase
    .from("establishments")
    .select("id, name, slug, logo_url, instagram, whatsapp")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  return resolvePublicHubResult(result);
}
