"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { isLoadedVideo, loadYouTubeIframeApi, type YouTubePlayer } from "@/lib/youtube-poc/iframe-api";
import { PlaybackTerminal, type PlaybackInstruction, type PlaybackTrack, type TerminalState } from "@/lib/youtube-poc/playback-terminal";
import styles from "@/app/[slug]/musicas/player/player.module.css";

export function MusicTvPlayer({ slug, name }: { slug: string; name: string }) {
  const [state, setState] = useState<TerminalState>("booting");
  const [instruction, setInstruction] = useState<PlaybackInstruction | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [activated, setActivated] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const youtube = useRef<YouTubePlayer | null>(null);
  const terminal = useRef<PlaybackTerminal | null>(null);
  const activeVideo = useRef<{ track: PlaybackTrack; started: boolean } | null>(null);
  const iframeReady = useRef(false);
  useEffect(() => {
    const controller = new PlaybackTerminal(async (event) => {
      const response = await fetch("/api/youtube/poc/player", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...(event ?? { operation: "state" }) }),
        signal: AbortSignal.timeout(12000), cache: "no-store",
      });
      if (response.status === 401) throw new Error("PLAYER_UNAUTHORIZED");
      if (!response.ok) throw new Error("PLAYER_UNAVAILABLE");
      return await response.json() as PlaybackInstruction;
    }, (nextState, nextInstruction) => {
      setState(nextState);
      if (nextInstruction) setInstruction(nextInstruction);
    });
    terminal.current = controller;
    void controller.wake();
    // Slow recovery covers missed broadcasts and delivery failures, not playback.
    const timer = window.setInterval(() => void controller.recover(), 15000);
    return () => { controller.dispose(); window.clearInterval(timer); terminal.current = null; };
  }, [slug]);
  const topic = instruction?.topic;
  useEffect(() => {
    if (!topic) return;
    // Cookie-free anon client never inherits an employee's admin session.
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const channel = client.channel(topic)
      .on("broadcast", { event: "wake" }, () => void terminal.current?.wake())
      .subscribe((status) => { if (status === "SUBSCRIBED") void terminal.current?.wake(); });
    return () => { void client.removeChannel(channel); };
  }, [topic]);
  const track = instruction?.current;
  useEffect(() => {
    if (!track || !surface.current) return;
    let disposed = false;
    void loadYouTubeIframeApi().then((api) => {
      if (disposed) return;
      setIframeError(false);
      setBlocked(false);
      activeVideo.current = { track, started: false };
      if (youtube.current) {
        if (iframeReady.current) youtube.current.loadVideoById(track.videoId);
        return;
      }
      const target = document.createElement("div");
      surface.current!.replaceChildren(target);
      youtube.current = new api.Player(target, {
        width: "100%", height: "100%", videoId: track.videoId,
        playerVars: { autoplay: 1, playsinline: 1, origin: window.location.origin, rel: 0 },
        events: {
          onReady: ({ target }) => {
            iframeReady.current = true;
            const active = activeVideo.current;
            if (!active) return;
            if (!isLoadedVideo(target, active.track.videoId)) target.loadVideoById(active.track.videoId);
            else target.playVideo();
          },
          onStateChange: ({ data }) => {
            const active = activeVideo.current;
            if (!active || !isLoadedVideo(youtube.current, active.track.videoId)) return;
            if (data === 1) { active.started = true; setBlocked(false); setActivated(true); }
            if (data === 0 && active.started) {
              active.started = false;
              void terminal.current?.report({ operation: "ended", requestId: active.track.id });
            }
          },
          onError: ({ data }) => {
            const active = activeVideo.current;
            if (active && [2, 5, 100, 101, 150, 153].includes(data)) {
              void terminal.current?.report({ operation: "error", requestId: active.track.id, errorCode: data });
            }
          },
          onAutoplayBlocked: () => { if (activeVideo.current) setBlocked(true); },
        },
      });
    }).catch(() => { if (!disposed) setIframeError(true); });
    return () => { disposed = true; activeVideo.current = null; };
  }, [track]);
  useEffect(() => () => {
    youtube.current?.destroy(); youtube.current = null; iframeReady.current = false;
  }, []);
  const playing = !!track && state === "playing" && !iframeError;
  function startPlayer() {
    setActivated(true);
    youtube.current?.playVideo();
    void terminal.current?.wake();
  }
  return <main className={styles.screen}>
    <div className={playing ? styles.video : styles.hidden}><div ref={surface} /></div>
    {playing ? <footer className={styles.caption}>
      <p>Tocando agora</p><h2>{track.title}</h2>
      {blocked && <button onClick={startPlayer}>INICIAR PLAYER</button>}
    </footer> : <section className={styles.center} aria-live="polite">
      <h1>{name}</h1>
      <p>{state === "waiting" ? "Aguardando pedidos..." : state === "unauthorized"
        ? "Autorização expirada. Abra o player novamente." : state === "booting"
        ? "Iniciando player..." : "Reconectando player..."}</p>
      {(state === "unauthorized" || iframeError) && <button onClick={() => window.location.reload()}>Reabrir player</button>}
      {state === "waiting" && !activated && <button onClick={startPlayer}>INICIAR PLAYER</button>}
    </section>}
  </main>;
}
