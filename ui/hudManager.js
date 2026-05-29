import { BUILDINGS } from "../src/base/buildings.js";
import { UNITS } from "../src/units/factory.js";

export class HudManager {
  constructor({
    wallet,
    grid,
    unitFactory,
    combat,
    onBuildRefinery,
    onTrainAirship,
    onRaidClouds,
    onWipeSave,
  }) {
    this.wallet = wallet;
    this.grid = grid;
    this.unitFactory = unitFactory;
    this.combat = combat;
    this.onBuildRefinery = onBuildRefinery;
    this.onTrainAirship = onTrainAirship;
    this.onRaidClouds = onRaidClouds;
    this.onWipeSave = onWipeSave;
    this.nodes = this.getNodes();
    this.bindEvents();
  }

  getNodes() {
    return {
      aether: document.getElementById("aether-balance"),
      fleet: document.getElementById("fleet-count"),
      queue: document.getElementById("production-queue"),
      grid: document.getElementById("base-grid"),
      log: document.getElementById("combat-log"),
      buildRefinery: document.getElementById("build-refinery-btn"),
      trainAirship: document.getElementById("train-airship-btn"),
      raidClouds: document.getElementById("raid-clouds-btn"),
      wipeSave: document.getElementById("wipe-save-btn"),
    };
  }

  bindEvents() {
    this.nodes.buildRefinery?.addEventListener("click", this.onBuildRefinery);
    this.nodes.trainAirship?.addEventListener("click", this.onTrainAirship);
    this.nodes.raidClouds?.addEventListener("click", this.onRaidClouds);
    this.nodes.wipeSave?.addEventListener("click", this.onWipeSave);
  }

  render() {
    this.nodes.aether.textContent = String(this.wallet.aether);
    this.nodes.fleet.textContent = `${UNITS.corsairAirship.icon} ${this.unitFactory.getFleetCount()}`;
    this.nodes.queue.textContent = this.formatQueue();
    this.nodes.buildRefinery.disabled = !this.wallet.canAfford(
      BUILDINGS.refinery.cost,
    );
    this.nodes.trainAirship.disabled = !this.wallet.canAfford(
      UNITS.corsairAirship.cost,
    );
    this.nodes.raidClouds.disabled =
      this.combat.raidInProgress || this.unitFactory.getFleetCount() < 1;
    this.renderGrid();
  }

  renderGrid() {
    const gridNode = this.nodes.grid;
    gridNode.innerHTML = "";
    this.grid.matrix.flat().forEach((cell, index) => {
      const slot = document.createElement("button");
      slot.className = "grid-cell";
      slot.type = "button";
      slot.setAttribute(
        "aria-label",
        cell
          ? (BUILDINGS[cell.type]?.name ?? "Building")
          : `Empty slot ${index + 1}`,
      );
      slot.textContent = cell ? (BUILDINGS[cell.type]?.icon ?? "🏭") : "";
      gridNode.appendChild(slot);
    });
  }

  setLog(message) {
    this.nodes.log.textContent = message;
  }

  formatQueue() {
    if (this.unitFactory.queue.length === 0) return "Production queue: idle";
    return `Production queue: ${this.unitFactory.queue.map((item) => `${UNITS[item.type].icon} ${item.remaining}s`).join(", ")}`;
  }
}
