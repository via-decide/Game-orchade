export class CombatSimulator {
  constructor({
    wallet,
    unitFactory,
    reward = 500,
    raidMs = 3000,
    onChange,
  } = {}) {
    this.wallet = wallet;
    this.unitFactory = unitFactory;
    this.reward = reward;
    this.raidMs = raidMs;
    this.onChange = onChange ?? (() => {});
    this.raidInProgress = false;
  }

  raidClouds() {
    if (this.raidInProgress)
      return { ok: false, message: "Raid already in progress." };
    if (this.unitFactory.getFleetCount() < 1)
      return { ok: false, message: "Train at least one 🛩️ before raiding." };

    this.unitFactory.consumeFleet();
    this.raidInProgress = true;
    this.onChange("Raid launched into the ☁️...", this.raidInProgress);

    setTimeout(() => {
      this.wallet.add("aether", this.reward);
      this.raidInProgress = false;
      this.onChange(
        `Raid successful! +${this.reward} Aether`,
        this.raidInProgress,
      );
    }, this.raidMs);

    return { ok: true, message: "Raid launched into the ☁️..." };
  }
}
