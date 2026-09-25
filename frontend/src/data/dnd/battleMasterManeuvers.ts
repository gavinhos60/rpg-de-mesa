export const BATTLE_MASTER_MANEUVERS_KEY = "fighter:battle-master-maneuvers";
export const MARTIAL_ADEPT_MANEUVERS_KEY = "feat:martial-adept-maneuvers";

export interface BattleManeuver {
  id: string;
  name: string;
  description: string;
}

/** Manobras do Mestre de Batalha (PHB 2014). */
export const BATTLE_MASTER_MANEUVERS: BattleManeuver[] = [
  { id: "commanders-strike", name: "Ataque do Comandante", description: "Aliado usa reação para atacar; gaste um dado de superioridade." },
  { id: "disarming-attack", name: "Ataque Desarmante", description: "Alvo faz salvaguarda de Força ou larga um item." },
  { id: "distracting-strike", name: "Ataque Distraído", description: "Próximo aliado tem vantagem contra o alvo até seu próximo turno." },
  { id: "evasive-footwork", name: "Passo Evasivo", description: "Soma o dado de superioridade ao deslocamento neste turno." },
  { id: "feinting-attack", name: "Ataque Fintado", description: "Vantagem no próximo ataque contra alvo a 1,5 m." },
  { id: "goading-attack", name: "Ataque Provocador", description: "Alvo tem desvantagem contra outros e deve atacá-lo se puder." },
  { id: "lunging-attack", name: "Ataque Estendido", description: "Aumenta alcance em 1,5 m e soma dado ao dano." },
  { id: "maneuvering-attack", name: "Ataque Manobrador", description: "Aliado se desloca metade da velocidade sem provocar do alvo." },
  { id: "menacing-attack", name: "Ataque Amedrontador", description: "Alvo faz salvaguarda de Sabedoria ou fica amedrontado." },
  { id: "parry", name: "Aparar", description: "Reação: soma dado + Destreza para reduzir dano corpo a corpo." },
  { id: "precision-attack", name: "Ataque Preciso", description: "Soma dado a um ataque que erraria por pouco." },
  { id: "pushing-attack", name: "Ataque Empurrador", description: "Alvo Grande ou menor é empurrado 4,5 m se falhar Força." },
  { id: "rally", name: "Incentivar", description: "Aliado recupera PV iguais ao dado + modificador de Carisma." },
  { id: "riposte", name: "Riposte", description: "Reação a um erro: contra-ataque com dado extra de dano." },
  { id: "sweeping-attack", name: "Ataque Varredor", description: "Dano do dado também atinge outra criatura a 1,5 m do alvo." },
  { id: "trip-attack", name: "Ataque Derrubador", description: "Alvo faz salvaguarda de Força ou cai." },
];

export function getBattleManeuverLimit(fighterLevel: number): number {
  if (fighterLevel >= 15) return 9;
  if (fighterLevel >= 10) return 7;
  if (fighterLevel >= 7) return 5;
  if (fighterLevel >= 3) return 3;
  return 0;
}

export function superiorityDieSize(fighterLevel: number): string {
  if (fighterLevel >= 18) return "d12";
  if (fighterLevel >= 10) return "d10";
  return "d8";
}

export function superiorityDiceMax(fighterLevel: number): number {
  if (fighterLevel >= 15) return 6;
  if (fighterLevel >= 7) return 5;
  if (fighterLevel >= 3) return 4;
  return 0;
}

export function getSelectedManeuvers(
  featureChoices: Record<string, string[]> | undefined
): string[] {
  return (featureChoices?.[BATTLE_MASTER_MANEUVERS_KEY] ?? []).filter(Boolean);
}

export function getBattleManeuver(id: string): BattleManeuver | undefined {
  return BATTLE_MASTER_MANEUVERS.find((item) => item.id === id);
}
