"use client";
import Link from "next/link";
import { useRef,useState } from "react";
import type { VideoResult } from "@/lib/music/youtube";
import styles from "@/app/[slug]/musicas/music.module.css";
const messages:Record<string,string>={disabled:"Os pedidos estão desativados.",offline:"O player está offline. Tente novamente mais tarde.",full:"A fila está cheia. Tente novamente mais tarde.",
  limited:"Você atingiu o limite de tentativas. Aguarde antes de tentar novamente.",quota_exhausted:"A busca atingiu o limite disponível. Tente novamente mais tarde.",
  retry_conflict:"Este pedido já foi utilizado. Escolha a música novamente.",video_unavailable:"Este vídeo não está disponível para reprodução.",
  consent_required:"Aceite os termos e a política de privacidade para continuar.",temporarily_unavailable:"Música temporariamente indisponível.",upstream_unavailable:"Não foi possível acessar o YouTube.",not_configured:"Música temporariamente indisponível."};
export function MusicRequestForm({slug,consented,accepting}:{slug:string;consented:boolean;accepting:boolean}) {
  const [consent,setConsent]=useState(consented),[checked,setChecked]=useState(false),[query,setQuery]=useState("");
  const [results,setResults]=useState<VideoResult[]>([]),[selected,setSelected]=useState<VideoResult|null>(null);
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[accepted,setAccepted]=useState(false);
  const [unavailable,setUnavailable]=useState(false);
  const ready=accepting&&!unavailable;
  const retry=useRef<{videoId:string;id:string}|null>(null),inflight=useRef(false);
  async function send(body:Record<string,unknown>) {
    const response=await fetch("/api/music/public",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({slug,...body}),signal:AbortSignal.timeout(20000),cache:"no-store"});
    return await response.json() as {status:string;results?:VideoResult[]};
  }
  async function run(operation:"consent"|"search"|"request") {
    if(inflight.current || (operation!=="consent"&&(!ready||!consent)))return;
    if(operation==="request"&&!selected)return;
    inflight.current=true;setBusy(true);setMessage("");setAccepted(false);
    try {
      const body=operation==="consent"?{operation,accepted:true}:operation==="search"?{operation,query:query.trim()}:
        {operation,videoId:selected!.videoId,retryId:retry.current!.id};
      const data=await send(body);
      if(data.status==="consented")setConsent(true);
      else if(data.status==="results"){setResults(data.results??[]);setSelected(null);retry.current=null;if(!data.results?.length)setMessage("Nenhum vídeo encontrado.");}
      else if(data.status==="accepted"){setAccepted(true);setMessage("Pedido recebido! Pedidos não garantem reprodução.");setSelected(null);retry.current=null;}
      else {setMessage(messages[data.status]??messages.temporarily_unavailable);if(data.status==="consent_required")setConsent(false);
        if(data.status==="disabled"||data.status==="offline"){setUnavailable(true);setResults([]);setSelected(null);retry.current=null;}}
    } catch {setMessage("Não foi possível confirmar a operação. Tente novamente; o mesmo pedido não será duplicado.");}
    finally {inflight.current=false;setBusy(false);}
  }
  return <section className={styles.panel} aria-label="Pedidos de música">
    {!ready&&<p className={styles.notice}>Os pedidos estão pausados ou a TV está offline. Atualize esta tela quando o player estiver pronto para buscar e pedir músicas.</p>}
    {!consent?<div className={styles.consent}>
      <p>Usamos o YouTube para buscar e reproduzir vídeos. Cookies identificam temporariamente suas tentativas e protegem a fila contra abuso.</p>
      <label><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/><span>Li e aceito a <Link href={`/${slug}/musicas/privacidade`}>política de privacidade</Link> e os <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">Termos do YouTube</a>.</span></label>
      <button disabled={!checked||busy} onClick={()=>void run("consent")}>{busy?"Aguarde...":"Aceitar e continuar"}</button>
    </div>:<>
      <form onSubmit={e=>{e.preventDefault();if(ready&&query.trim().length>=3)void run("search");}}>
        <label htmlFor="music-search">Buscar música ou artista</label>
        <input id="music-search" value={query} disabled={!ready||busy} onChange={e=>{setQuery(e.target.value);setResults([]);setSelected(null);retry.current=null;setMessage("");}} maxLength={100} placeholder="Ex.: Deftones Change" autoComplete="off"/>
        <button disabled={!ready||busy||query.trim().length<3} type="submit">{busy?"Aguarde...":"Buscar"}</button>
      </form>
      <ol className={styles.results}>{results.map(video=><li key={video.videoId}>
        <button disabled={!ready||busy} aria-pressed={selected?.videoId===video.videoId} onClick={()=>{if(!ready||busy)return;setSelected(video);setAccepted(false);setMessage("");
          if(retry.current?.videoId!==video.videoId)retry.current={videoId:video.videoId,id:crypto.randomUUID()};}}>
          <span>{video.title}</span><small>{video.channelTitle}</small>
        </button></li>)}</ol>
      <button disabled={!ready||busy||!selected} onClick={()=>void run("request")}>Pedir música</button>
      <p>Pedidos entram em ordem de chegada e não garantem reprodução.</p>
    </>}
    {message&&<p role={accepted?"status":"alert"}>{message}</p>}
    <p><Link href={`/${slug}/musicas/privacidade`}>Privacidade</Link> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacidade do Google</a> · <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">Termos do YouTube</a></p>
  </section>;
}
