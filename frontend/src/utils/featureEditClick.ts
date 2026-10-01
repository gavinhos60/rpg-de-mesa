/** Evita ativar "usar habilidade" ao interagir com renomear/editar. */
export function shouldIgnoreFeatureCardActivation(
  event: { target: EventTarget | null }
): boolean {
  const target = event.target;
  if (!target || !(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("[data-feature-edit]"));
}
