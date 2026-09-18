import type { CharacterFormData } from "../../types/character";

export const WARLOCK_INVOCATIONS_KEY = "warlock:eldritch-invocations";
export const WARLOCK_PACT_BOON_KEY = "warlock:pact-boon";

export interface EldritchInvocation {
  id: string;
  name: string;
  minLevel: number;
  description: string;
  /** Truque que o bruxo precisa conhecer. */
  requiresCantrip?: string;
  /** Dádiva de pacto necessária. */
  requiresPactBoon?: PactBoonId;
}

export type PactBoonId = "pact-of-the-chain" | "pact-of-the-blade" | "pact-of-the-tome";

export interface PactBoon {
  id: PactBoonId;
  name: string;
  description: string;
}

/** Número de invocações conhecidas por nível de bruxo (PHB). */
const INVOCATION_LIMIT_BY_LEVEL: readonly { minLevel: number; count: number }[] = [
  { minLevel: 18, count: 8 },
  { minLevel: 15, count: 7 },
  { minLevel: 12, count: 6 },
  { minLevel: 9, count: 5 },
  { minLevel: 7, count: 4 },
  { minLevel: 5, count: 3 },
  { minLevel: 2, count: 2 },
];

export const PACT_BOONS: PactBoon[] = [
  {
    id: "pact-of-the-chain",
    name: "Pacto da Corrente",
    description:
      "Você aprende o truque Encontrar Familiar e pode conjurá-lo como ritual. Seu familiar é mais resistente e você pode usar sua ação para permitir que ele ataque.",
  },
  {
    id: "pact-of-the-blade",
    name: "Pacto da Lâmina",
    description:
      "Com uma ação, você pode criar uma arma de pacto em sua mão ou invocar uma arma vinculada. A arma usa Carisma para ataques e dano.",
  },
  {
    id: "pact-of-the-tome",
    name: "Pacto do Tomo",
    description:
      "Seu livro sombrio contém três truques à escolha de qualquer classe conjuradora. Eles não contam para o limite de truques do bruxo.",
  },
];

