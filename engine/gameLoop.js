import { getProductionRate } from "../src/base/buildings.js";

const MAX_OFFLINE_SECONDS = 86400;

export function getGridProductionRate(grid) {
  const matrix = Array.isArray(grid?.matrix) ? grid.matrix : [];
  return matrix.flat().reduce((total, cell) => {
    if (cell?.type !== "refinery") return total;
    return total + getProductionRate(cell.type, cell.level);
  }, 0);
}

export function calculateOfflineProgress(
  grid,
  lastSavedTimestamp,
  now = Date.now(),
) {
  const savedAt = Number(lastSavedTimestamp);
  if (!Number.isFinite(savedAt) || savedAt <= 0) {
    return { offlineSeconds: 0, aether: 0 };
  }

  const elapsedSeconds = Math.floor((now - savedAt) / 1000);
  const offlineSeconds = Math.min(
    MAX_OFFLINE_SECONDS,
    Math.max(0, elapsedSeconds),
  );
  return {
    offlineSeconds,
    aether: getGridProductionRate(grid) * offlineSeconds,
  };
}

export class GameLoop {
  constructor({
    wallet,
    grid,
    tickMs = 1000,
    aetherPerTick = 5,
    saveEveryTicks = 10,
    onAutoSave,
  } = {}) {
    this.wallet = wallet;
    this.grid = grid;
    this.tickMs = tickMs;
    this.aetherPerTick = aetherPerTick;
    this.saveEveryTicks = saveEveryTicks;
    this.onAutoSave = onAutoSave;
    this.intervalId = null;
    this.tickCount = 0;
    this.lastTickTimestamp = null;
    this.lastElapsedTicks = 1;
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
      elapsedTicks: this.lastElapsedTicks ?? 1,
      aether: this.wallet?.aether ?? 0,
    };
  }

  start() {
    if (this.intervalId) return;
    this.lastTickTimestamp = Date.now();
    this.intervalId = setInterval(() => this.tick(), this.tickMs);
  }

  stop() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.lastTickTimestamp = null;
  }

  tick(now = Date.now()) {
    const elapsedMs = Math.max(0, now - (this.lastTickTimestamp ?? now));
    this.lastTickTimestamp = now;
    const elapsedTicks = Math.max(1, Math.floor(elapsedMs / this.tickMs));
    const productionRate =
      getGridProductionRate(this.grid) || this.aetherPerTick;
    const previousTickCount = this.tickCount;

    this.lastElapsedTicks = elapsedTicks;
    this.tickCount += elapsedTicks;
    this.wallet?.addAether(productionRate * elapsedTicks);
    this.notify("tick");
    if (
      this.onAutoSave &&
      Math.floor(previousTickCount / this.saveEveryTicks) !==
        Math.floor(this.tickCount / this.saveEveryTicks)
    ) {
      this.onAutoSave();
    }
  }
}
