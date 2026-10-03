export type MonsterActionSection =
  | "traits"
  | "actions"
  | "reactions"
  | "legendaryActions";

export function monsterActionKey(
  section: MonsterActionSection,
  index: number
): string {
  return `${section}:${index}`;
}

export function resolveAbilityDisplayName(
  id: string,
  defaultName: string,
  map?: Record<string, string> | null
): string {
  const custom = map?.[id]?.trim();
  return custom || defaultName;
}

/** Grava rótulo customizado; remove a chave se vazio ou igual ao nome padrão. */
export function applyAbilityDisplayName(
  map: Record<string, string> | undefined,
  id: string,
  defaultName: string,
  customLabel: string
): Record<string, string> | undefined {
  const trimmed = customLabel.trim();
  const next = { ...(map ?? {}) };
  if (!trimmed || trimmed === defaultName.trim()) {
    delete next[id];
  } else {
    next[id] = trimmed;
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

export function patchAbilityDisplayName(
  map: Record<string, string> | undefined,
  id: string,
  defaultName: string,
  customLabel: string
): Record<string, string> | undefined {
  return applyAbilityDisplayName(map, id, defaultName, customLabel);
}

export function resolveAbilityDisplayDescription(
  id: string,
  defaultDescription: string,
  map?: Record<string, string> | null
): string {
  const custom = map?.[id]?.trim();
  return custom || defaultDescription;
}

/** Grava descrição customizada; remove se vazio ou igual ao texto original. */
export function applyAbilityDisplayDescription(
  map: Record<string, string> | undefined,
  id: string,
  defaultDescription: string,
  customDescription: string
): Record<string, string> | undefined {
  const trimmed = customDescription.trim();
  const next = { ...(map ?? {}) };
  if (!trimmed || trimmed === defaultDescription.trim()) {
    delete next[id];
  } else {
    next[id] = trimmed;
  }
  return Object.keys(next).length > 0 ? next : undefined;
}
