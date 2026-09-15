export type ConditionId =
  | "blinded"
  | "charmed"
  | "deafened"
  | "frightened"
  | "grappled"
  | "incapacitated"
  | "invisible"
  | "paralyzed"
  | "petrified"
  | "poisoned"
  | "prone"
  | "restrained"
  | "stunned"
  | "unconscious"
  | "exhaustion";

export type DndCondition = {
  id: ConditionId;
  name: string;
  /** Resumo curto do Livro do Jogador (5e). */
  summary: string;
  color: string;
};

/** Condições oficiais do D&D 5e (Livro do Jogador). */
export const DND_CONDITIONS: DndCondition[] = [
  {
    id: "blinded",
    name: "Cego",
    summary:
      "Não enxerga; falha automaticamente testes que dependem de visão; ataques contra têm vantagem; seus ataques têm desvantagem.",
    color: "#4B5563",
  },
  {
    id: "charmed",
    name: "Enfeitiçado",
    summary:
      "Não pode atacar o encantador nem mirá-lo com efeitos nocivos; o encantador tem vantagem em interações sociais.",
    color: "#DB2777",
  },
  {
    id: "deafened",
    name: "Surdo",
    summary: "Não ouve; falha automaticamente testes que dependem de audição.",
    color: "#78716C",
  },
  {
    id: "frightened",
    name: "Amedrontado",
    summary:
      "Desvantagem em testes e ataques enquanto a fonte do medo estiver à vista; não pode se aproximar voluntariamente dela.",
    color: "#7C3AED",
  },
  {
    id: "grappled",
    name: "Agarrado",
    summary:
      "Deslocamento 0; termina se o agarrador for incapacitado ou se ambos forem separados.",
    color: "#B45309",
  },
  {
    id: "incapacitated",
    name: "Incapacitado",
    summary: "Não pode realizar ações nem reações.",
    color: "#64748B",
  },
  {
    id: "invisible",
    name: "Invisível",
    summary:
      "Impossível de ver sem magia especial; ataques contra têm desvantagem; seus ataques têm vantagem.",
    color: "#67E8F9",
  },
  {
    id: "paralyzed",
    name: "Paralisado",
    summary:
      "Incapacitado, não pode se mover nem falar; falha automaticamente testes de Força e Destreza; ataques contra têm vantagem; acertos a 1,5 m são críticos.",
    color: "#2563EB",
  },
  {
    id: "petrified",
    name: "Petrificado",
    summary:
      "Transformado em substância sólida; incapacitado, peso ×10; resistência a todos os danos; imune a veneno e doença.",
    color: "#A8A29E",
  },
  {
    id: "poisoned",
    name: "Envenenado",
    summary: "Desvantagem em jogadas de ataque e testes de atributo.",
    color: "#16A34A",
  },
  {
    id: "prone",
    name: "Caído",
    summary:
      "Só se arrasta salvo se levantar; desvantagem em ataques; ataques corpo a corpo contra têm vantagem; à distância têm desvantagem.",
    color: "#CA8A04",
  },
  {
    id: "restrained",
    name: "Impedido",
    summary:
      "Deslocamento 0; ataques e testes de Destreza com desvantagem; ataques contra têm vantagem.",
    color: "#C2410C",
  },
  {
    id: "stunned",
    name: "Atordoado",
    summary:
      "Incapacitado, não pode se mover e fala hesitante; falha automaticamente testes de Força e Destreza; ataques contra têm vantagem.",
    color: "#EAB308",
  },
  {
    id: "unconscious",
    name: "Inconsciente",
    summary:
      "Incapacitado, caído, não se move nem fala; falha testes de Força/Destreza; ataques contra têm vantagem; acertos a 1,5 m são críticos.",
    color: "#1E3A8A",
  },
  {
    id: "exhaustion",
    name: "Exaustão",
    summary:
      "Níveis 1–6 com efeitos cumulativos (desvantagem, velocidade, etc.). Remova níveis com descanso longo.",
    color: "#44403C",
  },
];

export function getCondition(id: string): DndCondition | undefined {
  return DND_CONDITIONS.find((item) => item.id === id);
}

export function isConditionId(value: string): value is ConditionId {
  return DND_CONDITIONS.some((item) => item.id === value);
}
