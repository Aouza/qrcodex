import type { PlaybackState,PlayerCommand,PlayerReply } from "./protocol";
export type TerminalView = {status:string;playback:PlaybackState|null};
type TechnicalEvent = {operation:"ended"|"error";requestId:string;leaseGeneration:number;playbackGeneration:number;errorCode?:number};
// One serialized channel. Retries retain the exact event generation; ordinary
// reads never restart a video, and unauthenticated wakes have bounded impact.
export class MusicTerminal {
  view:TerminalView={status:"booting",playback:null};
  private pending:TechnicalEvent|null=null;
  private busy=false; private disposed=false; private instruction=false; private ready=false;
  private deadline=0; private nextHeartbeat=0; private nextWake=0;
  private slug:string;private instanceId:string;private bootId:string;
  private transport:(command:PlayerCommand)=>Promise<PlayerReply>;private publish:(view:TerminalView)=>void;private now:()=>number;
  constructor(slug:string,instanceId:string,bootId:string,
    transport:(command:PlayerCommand)=>Promise<PlayerReply>,publish:(view:TerminalView)=>void,now=()=>Date.now()) {
    this.slug=slug;this.instanceId=instanceId;this.bootId=bootId;this.transport=transport;this.publish=publish;this.now=now;
  }
  setReady(ready:boolean) { if (this.ready!==ready) { this.ready=ready;this.nextHeartbeat=0; } }
  async wake(kind:"queue"|"instruction"="queue") {
    if (this.disposed || this.view.status==="unauthorized" || (kind==="queue" && this.view.playback?.track)) return;
    if (this.now()<this.nextWake) return;
    this.nextWake=this.now()+5000;
    this.instruction=true;
    await this.sync();
  }
  async report(event:TechnicalEvent) {
    const p=this.view.playback;
    if (!p || this.pending || this.disposed || p.track?.id!==event.requestId || p.playbackGeneration!==event.playbackGeneration || p.leaseGeneration!==event.leaseGeneration) return;
    this.pending=event;
    await this.sync();
  }
  async tick() {
    if (this.disposed || this.view.status==="unauthorized") return;
    if (this.view.playback && this.now()>=this.deadline) {
      this.pending=null;this.view={status:"recovering",playback:null};this.publish(this.view);this.nextHeartbeat=0;
    }
    if (this.now()>=this.nextHeartbeat) await this.sync();
  }
  dispose() { this.disposed=true; }
  private async sync() {
    if (this.busy || this.disposed) return;
    this.busy=true;
    const sentEvent=this.pending;
    const start=this.now(); const p=this.view.playback;
    const command={slug:this.slug,instanceId:this.instanceId,bootId:this.bootId,...(this.pending??(
      p && !this.instruction ? {operation:"heartbeat" as const,leaseGeneration:p.leaseGeneration,ready:this.ready} : {operation:"state" as const}))} as PlayerCommand;
    this.instruction=false;
    this.nextHeartbeat=start+20000;
    try {
      const reply=await this.transport(command);
      if (this.disposed) return;
      if(this.pending===sentEvent)this.pending=null;
      if (reply.status==="playing"||reply.status==="waiting") {
        // Never extend a local deadline beyond the RPC's actual lease or a
        // conservative 85s measured from sending the request (not receiving it).
        this.deadline=Math.min(start+85000,Date.parse(reply.leaseExpiresAt));
        if (this.deadline<=this.now()) { this.view={status:"recovering",playback:null}; }
        else this.view={status:reply.status,playback:reply};
      } else this.view={status:reply.status==="lease_lost"?"recovering":reply.status,playback:null};
      this.publish(this.view);
    } catch {
      if (!this.disposed) { this.view={status:"recovering",playback:this.view.playback};this.publish(this.view);this.nextHeartbeat=this.now()+15000; }
    } finally {
      this.busy=false;
      // Don't lose ENDED arriving during a heartbeat, or admin instruction
      // arriving while the server is resolving another request.
      if (!this.disposed && (this.pending && command.operation!=="ended"&&command.operation!=="error" || this.instruction)) await this.sync();
    }
  }
}
