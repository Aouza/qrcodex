import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { resolveMembership } from "./resolve-membership";

type AdminAccess =
  | { status: "unauthenticated" }
  | { status: "not_configured"; email: string | null }
  | { status: "selection_required"; email: string | null }
  | { status: "unavailable"; email: string | null }
  | {
      status: "authorized";
      email: string | null;
      establishment: {
        id: string;
        name: string;
        slug: string;
        role: string;
      };
    };

export const getAdminAccess = cache(async (): Promise<AdminAccess> => {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) return { status: "unauthenticated" };

  const { data: membershipRows, error: membershipError } = await supabase
    .from("establishment_users")
    .select("establishment_id, role")
    .eq("user_id", user.id)
    .limit(2);

  if (membershipError) {
    return { status: "unavailable", email: user.email ?? null };
  }

  const resolution = resolveMembership(
    membershipRows.map((row) => ({
      establishmentId: row.establishment_id,
      role: row.role,
    })),
  );

  if (resolution.status === "none") {
    return { status: "not_configured", email: user.email ?? null };
  }

  if (resolution.status === "multiple") {
    return { status: "selection_required", email: user.email ?? null };
  }

  const { data: establishment, error: establishmentError } = await supabase
    .from("establishments")
    .select("id, name, slug")
    .eq("id", resolution.membership.establishmentId)
    .single();

  if (establishmentError || !establishment) {
    return { status: "unavailable", email: user.email ?? null };
  }

  return {
    status: "authorized",
    email: user.email ?? null,
    establishment: {
      ...establishment,
      role: resolution.membership.role,
    },
  };
});
