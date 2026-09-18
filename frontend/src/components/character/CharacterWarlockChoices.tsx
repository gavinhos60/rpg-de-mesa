import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { CharacterFormData } from "../../types/character";
import { getSpell } from "../../data/dnd/spells";
import {
  ELDRITCH_INVOCATIONS,
  getEldritchInvocation,
  getEldritchInvocationLimit,
  getPactBoon,
  getSelectedEldritchInvocations,
  getWarlockCantrips,
  canTakeEldritchInvocation,
  PACT_BOONS,
  WARLOCK_INVOCATIONS_KEY,
  WARLOCK_PACT_BOON_KEY,
  type PactBoonId,
} from "../../data/dnd/eldritchInvocations";
import {
  getBookOfSecretsCantrips,
  getBookOfSecretsRituals,
  getHexWarriorWeaponId,
  getHexWarriorWeaponOptions,
  getLevel1RitualSpells,
  getLifedrinkerDamageType,
  getPactBladeWeaponId,
  getPactBladeWeaponOptions,
  getPactTomeCantrips,
  getUniversalCantrips,
  getWarlockGrantedSpells,
  getWarlockPactSummary,
  getWarlockSubclassId,
  LIFEDRINKER_DAMAGE_TYPES,
  WARLOCK_BOOK_CANTTRIPS_KEY,
  WARLOCK_BOOK_RITUALS_KEY,
  WARLOCK_HEX_WEAPON_KEY,
  WARLOCK_LIFEDRINKER_DAMAGE_KEY,
  WARLOCK_PACT_BLADE_WEAPON_KEY,
  WARLOCK_PACT_TOME_CANTRIPS_KEY,
} from "../../data/dnd/warlockPact";
import { getEquipmentItem } from "../../data/dnd/equipment";

interface CharacterWarlockChoicesProps {
  data: CharacterFormData;
  onChange?: Dispatch<SetStateAction<CharacterFormData>>;
  warlockLevel: number;
  readOnly?: boolean;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border-strong)",
};

