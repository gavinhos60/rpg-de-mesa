export const FIGHTING_STYLE_KEY = "class:fighting-style";
export const FIGHTING_STYLE_2_KEY = "class:fighting-style-2";

export interface FightingStyleOption {
  id: string;
  name: string;
  description: string;
  /** Classes PHB que podem escolher esta opção. */
  classes: Array<"fighter" | "paladin" | "ranger">;
}

export const FIGHTING_STYLES: FightingStyleOption[] = [
  {
    id: "archery",
    name: "Arquearia",
    description: "+2 em jogadas de ataque com armas à distância.",
    classes: ["fighter", "ranger"],
  },
  {
    id: "defense",
    name: "Defesa",
    description: "+1 de CA enquanto estiver usando armadura.",
    classes: ["fighter", "paladin", "ranger"],
  },
  {
    id: "dueling",
    name: "Duelismo",
    description: "+2 de dano com armas corpo a corpo em uma mão e nenhuma outra arma.",
    classes: ["fighter", "paladin", "ranger"],
  },
  {
    id: "great-weapon-fighting",
    name: "Combate com Armas Grandes",
    description:
      "Ao rolar 1 ou 2 no dano de armas corpo a corpo de duas mãos, pode rerrolar o dado (uma vez).",
    classes: ["fighter", "paladin"],
  },
  {
    id: "protection",
    name: "Proteção",
    description:
      "Com escudo, use reação para impor desvantagem no ataque contra aliado a 1,5 m (exceto você).",
    classes: ["fighter", "paladin"],
  },
  {
    id: "two-weapon-fighting",
    name: "Combate com Duas Armas",
    description:
      "Ao lutar com duas armas, soma o modificador de habilidade ao dano da segunda arma.",
    classes: ["fighter", "ranger"],
  },
];

export function fightingStylesForClass(
  classId: "fighter" | "paladin" | "ranger"
): FightingStyleOption[] {
  return FIGHTING_STYLES.filter((style) => style.classes.includes(classId));
}

export function getFightingStyle(id: string | undefined): FightingStyleOption | undefined {
  if (!id) return undefined;
  return FIGHTING_STYLES.find((style) => style.id === id);
}
