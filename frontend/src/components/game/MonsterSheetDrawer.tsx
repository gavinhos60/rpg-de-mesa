import { useState } from "react";
import type { Monster, MonsterAction } from "../../data/dnd/monsters";
import { monsterPortraitUrl } from "../../data/dnd/monsterPortrait";
import { translateMonsterText as t } from "../../data/dnd/monsterTranslate";

export type MonsterSheetActionPayload = {
  monsterName: string;
  actionName: string;
  description?: string;
  attackBonus?: number | null;
  damage?: string | null;
  abilityModifier?: number | null;
  abilityLabel?: string | null;
};

type PendingAction = Omit<MonsterSheetActionPayload, "monsterName"> & {
  summary: string;
};

interface MonsterSheetDrawerProps {
  monster: Monster;
  displayName?: string;
  hpCurrent?: number;
  hpMax?: number;
  canRoll?: boolean;
  onAction?: (payload: MonsterSheetActionPayload) => void;
  onClose: () => void;
}

function abilityMod(value: number) {
  return Math.floor((value - 10) / 2);
}

function AbilityRow({
  label,
  value,
  clickable,
  onRoll,
}: {
  label: string;
  value: number;
  clickable?: boolean;
  onRoll?: () => void;
}) {
  const mod = abilityMod(value);
  const content = (
    <>
      <div className="text-[10px] uppercase text-[var(--color-ink-soft)]">{label}</div>
      <div className="text-sm font-semibold text-[var(--color-ink)]">{value}</div>
      <div className="text-xs text-[var(--color-ink-muted)]">
        {mod >= 0 ? `+${mod}` : mod}
      </div>
    </>
  );

  if (clickable && onRoll) {
    return (
      <button
        type="button"
        onClick={onRoll}
        title={`Rolar teste de ${label}`}
        className="border px-2 py-1 text-center transition hover:border-[var(--color-crimson)] hover:bg-[var(--color-parchment-soft)]"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment-soft)" }}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className="border px-2 py-1 text-center"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-parchment-soft)",
      }}
    >
      {content}
    </div>
  );
}

function ActionBlock({
  title,
  items,
  clickable,
  onUse,
}: {
  title: string;
  items: MonsterAction[];
  clickable?: boolean;
  onUse?: (item: MonsterAction) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <h4
        className="mb-2 text-sm text-[var(--color-ink)]"
        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
      >
        {title}
      </h4>
      <div className="space-y-3">
        {items.map((item) => {
          const rollable =
            item.attackBonus != null || Boolean(item.damage?.match(/\d*d\d+/i));
          const body = (
            <>
              <p className="text-sm font-semibold text-[var(--color-crimson)]">
                {t(item.name)}
                {item.attackBonus != null && (
                  <span className="ml-2 font-normal text-[var(--color-ink-muted)]">
                    +{item.attackBonus} para acertar
                  </span>
                )}
                {item.damage && (
                  <span className="ml-2 font-normal text-[var(--color-ink-muted)]">
                    · {t(item.damage)}
                  </span>
                )}
                {clickable && (
                  <span className="ml-2 text-[10px] font-normal uppercase tracking-wide text-[var(--color-ink-soft)]">
                    {rollable ? "clique para rolar" : "clique para chat"}
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {t(item.description)}
              </p>
            </>
          );

          if (clickable && onUse) {
            return (
              <button
                key={`${title}-${item.name}`}
                type="button"
                onClick={() => onUse(item)}
                className="block w-full border px-2 py-2 text-left transition hover:border-[var(--color-crimson)] hover:bg-[var(--color-parchment)]"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-parchment-soft)",
                }}
              >
                {body}
              </button>
            );
          }

          return <div key={`${title}-${item.name}`}>{body}</div>;
        })}
      </div>
    </div>
  );
}

