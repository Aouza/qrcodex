const RELICAS_LOGO = "/images/logo/relicas-logo.jpg";

export function getEstablishmentLogo(logoUrl: string | null, slug: string) {
  if (logoUrl) return logoUrl;
  return slug === "relicas" ? RELICAS_LOGO : null;
}
