export const DRUID_LAND_TERRAIN_KEY = "druid:land-terrain";
export const DRUID_LAND_BONUS_CANTRIP_KEY = "druid:land-bonus-cantrip";

export interface LandTerrain {
  id: string;
  name: string;
}

export const LAND_TERRAINS: LandTerrain[] = [
  { id: "arctic", name: "Ártico" },
  { id: "coast", name: "Costa" },
  { id: "desert", name: "Deserto" },
  { id: "forest", name: "Floresta" },
  { id: "grassland", name: "Pradaria" },
  { id: "mountain", name: "Montanha" },
  { id: "swamp", name: "Pântano" },
  { id: "underdark", name: "Subterrâneo" },
];

/** Magias do círculo sempre preparadas por terreno (PHB). */
export const LAND_CIRCLE_SPELLS: Record<
  string,
  Array<{ minLevel: number; spells: string[] }>
> = {
  arctic: [
    { minLevel: 3, spells: ["hold-person", "spike-growth"] },
    { minLevel: 5, spells: ["sleet-storm", "slow"] },
    { minLevel: 7, spells: ["freedom-of-movement", "ice-storm"] },
    { minLevel: 9, spells: ["commune-with-nature", "cone-of-cold"] },
  ],
  coast: [
    { minLevel: 3, spells: ["mirror-image", "misty-step"] },
    { minLevel: 5, spells: ["water-breathing", "water-walk"] },
    { minLevel: 7, spells: ["control-water", "freedom-of-movement"] },
    { minLevel: 9, spells: ["conjure-elemental", "scrying"] },
  ],
  desert: [
    { minLevel: 3, spells: ["blur", "silence"] },
    { minLevel: 5, spells: ["create-food-and-water", "protection-from-energy"] },
    { minLevel: 7, spells: ["blight", "hallucinatory-terrain"] },
    { minLevel: 9, spells: ["insect-plague", "wall-of-stone"] },
  ],
  forest: [
    { minLevel: 3, spells: ["barkskin", "spider-climb"] },
    { minLevel: 5, spells: ["call-lightning", "plant-growth"] },
    { minLevel: 7, spells: ["divination", "freedom-of-movement"] },
    { minLevel: 9, spells: ["commune-with-nature", "tree-stride"] },
  ],
  grassland: [
    { minLevel: 3, spells: ["invisibility", "pass-without-trace"] },
    { minLevel: 5, spells: ["daylight", "haste"] },
    { minLevel: 7, spells: ["divination", "freedom-of-movement"] },
    { minLevel: 9, spells: ["dream", "insect-plague"] },
  ],
  mountain: [
    { minLevel: 3, spells: ["spider-climb", "spike-growth"] },
    { minLevel: 5, spells: ["lightning-bolt", "meld-into-stone"] },
    { minLevel: 7, spells: ["stone-shape", "stoneskin"] },
    { minLevel: 9, spells: ["passwall", "wall-of-stone"] },
  ],
  swamp: [
    { minLevel: 3, spells: ["darkness", "melfs-acid-arrow"] },
    { minLevel: 5, spells: ["water-walk", "stinking-cloud"] },
    { minLevel: 7, spells: ["freedom-of-movement", "locate-creature"] },
    { minLevel: 9, spells: ["insect-plague", "scrying"] },
  ],
  underdark: [
    { minLevel: 3, spells: ["spider-climb", "web"] },
    { minLevel: 5, spells: ["gaseous-form", "stinking-cloud"] },
    { minLevel: 7, spells: ["greater-invisibility", "stone-shape"] },
    { minLevel: 9, spells: ["cloudkill", "insect-plague"] },
  ],
};

export function getLandTerrainId(
  featureChoices: Record<string, string[]> | undefined
): string | undefined {
  return featureChoices?.[DRUID_LAND_TERRAIN_KEY]?.[0];
}

export function getLandCirclePreparedSpells(
  terrainId: string,
  druidLevel: number
): string[] {
  const groups = LAND_CIRCLE_SPELLS[terrainId] ?? [];
  return groups
    .filter((group) => druidLevel >= group.minLevel)
    .flatMap((group) => group.spells);
}