export function MonsterSheetDrawer({
  monster,
  displayName,
  hpCurrent,
  hpMax,
  canRoll = false,
  onAction,
  onClose,
}: MonsterSheetDrawerProps) {
  const [pending, setPending] = useState<PendingAction | null>(null);
  const current = hpCurrent ?? monster.hp;
  const max = hpMax ?? monster.hp;
  const creatureName = displayName?.trim() || monster.name;

  function requestAction(next: PendingAction) {
    setPending(next);
  }

  function confirmPending() {
    if (!pending) return;
    const { summary: _summary, ...payload } = pending;
    onAction?.({ monsterName: creatureName, ...payload });
    setPending(null);
  }

  function useMonsterAction(item: MonsterAction) {
    const actionName = t(item.name);
    const rollable =
      item.attackBonus != null || Boolean(item.damage?.match(/\d*d\d+/i));
    const bits = [
      rollable ? "rolar" : "enviar ao chat",
      item.attackBonus != null ? `ataque +${item.attackBonus}` : null,
      item.damage ? `dano ${item.damage}` : null,
    ].filter(Boolean);
    requestAction({
      actionName,
      description: t(item.description),
      attackBonus: item.attackBonus,
      damage: item.damage,
      summary: bits.join(" · "),
    });
  }

  function rollAbility(label: string, score: number) {
    const mod = abilityMod(score);
    requestAction({
      actionName: `Teste de ${label}`,
      abilityLabel: label,
      abilityModifier: mod,
      summary: `1d20${mod >= 0 ? `+${mod}` : mod}`,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border shadow-xl"
        style={{
          backgroundColor: "var(--color-parchment)",
          borderColor: "var(--color-border-strong)",
          fontFamily: "'EB Garamond', Georgia, serif",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-start justify-between gap-3 border-b px-4 py-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <h2
              className="text-xl text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {creatureName}
            </h2>
            <p className="text-xs text-[var(--color-ink-soft)]">
              {monster.sizeLabel} {monster.type}, {monster.alignment}
            </p>
            {canRoll && (
              <p className="mt-1 text-[11px] text-[var(--color-crimson)]">
                Clique em atributos ou ações para enviar ao chat
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            Fechar
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <img
            src={monsterPortraitUrl(monster)}
            alt={monster.name}
            className="mx-auto max-h-48 border object-contain"
            style={{ borderColor: "var(--color-border)", backgroundColor: "#1A140F" }}
          />

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-[var(--color-ink-soft)]">CA</span>
              <div className="text-lg text-[var(--color-ink)]">{monster.ac}</div>
            </div>
            <div className="border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-[var(--color-ink-soft)]">PV</span>
              <div className="text-lg text-[var(--color-ink)]">
                {current} / {max}
                {monster.hitDice && (
                  <span className="ml-1 text-xs text-[var(--color-ink-soft)]">
                    ({monster.hitDice})
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-2 border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-[var(--color-ink-soft)]">Deslocamento</span>
              <div className="text-[var(--color-ink)]">{t(monster.speed) || "—"}</div>
            </div>
            <div className="border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-[var(--color-ink-soft)]">ND</span>
              <div className="text-[var(--color-ink)]">
                {monster.cr}
                {monster.xp ? ` (${monster.xp} XP)` : ""}
              </div>
            </div>
            <div className="border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-[var(--color-ink-soft)]">Idiomas</span>
              <div className="text-[var(--color-ink)]">{t(monster.languages)}</div>
            </div>
          </div>

          <div>
            <h4
              className="mb-2 text-sm text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Atributos
            </h4>
            <div className="grid grid-cols-6 gap-1">
              <AbilityRow
                label="For"
                value={monster.abilities.strength}
                clickable={canRoll}
                onRoll={() => rollAbility("Força", monster.abilities.strength)}
              />
              <AbilityRow
                label="Des"
                value={monster.abilities.dexterity}
                clickable={canRoll}
                onRoll={() => rollAbility("Destreza", monster.abilities.dexterity)}
              />
              <AbilityRow
                label="Con"
                value={monster.abilities.constitution}
                clickable={canRoll}
                onRoll={() =>
                  rollAbility("Constituição", monster.abilities.constitution)
                }
              />
              <AbilityRow
                label="Int"
                value={monster.abilities.intelligence}
                clickable={canRoll}
                onRoll={() =>
                  rollAbility("Inteligência", monster.abilities.intelligence)
                }
              />
              <AbilityRow
                label="Sab"
                value={monster.abilities.wisdom}
                clickable={canRoll}
                onRoll={() => rollAbility("Sabedoria", monster.abilities.wisdom)}
              />
              <AbilityRow
                label="Car"
                value={monster.abilities.charisma}
                clickable={canRoll}
                onRoll={() => rollAbility("Carisma", monster.abilities.charisma)}
              />
            </div>
          </div>

          <div className="space-y-1 text-sm text-[var(--color-ink-muted)]">
            <p>
              <strong className="text-[var(--color-ink)]">Perícias:</strong> {t(monster.skills)}
            </p>
            <p>
              <strong className="text-[var(--color-ink)]">Sentidos:</strong> {t(monster.senses)}
            </p>
            <p>
              <strong className="text-[var(--color-ink)]">Resistências:</strong>{" "}
              {t(monster.damageResistances)}
            </p>
            <p>
              <strong className="text-[var(--color-ink)]">Imunidades:</strong>{" "}
              {t(monster.damageImmunities)}
              {monster.conditionImmunities !== "—"
                ? `; condições: ${t(monster.conditionImmunities)}`
                : ""}
            </p>
            {monster.damageVulnerabilities !== "—" && (
              <p>
                <strong className="text-[var(--color-ink)]">Vulnerabilidades:</strong>{" "}
                {t(monster.damageVulnerabilities)}
              </p>
            )}
          </div>

          <ActionBlock
            title="Traços"
            items={monster.traits}
            clickable={canRoll}
            onUse={useMonsterAction}
          />
          <ActionBlock
            title="Ações"
            items={monster.actions}
            clickable={canRoll}
            onUse={useMonsterAction}
          />
          <ActionBlock
            title="Reações"
            items={monster.reactions}
            clickable={canRoll}
            onUse={useMonsterAction}
          />
          <ActionBlock
            title="Ações lendárias"
            items={monster.legendaryActions}
            clickable={canRoll}
            onUse={useMonsterAction}
          />
        </div>
      </aside>

      {pending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-sm border px-4 py-4 shadow-xl"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-strong)",
              fontFamily: "'EB Garamond', Georgia, serif",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              className="text-lg text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Confirmar ação?
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Tem certeza que deseja usar{" "}
              <strong className="text-[var(--color-ink)]">{pending.actionName}</strong> de{" "}
              <strong className="text-[var(--color-ink)]">{creatureName}</strong>?
            </p>
            {pending.summary && (
              <p className="mt-2 text-xs text-[var(--color-ink-soft)]">{pending.summary}</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="border px-3 py-2 text-sm text-[var(--color-ink-muted)]"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmPending}
                className="border px-3 py-2 text-sm text-[var(--color-ink-inverse)]"
                style={{ borderColor: "var(--color-crimson)", backgroundColor: "var(--color-crimson)" }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
