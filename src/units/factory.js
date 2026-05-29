export const UNITS = {
  corsairAirship: {
    type: "corsairAirship",
    name: "Corsair Airship",
    cost: 100,
    buildTime: 5,
    icon: "🛩️",
  },
};

export class UnitFactory {
  constructor({ wallet, activeFleet = 0, queue } = {}) {
    this.wallet = wallet;
    this.activeFleet = Array.from(
      { length: Math.max(0, Number(activeFleet) || 0) },
      () => ({
        type: UNITS.corsairAirship.type,
      }),
    );
    this.queue = Array.isArray(queue) ? queue : [];
    this.onChange = () => {};
  }

  setChangeHandler(handler) {
    this.onChange = handler;
  }

  trainAirship() {
    const unit = UNITS.corsairAirship;
    if (!this.wallet.spendAether(unit.cost))
      return { ok: false, message: `Need ${unit.cost} Aether.` };
    this.queue.push({ type: unit.type, remaining: unit.buildTime });
    this.onChange();
    return { ok: true, message: `${unit.name} production started.` };
  }

  tick() {
    if (this.queue.length === 0) return;
    for (const item of this.queue) item.remaining -= 1;
    const completed = this.queue.filter((item) => item.remaining <= 0);
    this.queue = this.queue.filter((item) => item.remaining > 0);
    for (const item of completed) this.activeFleet.push({ type: item.type });
    this.onChange();
  }

  consumeFleet() {
    const count = this.activeFleet.length;
    this.activeFleet = [];
    this.onChange();
    return count;
  }

  getFleetCount() {
    return this.activeFleet.length;
  }
}
