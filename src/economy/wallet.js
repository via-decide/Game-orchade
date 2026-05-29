export class Wallet {
  constructor(aether = 0) {
    this.aether = Math.max(0, Math.floor(Number(aether) || 0));
  }

  addAether(amount) {
    this.aether += Math.max(0, Math.floor(Number(amount) || 0));
    return this.aether;
  }

  canAfford(cost) {
    return this.aether >= Math.max(0, Math.floor(Number(cost) || 0));
  }

  spendAether(cost) {
    const normalizedCost = Math.max(0, Math.floor(Number(cost) || 0));
    if (!this.canAfford(normalizedCost)) return false;
    this.aether -= normalizedCost;
    return true;
  }

  setAether(amount) {
    this.aether = Math.max(0, Math.floor(Number(amount) || 0));
    return this.aether;
  }
}
