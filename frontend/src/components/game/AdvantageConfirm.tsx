import { useState } from "react";
import { RibbonButton } from "../icons/MedievalIcons";

interface AdvantageConfirmProps {
  title: string;
  onConfirm: (advantage: boolean) => void;
  onCancel: () => void;
}

export function AdvantageConfirm({
  title,
  onConfirm,
  onCancel,
}: AdvantageConfirmProps) {
  const [advantage, setAdvantage] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-sm border-2 p-5"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-crimson)" }}
      >
        <h3
          className="text-lg text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          {title}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Rolar com vantagem? (2d20, fica o maior)
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setAdvantage(false)}
            className="flex-1 border px-3 py-2 text-sm"
            style={{
              fontFamily: "'Cinzel', serif",
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
            className="flex-1 border px-3 py-2 text-sm"
            style={{
              fontFamily: "'Cinzel', serif",
              borderColor: advantage ? "var(--color-crimson)" : "var(--color-border)",
              backgroundColor: advantage ? "var(--color-crimson)" : "var(--color-parchment)",
              color: advantage ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
            }}
          >
            Sim
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            Cancelar
          </button>
          <RibbonButton type="button" onClick={() => onConfirm(advantage)}>
            Rolar
          </RibbonButton>
        </div>
      </div>
    </div>
  );
}
