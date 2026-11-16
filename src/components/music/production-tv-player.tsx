"use client";
import { useEffect,useRef,useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { loadYouTubeIframeApi,isLoadedVideo,type YouTubePlayer } from "@/lib/youtube-poc/iframe-api";
import { MusicTerminal,type TerminalView } from "@/lib/music/terminal";
import { playbackSchema,type PlaybackState,type PlayerReply } from "@/lib/music/protocol";
import styles from "@/app/[slug]/musicas/player/player.module.css";
export function ProductionTvPlayer({slug,name}:{slug:string;name:string}) {
  const [view,setView]=useState<TerminalView>({status:"booting",playback:null});
  const [blocked,setBlocked]=useState(false),[activated,setActivated]=useState(false),[apiReady,setApiReady]=useState(false);
  const [apiError,setApiError]=useState(false),[tabError,setTabError]=useState(false);
  const surface=useRef<HTMLDivElement>(null),youtube=useRef<YouTubePlayer|null>(null),terminal=useRef<MusicTerminal|null>(null);
  const active=useRef<{state:PlaybackState;started:boolean}|null>(null);
  const activatedRef=useRef(false),readyRef=useRef(false);
  useEffect(()=>{
    if (!navigator.locks) {
      let cancelled=false;
      queueMicrotask(()=>{if(!cancelled)setTabError(true);});
      return ()=>{cancelled=true;}; // HTTPS/localhost is required for a production TV.
    }
    let disposed=false;let release:()=>void=()=>{};let timer:number|undefined;
    void navigator.locks.request(`music-tv:${slug}`,{ifAvailable:true},async lock=>{
      if (disposed) return;
      if (!lock) { setView({status:"busy",playback:null});return; }
      let instance=sessionStorage.getItem(`music-instance:${slug}`);
      if (!instance || !/^[a-f0-9-]{36}$/.test(instance)) { instance=crypto.randomUUID();sessionStorage.setItem(`music-instance:${slug}`,instance); }
      const controller=new MusicTerminal(slug,instance,crypto.randomUUID(),async command=>{
        const response=await fetch("/api/music/player",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(command),
          cache:"no-store",signal:AbortSignal.timeout(12000)});
        const data=await response.json();
        if (response.status===401) return {status:"unauthorized"};
        if (!response.ok) throw new Error("PLAYER_UNAVAILABLE");
        if (["unauthorized","disabled","busy","lease_lost"].includes(data.status)) return {status:data.status} as PlayerReply;
        return playbackSchema.parse(data);
      },next=>{
        if (disposed) return;
        if (!next.playback?.track) { youtube.current?.stopVideo();active.current=null; }
        setView(next);
      });
      terminal.current=controller;
      controller.setReady(readyRef.current && activatedRef.current);
      void controller.wake();
      timer=window.setInterval(()=>void controller.tick(),1000); // Local lease watchdog; HTTP remains 15/20s.
      await new Promise<void>(resolve=>{release=resolve;if(disposed)resolve();});
    }).catch(()=>{if(!disposed)setTabError(true);});
    return ()=>{disposed=true;terminal.current?.dispose();terminal.current=null;if(timer)window.clearInterval(timer);release();};
  },[slug]);
  useEffect(()=>{
    if (!surface.current) return;
    let disposed=false;
    void loadYouTubeIframeApi().then(api=>{
      if(disposed)return;
      const target=document.createElement("div");surface.current!.replaceChildren(target);
      youtube.current=new api.Player(target,{width:"100%",height:"100%",
        playerVars:{autoplay:1,playsinline:1,origin:window.location.origin,rel:0},events:{
          onReady:({target})=>{
            readyRef.current=true;setApiReady(true);
            terminal.current?.setReady(activatedRef.current);
            const current=active.current?.state.track;if(current)target.loadVideoById(current.videoId);
          },
          onStateChange:({data})=>{
            const current=active.current;
            if (!current?.state.track||!isLoadedVideo(youtube.current,current.state.track.videoId)) return;
            if(data===1){current.started=true;setBlocked(false);activatedRef.current=true;setActivated(true);terminal.current?.setReady(true);}
            if(data===0&&current.started){current.started=false;void terminal.current?.report({operation:"ended",requestId:current.state.track.id,
              leaseGeneration:current.state.leaseGeneration,playbackGeneration:current.state.playbackGeneration});}
          },
          onError:({data})=>{
            const current=active.current;
            if(current?.state.track&&isLoadedVideo(youtube.current,current.state.track.videoId)&&[2,5,100,101,150,153].includes(data))
              void terminal.current?.report({operation:"error",requestId:current.state.track.id,leaseGeneration:current.state.leaseGeneration,
                playbackGeneration:current.state.playbackGeneration,errorCode:data});
          },
          onAutoplayBlocked:()=>{setBlocked(true);terminal.current?.setReady(false);},
        }});
    }).catch(()=>{if(!disposed){setApiError(true);terminal.current?.setReady(false);}});
    return ()=>{disposed=true;youtube.current?.stopVideo();youtube.current?.destroy();youtube.current=null;readyRef.current=false;};
  },[]);
  const playback=view.playback,topic=playback?.topic;
  useEffect(()=>{
    if(!topic)return;
    const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{
      auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    const channel=client.channel(topic).on("broadcast",{event:"wake"},()=>void terminal.current?.wake())
      .on("broadcast",{event:"instruction"},()=>void terminal.current?.wake("instruction"))
      .subscribe(status=>{if(status==="SUBSCRIBED")void terminal.current?.wake();});
    return ()=>{void client.removeChannel(channel);};
  },[topic]);
  useEffect(()=>{
    if(!playback?.track)return;
    const old=active.current;
    if(old?.state.track?.id===playback.track.id&&old.state.playbackGeneration===playback.playbackGeneration&&old.state.leaseGeneration===playback.leaseGeneration)return;
    active.current={state:playback,started:false};setBlocked(false);
    if(readyRef.current)youtube.current?.loadVideoById(playback.track.videoId);
  },[playback]);
  function start(){activatedRef.current=true;setActivated(true);setBlocked(false);youtube.current?.playVideo();terminal.current?.setReady(readyRef.current);void terminal.current?.tick();}
  const show=!!playback?.track&&!apiError&&!tabError;
  const messages:Record<string,string>={booting:"Iniciando player...",waiting:"Aguardando pedidos...",recovering:"Reconectando player...",
    unauthorized:"Autorização expirada ou revogada. Pareie a TV novamente.",disabled:"Música desativada pelo estabelecimento.",busy:"Outra aba ou TV está utilizando o player."};
  return <main className={styles.screen}>
    <div className={show?styles.video:styles.hidden}><div ref={surface}/></div>
    {show?<footer className={styles.caption}><p>Tocando agora</p><h2>{playback.track!.title}</h2>
      {view.status==="recovering"&&<p>Reconectando...</p>}{blocked&&<button onClick={start}>INICIAR PLAYER</button>}</footer>
      :<section className={styles.center} aria-live="polite"><h1>{name}</h1><p>{tabError?"Abra a TV em HTTPS ou localhost, com suporte a bloqueio de abas.":apiError?"Não foi possível carregar o YouTube.":messages[view.status]}</p>
        {apiReady&&!activated&&!apiError&&!tabError&&!["unauthorized","busy","disabled"].includes(view.status)&&<button onClick={start}>INICIAR PLAYER</button>}
        {["unauthorized","busy"].includes(view.status)||apiError||tabError?<button onClick={()=>window.location.reload()}>Reabrir player</button>:null}</section>}
  </main>;
}