/** Invocações Místicas do PHB (2014). */
export const ELDRITCH_INVOCATIONS: EldritchInvocation[] = [
  {
    id: "agonizing-blast",
    name: "Explosão Agonizante",
    minLevel: 2,
    requiresCantrip: "eldritch-blast",
    description: "Adicione seu modificador de Carisma ao dano de Explosão Mística.",
  },
  {
    id: "armor-of-shadows",
    name: "Armadura das Sombras",
    minLevel: 2,
    description: "Você pode conjurar Armadura de Mago sobre si mesmo, à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "ascendant-step",
    name: "Passo Ascendente",
    minLevel: 9,
    description: "Você pode conjurar Levitação sobre si mesmo, à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "beast-speech",
    name: "Fala das Feras",
    minLevel: 2,
    description: "Você pode se comunicar telepaticamente com bestas a até 9 m, enquanto ambos puderem se ver.",
  },
  {
    id: "beguiling-influence",
    name: "Influência Sedutora",
    minLevel: 2,
    description: "Você ganha proficiência em Enganação e Persuasão.",
  },
  {
    id: "bewitching-whispers",
    name: "Sussurros Enfeitiçantes",
    minLevel: 7,
    description: "Você pode conjurar Compulsão uma vez por descanso longo sem gastar um espaço de magia.",
  },
  {
    id: "book-of-ancient-secrets",
    name: "Livro dos Segredos Antigos",
    minLevel: 2,
    requiresPactBoon: "pact-of-the-tome",
    description:
      "Escolha dois truques e dois rituais de 1º nível de qualquer lista. Seu tomo os contém e você pode conjurar os rituais como ritual.",
  },
  {
    id: "chains-of-carceri",
    name: "Correntes de Carceri",
    minLevel: 15,
    description: "Você pode conjurar Imobilizar Pessoa uma vez por descanso longo sem gastar um espaço de magia.",
  },
  {
    id: "devils-sight",
    name: "Visão do Diabo",
    minLevel: 2,
    description: "Você enxerga normalmente na escuridão, mágica ou comum, a até 36 m.",
  },
  {
    id: "dreadful-word",
    name: "Palavra Horripilante",
    minLevel: 7,
    description: "Você pode conjurar Confusão uma vez por descanso longo sem gastar um espaço de magia.",
  },
  {
    id: "eldritch-sight",
    name: "Visão Mística",
    minLevel: 2,
    description: "Você pode conjurar Detectar Magia à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "eldritch-spear",
    name: "Lança Mística",
    minLevel: 2,
    requiresCantrip: "eldritch-blast",
    description: "Quando você conjura Explosão Mística, o alcance aumenta para 90 m.",
  },
  {
    id: "eyes-of-the-rune-keeper",
    name: "Olhos do Guardião das Runas",
    minLevel: 2,
    description: "Você pode ler todas as escritas.",
  },
  {
    id: "fiendish-vigor",
    name: "Vigor Infernal",
    minLevel: 2,
    description: "Você pode conjurar Falsa Vida sobre si mesmo, à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "gaze-of-two-minds",
    name: "Olhar de Duas Mentes",
    minLevel: 2,
    description:
      "Com uma ação, toque uma criatura amigável e perceba pelos sentidos dela até o fim do seu próximo turno.",
  },
  {
    id: "lifedrinker",
    name: "Bebedor de Vida",
    minLevel: 12,
    requiresPactBoon: "pact-of-the-blade",
    description: "Sua arma de pacto causa +1d8 de dano necrótico, radiante ou de concussão (escolha ao ganhar).",
  },
  {
    id: "mask-of-many-faces",
    name: "Máscara de Muitos Rostos",
    minLevel: 2,
    description: "Você pode conjurar Disfarçar-se sobre si mesmo, à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "master-of-myriad-forms",
    name: "Mestre das Miríades de Formas",
    minLevel: 15,
    description: "Você pode conjurar Metamorfose sobre si mesmo, à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "minions-of-chaos",
    name: "Lacaios do Caos",
    minLevel: 9,
    description: "Você pode conjurar Convocar Elemental uma vez por descanso longo sem gastar um espaço de magia.",
  },
  {
    id: "misty-visions",
    name: "Visões Nebulosas",
    minLevel: 2,
    description: "Você pode conjurar Ilusão Menor à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "one-with-shadows",
    name: "Uno com as Sombras",
    minLevel: 15,
    description:
      "Quando estiver em área de penumbra ou escuridão, você pode conjurar Invisibilidade sobre si mesmo, à vontade.",
  },
  {
    id: "otherworldly-leap",
    name: "Salto de Outro Mundo",
    minLevel: 9,
    description: "Você pode conjurar Salto sobre si mesmo, à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "repelling-blast",
    name: "Explosão Repulsiva",
    minLevel: 2,
    requiresCantrip: "eldritch-blast",
    description: "Quando você acerta com Explosão Mística, empurra o alvo 3 m para trás.",
  },
  {
    id: "sculptor-of-flesh",
    name: "Escultor de Carne",
    minLevel: 7,
    description: "Você pode conjurar Polimorfar uma vez por descanso longo sem gastar um espaço de magia.",
  },
  {
    id: "sign-of-ill-omen",
    name: "Sinal do Mau Agouro",
    minLevel: 15,
    description: "Você pode conjurar Adivinhação uma vez por descanso longo sem gastar um espaço de magia.",
  },
  {
    id: "thief-of-five-fates",
    name: "Ladrão dos Cinco Destinos",
    minLevel: 2,
    description: "Você pode conjurar Amarrar uma vez por descanso longo sem gastar um espaço de magia.",
  },
  {
    id: "thirsting-blade",
    name: "Lâmina Sedenta",
    minLevel: 5,
    requiresPactBoon: "pact-of-the-blade",
    description: "Você pode atacar duas vezes, em vez de uma, quando usar a ação Atacar com sua arma de pacto.",
  },
  {
    id: "visions-of-distant-realms",
    name: "Visões de Reinos Distantes",
    minLevel: 15,
    description: "Você pode conjurar Olho Arcano à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "voice-of-the-chain-master",
    name: "Voz do Mestre da Corrente",
    minLevel: 2,
    requiresPactBoon: "pact-of-the-chain",
    description:
      "Você pode se comunicar telepaticamente com seu familiar e perceber pelos sentidos dele a qualquer distância.",
  },
  {
    id: "whispers-of-the-grave",
    name: "Sussurros da Sepultura",
    minLevel: 9,
    description: "Você pode conjurar Falar com os Mortos à vontade, sem gastar um espaço de magia.",
  },
  {
    id: "witch-sight",
    name: "Visão de Bruxa",
    minLevel: 15,
    description: "Você pode ver a verdadeira forma de metamorfos e ilusões a até 9 m.",
  },
];

