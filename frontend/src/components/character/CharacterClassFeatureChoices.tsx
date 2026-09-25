import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { CharacterFormData, Skill } from "../../types/character";
import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_SKILLS } from "../../data/dnd/skills";
import { DND_SPELLS, getSpell } from "../../data/dnd/spells";
import {
  FIGHTING_STYLE_KEY,
  FIGHTING_STYLE_2_KEY,
  fightingStylesForClass,
} from "../../data/dnd/fightingStyles";
import {
  BATTLE_MASTER_MANEUVERS,
  BATTLE_MASTER_MANEUVERS_KEY,
  getBattleManeuverLimit,
  getSelectedManeuvers,
  MARTIAL_ADEPT_MANEUVERS_KEY,
  superiorityDieSize,
  superiorityDiceMax,
} from "../../data/dnd/battleMasterManeuvers";
import {
  getMartialAdeptManeuverIds,
  getValidAsiKeys,
  hasSelectedFeat,
} from "../../data/dnd/classFeatures";
import {
  METAMAGIC_OPTIONS,
  SORCERER_METAMAGIC_KEY,
  getMetamagicLimit,
  getSelectedMetamagic,
} from "../../data/dnd/metamagicOptions";
import {
  DRACONIC_ANCESTRIES,
  DRACONIC_ANCESTRY_KEY,
} from "../../data/dnd/draconicAncestry";
import {
  DRUID_LAND_BONUS_CANTRIP_KEY,
  DRUID_LAND_TERRAIN_KEY,
  LAND_TERRAINS,
} from "../../data/dnd/landCircle";
import {
  BARBARIAN_TOTEM_ASPECT_KEY,
  BARBARIAN_TOTEM_ATTUNEMENT_KEY,
  BARBARIAN_TOTEM_SPIRIT_KEY,
  TOTEM_ASPECTS,
  TOTEM_ATTUNEMENTS,
  TOTEM_SPIRITS,
} from "../../data/dnd/totemBarbarian";
import {
  FAVORED_ENEMY_TYPES,
  FAVORED_TERRAINS,
  HUNTER_DEFENSE_OPTIONS,
  HUNTER_MULTIATTACK_OPTIONS,
  HUNTER_PREY_OPTIONS,
  HUNTER_SUPERIOR_OPTIONS,
  RANGER_BEAST_COMPANION_KEY,
  RANGER_FAVORED_ENEMIES_KEY,
  RANGER_FAVORED_TERRAINS_KEY,
  RANGER_HUNTER_DEFENSE_KEY,
  RANGER_HUNTER_MULTIATTACK_KEY,
  RANGER_HUNTER_PREY_KEY,
  RANGER_HUNTER_SUPERIOR_KEY,
  favoredEnemyLimit,
  favoredTerrainLimit,
} from "../../data/dnd/rangerOptions";
import {
  BARD_LORE_SKILLS_KEY,
  BARD_MAGICAL_SECRETS_10_KEY,
  BARD_MAGICAL_SECRETS_14_KEY,
  BARD_MAGICAL_SECRETS_6_KEY,
  CHAIN_FAMILIAR_OPTIONS,
  CLERIC_KNOWLEDGE_LANGUAGES_KEY,
  CLERIC_KNOWLEDGE_SKILLS_KEY,
  CLERIC_NATURE_CANTRIP_KEY,
  CLERIC_NATURE_SKILL_KEY,
  WARLOCK_CHAIN_FAMILIAR_KEY,
  expertiseKey,
  getExpertiseLimit,
  syncExpertiseOnSheet,
} from "../../data/dnd/classFeatureChoices";
import { WARLOCK_PACT_BOON_KEY } from "../../data/dnd/eldritchInvocations";

interface Props {
  data: CharacterFormData;
  onChange?: Dispatch<SetStateAction<CharacterFormData>>;
  readOnly?: boolean;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border-strong)",
};

function choiceValues(
  featureChoices: Record<string, string[]> | undefined,
  key: string
): string[] {
  return (featureChoices?.[key] ?? []).filter(Boolean);
}

