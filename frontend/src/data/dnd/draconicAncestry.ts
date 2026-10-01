export const DRACONIC_ANCESTRY_KEY = "sorcerer:draconic-ancestry";

export type DraconicBreathShape = "line" | "cone";

export interface DraconicAncestry {
  id: string;
  name: string;
  damageType: string;
  breathShape: DraconicBreathShape;
}

export const DRACONIC_ANCESTRIES: DraconicAncestry[] = [
  { id: "black", name: "Dragão Negro", damageType: "ácido", breathShape: "line" },
  { id: "blue", name: "Dragão Azul", damageType: "elétrico", breathShape: "line" },
  { id: "brass", name: "Dragão de Brass", damageType: "fogo", breathShape: "line" },
  { id: "bronze", name: "Dragão de Bronze", damageType: "elétrico", breathShape: "line" },
  { id: "copper", name: "Dragão de Cobre", damageType: "ácido", breathShape: "line" },
  { id: "gold", name: "Dragão de Ouro", damageType: "fogo", breathShape: "cone" },
  { id: "green", name: "Dragão Verde", damageType: "veneno", breathShape: "cone" },
  { id: "red", name: "Dragão Vermelho", damageType: "fogo", breathShape: "cone" },
  { id: "silver", name: "Dragão de Prata", damageType: "frio", breathShape: "cone" },
  { id: "white", name: "Dragão Branco", damageType: "frio", breathShape: "cone" },
];

export function getDraconicAncestryById(
  id: string | null | undefined
): DraconicAncestry | undefined {
  const key = String(id ?? "").trim();
  return key ? DRACONIC_ANCESTRIES.find((entry) => entry.id === key) : undefined;
}

export function formatDraconicBreathWeapon(ancestry: DraconicAncestry): string {
  if (ancestry.breathShape === "line") {
    return "Sopro em linha de 9 m × 1,5 m (CD 8 + CON + proficiência; 2d6, aumenta com o nível).";
  }
  return "Sopro em cone de 4,5 m (CD 8 + CON + proficiência; 2d6, aumenta com o nível).";
}

export function getDraconicAncestry(
  featureChoices: Record<string, string[]> | undefined
): DraconicAncestry | undefined {
  const id = featureChoices?.[DRACONIC_ANCESTRY_KEY]?.[0];
  return getDraconicAncestryById(id);
}
