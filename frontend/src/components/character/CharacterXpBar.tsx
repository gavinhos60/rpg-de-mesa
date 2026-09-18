import { useEffect, useState } from "react";
import type { CharacterFormData } from "../../types/character";
import {
  canAdvanceLevel,
  formatXp,
  resolveCharacterXp,
  xpProgress,
  xpToNextLevel,
} from "../../data/dnd/xpTable";
import { canLevelUpCharacter, getTotalLevel } from "../../utils/levelUp";

interface CharacterXpBarProps {
  data: CharacterFormData;
  editable?: boolean;
  busy?: boolean;
  onUpdateXp?: (xp: number) => Promise<void>;
  onLevelUp?: () => void;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;

export function CharacterXpBar({
  data,
  editable = false,
  busy = false,
  onUpdateXp,
  onLevelUp,
}: CharacterXpBarProps) {
  const totalLevel = getTotalLevel(data);
  const xp = resolveCharacterXp(data.xp, totalLevel);
  const progress = xpProgress(totalLevel, xp);
  const nextThreshold = xpToNextLevel(totalLevel);
  const showLevelUp =
    Boolean(onLevelUp) && canLevelUpCharacter(data);

  const [draftXp, setDraftXp] = useState(String(xp));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) {
      setDraftXp(String(xp));
    }
  }, [xp, editing]);

  async function commitXp() {
    const parsed = Math.max(0, Math.floor(Number(draftXp.replace(/\D/g, "")) || 0));
    setDraftXp(String(parsed));
    setEditing(false);
    if (parsed !== xp && onUpdateXp) {
      await onUpdateXp(parsed);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-ink-muted)]">
        <span style={cinzel}>
          Experiência
          {nextThreshold != null
            ? `: ${formatXp(xp)} / ${formatXp(nextThreshold)} XP`
            : `: ${formatXp(xp)} XP (nível máximo)`}
        </span>
        {editable && onUpdateXp && (
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draftXp}
                  disabled={busy}
                  onChange={(event) => setDraftXp(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void commitXp();
                    if (event.key === "Escape") {
                      setDraftXp(String(xp));
                      setEditing(false);
                    }
                  }}
                  className="w-28 border px-2 py-0.5 text-right text-[var(--color-ink)]"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void commitXp()}
                  className="text-[var(--color-crimson)] hover:underline disabled:opacity-50"
                >
                  Salvar
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => setEditing(true)}
                className="text-[var(--color-crimson)] hover:underline disabled:opacity-50"
              >
                Editar XP
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress.progress * 100)}
        aria-label="Progresso de experiência"
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${Math.round(progress.progress * 100)}%`,
            backgroundColor: "#2563EB",
            boxShadow: "0 0 8px rgba(37, 99, 235, 0.45)",
          }}
        />
      </div>

      {nextThreshold != null && (
        <p className="text-[11px] text-[var(--color-ink-soft)]">
          {formatXp(progress.inLevel)} XP neste nível
          {canAdvanceLevel(totalLevel, xp)
            ? ` · pronto para subir ao nível ${totalLevel + 1}`
            : progress.remaining != null
              ? ` · faltam ${formatXp(progress.remaining)} XP para o nível ${totalLevel + 1}`
              : ""}
        </p>
      )}

      {showLevelUp && (
        <button
          type="button"
          disabled={busy}
          onClick={onLevelUp}
          className="mt-1 border px-4 py-2 text-sm transition-colors disabled:opacity-50"
          style={{
            ...cinzel,
            borderColor: "#2563EB",
            backgroundColor: "rgba(37, 99, 235, 0.12)",
            color: "#1D4ED8",
            fontWeight: 600,
          }}
        >
          Próximo nível
        </button>
      )}
    </div>
  );
}