function patchMartialAdeptManeuvers(
  onChange: Dispatch<SetStateAction<CharacterFormData>> | undefined,
  data: CharacterFormData,
  next: string[]
) {
  if (!onChange) return;

  if (data.talentId === "martial-adept") {
    onChange((previous) => ({
      ...previous,
      featureChoices: {
        ...previous.featureChoices,
        [MARTIAL_ADEPT_MANEUVERS_KEY]: next,
      },
    }));
    return;
  }

  const validKeys = getValidAsiKeys(data.classes);
  for (const [key, selection] of Object.entries(data.asiSelections)) {
    if (
      !validKeys.has(key) ||
      selection.kind !== "feat" ||
      selection.featId !== "martial-adept"
    ) {
      continue;
    }

    onChange((previous) => {
      const current = previous.asiSelections[key];
      if (!current || current.kind !== "feat") return previous;
      return {
        ...previous,
        asiSelections: {
          ...previous.asiSelections,
          [key]: {
            ...current,
            featChoices: {
              ...current.featChoices,
              [MARTIAL_ADEPT_MANEUVERS_KEY]: next,
            },
          },
        },
      };
    });
    return;
  }

  patchChoices(onChange, MARTIAL_ADEPT_MANEUVERS_KEY, next);
}

export function CharacterClassFeatureChoices({
  data,
  onChange,
  readOnly = false,
}: Props) {
  const sections: ReactNode[] = [];

  if (hasSelectedFeat(data, "martial-adept")) {
    sections.push(
      <MultiPick
        key="martial-adept"
        title="Adepto Marcial — manobras"
        limit={2}
        options={BATTLE_MASTER_MANEUVERS.map((item) => ({
          id: item.id,
          label: item.name,
          detail: item.description,
        }))}
        selected={getMartialAdeptManeuverIds(data)}
        readOnly={readOnly}
        onChange={(next) => patchMartialAdeptManeuvers(onChange, data, next)}
      />
    );
  }

  for (const selection of data.classes) {
    const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
    const { classId, subclassId, level } = selection;
    const prefix = `${classId}-${selection.subclassId || "base"}`;

    if (
      (classId === "fighter" && level >= 1) ||
      (classId === "paladin" && level >= 2) ||
      (classId === "ranger" && level >= 2)
    ) {
      sections.push(
        <SinglePick
          key={`${prefix}-style`}
          title="Estilo de luta"
          options={fightingStylesForClass(
            classId as "fighter" | "paladin" | "ranger"
          ).map((s) => ({ id: s.id, label: s.name, detail: s.description }))}
          value={choiceValues(data.featureChoices, FIGHTING_STYLE_KEY)[0] ?? ""}
          readOnly={readOnly}
          onChange={(id) =>
            patchChoices(onChange, FIGHTING_STYLE_KEY, id ? [id] : [])
          }
        />
      );
    }

    if (classId === "fighter" && subclassId === "champion" && level >= 10) {
      sections.push(
        <SinglePick
          key={`${prefix}-style2`}
          title="Segundo estilo de luta (Campeão)"
          options={fightingStylesForClass("fighter").map((s) => ({
            id: s.id,
            label: s.name,
            detail: s.description,
          }))}
          value={choiceValues(data.featureChoices, FIGHTING_STYLE_2_KEY)[0] ?? ""}
          readOnly={readOnly}
          onChange={(id) =>
            patchChoices(onChange, FIGHTING_STYLE_2_KEY, id ? [id] : [])
          }
        />
      );
    }

    if (classId === "fighter" && subclassId === "battle-master" && level >= 3) {
      const limit = getBattleManeuverLimit(level);
      sections.push(
        <div key={`${prefix}-bm`} className="space-y-2">
          <p className="text-xs text-[var(--color-ink-muted)]">
            Superioridade: {superiorityDiceMax(level)}×{superiorityDieSize(level)} (descanso curto)
          </p>
          <MultiPick
            title="Manobras de Mestre de Batalha"
            limit={limit}
            options={BATTLE_MASTER_MANEUVERS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            selected={getSelectedManeuvers(data.featureChoices)}
            readOnly={readOnly}
            onChange={(next) =>
              patchChoices(onChange, BATTLE_MASTER_MANEUVERS_KEY, next)
            }
          />
        </div>
      );
    }

    if (classId === "sorcerer" && level >= 3) {
      sections.push(
        <MultiPick
          key={`${prefix}-meta`}
          title="Metamagia"
          limit={getMetamagicLimit(level)}
          options={METAMAGIC_OPTIONS.map((item) => ({
            id: item.id,
            label: item.name,
            detail: `${item.cost}. ${item.description}`,
          }))}
          selected={getSelectedMetamagic(data.featureChoices)}
          readOnly={readOnly}
          onChange={(next) =>
            patchChoices(onChange, SORCERER_METAMAGIC_KEY, next)
          }
        />
      );
    }

    if (
      classId === "sorcerer" &&
      subclassId === "draconic-bloodline" &&
      level >= 1
    ) {
      sections.push(
        <SinglePick
          key={`${prefix}-dragon`}
          title="Ancestral dracônico"
          options={DRACONIC_ANCESTRIES.map((item) => ({
            id: item.id,
            label: item.name,
            detail: `Dano: ${item.damageType}`,
          }))}
          value={choiceValues(data.featureChoices, DRACONIC_ANCESTRY_KEY)[0] ?? ""}
          readOnly={readOnly}
          onChange={(id) =>
            patchChoices(onChange, DRACONIC_ANCESTRY_KEY, id ? [id] : [])
          }
        />
      );
    }

    if (
      classId === "druid" &&
      subclassId === "circle-of-the-land" &&
      level >= 2
    ) {
      sections.push(
        <SinglePick
          key={`${prefix}-land`}
          title="Terreno do Círculo da Terra"
          options={LAND_TERRAINS.map((item) => ({
            id: item.id,
            label: item.name,
          }))}
          value={choiceValues(data.featureChoices, DRUID_LAND_TERRAIN_KEY)[0] ?? ""}
          readOnly={readOnly}
          onChange={(id) =>
            patchChoices(onChange, DRUID_LAND_TERRAIN_KEY, id ? [id] : [])
          }
        />
      );
      const cantrips = DND_SPELLS.filter(
        (spell) => spell.classes.includes("druid") && spell.level === 0
      );
      sections.push(
        <SinglePick
          key={`${prefix}-land-cantrip`}
          title="Truque bônus (Círculo da Terra)"
          options={cantrips.map((spell) => ({
            id: spell.id,
            label: spell.name,
          }))}
          value={
            choiceValues(data.featureChoices, DRUID_LAND_BONUS_CANTRIP_KEY)[0] ?? ""
          }
          readOnly={readOnly}
          onChange={(id) =>
            patchChoices(onChange, DRUID_LAND_BONUS_CANTRIP_KEY, id ? [id] : [])
          }
        />
      );
    }

    if (classId === "barbarian" && subclassId === "totem-warrior") {
      if (level >= 3) {
        sections.push(
          <SinglePick
            key={`${prefix}-totem3`}
            title="Espírito totêmico (3º)"
            options={TOTEM_SPIRITS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            value={
              choiceValues(data.featureChoices, BARBARIAN_TOTEM_SPIRIT_KEY)[0] ?? ""
            }
            readOnly={readOnly}
            onChange={(id) =>
              patchChoices(onChange, BARBARIAN_TOTEM_SPIRIT_KEY, id ? [id] : [])
            }
          />
        );
      }
      if (level >= 6) {
        sections.push(
          <SinglePick
            key={`${prefix}-totem6`}
            title="Aspecto da besta (6º)"
            options={TOTEM_ASPECTS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            value={
              choiceValues(data.featureChoices, BARBARIAN_TOTEM_ASPECT_KEY)[0] ?? ""
            }
            readOnly={readOnly}
            onChange={(id) =>
              patchChoices(onChange, BARBARIAN_TOTEM_ASPECT_KEY, id ? [id] : [])
            }
          />
        );
      }
      if (level >= 14) {
        sections.push(
          <SinglePick
            key={`${prefix}-totem14`}
            title="Sintonia totêmica (14º)"
            options={TOTEM_ATTUNEMENTS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            value={
              choiceValues(data.featureChoices, BARBARIAN_TOTEM_ATTUNEMENT_KEY)[0] ??
              ""
            }
            readOnly={readOnly}
            onChange={(id) =>
              patchChoices(onChange, BARBARIAN_TOTEM_ATTUNEMENT_KEY, id ? [id] : [])
            }
          />
        );
      }
    }

    if (classId === "ranger") {
      sections.push(
        <MultiPick
          key={`${prefix}-enemies`}
          title="Inimigo favorito"
          limit={favoredEnemyLimit(level)}
          options={FAVORED_ENEMY_TYPES.map((item) => ({
            id: item.id,
            label: item.name,
          }))}
          selected={choiceValues(data.featureChoices, RANGER_FAVORED_ENEMIES_KEY)}
          readOnly={readOnly}
          onChange={(next) =>
            patchChoices(onChange, RANGER_FAVORED_ENEMIES_KEY, next)
          }
        />
      );
      sections.push(
        <MultiPick
          key={`${prefix}-terrains`}
          title="Explorador natural — terreno favorito"
          limit={favoredTerrainLimit(level)}
          options={FAVORED_TERRAINS.map((item) => ({
            id: item.id,
            label: item.name,
          }))}
          selected={choiceValues(data.featureChoices, RANGER_FAVORED_TERRAINS_KEY)}
          readOnly={readOnly}
          onChange={(next) =>
            patchChoices(onChange, RANGER_FAVORED_TERRAINS_KEY, next)
          }
        />
      );
    }

    if (classId === "ranger" && subclassId === "hunter") {
      if (level >= 3) {
        sections.push(
          <SinglePick
            key={`${prefix}-prey`}
            title="Presa do Caçador"
            options={HUNTER_PREY_OPTIONS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            value={choiceValues(data.featureChoices, RANGER_HUNTER_PREY_KEY)[0] ?? ""}
            readOnly={readOnly}
            onChange={(id) =>
              patchChoices(onChange, RANGER_HUNTER_PREY_KEY, id ? [id] : [])
            }
          />
        );
      }
      if (level >= 7) {
        sections.push(
          <SinglePick
            key={`${prefix}-def`}
            title="Táticas defensivas"
            options={HUNTER_DEFENSE_OPTIONS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            value={
              choiceValues(data.featureChoices, RANGER_HUNTER_DEFENSE_KEY)[0] ?? ""
            }
            readOnly={readOnly}
            onChange={(id) =>
              patchChoices(onChange, RANGER_HUNTER_DEFENSE_KEY, id ? [id] : [])
            }
          />
        );
      }
      if (level >= 11) {
        sections.push(
          <SinglePick
            key={`${prefix}-multi`}
            title="Multiataque (Caçador)"
            options={HUNTER_MULTIATTACK_OPTIONS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            value={
              choiceValues(data.featureChoices, RANGER_HUNTER_MULTIATTACK_KEY)[0] ??
              ""
            }
            readOnly={readOnly}
            onChange={(id) =>
              patchChoices(onChange, RANGER_HUNTER_MULTIATTACK_KEY, id ? [id] : [])
            }
          />
        );
      }
      if (level >= 15) {
        sections.push(
          <SinglePick
            key={`${prefix}-sup`}
            title="Defesa superior"
            options={HUNTER_SUPERIOR_OPTIONS.map((item) => ({
              id: item.id,
              label: item.name,
              detail: item.description,
            }))}
            value={
              choiceValues(data.featureChoices, RANGER_HUNTER_SUPERIOR_KEY)[0] ?? ""
            }
            readOnly={readOnly}
            onChange={(id) =>
              patchChoices(onChange, RANGER_HUNTER_SUPERIOR_KEY, id ? [id] : [])
            }
          />
        );
      }
    }

    if (classId === "ranger" && subclassId === "beast-master" && level >= 3) {
      sections.push(
        <TextField
          key={`${prefix}-beast`}
          title="Companheiro animal (ND ≤ 1/4, Médio ou menor)"
          value={
            choiceValues(data.featureChoices, RANGER_BEAST_COMPANION_KEY)[0] ?? ""
          }
          readOnly={readOnly}
          placeholder="Ex.: Lobo, Águia, Pantera..."
          onChange={(text) =>
            patchChoices(onChange, RANGER_BEAST_COMPANION_KEY, text ? [text] : [])
          }
        />
      );
    }

    if (
      classId === "bard" &&
      subclassId === "college-of-lore" &&
      level >= 3
    ) {
      sections.push(
        <SkillMultiPick
          key={`${prefix}-lore-skills`}
          title="Colégio do Conhecimento — 3 perícias bônus"
          limit={3}
          selected={choiceValues(data.featureChoices, BARD_LORE_SKILLS_KEY) as Skill[]}
          readOnly={readOnly}
          onChange={(next) =>
            patchChoices(onChange, BARD_LORE_SKILLS_KEY, next)
          }
        />
      );
    }

    const expKey = expertiseKey(classId);
    const expLimit = getExpertiseLimit(classId, level);
    if (expKey && expLimit > 0) {
      sections.push(
        <SkillMultiPick
          key={`${prefix}-expertise`}
          title={`Expertise (${characterClass?.name ?? classId})`}
          limit={expLimit}
          selected={choiceValues(data.featureChoices, expKey) as Skill[]}
          readOnly={readOnly}
          onChange={(next) => patchExpertise(onChange, expKey, next)}
        />
      );
    }

    if (subclassId === "knowledge-domain" && level >= 1) {
      sections.push(
        <SkillMultiPick
          key={`${prefix}-know-skills`}
          title="Domínio do Conhecimento — perícias"
          limit={2}
          selected={
            choiceValues(data.featureChoices, CLERIC_KNOWLEDGE_SKILLS_KEY) as Skill[]
          }
          readOnly={readOnly}
          onChange={(next) =>
            patchChoices(onChange, CLERIC_KNOWLEDGE_SKILLS_KEY, next)
          }
        />
      );
      sections.push(
        <TextListPick
          key={`${prefix}-know-lang`}
          title="Domínio do Conhecimento — idiomas (2)"
          limit={2}
          selected={choiceValues(data.featureChoices, CLERIC_KNOWLEDGE_LANGUAGES_KEY)}
          readOnly={readOnly}
          onChange={(next) =>
            patchChoices(onChange, CLERIC_KNOWLEDGE_LANGUAGES_KEY, next)
          }
        />
      );
    }

    if (subclassId === "nature-domain" && level >= 1) {
      sections.push(
        <SkillMultiPick
          key={`${prefix}-nat-skill`}
          title="Domínio da Natureza — perícia"
          limit={1}
          selected={
            choiceValues(data.featureChoices, CLERIC_NATURE_SKILL_KEY) as Skill[]
          }
          readOnly={readOnly}
          onChange={(next) =>
            patchChoices(onChange, CLERIC_NATURE_SKILL_KEY, next)
          }
        />
      );
      const druidCantrips = DND_SPELLS.filter(
        (s) => s.classes.includes("druid") && s.level === 0
      );
      sections.push(
        <SinglePick
          key={`${prefix}-nat-cantrip`}
          title="Domínio da Natureza — truque de druida"
          options={druidCantrips.map((spell) => ({
            id: spell.id,
            label: spell.name,
          }))}
          value={
            choiceValues(data.featureChoices, CLERIC_NATURE_CANTRIP_KEY)[0] ?? ""
          }
          readOnly={readOnly}
          onChange={(id) =>
            patchChoices(onChange, CLERIC_NATURE_CANTRIP_KEY, id ? [id] : [])
          }
        />
      );
    }

    if (
      classId === "warlock" &&
      level >= 3 &&
      choiceValues(data.featureChoices, WARLOCK_PACT_BOON_KEY)[0] ===
        "pact-of-the-chain"
    ) {
      sections.push(
        <SinglePick
          key={`${prefix}-chain`}
          title="Forma do familiar (Pacto da Corrente)"
          options={CHAIN_FAMILIAR_OPTIONS.map((item) => ({
            id: item.id,
            label: item.name,
          }))}
          value={
            choiceValues(data.featureChoices, WARLOCK_CHAIN_FAMILIAR_KEY)[0] ?? ""
          }
          readOnly={readOnly}
          onChange={(id) =>
            patchChoices(onChange, WARLOCK_CHAIN_FAMILIAR_KEY, id ? [id] : [])
          }
        />
      );
    }

    if (classId === "bard") {
      if (subclassId === "college-of-lore" && level >= 6) {
        sections.push(
          <SpellMultiPick
            key={`${prefix}-sec6`}
            title="Segredos Mágicos adicionais (6º — Lore)"
            limit={2}
            maxSpellLevel={3}
            selected={choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_6_KEY)}
            readOnly={readOnly}
            onChange={(next) =>
              patchChoices(onChange, BARD_MAGICAL_SECRETS_6_KEY, next)
            }
          />
        );
      }
      if (level >= 10) {
        sections.push(
          <SpellMultiPick
            key={`${prefix}-sec10`}
            title="Segredos Mágicos (10º)"
            limit={2}
            maxSpellLevel={6}
            selected={choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_10_KEY)}
            readOnly={readOnly}
            onChange={(next) =>
              patchChoices(onChange, BARD_MAGICAL_SECRETS_10_KEY, next)
            }
          />
        );
      }
      if (level >= 14) {
        sections.push(
          <SpellMultiPick
            key={`${prefix}-sec14`}
            title="Segredos Mágicos (14º)"
            limit={2}
            maxSpellLevel={7}
            selected={choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_14_KEY)}
            readOnly={readOnly}
            onChange={(next) =>
              patchChoices(onChange, BARD_MAGICAL_SECRETS_14_KEY, next)
            }
          />
        );
      }
    }
  }

  if (sections.length === 0) return null;

  return (
    <section className="space-y-4">
      <h3
        className="text-sm text-[var(--color-ink)]"
        style={{ ...cinzel, fontWeight: 600 }}
      >
        Escolhas de classe
      </h3>
      {sections.map((section, index) => (
        <div key={index} className="border p-3" style={card}>
          {section}
        </div>
      ))}
    </section>
  );
}

function patchChoices(
  onChange: Dispatch<SetStateAction<CharacterFormData>> | undefined,
  key: string,
  values: string[]
) {
  if (!onChange) return;
  onChange((previous) => ({
    ...previous,
    featureChoices: {
      ...previous.featureChoices,
      [key]: values,
    },
  }));
}

function patchExpertise(
  onChange: Dispatch<SetStateAction<CharacterFormData>> | undefined,
  key: string,
  skills: string[]
) {
  if (!onChange) return;
  onChange((previous) =>
    syncExpertiseOnSheet({
      ...previous,
      featureChoices: {
        ...previous.featureChoices,
        [key]: skills,
      },
    })
  );
}

function SinglePick({
  title,
  options,
  value,
  readOnly,
  onChange,
}: {
  title: string;
  options: Array<{ id: string; label: string; detail?: string }>;
  value: string;
  readOnly: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-[var(--color-ink)]">{title}</p>
      <div className="grid gap-2 md:grid-cols-2">
        {options.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(active ? "" : option.id)}
              className="border p-2 text-left text-xs disabled:opacity-60"
              style={{
                borderColor: active ? "var(--color-crimson)" : "var(--color-border)",
                backgroundColor: active
                  ? "color-mix(in srgb, var(--color-crimson) 12%, transparent)"
                  : "transparent",
              }}
            >
              <span className="font-medium">{option.label}</span>
              {option.detail ? (
                <span className="mt-1 block text-[var(--color-ink-muted)]">
                  {option.detail}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MultiPick({
  title,
  limit,
  options,
  selected,
  readOnly,
  onChange,
}: {
  title: string;
  limit: number;
  options: Array<{ id: string; label: string; detail?: string }>;
  selected: string[];
  readOnly: boolean;
  onChange: (next: string[]) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-[var(--color-ink)]">
        {title} ({selected.length}/{limit})
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {options.map((option) => {
          const active = selected.includes(option.id);
          const disabled = !active && selected.length >= limit;
          return (
            <button
              key={option.id}
              type="button"
              disabled={readOnly || disabled}
              onClick={() => {
                onChange(
                  active
                    ? selected.filter((id) => id !== option.id)
                    : [...selected, option.id]
                );
              }}
              className="border p-2 text-left text-xs disabled:opacity-40"
              style={{
                borderColor: active ? "var(--color-crimson)" : "var(--color-border)",
              }}
            >
              {option.label}
              {option.detail ? (
                <span className="mt-1 block text-[var(--color-ink-muted)]">
                  {option.detail}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkillMultiPick({
  title,
  limit,
  selected,
  readOnly,
  onChange,
}: {
  title: string;
  limit: number;
  selected: Skill[];
  readOnly: boolean;
  onChange: (next: string[]) => void;
}) {
  return (
    <MultiPick
      title={title}
      limit={limit}
      selected={selected}
      readOnly={readOnly}
      onChange={onChange}
      options={DND_SKILLS.map((skill) => ({
        id: skill.id,
        label: skill.name,
      }))}
    />
  );
}

function TextListPick({
  title,
  limit,
  selected,
  readOnly,
  onChange,
}: {
  title: string;
  limit: number;
  selected: string[];
  readOnly: boolean;
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-[var(--color-ink)]">
        {title} ({selected.length}/{limit})
      </p>
      <ul className="mb-2 space-y-1 text-xs">
        {selected.map((item) => (
          <li key={item} className="flex justify-between gap-2">
            <span>{item}</span>
            {!readOnly ? (
              <button
                type="button"
                className="text-[var(--color-crimson)]"
                onClick={() => onChange(selected.filter((x) => x !== item))}
              >
                remover
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {!readOnly && selected.length < limit ? (
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 border px-2 py-1 text-xs"
            placeholder="Idioma"
          />
          <button
            type="button"
            className="border px-2 py-1 text-xs"
            onClick={() => {
              const trimmed = draft.trim();
              if (!trimmed || selected.includes(trimmed)) return;
              onChange([...selected, trimmed]);
              setDraft("");
            }}
          >
            Adicionar
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TextField({
  title,
  value,
  placeholder,
  readOnly,
  onChange,
}: {
  title: string;
  value: string;
  placeholder?: string;
  readOnly: boolean;
  onChange: (text: string) => void;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-[var(--color-ink)]">{title}</span>
      <input
        disabled={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-2 py-1.5 text-sm disabled:opacity-60"
      />
    </label>
  );
}

function SpellMultiPick({
  title,
  limit,
  maxSpellLevel,
  selected,
  readOnly,
  onChange,
}: {
  title: string;
  limit: number;
  maxSpellLevel: number;
  selected: string[];
  readOnly: boolean;
  onChange: (next: string[]) => void;
}) {
  const spells = DND_SPELLS.filter(
    (spell) => spell.level > 0 && spell.level <= maxSpellLevel
  );
  return (
    <MultiPick
      title={title}
      limit={limit}
      selected={selected.filter((id) => getSpell(id))}
      readOnly={readOnly}
      onChange={onChange}
      options={spells.map((spell) => ({
        id: spell.id,
        label: `${spell.name} (${spell.level}º)`,
        detail: spell.school,
      }))}
    />
  );
}
