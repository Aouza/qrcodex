import assert from "node:assert/strict";
import test from "node:test";
import { getReservationHref } from "../src/lib/site/reservation-link.ts";

test("o link de reserva abre o WhatsApp cadastrado com uma mensagem editável", () => {
  const local = new URL(getReservationHref("11987654321"));
  const international = new URL(getReservationHref("5511987654321"));
  assert.equal(local.origin, "https://wa.me");
  assert.equal(local.pathname, "/5511987654321");
  assert.equal(local.href, international.href);
  assert.equal(local.searchParams.get("text"), "Olá! Gostaria de reservar uma mesa.");
});

test("o link de reserva fica indisponível para contatos ausentes ou inválidos", () => {
  for (const contact of [null, "", "123", "https://example.com", "011987654321"]) {
    assert.equal(getReservationHref(contact), null);
  }
});
