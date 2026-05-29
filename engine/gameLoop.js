export class GameLoop {
  constructor({
    wallet,
    tickMs = 1000,
    aetherPerTick = 5,
    saveEveryTicks = 10,
    onAutoSave,
  } = {}) {
    this.wallet = wallet;
    this.tickMs = tickMs;
    this.aetherPerTick = aetherPerTick;
    this.saveEveryTicks = saveEveryTicks;
    this.onAutoSave = onAutoSave;
    this.intervalId = null;
    this.tickCount = 0;
    this.subscribers = new Set();
  }

  subscribe(handler) {
    this.subscribers.add(handler);
    return () => this.subscribers.delete(handler);
  }

  notify(reason = "state") {
    const snapshot = this.getSnapshot(reason);
    for (const handler of this.subscribers) handler(snapshot);
  }

  getSnapshot(reason = "state") {
    return {
      reason,
      tickCount: this.tickCount,
      aether: this.wallet?.aether ?? 0,
    };
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), this.tickMs);
  }

  stop() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  tick() {
    this.tickCount += 1;
    this.wallet?.addAether(this.aetherPerTick);
    this.notify("tick");
    if (this.onAutoSave && this.tickCount % this.saveEveryTicks === 0) {
      this.onAutoSave();
    }
  }
}