export function CharacterWarlockChoices({
  data,
  onChange,
  warlockLevel,
  readOnly = false,
}: CharacterWarlockChoicesProps) {
  const pactBoon = getPactBoon(data.featureChoices);
  const selected = getSelectedEldritchInvocations(data.featureChoices);
  const cantrips = getWarlockCantrips(data);
  const invocationLimit = getEldritchInvocationLimit(warlockLevel);
  const subclassId = getWarlockSubclassId(data);
  const showPactBoon = warlockLevel >= 3;
  const showInvocations = warlockLevel >= 2 && invocationLimit > 0;
  const showHexWarrior = subclassId === "hexblade" && warlockLevel >= 1;
  const pactSummary = getWarlockPactSummary(data);
  const grantedSpells = getWarlockGrantedSpells(data);

  if (!showPactBoon && !showInvocations && !showHexWarrior) {
    return null;
  }

  function updateChoices(key: string, values: string[]) {
    if (readOnly || !onChange) return;
    onChange((previous) => ({
      ...previous,
      featureChoices: {
        ...previous.featureChoices,
        [key]: values,
      },
    }));
  }

  function setPactBoon(boonId: PactBoonId) {
    if (readOnly || !onChange) return;
    onChange((previous) => {
      const cantripList = getWarlockCantrips(previous);
      const current = getSelectedEldritchInvocations(previous.featureChoices);
      const kept = current.filter((id) => {
        const invocation = getEldritchInvocation(id);
        return (
          invocation &&
          canTakeEldritchInvocation(
            invocation,
            warlockLevel,
            current,
            boonId,
            cantripList
          )
        );
      });

      return {
        ...previous,
        featureChoices: {
          ...previous.featureChoices,
          [WARLOCK_PACT_BOON_KEY]: [boonId],
          [WARLOCK_INVOCATIONS_KEY]: kept,
        },
      };
    });
  }

  function toggleInvocation(invocationId: string) {
    if (readOnly || !onChange) return;
    onChange((previous) => {
      const current = getSelectedEldritchInvocations(previous.featureChoices);
      const pact = getPactBoon(previous.featureChoices);
      const invocation = getEldritchInvocation(invocationId);
      if (!invocation) return previous;

      const next = current.includes(invocationId)
        ? current.filter((id) => id !== invocationId)
        : current.length >= invocationLimit
          ? current
          : canTakeEldritchInvocation(
                invocation,
                warlockLevel,
                current,
                pact,
                getWarlockCantrips(previous)
              )
            ? [...current, invocationId]
            : current;

      return {
        ...previous,
        featureChoices: {
          ...previous.featureChoices,
          [WARLOCK_INVOCATIONS_KEY]: next,
        },
      };
    });
  }

  function toggleSpellChoice(key: string, spellId: string, limit: number) {
    if (readOnly || !onChange) return;
    onChange((previous) => {
      const current = (previous.featureChoices[key] ?? []).filter(Boolean);
      const next = current.includes(spellId)
        ? current.filter((id) => id !== spellId)
        : current.length >= limit
          ? current
          : [...current, spellId];
      return {
        ...previous,
        featureChoices: {
          ...previous.featureChoices,
          [key]: next,
        },
      };
    });
  }

  function setSingleChoice(key: string, value: string) {
    updateChoices(key, [value]);
  }

  const tomeCantrips = getPactTomeCantrips(data.featureChoices);
  const bookCantrips = getBookOfSecretsCantrips(data.featureChoices);
  const bookRituals = getBookOfSecretsRituals(data.featureChoices);
  const bladeWeapon = getPactBladeWeaponId(data.featureChoices);
  const hexWeapon = getHexWarriorWeaponId(data.featureChoices);
  const lifedrinkerDamage = getLifedrinkerDamageType(data.featureChoices);
  const warlockCantripIds = new Set(getWarlockCantrips(data));

  return (
    <section className="mb-8 space-y-6">
      <div>
        <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
          Bruxo — opções de pacto
        </h3>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Dádiva de Pacto, Invocações Místicas e escolhas vinculadas ao patrono.
        </p>
        {readOnly && pactSummary.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-[var(--color-ink-soft)]">
            {pactSummary.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        )}
      </div>

      {showHexWarrior && (
        <ChoiceSection
          title="Guerreiro Hexagonal"
          subtitle="Arma de uma mão que usa Carisma para ataques e dano."
          complete={Boolean(hexWeapon)}
        >
          {readOnly ? (
            <DetailCard
              label={getEquipmentItem(hexWeapon ?? "")?.name ?? "Não definida"}
              detail="Arma escolhida para Guerreiro Hexagonal."
            />
          ) : (
            <WeaponGrid
              weapons={getHexWarriorWeaponOptions()}
              selectedId={hexWeapon}
              onSelect={(id) => setSingleChoice(WARLOCK_HEX_WEAPON_KEY, id)}
            />
          )}
        </ChoiceSection>
      )}

      {showPactBoon && (
        <ChoiceSection
          title="Dádiva de Pacto"
          subtitle="Escolha um pacto sobrenatural."
          complete={Boolean(pactBoon)}
        >
          {readOnly ? (
            pactBoon ? (
              <DetailCard
                label={PACT_BOONS.find((item) => item.id === pactBoon)?.name ?? pactBoon}
                detail={PACT_BOONS.find((item) => item.id === pactBoon)?.description ?? ""}
              />
            ) : (
              <p className="text-sm italic text-[var(--color-ink-muted)]">Não definida.</p>
            )
          ) : (
            <div className="grid gap-2 md:grid-cols-3">
              {PACT_BOONS.map((boon) => {
                const active = pactBoon === boon.id;
                return (
                  <button
                    key={boon.id}
                    type="button"
                    onClick={() => setPactBoon(boon.id)}
                    className="border p-3 text-left transition-colors"
                    style={{
                      borderColor: active ? "var(--color-crimson)" : "var(--color-border)",
                      backgroundColor: active ? "var(--color-parchment)" : "var(--color-surface)",
                    }}
                  >
                    <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                      {boon.name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                      {boon.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </ChoiceSection>
      )}

      {pactBoon === "pact-of-the-chain" && warlockLevel >= 3 && (
        <DetailCard
          label="Encontrar Familiar"
          detail="Concedido pelo Pacto da Corrente. Pode ser conjurado como ritual e seu familiar pode atacar."
        />
      )}

      {pactBoon === "pact-of-the-blade" && warlockLevel >= 3 && (
        <ChoiceSection
          title="Arma de Pacto"
          subtitle="Arma corpo a corpo vinculada que usa Carisma para ataques e dano."
          complete={Boolean(bladeWeapon)}
        >
          {readOnly ? (
            <DetailCard
              label={getEquipmentItem(bladeWeapon ?? "")?.name ?? "Não definida"}
              detail="Arma vinculada do Pacto da Lâmina."
            />
          ) : (
            <WeaponGrid
              weapons={getPactBladeWeaponOptions()}
              selectedId={bladeWeapon}
              onSelect={(id) => setSingleChoice(WARLOCK_PACT_BLADE_WEAPON_KEY, id)}
            />
          )}
        </ChoiceSection>
      )}

      {pactBoon === "pact-of-the-tome" && warlockLevel >= 3 && (
        <ChoiceSection
          title="Truques do Tomo"
          subtitle="Três truques de qualquer lista conjuradora. Não contam para o limite do bruxo."
          complete={tomeCantrips.length >= 3}
          counter={`${tomeCantrips.length} / 3`}
        >
          <SpellGrid
            readOnly={readOnly}
            spells={getUniversalCantrips().filter((spell) => !warlockCantripIds.has(spell.id))}
            selected={tomeCantrips}
            limit={3}
            onToggle={(id) => toggleSpellChoice(WARLOCK_PACT_TOME_CANTRIPS_KEY, id, 3)}
          />
        </ChoiceSection>
      )}

      {showInvocations && (
        <ChoiceSection
          title="Invocações Místicas"
          subtitle="Fragmentos de conhecimento proibido."
          complete={selected.length >= invocationLimit}
          counter={`${selected.length} / ${invocationLimit}`}
        >
          {readOnly ? (
            selected.length === 0 ? (
              <p className="text-sm italic text-[var(--color-ink-muted)]">
                Nenhuma invocação selecionada.
              </p>
            ) : (
              <ul className="space-y-2">
                {selected.map((id) => {
                  const invocation = getEldritchInvocation(id);
                  if (!invocation) return null;
                  return (
                    <li key={id}>
                      <DetailCard name={invocation.name} detail={invocation.description} />
                    </li>
                  );
                })}
              </ul>
            )
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {ELDRITCH_INVOCATIONS.map((invocation) => {
                const isSelected = selected.includes(invocation.id);
                const eligible = canTakeEldritchInvocation(
                  invocation,
                  warlockLevel,
                  selected,
                  pactBoon,
                  cantrips
                );
                const disabled =
                  !isSelected && (!eligible || selected.length >= invocationLimit);

                return (
                  <button
                    key={invocation.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleInvocation(invocation.id)}
                    className="border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      borderColor: isSelected ? "var(--color-crimson)" : "var(--color-border)",
                      backgroundColor: isSelected
                        ? "var(--color-parchment)"
                        : "var(--color-surface)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                        {invocation.name}
                      </p>
                      <span className="text-xs text-[var(--color-crimson)]">
                        {isSelected ? "✓" : "+"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                      Nv. bruxo {invocation.minLevel}+
                      {invocation.requiresCantrip ? " · requer Explosão Mística" : ""}
                      {invocation.requiresPactBoon
                        ? ` · requer ${PACT_BOONS.find((item) => item.id === invocation.requiresPactBoon)?.name ?? "pacto"}`
                        : ""}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                      {invocation.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </ChoiceSection>
      )}

      {selected.includes("book-of-ancient-secrets") && (
        <>
          <ChoiceSection
            title="Livro dos Segredos Antigos — truques"
            subtitle="Dois truques de qualquer lista conjuradora."
            complete={bookCantrips.length >= 2}
            counter={`${bookCantrips.length} / 2`}
          >
            <SpellGrid
              readOnly={readOnly}
              spells={getUniversalCantrips()}
              selected={bookCantrips}
              limit={2}
              onToggle={(id) => toggleSpellChoice(WARLOCK_BOOK_CANTTRIPS_KEY, id, 2)}
            />
          </ChoiceSection>
          <ChoiceSection
            title="Livro dos Segredos Antigos — rituais"
            subtitle="Dois rituais de 1º nível de qualquer lista."
            complete={bookRituals.length >= 2}
            counter={`${bookRituals.length} / 2`}
          >
            <SpellGrid
              readOnly={readOnly}
              spells={getLevel1RitualSpells()}
              selected={bookRituals}
              limit={2}
              onToggle={(id) => toggleSpellChoice(WARLOCK_BOOK_RITUALS_KEY, id, 2)}
            />
          </ChoiceSection>
        </>
      )}

      {selected.includes("lifedrinker") && warlockLevel >= 12 && (
        <ChoiceSection
          title="Bebedor de Vida — tipo de dano"
          subtitle="Dano extra da arma de pacto."
          complete={Boolean(lifedrinkerDamage)}
        >
          {readOnly ? (
            <DetailCard
              label={
                LIFEDRINKER_DAMAGE_TYPES.find((item) => item.id === lifedrinkerDamage)?.name ??
                "Não definido"
              }
              detail="Tipo de dano extra do Bebedor de Vida."
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {LIFEDRINKER_DAMAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSingleChoice(WARLOCK_LIFEDRINKER_DAMAGE_KEY, type.id)}
                  className="border px-4 py-2 text-sm"
                  style={{
                    borderColor:
                      lifedrinkerDamage === type.id
                        ? "var(--color-crimson)"
                        : "var(--color-border)",
                    backgroundColor:
                      lifedrinkerDamage === type.id
                        ? "var(--color-parchment)"
                        : "var(--color-surface)",
                  }}
                >
                  {type.name}
                </button>
              ))}
            </div>
          )}
        </ChoiceSection>
      )}

      {readOnly && grantedSpells.length > 0 && (
        <ChoiceSection title="Magias concedidas" subtitle="Não contam contra o limite de magias conhecidas.">
          <ul className="space-y-1 text-sm text-[var(--color-ink-muted)]">
            {grantedSpells.map((entry) => (
              <li key={`${entry.source}-${entry.id}`}>
                • {entry.name} <span className="text-xs text-[var(--color-ink-soft)]">({entry.source})</span>
              </li>
            ))}
          </ul>
        </ChoiceSection>
      )}
    </section>
  );
}

function ChoiceSection({
  title,
  subtitle,
  complete,
  counter,
  children,
}: {
  title: string;
  subtitle: string;
  complete?: boolean;
  counter?: string;
  children: ReactNode;
}) {
  return (
    <div className="border p-5" style={card}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
            {title}
          </h4>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{subtitle}</p>
        </div>
        {complete != null && (
          <span
            className="px-3 py-1 text-xs"
            style={{
              ...cinzel,
              backgroundColor: complete ? "var(--color-green)" : "var(--color-crimson)",
              color: "var(--color-ink-inverse)",
            }}
          >
            {counter ?? (complete ? "Definido" : "Pendente")}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function DetailCard({
  name,
  label,
  detail,
}: {
  name?: string;
  label?: string;
  detail: string;
}) {
  return (
    <div
      className="border px-3 py-2"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
    >
      <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
        {name ?? label}
      </p>
      <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">{detail}</p>
    </div>
  );
}

function WeaponGrid({
  weapons,
  selectedId,
  onSelect,
}: {
  weapons: Array<{ id: string; name: string } | undefined>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4">
      {weapons.map((weapon) => {
        if (!weapon) return null;
        const active = selectedId === weapon.id;
        return (
          <button
            key={weapon.id}
            type="button"
            onClick={() => onSelect(weapon.id)}
            className="border px-3 py-2 text-left text-sm transition-colors"
            style={{
              borderColor: active ? "var(--color-crimson)" : "var(--color-border)",
              backgroundColor: active ? "var(--color-parchment)" : "var(--color-surface)",
            }}
          >
            {weapon.name}
          </button>
        );
      })}
    </div>
  );
}

function SpellGrid({
  readOnly,
  spells,
  selected,
  limit,
  onToggle,
}: {
  readOnly: boolean;
  spells: Array<{ id: string; name: string }>;
  selected: string[];
  limit: number;
  onToggle: (id: string) => void;
}) {
  if (readOnly) {
    return (
      <ul className="space-y-1 text-sm text-[var(--color-ink-muted)]">
        {selected.map((id) => (
          <li key={id}>• {getSpell(id)?.name ?? id}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid max-h-48 gap-1 overflow-y-auto sm:grid-cols-2">
      {spells.map((spell) => {
        const active = selected.includes(spell.id);
        const disabled = !active && selected.length >= limit;
        return (
          <button
            key={spell.id}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(spell.id)}
            className="border px-2 py-1 text-left text-xs disabled:opacity-40"
            style={{
              borderColor: active ? "var(--color-crimson)" : "var(--color-border)",
              backgroundColor: active ? "var(--color-parchment)" : "var(--color-surface)",
            }}
          >
            {spell.name}
          </button>
        );
      })}
    </div>
  );
}
