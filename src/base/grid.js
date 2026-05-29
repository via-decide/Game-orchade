import { BUILDINGS } from "./buildings.js";

export class BaseGrid {
  constructor({ wallet, size = 10, matrix } = {}) {
    this.wallet = wallet;
    this.size = size;
    this.matrix = this.normalizeMatrix(matrix);
    this.onChange = () => {};
  }

  normalizeMatrix(matrix) {
    return Array.from({ length: this.size }, (_, y) =>
      Array.from({ length: this.size }, (_, x) => matrix?.[y]?.[x] ?? null),
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
    if (!this.wallet.spendAether(schema.cost))
      return { ok: false, message: `Need ${schema.cost} Aether.` };

    this.matrix[y][x] = { type: schema.type };
    this.onChange(this.matrix);
    return { ok: true, message: `${schema.name} built.` };
  }

  isInBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }
}
