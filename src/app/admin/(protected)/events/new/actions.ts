"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { EventFormState } from "@/lib/admin/event-form-state";
import { getAdminAccess } from "@/lib/auth/get-admin-access";
import { createClient } from "@/lib/supabase/server";
import { parseEventInput } from "@/lib/validation/event";

export async function createEvent(_state: EventFormState, formData: FormData): Promise<EventFormState> {
  const access = await getAdminAccess();
  if (access.status !== "authorized") return { formError: "Sua sessão não permite criar eventos." };
  const parsed = parseEventInput({ title: formData.get("title"), description: formData.get("description"), startsAt: formData.get("startsAt"), endsAt: formData.get("endsAt"), externalUrl: formData.get("externalUrl"), active: false });
  if (!parsed.success) return { formError: "Revise os campos indicados.", fieldErrors: parsed.error.flatten().fieldErrors as EventFormState["fieldErrors"] };
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").insert({ establishment_id: access.establishment.id, ...parsed.data, active: false }).select("id").single();
  if (error || !data) return { formError: "Não foi possível criar o evento agora." };
  revalidatePath("/admin/events");
  redirect(`/admin/events/${data.id}?created=1`);
}
