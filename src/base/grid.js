import { BUILDINGS, getBuildingLevel, getUpgradeCost } from "./buildings.js";

export class BaseGrid {
  constructor({ wallet, profile, size = 10, matrix } = {}) {
    this.wallet = wallet;
    this.profile = profile;
    this.size = size;
    this.matrix = this.normalizeMatrix(matrix);
    this.onChange = () => {};
  }

  normalizeMatrix(matrix) {
    return Array.from({ length: this.size }, (_, y) =>
      Array.from({ length: this.size }, (_, x) => {
        const cell = matrix?.[y]?.[x] ?? null;
        if (!cell) return null;
        const schema = BUILDINGS[cell.type];
        if (!schema) return null;
        return { type: schema.type, level: getBuildingLevel(cell) };
      }),
    );
  }

  setChangeHandler(handler) {
    this.onChange = handler;
  }

  findNextEmptySlot() {
    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        if (!this.matrix[y][x]) return { x, y };
      }
    }
    return null;
  }

  placeBuilding(x, y, type) {
    const schema = BUILDINGS[type];
    if (!schema) return { ok: false, message: "Unknown building type." };
    if (!this.isInBounds(x, y))
      return { ok: false, message: "Build location is outside the base grid." };
    if (this.matrix[y][x])
      return { ok: false, message: "That grid slot is already occupied." };
    if (!this.wallet.deduct("aether", schema.cost))
      return { ok: false, message: `Need ${schema.cost} Aether.` };

    this.matrix[y][x] = { type: schema.type, level: schema.level };
    this.profile?.addXp(50 * schema.level);
    this.onChange(this.matrix);
    return { ok: true, message: `${schema.name} built.` };
  }

  upgradeBuilding(x, y) {
    if (!this.isInBounds(x, y))
      return {
        ok: false,
        message: "Upgrade location is outside the base grid.",
      };
    const building = this.matrix[y][x];
    const schema = BUILDINGS[building?.type];
    if (!building || !schema)
      return { ok: false, message: "No building to upgrade." };

    const currentLevel = getBuildingLevel(building);
    const cost = getUpgradeCost(building.type, currentLevel);
    if (!this.wallet.deduct("aether", cost))
      return { ok: false, message: `Need ${cost} Aether.` };

    building.level = currentLevel + 1;
    this.profile?.addXp(50 * building.level);
    this.onChange(this.matrix);
    return {
      ok: true,
      message: `${schema.name} upgraded to Lv.${building.level}.`,
    };
  }

  isInBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }
}
