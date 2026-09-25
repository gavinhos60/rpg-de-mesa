import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { CampaignPlayerOption } from "../../utils/campaignPlayers";
import { RibbonButton } from "../icons/MedievalIcons";

function buildInitialSelection(
  players: CampaignPlayerOption[],
  initialAudienceUserIds: number[]
): Set<number> {
  const next = new Set(initialAudienceUserIds);
  if (next.size === 0 && players.length > 0) {
    for (const player of players) next.add(player.userId);
  }
  return next;
}

interface PublishAudienceModalProps {
  open: boolean;
  /** Muda ao abrir outro item — reinicia a seleção uma vez. */
  sessionKey: string;
  itemTitle: string;
  itemKind: "papyrus" | "note";
  players: CampaignPlayerOption[];
  initialAudienceUserIds?: number[];
  busy?: boolean;
  onCancel: () => void;
  onConfirm: (audienceUserIds: number[]) => void;
}

export function PublishAudienceModal({
  open,
  sessionKey,
  itemTitle,
  itemKind,
  players,
  initialAudienceUserIds = [],
  busy,
  onCancel,
  onConfirm,
}: PublishAudienceModalProps) {
  const [selected, setSelected] = useState<Set<number>>(() =>
    buildInitialSelection(players, initialAudienceUserIds)
  );

  useEffect(() => {
    if (!open || !sessionKey) return;
    setSelected(buildInitialSelection(players, initialAudienceUserIds));
    // Reinicia só ao abrir outro item (sessionKey), não a cada render do pai.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const allSelected = useMemo(
    () => players.length > 0 && players.every((p) => selected.has(p.userId)),
    [players, selected]
  );

  if (!open) return null;

  const kindLabel = itemKind === "papyrus" ? "documento" : "anotação";

  function toggle(userId: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(players.map((p) => p.userId)));
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-overlay)" }}
      role="dialog"
      aria-modal
      aria-label="Publicar para jogadores"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-md border-2 p-4 shadow-xl"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-wood)",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <h3
          className="mb-1 text-lg text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Publicar {kindLabel}
        </h3>
        <p className="mb-3 text-xs text-[var(--color-ink-soft)]">
          {itemTitle.trim() || "Sem título"} — escolha quem verá na mesa.
        </p>

        {players.length === 0 ? (
          <p className="mb-4 text-sm italic text-[var(--color-ink-soft)]">
            Nenhum jogador na campanha. Adicione personagens/jogadores ao grupo
            primeiro.
          </p>
        ) : (
          <div
            className="mb-4 max-h-56 overflow-y-auto rounded border p-2"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment-soft)",
            }}
          >
            <label className="mb-2 flex cursor-pointer items-center gap-2 border-b pb-2 text-sm text-[var(--color-ink)]">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                onClick={(event) => event.stopPropagation()}
              />
              <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}>
                Todos os jogadores
              </span>
            </label>
            <ul className="space-y-1.5">
              {players.map((player) => (
                <li key={player.userId}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink-muted)]">
                    <input
                      type="checkbox"
                      checked={selected.has(player.userId)}
                      onChange={() => toggle(player.userId)}
                      onClick={(event) => event.stopPropagation()}
                    />
                    {player.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <RibbonButton
            type="button"
            className="flex-1"
            disabled={busy || players.length === 0 || selected.size === 0}
            onClick={() => onConfirm([...selected])}
          >
            Publicar
          </RibbonButton>
          <button
            type="button"
            className="border px-3 py-1.5 text-xs"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment)",
            }}
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
