export function getReservationHref(whatsapp: string | null | undefined) {
  if (!whatsapp || !/^[1-9]\d{9,14}$/.test(whatsapp)) return null;

  const number = whatsapp.length <= 11 ? `55${whatsapp}` : whatsapp;
  const url = new URL(`https://wa.me/${number}`);
  url.searchParams.set("text", "Olá! Gostaria de reservar uma mesa.");
  return url.href;
}