export function getEldritchInvocationLimit(warlockLevel: number): number {
  for (const entry of INVOCATION_LIMIT_BY_LEVEL) {
    if (warlockLevel >= entry.minLevel) {
      return entry.count;
    }
  }
  return 0;
}

export function getSelectedEldritchInvocations(
  featureChoices: Record<string, string[]> | undefined
): string[] {
  return (featureChoices?.[WARLOCK_INVOCATIONS_KEY] ?? []).filter(Boolean);
}

export function getPactBoon(
  featureChoices: Record<string, string[]> | undefined
): PactBoonId | null {
  const raw = featureChoices?.[WARLOCK_PACT_BOON_KEY]?.[0];
  if (raw === "pact-of-the-chain" || raw === "pact-of-the-blade" || raw === "pact-of-the-tome") {
    return raw;
  }
  return null;
}

export function getEldritchInvocation(id: string): EldritchInvocation | undefined {
  return ELDRITCH_INVOCATIONS.find((item) => item.id === id);
}

export function getWarlockCantrips(data: CharacterFormData): string[] {
  return data.spells.byClass.warlock?.cantrips ?? [];
}

export function canTakeEldritchInvocation(
  invocation: EldritchInvocation,
  warlockLevel: number,
  selectedIds: string[],
  pactBoon: PactBoonId | null,
  cantrips: string[]
): boolean {
  if (warlockLevel < invocation.minLevel) return false;
  if (selectedIds.includes(invocation.id)) return true;
  if (invocation.requiresPactBoon && pactBoon !== invocation.requiresPactBoon) {
    return false;
  }
  if (invocation.requiresCantrip && !cantrips.includes(invocation.requiresCantrip)) {
    return false;
  }
  return true;
}

export function getAvailableEldritchInvocations(
  warlockLevel: number,
  selectedIds: string[],
  pactBoon: PactBoonId | null,
  cantrips: string[]
): EldritchInvocation[] {
  return ELDRITCH_INVOCATIONS.filter((invocation) =>
    canTakeEldritchInvocation(invocation, warlockLevel, selectedIds, pactBoon, cantrips)
  );
}

export function getWarlockChoicesIssues(
  data: CharacterFormData,
  warlockLevel: number
): string[] {
  const issues: string[] = [];
  const pactBoon = getPactBoon(data.featureChoices);
  const selected = getSelectedEldritchInvocations(data.featureChoices);
  const cantrips = getWarlockCantrips(data);
  const limit = getEldritchInvocationLimit(warlockLevel);

  if (warlockLevel >= 3 && !pactBoon) {
    issues.push("Escolha a Dádiva de Pacto do bruxo.");
  }

  if (warlockLevel >= 2 && selected.length < limit) {
    issues.push(
      `Escolha ${limit} Invocação${limit === 1 ? "" : "ões"} Mística${limit === 1 ? "" : "s"}.`
    );
  }

  selected.forEach((id) => {
    const invocation = getEldritchInvocation(id);
    if (!invocation) {
      issues.push("Remova uma invocação mística inválida.");
      return;
    }
    if (!canTakeEldritchInvocation(invocation, warlockLevel, selected, pactBoon, cantrips)) {
      issues.push(`A invocação "${invocation.name}" não cumpre os pré-requisitos.`);
    }
  });

  return issues;
}
