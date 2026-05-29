export class PlayerProfile {
  constructor({ level = 1, xp = 0 } = {}) {
    this.level = Math.max(1, Math.floor(Number(level) || 1));
    this.xp = Math.max(0, Math.floor(Number(xp) || 0));
  }

  addXp(amount) {
    const gainedXp = Math.max(0, Math.floor(Number(amount) || 0));
    if (gainedXp === 0)
      return { leveledUp: false, level: this.level, xp: this.xp };

    const previousLevel = this.level;
    this.xp += gainedXp;
    while (this.xp >= this.getXpRequiredForNextLevel()) {
      this.level += 1;
    }

    const leveledUp = this.level > previousLevel;
    if (leveledUp) this.emitLevelUp(previousLevel);
    return { leveledUp, level: this.level, xp: this.xp };
  }

  getXpRequiredForNextLevel() {
    return Math.floor(100 * this.level ** 1.5);
  }

  emitLevelUp(previousLevel) {
    if (typeof window === "undefined" || typeof CustomEvent === "undefined")
      return;
    window.dispatchEvent(
      new CustomEvent("player-profile-level-up", {
        detail: {
          previousLevel,
          level: this.level,
          xp: this.xp,
          nextLevelXp: this.getXpRequiredForNextLevel(),
        },
      }),
    );
  }
}
