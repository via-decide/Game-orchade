const STORAGE_KEY = "zayvora-mvp-save";

export function saveGame({ wallet, profile, grid, unitFactory }) {
  try {
    const now = Date.now();
    const payload = {
      version: 1,
      savedAt: now,
      lastSavedTimestamp: now,
      wallet: { balances: normalizeBalances(wallet?.balances) },
      profile: normalizeProfile(profile),
      grid: { matrix: serializeGridMatrix(grid?.matrix) },
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
      lastSavedTimestamp: normalizeTimestamp(
        parsed.lastSavedTimestamp ?? parsed.savedAt,
      ),
      wallet: {
        balances: normalizeBalances(parsed.wallet?.balances ?? parsed.wallet),
      },
      profile: normalizeProfile(parsed.profile),
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

function normalizeBalances(balances = {}) {
  return {
    aether: Math.max(0, Math.floor(Number(balances?.aether) || 0)),
    chronium: Math.max(0, Math.floor(Number(balances?.chronium) || 0)),
  };
}

function normalizeProfile(profile = {}) {
  return {
    level: Math.max(1, Math.floor(Number(profile?.level) || 1)),
    xp: Math.max(0, Math.floor(Number(profile?.xp) || 0)),
  };
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

function normalizeTimestamp(timestamp) {
  const normalized = Number(timestamp);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
}

function createDefaultSave() {
  return {
    lastSavedTimestamp: null,
    wallet: { balances: { aether: 0, chronium: 0 } },
    profile: { level: 1, xp: 0 },
    grid: { matrix: null },
    fleet: { count: 0 },
  };
}
