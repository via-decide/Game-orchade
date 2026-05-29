import {
  BUILDINGS,
  getBuildingLevel,
  getProductionRate,
  getUpgradeCost,
} from "../src/base/buildings.js";
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
    onUpgradeBuilding,
  }) {
    this.wallet = wallet;
    this.grid = grid;
    this.unitFactory = unitFactory;
    this.combat = combat;
    this.onBuildRefinery = onBuildRefinery;
    this.onTrainAirship = onTrainAirship;
    this.onRaidClouds = onRaidClouds;
    this.onWipeSave = onWipeSave;
    this.onUpgradeBuilding = onUpgradeBuilding;
    this.selectedCell = null;
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
      modal: document.getElementById("building-modal"),
      modalName: document.getElementById("modal-building-name"),
      modalLevel: document.getElementById("modal-building-level"),
      modalProduction: document.getElementById("modal-building-production"),
      upgradeBuilding: document.getElementById("upgrade-building-btn"),
      closeModal: document.getElementById("close-building-modal-btn"),
    };
  }

  bindEvents() {
    this.nodes.buildRefinery?.addEventListener("click", this.onBuildRefinery);
    this.nodes.trainAirship?.addEventListener("click", this.onTrainAirship);
    this.nodes.raidClouds?.addEventListener("click", this.onRaidClouds);
    this.nodes.wipeSave?.addEventListener("click", this.onWipeSave);
    this.nodes.closeModal?.addEventListener("click", () => this.closeModal());
    this.nodes.upgradeBuilding?.addEventListener("click", () => {
      if (!this.selectedCell) return;
      this.onUpgradeBuilding(this.selectedCell.x, this.selectedCell.y);
    });
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
    this.renderModal();
  }

  renderGrid() {
    const gridNode = this.nodes.grid;
    gridNode.innerHTML = "";
    this.grid.matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        const slot = document.createElement("button");
        const schema = BUILDINGS[cell?.type];
        slot.className = "grid-cell";
        slot.type = "button";
        slot.dataset.x = String(x);
        slot.dataset.y = String(y);
        slot.setAttribute(
          "aria-label",
          schema
            ? `${schema.name} level ${getBuildingLevel(cell)}`
            : `Empty slot ${y * this.grid.size + x + 1}`,
        );
        if (schema) {
          slot.classList.add("occupied");
          slot.addEventListener("click", () => this.openModal(x, y));
          slot.innerHTML = `<span class="building-icon">${schema.icon}</span><span class="building-level">Lv.${getBuildingLevel(cell)}</span>`;
        }
        gridNode.appendChild(slot);
      });
    });
  }

  openModal(x, y) {
    this.selectedCell = { x, y };
    this.nodes.modal.hidden = false;
    this.renderModal();
  }

  closeModal() {
    this.selectedCell = null;
    this.nodes.modal.hidden = true;
  }

  renderModal() {
    if (!this.selectedCell || this.nodes.modal.hidden) return;
    const { x, y } = this.selectedCell;
    const building = this.grid.matrix[y]?.[x];
    const schema = BUILDINGS[building?.type];
    if (!building || !schema) {
      this.closeModal();
      return;
    }

    const level = getBuildingLevel(building);
    const nextLevel = level + 1;
    const upgradeCost = getUpgradeCost(building.type, level);
    this.nodes.modalName.textContent = schema.name;
    this.nodes.modalLevel.textContent = `Current Level: Lv.${level}`;
    this.nodes.modalProduction.textContent = `Production: ${getProductionRate(building.type, level)} → ${getProductionRate(building.type, nextLevel)} Aether/tick`;
    this.nodes.upgradeBuilding.textContent = `Upgrade (Cost: ${upgradeCost} Aether)`;
    this.nodes.upgradeBuilding.disabled = !this.wallet.canAfford(upgradeCost);
  }

  setLog(message) {
    this.nodes.log.textContent = message;
  }

  formatQueue() {
    if (this.unitFactory.queue.length === 0) return "Production queue: idle";
    return `Production queue: ${this.unitFactory.queue.map((item) => `${UNITS[item.type].icon} ${item.remaining}s`).join(", ")}`;
  }
}
