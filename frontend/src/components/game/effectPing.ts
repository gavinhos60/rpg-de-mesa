/** Efeitos de ping no estilo Roll20 (aura / feixe / foguete / queimar / brilho). */

export type FxPingKind = "breathe" | "beam" | "rocket" | "burn" | "glow";
export type FxPingElement =
  | "fire"
  | "charm"
  | "acid"
  | "death"
  | "holy"
  | "blood"
  | "frost"
  | "slime"
  | "smoke"
  | "water"
  | "magic";

export type FxFade = "instant" | "stay";

export type EffectSettings = {
  kind: FxPingKind;
  element: FxPingElement;
  fade: FxFade;
  broadcast: boolean;
};

export const FX_KINDS: Array<{ id: FxPingKind; label: string }> = [
  { id: "breathe", label: "Respirar" },
  { id: "beam", label: "Feixe" },
  { id: "rocket", label: "Foguete" },
  { id: "burn", label: "Queimar" },
  { id: "glow", label: "Brilho" },
];

export const FX_ELEMENTS: Array<{ id: FxPingElement; label: string; color: string }> = [
  { id: "fire", label: "Fogo", color: "#FF5A1F" },
  { id: "charm", label: "Encanto", color: "#FF5CB0" },
  { id: "acid", label: "Ácido", color: "#B4F000" },
  { id: "death", label: "Morte", color: "#5A1A7A" },
  { id: "holy", label: "Sagrado", color: "#FFE566" },
  { id: "blood", label: "Sangue", color: "#B01030" },
  { id: "frost", label: "Geada", color: "#66D4FF" },
  { id: "slime", label: "Lodo", color: "#33EE22" },
  { id: "smoke", label: "Fumo", color: "#8A8A8A" },
  { id: "water", label: "Água", color: "#2A8CFF" },
  { id: "magic", label: "Magia", color: "#A878FF" },
];

export const DEFAULT_EFFECT_SETTINGS: EffectSettings = {
  kind: "glow",
  element: "magic",
  fade: "instant",
  broadcast: true,
};

export const FX_INSTANT_MS = 3800;

export function fxElementColor(element: FxPingElement): string {
  return FX_ELEMENTS.find((item) => item.id === element)?.color ?? "#B388FF";
}

export function fxKindNeedsDrag(kind: FxPingKind): boolean {
  return kind === "beam" || kind === "rocket";
}

/** Tipos em que o arraste define o tamanho/alcance da área. */
export function fxKindScalesWithDrag(kind: FxPingKind): boolean {
  return kind === "breathe";
}

export function fxKindLabel(kind: FxPingKind): string {
  return FX_KINDS.find((item) => item.id === kind)?.label ?? kind;
}

export function fxElementLabel(element: FxPingElement): string {
  return FX_ELEMENTS.find((item) => item.id === element)?.label ?? element;
}
