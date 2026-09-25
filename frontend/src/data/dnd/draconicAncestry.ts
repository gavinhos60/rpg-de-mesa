export const DRACONIC_ANCESTRY_KEY = "sorcerer:draconic-ancestry";

export interface DraconicAncestry {
  id: string;
  name: string;
  damageType: string;
}

export const DRACONIC_ANCESTRIES: DraconicAncestry[] = [
  { id: "black", name: "Dragão Negro", damageType: "ácido" },
  { id: "blue", name: "Dragão Azul", damageType: "elétrico" },
  { id: "brass", name: "Dragão de Brass", damageType: "fogo" },
  { id: "bronze", name: "Dragão de Bronze", damageType: "elétrico" },
  { id: "copper", name: "Dragão de Cobre", damageType: "ácido" },
  { id: "gold", name: "Dragão de Ouro", damageType: "fogo" },
  { id: "green", name: "Dragão Verde", damageType: "veneno" },
  { id: "red", name: "Dragão Vermelho", damageType: "fogo" },
  { id: "silver", name: "Dragão de Prata", damageType: "frio" },
  { id: "white", name: "Dragão Branco", damageType: "frio" },
];

export function getDraconicAncestry(
  featureChoices: Record<string, string[]> | undefined
): DraconicAncestry | undefined {
  const id = featureChoices?.[DRACONIC_ANCESTRY_KEY]?.[0];
  if (!id) return undefined;
  return DRACONIC_ANCESTRIES.find((item) => item.id === id);
}
