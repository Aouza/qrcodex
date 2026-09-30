export type YouTubePlayer = {
  playVideo(): void;
  loadVideoById(videoId: string): void;
  getVideoUrl(): string;
  destroy(): void;
};
type PlayerOptions = {
  videoId: string; width: string; height: string;
  playerVars: { autoplay: number; playsinline: number; origin: string; rel: number };
  events: {
    onReady(event: { target: YouTubePlayer }): void;
    onStateChange(event: { data: number }): void;
    onError(event: { data: number }): void;
    onAutoplayBlocked(): void;
  };
};
type YouTubeApi = { Player: new (element: HTMLElement, options: PlayerOptions) => YouTubePlayer };
declare global { interface Window { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void } }

let loading: Promise<YouTubeApi> | undefined;
export function loadYouTubeIframeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (loading) return loading;
  loading = new Promise<YouTubeApi>((resolve, reject) => {
    const script = document.createElement("script");
    const previous = window.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => finish(new Error("IFrame API unavailable")), 15000);
    function finish(error?: Error) {
      window.clearTimeout(timeout);
      script.onerror = null;
      window.onYouTubeIframeAPIReady = previous;
      if (error) { script.remove(); loading = undefined; reject(error); }
      else if (window.YT) resolve(window.YT);
    }
    window.onYouTubeIframeAPIReady = () => { previous?.(); finish(); };
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => finish(new Error("IFrame API unavailable"));
    document.head.append(script);
  });
  return loading;
}

export function isLoadedVideo(player: YouTubePlayer | null, videoId: string) {
  if (!player) return false;
  try { return new URL(player.getVideoUrl()).searchParams.get("v") === videoId; }
  catch { return false; }
}
