const SUPPORTED_CURRENCIES = ["aether", "chronium"];

export class Wallet {
  constructor(balances = {}) {
    const startingBalances =
      typeof balances === "number" ? { aether: balances } : balances;
    this.balances = SUPPORTED_CURRENCIES.reduce(
      (normalized, currency) => ({
        ...normalized,
        [currency]: normalizeAmount(startingBalances?.[currency]),
      }),
      {},
    );
  }

  get aether() {
    return this.balances.aether;
  }

  get chronium() {
    return this.balances.chronium;
  }

  add(currency, amount) {
    const type = normalizeCurrency(currency);
    this.balances[type] = this.getBalance(type) + normalizeAmount(amount);
    return this.balances[type];
  }

  deduct(currency, amount) {
    const type = normalizeCurrency(currency);
    const cost = normalizeAmount(amount);
    if (!this.hasEnough(type, cost)) return false;
    this.balances[type] -= cost;
    return true;
  }

  hasEnough(currency, amount) {
    const type = normalizeCurrency(currency);
    return this.getBalance(type) >= normalizeAmount(amount);
  }

  getBalance(currency) {
    return this.balances[normalizeCurrency(currency)] ?? 0;
  }

  set(currency, amount) {
    const type = normalizeCurrency(currency);
    this.balances[type] = normalizeAmount(amount);
    return this.balances[type];
  }

  addAether(amount) {
    return this.add("aether", amount);
  }

  canAfford(currency, amount) {
    return amount === undefined
      ? this.hasEnough("aether", currency)
      : this.hasEnough(currency, amount);
  }

  spendAether(cost) {
    return this.deduct("aether", cost);
  }

  setAether(amount) {
    return this.set("aether", amount);
  }
}

function normalizeCurrency(currency) {
  return SUPPORTED_CURRENCIES.includes(currency) ? currency : "aether";
}

function normalizeAmount(amount) {
  return Math.max(0, Math.floor(Number(amount) || 0));
}
