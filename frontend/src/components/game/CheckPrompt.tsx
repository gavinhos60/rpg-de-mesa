import { useState } from "react";
import type { CheckRequest } from "../../types/game";
import { RibbonButton } from "../icons/MedievalIcons";

interface CheckPromptProps {
  request: CheckRequest;
  characterName?: string;
  onRoll: (options?: { advantage?: boolean }) => void;
  onDismiss: () => void;
}

export function CheckPrompt({
  request,
  characterName,
  onRoll,
  onDismiss,
}: CheckPromptProps) {
  const [advantage, setAdvantage] = useState(false);
  const name =
    characterName ||
    request.characterName ||
    "Seu personagem";

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div
        className="w-full max-w-xl border-2 px-4 py-3"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-crimson)" }}
      >
        <p
          className="text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          {name} precisa realizar um teste de {request.label}.
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
          Rolar com vantagem? (2d20, fica o maior)
        </p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setAdvantage(false)}
            className="border px-3 py-1 text-xs"
            style={{
              borderColor: !advantage ? "var(--color-crimson)" : "var(--color-border)",
              backgroundColor: !advantage ? "var(--color-crimson)" : "var(--color-parchment)",
              color: !advantage ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
            }}
          >
            Não
          </button>
          <button
            type="button"
            onClick={() => setAdvantage(true)}
            className="border px-3 py-1 text-xs"
            style={{
              borderColor: advantage ? "var(--color-crimson)" : "var(--color-border)",
              backgroundColor: advantage ? "var(--color-crimson)" : "var(--color-parchment)",
              color: advantage ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
            }}
          >
            Sim
          </button>
        </div>
        <div className="mt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            Ignorar
          </button>
          <RibbonButton type="button" onClick={() => onRoll({ advantage })}>
            Rolar
          </RibbonButton>
        </div>
      </div>
    </div>
  );
}
