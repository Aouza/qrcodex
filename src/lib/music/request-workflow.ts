import type { VideoResult } from "./youtube";
export type RequestIdentity = {slug:string;visitorHash:string;networkHash:string};
export type Outcome = {status:string;requestId?:string;results?:VideoResult[]};
export type RequestDependencies = {
  receipt(identity:RequestIdentity,retryId:string,videoId:string):Promise<Outcome|null>;
  reserve(identity:RequestIdentity,operation:"search"|"validate"):Promise<Outcome>;
  search(query:string):Promise<VideoResult[]>;
  validate(videoId:string):Promise<VideoResult>;
  admit(identity:RequestIdentity,retryId:string,video:VideoResult,verifiedAt:string):Promise<Outcome>;
};
export async function requestMusic(identity:RequestIdentity,retryId:string,videoId:string,deps:RequestDependencies):Promise<Outcome> {
  const receipt=await deps.receipt(identity,retryId,videoId);
  if (receipt) return receipt;
  const budget=await deps.reserve(identity,"validate");
  if (budget.status!=="reserved") return budget;
  const video=await deps.validate(videoId); // Only server-fetched metadata is admitted.
  return deps.admit(identity,retryId,video,new Date().toISOString());
}
export async function searchMusic(identity:RequestIdentity,query:string,deps:RequestDependencies):Promise<Outcome> {
  const budget=await deps.reserve(identity,"search");
  return budget.status==="reserved" ? {status:"results",results:await deps.search(query)} : budget;
}
