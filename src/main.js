import { GameLoop, calculateOfflineProgress } from "../engine/gameLoop.js";
import { saveGame, loadGame, wipeSave } from "../engine/saveSystem.js";
import { BaseGrid } from "./base/grid.js";
import { Wallet } from "./economy/wallet.js";
import { UnitFactory } from "./units/factory.js";
import { CombatSimulator } from "./combat/simulator.js";
import { HudManager } from "../ui/hudManager.js";

window.addEventListener("DOMContentLoaded", () => {
  const saved = loadGame();
  const wallet = new Wallet(saved.wallet.aether);
  const grid = new BaseGrid({ wallet, matrix: saved.grid.matrix });
  const unitFactory = new UnitFactory({
    wallet,
    activeFleet: saved.fleet.count,
  });
  const gameState = { wallet, grid, unitFactory };
  const offlineProgress = calculateOfflineProgress(
    grid,
    saved.lastSavedTimestamp,
  );
  if (offlineProgress.aether > 0) wallet.addAether(offlineProgress.aether);
  let hud;

  const persist = () => saveGame(gameState);
  const gameLoop = new GameLoop({ wallet, grid, onAutoSave: persist });
  const combat = new CombatSimulator({
    wallet,
    unitFactory,
    onChange: (message) => {
      hud.setLog(message);
      persist();
      gameLoop.notify("combat");
    },
  });

  hud = new HudManager({
    wallet,
    grid,
    unitFactory,
    combat,
    onBuildRefinery: () => {
      const slot = grid.findNextEmptySlot();
      const result = slot
        ? grid.placeBuilding(slot.x, slot.y, "refinery")
        : { ok: false, message: "Base grid is full." };
      hud.setLog(result.message);
      gameLoop.notify("build");
    },
    onTrainAirship: () => {
      const result = unitFactory.trainAirship();
      hud.setLog(result.message);
      gameLoop.notify("train");
    },
    onRaidClouds: () => {
      const result = combat.raidClouds();
      hud.setLog(result.message);
      gameLoop.notify("raid");
    },
    onUpgradeBuilding: (x, y) => {
      const result = grid.upgradeBuilding(x, y);
      hud.setLog(result.message);
      gameLoop.notify("upgrade");
    },
    onWipeSave: () => {
      wipeSave();
      wallet.setAether(0);
      grid.matrix = grid.normalizeMatrix(null);
      unitFactory.activeFleet = [];
      unitFactory.queue = [];
      hud.setLog("Save wiped. Fresh base ready.");
      gameLoop.notify("wipe");
    },
  });

  grid.setChangeHandler(() => persist());
  unitFactory.setChangeHandler(() => persist());
  gameLoop.subscribe((snapshot) => {
    if (snapshot.reason === "tick") unitFactory.tick();
  });
  gameLoop.subscribe(() => hud.render());

  hud.render();
  if (offlineProgress.offlineSeconds > 60 && offlineProgress.aether > 0) {
    hud.showOfflineProgress(offlineProgress.aether);
  }
  persist();
  gameLoop.start();
});
