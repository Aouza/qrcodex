import type { Metadata } from "next";
import styles from "@/components/admin/admin-content.module.css";
import { EstablishmentSettingsForm } from "@/components/admin/establishment-settings-form";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Configurações | Administração",
};

export default async function AdminSettingsPage() {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("establishments").select("name, slug, instagram, whatsapp").eq("id", access.establishment.id).maybeSingle();
  if (error || !data) throw new Error("Failed to load establishment settings.");
  return <><header className={styles.heading}><p className={styles.eyebrow}>Estabelecimento</p><h1>Configurações</h1><p>Mantenha a identidade e os contatos públicos atualizados.</p></header><EstablishmentSettingsForm values={{ name: data.name, slug: data.slug, instagram: data.instagram ?? "", whatsapp: data.whatsapp ?? "" }} /></>;
}
