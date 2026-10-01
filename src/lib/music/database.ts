import "server-only";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { searchMusicVideos,validateMusicVideo } from "./youtube";
import type { RequestDependencies,RequestIdentity } from "./request-workflow";
export function musicDatabase() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("MUSIC_NOT_CONFIGURED");
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
    global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(10000),cache:"no-store"})}});
}
export async function musicRpc(name:string,args:Record<string,unknown>={}) {
  const {data,error}=await musicDatabase().rpc(name,args);
  if (error) throw new Error("MUSIC_DATABASE_UNAVAILABLE");
  return data as unknown;
}
export async function musicAvailability(slug:string) {
  const {data,error}=await createPublicClient().rpc("music_availability",{p_slug:slug});
  if (error) throw new Error("MUSIC_DATABASE_UNAVAILABLE");
  return data===null ? null : z.object({enabled:z.boolean(),accepting:z.boolean()}).parse(data);
}
const outcome=z.object({status:z.enum(["accepted","retry_conflict","reserved","disabled","offline","full","limited","quota_exhausted","unavailable"]),requestId:z.uuid().optional()});
function identityArgs(identity:RequestIdentity) {
  return {p_slug:identity.slug,p_visitor_hash:identity.visitorHash,p_network_hash:identity.networkHash};
}
export function requestDependencies():RequestDependencies {
  const key=process.env.YOUTUBE_MUSIC_API_KEY;
  const costs={search:Number(process.env.YOUTUBE_MUSIC_SEARCH_COST??"1"),validate:Number(process.env.YOUTUBE_MUSIC_VIDEO_COST??"1")};
  if (!key || Object.values(costs).some(cost=>!Number.isInteger(cost)||cost<1||cost>1000)) throw new Error("MUSIC_NOT_CONFIGURED");
  return {
    async receipt(identity,retryId,videoId) {
      const data=await musicRpc("music_request_receipt",{p_slug:identity.slug,p_visitor_hash:identity.visitorHash,p_retry:retryId,p_video:videoId});
      return data===null ? null : outcome.parse(data);
    },
    async reserve(identity,operation) { return outcome.parse(await musicRpc("music_reserve_api",{...identityArgs(identity),p_operation:operation,p_units:costs[operation]})); },
    search:query=>searchMusicVideos(query,key),validate:id=>validateMusicVideo(id,key),
    async admit(identity,retryId,video,verifiedAt) {
      return outcome.parse(await musicRpc("music_admit_request",{...identityArgs(identity),p_retry:retryId,p_video:video.videoId,
        p_title:video.title,p_channel:video.channelTitle,p_thumbnail:video.thumbnailUrl,p_verified_at:verifiedAt}));
    },
  };
}
