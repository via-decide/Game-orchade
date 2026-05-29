const STORAGE_KEY = "zayvora-mvp-save";

export function saveGame({ wallet, grid, unitFactory }) {
  try {
    const payload = {
      version: 1,
      savedAt: Date.now(),
      wallet: { aether: wallet?.aether ?? 0 },
      grid: { matrix: serializeGridMatrix(grid?.matrix) },
      grid: { matrix: grid?.matrix ?? [] },
      fleet: { count: unitFactory?.getFleetCount?.() ?? 0 },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultSave();
    const parsed = JSON.parse(raw);
    return {
      wallet: { aether: Math.max(0, Number(parsed.wallet?.aether) || 0) },
      grid: { matrix: parsed.grid?.matrix ?? null },
      fleet: { count: Math.max(0, Number(parsed.fleet?.count) || 0) },
    };
  } catch {
    return createDefaultSave();
  }
}

export function wipeSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

function serializeGridMatrix(matrix) {
  if (!Array.isArray(matrix)) return [];
  return matrix.map((row) =>
    Array.isArray(row)
      ? row.map((cell) =>
          cell
            ? {
                type: cell.type,
                level: Math.max(1, Math.floor(Number(cell.level) || 1)),
              }
            : null,
        )
      : [],
  );
}

function createDefaultSave() {
  return {
    wallet: { aether: 0 },
    grid: { matrix: null },
    fleet: { count: 0 },
  };
}
