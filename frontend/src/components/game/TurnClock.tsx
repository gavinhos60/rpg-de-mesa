import { useRef, useState } from "react";
import type {
  BoardToken,
  CombatantEntry,
  CombatState,
} from "../../types/game";
import { RibbonButton } from "../icons/MedievalIcons";

interface TurnClockProps {
  combat: CombatState;
  isMaster: boolean;
  tokens?: BoardToken[];
  onNext?: () => void;
  onEnd?: () => void;
  onStart?: () => void;
  onReorder?: (orderIds: string[]) => void;
  /** Destaca o token no mapa sem selecionar (hover na régua). */
  onHoverCombatant?: (entry: CombatantEntry | null) => void;
}

function tokenForCombatant(
  entry: CombatantEntry,
  tokens: BoardToken[]
): BoardToken | null {
  if (entry.tokenId) {
    const byId = tokens.find((token) => token.id === entry.tokenId);
    if (byId) return byId;
  }
  if (entry.characterId != null) {
    const byChar = tokens.find(
      (token) => token.characterId === entry.characterId
    );
    if (byChar) return byChar;
  }
  return null;
}

export function TurnClock({
  combat,
  isMaster,
  tokens = [],
  onNext,
  onEnd,
  onStart,
  onReorder,
  onHoverCombatant,
}: TurnClockProps) {
  const current = combat.order[combat.currentIndex];
  const statusLabel = combat.active
    ? `Rodada ${combat.round}`
    : combat.collecting
      ? "Coletando iniciativas"
      : "Relógio";

  const dragIdRef = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const canDrag = isMaster && Boolean(onReorder) && combat.order.length > 1;

  function moveEntry(fromId: string, toId: string) {
    if (!onReorder || fromId === toId) return;
    const ids = combat.order.map((entry) => entry.id);
    const fromIndex = ids.indexOf(fromId);
    const toIndex = ids.indexOf(toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const next = [...ids];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder(next);
  }

  return (
    <div
      className="flex flex-col gap-2 border-b-2 px-3 py-2 sm:flex-row sm:items-center sm:gap-3"
      style={{
        backgroundColor: "var(--color-panel)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="shrink-0">
        <p
          className="text-xs tracking-wide text-[var(--color-ink-inverse)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          {statusLabel}
        </p>
        {combat.active && current ? (
          <p className="text-[10px] text-[var(--color-crow-soft)]">
            Vez de {current.name}
          </p>
        ) : null}
        {canDrag ? (
          <p className="text-[10px] text-[var(--color-ink-soft)]">
            Arraste para reordenar
          </p>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5">
        {combat.order.length === 0 ? (
          <span className="text-xs italic text-[var(--color-ink-soft)]">
            Aguardando rolagens…
          </span>
        ) : (
          combat.order.map((entry, index) => {
            const isCurrent = combat.active && index === combat.currentIndex;
            const isDragOver = dragOverId === entry.id && draggingId !== entry.id;
            const isDragging = draggingId === entry.id;
            const token = tokenForCombatant(entry, tokens);
            const imageUrl = token?.imageUrl;
            const initials = entry.name.slice(0, 2).toUpperCase();
            const initLabel =
              entry.natural === 20
                ? `${entry.initiative}!`
                : entry.natural === 1
                  ? `${entry.initiative}↓`
                  : String(entry.initiative);

            return (
              <div
                key={entry.id}
                draggable={canDrag}
                onMouseEnter={() => onHoverCombatant?.(entry)}
                onMouseLeave={() => onHoverCombatant?.(null)}
                onDragStart={(event) => {
                  if (!canDrag) return;
                  dragIdRef.current = entry.id;
                  setDraggingId(entry.id);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", entry.id);
                }}
                onDragEnd={() => {
                  dragIdRef.current = null;
                  setDraggingId(null);
                  setDragOverId(null);
                  onHoverCombatant?.(null);
                }}
                onDragOver={(event) => {
                  if (!canDrag) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  if (dragOverId !== entry.id) setDragOverId(entry.id);
                }}
                onDragLeave={() => {
                  if (dragOverId === entry.id) setDragOverId(null);
                }}
                onDrop={(event) => {
                  if (!canDrag) return;
                  event.preventDefault();
                  const fromId =
                    dragIdRef.current ||
                    event.dataTransfer.getData("text/plain");
                  setDragOverId(null);
                  setDraggingId(null);
                  dragIdRef.current = null;
                  if (fromId) moveEntry(fromId, entry.id);
                }}
                className="flex shrink-0 items-center gap-1.5 border px-1.5 py-1"
                style={{
                  borderColor: isDragOver
                    ? "var(--color-border)"
                    : isCurrent
                      ? "var(--color-crimson)"
                      : "var(--color-border-subtle)",
                  backgroundColor: isCurrent
                    ? "color-mix(in srgb, var(--color-crimson) 35%, var(--color-parchment))"
                    : "var(--color-parchment)",
                  boxShadow: isCurrent
                    ? "0 0 0 1px var(--color-crimson)"
                    : isDragOver
                      ? "inset 0 0 0 2px var(--color-border)"
                      : undefined,
                  opacity: isDragging ? 0.45 : 1,
                  cursor: canDrag ? "grab" : "default",
                }}
                title={entry.name}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[10px] font-semibold text-[var(--color-ink-inverse)]"
                  style={{
                    borderColor: isCurrent
                      ? "var(--color-crimson)"
                      : "var(--color-border)",
                    backgroundColor: token?.color || "var(--color-crow)",
                    backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!imageUrl ? initials : null}
                </span>
                <span
                  className="min-w-[1.25rem] text-sm tabular-nums text-[var(--color-ink)]"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontWeight: isCurrent ? 700 : 600,
                  }}
                >
                  {initLabel}
                </span>
              </div>
            );
          })
        )}
      </div>

      {isMaster ? (
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {!combat.active && combat.order.length > 0 ? (
            <RibbonButton type="button" onClick={onStart}>
              Iniciar relógio
            </RibbonButton>
          ) : null}
          {combat.active ? (
            <RibbonButton type="button" onClick={onNext}>
              Próximo turno
            </RibbonButton>
          ) : null}
          <button
            type="button"
            onClick={onEnd}
            className="border px-2.5 py-1 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-danger)]"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment)",
            }}
          >
            Encerrar
          </button>
        </div>
      ) : null}
    </div>
  );
}
