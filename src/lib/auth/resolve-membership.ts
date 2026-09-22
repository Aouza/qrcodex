export type EstablishmentMembership = {
  establishmentId: string;
  role: string;
};

export type MembershipResolution =
  | { status: "none" }
  | { status: "multiple" }
  | { status: "single"; membership: EstablishmentMembership };

export function resolveMembership(
  memberships: EstablishmentMembership[],
): MembershipResolution {
  if (memberships.length === 0) return { status: "none" };
  if (memberships.length > 1) return { status: "multiple" };
  return { status: "single", membership: memberships[0] };
}
