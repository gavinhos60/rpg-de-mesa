import { useMemo, useState } from "react";
import type { Spell } from "../../types/character";
import { listCastableSpellSlotLevels } from "../../utils/characterResources";
import type { CharacterFormData } from "../../types/character";
import { RibbonButton } from "../icons/MedievalIcons";

interface SpellCastConfirmProps {
  spell: Spell;
  sheet: CharacterFormData;
  onConfirm: (options: { advantage: boolean; slotLevel: number }) => void;
  onCancel: () => void;
}

export function SpellCastConfirm({
  spell,
  sheet,
  onConfirm,
  onCancel,
}: SpellCastConfirmProps) {
  const [advantage, setAdvantage] = useState(false);
  const slotOptions = useMemo(
    () => listCastableSpellSlotLevels(sheet, spell.level),
    [sheet, spell.level]
  );
  const [slotLevel, setSlotLevel] = useState(
    () => slotOptions[0]?.level ?? spell.level
  );

  const canCast = spell.level <= 0 || slotOptions.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md border-2 p-5"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-crimson)",
        }}
      >
        <h3
          className="text-lg text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Conjurar {spell.name}
        </h3>

        {spell.level > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              Espaço de magia
            </p>
            {slotOptions.length === 0 ? (
              <p className="text-sm text-[var(--color-crimson)]">
                Nenhum espaço de {spell.level}º círculo ou superior disponível.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slotOptions.map((option) => {
                  const active = slotLevel === option.level;
                  return (
                    <button
                      key={`${option.source}-${option.level}`}
                      type="button"
                      className="border px-3 py-2 text-sm"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        borderColor: active
                          ? "var(--color-crimson)"
                          : "var(--color-border)",
                        backgroundColor: active
                          ? "var(--color-crimson)"
                          : "var(--color-parchment)",
                        color: active
                          ? "var(--color-ink-inverse)"
                          : "var(--color-ink-muted)",
                      }}
                      onClick={() => setSlotLevel(option.level)}
                    >
                      {option.level}º
                      {option.level > spell.level ? " ↑" : ""}
                      <span className="ml-1 text-[10px] opacity-80">
                        ({option.remaining}/{option.max}
                        {option.source === "pact" ? " pacto" : ""})
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {slotLevel > spell.level ? (
              <p className="mt-2 text-[11px] text-[var(--color-ink-soft)]">
                Magia de {spell.level}º conjurada com espaço de {slotLevel}º
                círculo.
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          Rolar com vantagem? (2d20, fica o maior)
        </p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setAdvantage(false)}
            className="flex-1 border px-3 py-2 text-sm"
            style={{
              fontFamily: "'Cinzel', serif",
              borderColor: !advantage
                ? "var(--color-crimson)"
                : "var(--color-border)",
              backgroundColor: !advantage
                ? "var(--color-crimson)"
                : "var(--color-parchment)",
              color: !advantage
                ? "var(--color-ink-inverse)"
                : "var(--color-ink-muted)",
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
              borderColor: advantage
                ? "var(--color-crimson)"
                : "var(--color-border)",
              backgroundColor: advantage
                ? "var(--color-crimson)"
                : "var(--color-parchment)",
              color: advantage
                ? "var(--color-ink-inverse)"
                : "var(--color-ink-muted)",
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
          <RibbonButton
            type="button"
            disabled={!canCast}
            onClick={() =>
              onConfirm({
                advantage,
                slotLevel: spell.level > 0 ? slotLevel : 0,
              })
            }
          >
            Conjurar
          </RibbonButton>
        </div>
      </div>
    </div>
  );
}
