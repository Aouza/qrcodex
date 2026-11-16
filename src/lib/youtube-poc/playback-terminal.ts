export type PlaybackTrack = { id: string; videoId: string; title: string; channelTitle: string };
export type PlaybackInstruction = { current: PlaybackTrack | null; topic: string };
export type PlaybackEvent = { operation: "ended" | "error"; requestId: string; errorCode?: number };
export type TerminalState = "booting" | "waiting" | "playing" | "recovering" | "unauthorized";

// Serializes technical events, retaining a failed delivery for idempotent retry.
export class PlaybackTerminal {
  current: PlaybackTrack | null = null;
  state: TerminalState = "booting";
  private pending: PlaybackEvent | null = null;
  private busy = false;
  private disposed = false;
  private request: (event: PlaybackEvent | null) => Promise<PlaybackInstruction>;
  private update: (state: TerminalState, instruction?: PlaybackInstruction) => void;
  constructor(
    request: (event: PlaybackEvent | null) => Promise<PlaybackInstruction>,
    update: (state: TerminalState, instruction?: PlaybackInstruction) => void,
  ) { this.request = request; this.update = update; }
  async wake() {
    if (this.current || this.busy || this.disposed || this.state === "unauthorized") return;
    await this.resolve();
  }
  async report(event: PlaybackEvent) {
    if (this.disposed || this.busy || this.pending || this.current?.id !== event.requestId) return;
    this.pending = event;
    await this.resolve();
  }
  async recover() {
    if (this.state === "recovering" && !this.busy && !this.disposed) await this.resolve();
    else await this.wake();
  }
  dispose() { this.disposed = true; }
  private async resolve() {
    this.busy = true;
    try {
      const instruction = await this.request(this.pending);
      if (this.disposed) return;
      this.pending = null;
      this.current = instruction.current;
      this.state = this.current ? "playing" : "waiting";
      this.update(this.state, instruction);
    } catch (error) {
      if (this.disposed) return;
      this.state = error instanceof Error && error.message === "PLAYER_UNAUTHORIZED" ? "unauthorized" : "recovering";
      this.update(this.state);
    } finally { this.busy = false; }
  }
}
