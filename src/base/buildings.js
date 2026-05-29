export const BUILDINGS = {
  refinery: {
    type: "refinery",
    name: "Aether Refinery",
    cost: 50,
    baseProduction: 5,
    level: 1,
    icon: "🏭",
  },
};

export function getBuildingSchema(type) {
  return BUILDINGS[type] ?? null;
}

export function getBuildingLevel(building) {
  return Math.max(1, Math.floor(Number(building?.level) || 1));
}

export function getUpgradeCost(type, currentLevel = 1) {
  const schema = getBuildingSchema(type);
  if (!schema) return 0;
  const nextLevel = getBuildingLevel({ level: currentLevel }) + 1;
  return Math.ceil(schema.cost * nextLevel ** 1.5);
}

export function getProductionRate(type, level = 1) {
  const schema = getBuildingSchema(type);
  if (!schema) return 0;
  return schema.baseProduction * getBuildingLevel({ level });
}
