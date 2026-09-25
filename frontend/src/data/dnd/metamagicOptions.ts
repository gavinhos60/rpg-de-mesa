export const SORCERER_METAMAGIC_KEY = "sorcerer:metamagic";

export interface MetamagicOption {
  id: string;
  name: string;
  description: string;
  cost: string;
}

export const METAMAGIC_OPTIONS: MetamagicOption[] = [
  { id: "careful", name: "Magia Cuidadosa", cost: "1 ponto", description: "Aliados escolhidos passam automaticamente em salvaguardas da magia." },
  { id: "distant", name: "Magia Distante", cost: "1 ponto", description: "Dobra alcance; magias de toque viram 9 m." },
  { id: "empowered", name: "Magia Potente", cost: "1 ponto", description: "Rerrola até metade dos dados de dano (mínimo 1)." },
  { id: "extended", name: "Magia Estendida", cost: "1 ponto", description: "Dobra duração até 24 h se for 1 min ou mais." },
  { id: "heightened", name: "Magia Elevada", cost: "3 pontos", description: "Um alvo tem desvantagem na primeira salvaguarda." },
  { id: "quickened", name: "Magia Acelerada", cost: "2 pontos", description: "Conjura como ação bônus." },
  { id: "subtle", name: "Magia Sutil", cost: "1 ponto", description: "Conjura sem componentes somáticos ou verbais." },
  { id: "twinned", name: "Magia Gêmea", cost: "custo = nível", description: "Alvo uma criatura adicional (sem 1º se não for truque)." },
];

export function getMetamagicLimit(sorcererLevel: number): number {
  if (sorcererLevel >= 17) return 4;
  if (sorcererLevel >= 10) return 3;
  if (sorcererLevel >= 3) return 2;
  return 0;
}

export function getSelectedMetamagic(
  featureChoices: Record<string, string[]> | undefined
): string[] {
  return (featureChoices?.[SORCERER_METAMAGIC_KEY] ?? []).filter(Boolean);
}
