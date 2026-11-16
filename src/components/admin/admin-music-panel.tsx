"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { mutateAdminMusic } from "@/app/admin/(protected)/music/actions";
import type { AdminMusicCommand, AdminMusicResult, AdminMusicSnapshot } from "@/lib/music/admin-protocol";
import styles from "./admin-music.module.css";

export function AdminMusicPanel({ initial, slug }: { initial: AdminMusicSnapshot; slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<AdminMusicResult>({});
  const inflight = useRef(false);
  useEffect(() => {
    let disposed = false, last = 0;
    const refresh = () => {
      if (disposed || document.hidden || inflight.current || Date.now() - last < 5000) return;
      last = Date.now(); router.refresh();
    };
    // Broadcasts carry no queue or credentials. The server rechecks membership.
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const channel = client.channel(initial.topic)
      .on("broadcast", { event: "wake" }, refresh).on("broadcast", { event: "instruction" }, refresh)
      .subscribe(status => { if (status === "SUBSCRIBED") refresh(); });
    const timer = window.setInterval(refresh, 20000);
    document.addEventListener("visibilitychange", refresh);
    return () => { disposed = true; window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); void client.removeChannel(channel); };
  }, [initial.topic, router]);
  useEffect(() => {
    if (!result.pairingCode) return;
    const timer = window.setTimeout(() => setResult({ message: "Código expirado. Gere um novo código se necessário." }), 600000);
    return () => window.clearTimeout(timer);
  }, [result.pairingCode]);

  function run(command: AdminMusicCommand) {
    if (inflight.current) return;
    inflight.current = true; setResult({});
    startTransition(async () => {
      try { setResult(await mutateAdminMusic(command)); }
      catch { setResult({ error: "Não foi possível confirmar a operação. Atualize a fila antes de repetir." }); }
      finally { inflight.current = false; router.refresh(); }
    });
  }
  function confirm(command: AdminMusicCommand, message: string) {
    if (window.confirm(message)) run(command);
  }
  return <div className={styles.panel} aria-busy={pending}>
    <section className={styles.card}><h2>Operação</h2>
      <p aria-live="polite">TV: {initial.online ? "online e pronta" : "offline ou aguardando ativação"} · {initial.paired ? "pareada" : "não pareada"}</p>
      <form onSubmit={event => {
        event.preventDefault(); const form = new FormData(event.currentTarget);
        run({ operation: "settings", enabled: form.get("enabled") === "on", requestsEnabled: form.get("requestsEnabled") === "on" });
      }} key={`${initial.enabled}:${initial.requestsEnabled}`}>
        <label><input name="enabled" type="checkbox" defaultChecked={initial.enabled} disabled={pending} /> Música habilitada</label>
        <label><input name="requestsEnabled" type="checkbox" defaultChecked={initial.requestsEnabled} disabled={pending} /> Receber novos pedidos</label>
        <p>Pausar pedidos mantém a reprodução. Desabilitar Música para a TV e preserva a fila.</p>
        <button disabled={pending} type="submit">Salvar configuração</button>
      </form>
      <div className={styles.controls}>
        <button disabled={pending || initial.paired} onClick={() => run({ operation: "pair", replace: false })}>Gerar código para TV</button>
        <button disabled={pending || !initial.paired} onClick={() => confirm({ operation: "pair", replace: true }, "Revogar a TV atual e gerar um novo código? A reprodução será interrompida.")}>Substituir TV</button>
        <button disabled={pending} onClick={() => confirm({ operation: "revoke", confirmed: true }, "Revogar a TV e os códigos pendentes? A fila será preservada.")}>Revogar autorização</button>
        <button disabled={pending} onClick={() => router.refresh()}>Atualizar fila</button>
      </div>
      <Link href={`/${slug}/musicas/player`} target="_blank" rel="noopener noreferrer">Abrir player da TV</Link>
      {result.pairingCode && <label>Código de uso único (não compartilhe)
        <input className={styles.code} value={result.pairingCode} readOnly autoComplete="off" spellCheck={false} />
      </label>}
      {result.error && <p role="alert">{result.error}</p>}{result.message && <p role="status">{result.message}</p>}
    </section>
    <section className={styles.card}><h2>Tocando agora</h2>
      {initial.current ? <><h3>{initial.current.title}</h3><p>{initial.current.channelTitle}</p>
        <button disabled={pending || !initial.enabled} onClick={() => confirm({ operation: "skip", requestId: initial.current!.id, confirmed: true }, "Pular este pedido e avançar para o próximo?")}>Pular música atual</button></> : <p>Nenhum pedido em reprodução.</p>}
    </section>
    <section className={styles.card}><h2>Fila — ordem de chegada</h2>
      {initial.queue.length ? <ol className={styles.queue}>{initial.queue.map(track => <li key={track.id}>
        <div><strong>{track.title}</strong><p>{track.channelTitle}</p></div>
        <button disabled={pending} onClick={() => confirm({ operation: "remove", requestId: track.id, confirmed: true }, "Remover este pedido da fila?")}>Remover pedido</button>
      </li>)}</ol> : <p>Aguardando pedidos...</p>}
    </section>
  </div>;
}
