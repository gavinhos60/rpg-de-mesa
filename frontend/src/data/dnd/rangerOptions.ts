export const RANGER_FAVORED_ENEMIES_KEY = "ranger:favored-enemies";
export const RANGER_FAVORED_TERRAINS_KEY = "ranger:favored-terrains";
export const RANGER_HUNTER_PREY_KEY = "ranger:hunter-prey";
export const RANGER_HUNTER_DEFENSE_KEY = "ranger:hunter-defense";
export const RANGER_HUNTER_MULTIATTACK_KEY = "ranger:hunter-multiattack";
export const RANGER_HUNTER_SUPERIOR_KEY = "ranger:hunter-superior";
export const RANGER_BEAST_COMPANION_KEY = "ranger:beast-companion";

export const FAVORED_ENEMY_TYPES = [
  { id: "aberrations", name: "Aberrações" },
  { id: "beasts", name: "Bestas" },
  { id: "celestials", name: "Celestiais" },
  { id: "constructs", name: "Constructos" },
  { id: "dragons", name: "Dragões" },
  { id: "elementals", name: "Elementais" },
  { id: "fey", name: "Fadas" },
  { id: "fiends", name: "Corruptores" },
  { id: "giants", name: "Gigantes" },
  { id: "monstrosities", name: "Monstruosidades" },
  { id: "oozes", name: "Limos" },
  { id: "plants", name: "Plantas" },
  { id: "undead", name: "Mortos-vivos" },
];

export const FAVORED_TERRAINS = [
  { id: "arctic", name: "Ártico" },
  { id: "coast", name: "Costa" },
  { id: "desert", name: "Deserto" },
  { id: "forest", name: "Floresta" },
  { id: "grassland", name: "Pradaria" },
  { id: "mountain", name: "Montanha" },
  { id: "swamp", name: "Pântano" },
  { id: "underdark", name: "Subterrâneo" },
];

export const HUNTER_PREY_OPTIONS = [
  { id: "colossus-slayer", name: "Assassino de Colossos", description: "+1d8 de dano uma vez por turno se o alvo não estiver com PV máximo." },
  { id: "horde-breaker", name: "Destruidor de Hordas", description: "Ataque adicional contra criatura a 1,5 m do alvo original." },
  { id: "giant-killer", name: "Matador de Gigantes", description: "Reação: ataque quando criatura Grande ou maior ataca você." },
];

export const HUNTER_DEFENSE_OPTIONS = [
  { id: "escape-horde", name: "Escapar da Horda", description: "Ataques de oportunidade com desvantagem contra você." },
  { id: "multiattack-defense", name: "Defesa Multiataque", description: "+4 CA contra ataques subsequentes do mesmo inimigo no turno dele." },
  { id: "steel-will", name: "Firmeza contra Imensos", description: "Vantagem em salvaguardas contra amedrontado." },
];

export const HUNTER_MULTIATTACK_OPTIONS = [
  { id: "volley", name: "Salva de Flechas", description: "Ataque à distância contra criaturas em área de 6 m." },
  { id: "whirlwind", name: "Ataque Giratório", description: "Ataque corpo a corpo contra criaturas a 1,5 m." },
];

export const HUNTER_SUPERIOR_OPTIONS = [
  { id: "evasion", name: "Esquiva", description: "Sem dano em Destreza bem-sucedida; metade se falhar." },
  { id: "stand-tide", name: "Firme contra a Maré", description: "Reação: redireciona ataque errado contra você para outra criatura." },
  { id: "uncanny-dodge", name: "Esquiva Sobrenatural", description: "Reação: metade do dano de um ataque que acertar você." },
];

export function favoredEnemyLimit(rangerLevel: number): number {
  if (rangerLevel >= 14) return 3;
  if (rangerLevel >= 6) return 2;
  if (rangerLevel >= 1) return 1;
  return 0;
}

export function favoredTerrainLimit(rangerLevel: number): number {
  if (rangerLevel >= 10) return 3;
  if (rangerLevel >= 6) return 2;
  if (rangerLevel >= 1) return 1;
  return 0;
}
