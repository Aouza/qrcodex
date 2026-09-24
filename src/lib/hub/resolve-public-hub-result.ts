export type PublicHubEstablishment = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  instagram: string | null;
  whatsapp: string | null;
};

type PublicHubResult = {
  data: PublicHubEstablishment | null;
  error: unknown;
};

export function resolvePublicHubResult({ data, error }: PublicHubResult) {
  if (error) {
    throw new Error("Failed to load the public Hub.");
  }

  return data;
}
