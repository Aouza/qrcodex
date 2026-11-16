import { z } from "zod";
export type VideoResult = { videoId:string;title:string;channelTitle:string;thumbnailUrl:string|null };
export class MusicUpstreamError extends Error {
  code:string;
  constructor(code:string) { super(code);this.code=code; }
}
const snippet=z.object({title:z.string().min(1).max(500),channelTitle:z.string().min(1).max(250),
  thumbnails:z.record(z.string(),z.object({url:z.string()})).optional()});
const searchPayload=z.object({items:z.array(z.unknown()).max(50)});
const searchVideo=z.object({id:z.object({kind:z.literal("youtube#video").optional(),videoId:z.string().regex(/^[A-Za-z0-9_-]{11}$/)}),snippet});
const videoPayload=z.object({items:z.array(z.object({id:z.string(),snippet,
  status:z.object({embeddable:z.boolean(),privacyStatus:z.string(),uploadStatus:z.string()})})).max(1)});
function thumbnail(data:z.infer<typeof snippet>) {
  const url=data.thumbnails?.medium?.url??data.thumbnails?.default?.url;
  return url?.startsWith("https://i.ytimg.com/") ? url : null;
}
async function youtubeCall(path:string,params:Record<string,string>,key:string,fetcher:typeof fetch) {
  if (!key) throw new MusicUpstreamError("not_configured");
  const url=new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [name,value] of Object.entries(params)) url.searchParams.set(name,value);
  let response:Response;
  try { response=await fetcher(url,{headers:{"X-Goog-Api-Key":key},signal:AbortSignal.timeout(8000),cache:"no-store"}); }
  catch { throw new MusicUpstreamError("upstream_unavailable"); }
  if (!response.ok) {
    const error=await response.json().catch(()=>null);
    const reason=error?.error?.errors?.[0]?.reason;
    throw new MusicUpstreamError(["quotaExceeded","dailyLimitExceeded"].includes(reason)?"quota_exhausted":"upstream_unavailable");
  }
  try { return await response.json(); } catch { throw new MusicUpstreamError("upstream_unavailable"); }
}
export async function searchMusicVideos(query:string,key:string,fetcher:typeof fetch=fetch):Promise<VideoResult[]> {
  const data=searchPayload.safeParse(await youtubeCall("search",{part:"snippet",type:"video",q:query,maxResults:"10",videoEmbeddable:"true"},key,fetcher));
  if (!data.success) throw new MusicUpstreamError("upstream_unavailable");
  // Some successful searches contain items without a videoId. They are not songs,
  // and must not invalidate the other independently validated video results.
  return data.data.items.flatMap(value=>{
    const parsed=searchVideo.safeParse(value);
    if (!parsed.success) return [];
    const item=parsed.data;
    return [{videoId:item.id.videoId,title:item.snippet.title,channelTitle:item.snippet.channelTitle,thumbnailUrl:thumbnail(item.snippet)}];
  });
}
export async function validateMusicVideo(videoId:string,key:string,fetcher:typeof fetch=fetch):Promise<VideoResult> {
  const data=videoPayload.parse(await youtubeCall("videos",{part:"snippet,status",id:videoId},key,fetcher));
  const video=data.items[0];
  if (!video || video.id!==videoId || !video.status.embeddable || video.status.privacyStatus!=="public" || video.status.uploadStatus!=="processed")
    throw new MusicUpstreamError("video_unavailable");
  return {videoId:video.id,title:video.snippet.title,channelTitle:video.snippet.channelTitle,thumbnailUrl:thumbnail(video.snippet)};
}
