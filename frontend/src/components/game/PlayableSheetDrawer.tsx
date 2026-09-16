import { useMemo, useState } from "react";
import type { Ability, CharacterFormData, CharacterWallet, Skill, Spell } from "../../types/character";
import type { CampaignCharacterLite } from "../../types/game";
import { CharacterSheetReview } from "../character/CharacterSheetReview";
import { DND_BACKGROUNDS } from "../../data/dnd/backgrounds";
import { ABILITIES, getAbilityModifier } from "../../data/dnd/abilities";
import {
  DND_SKILLS,
  getProficientSkills,
  getSkillExtraBonus,
} from "../../data/dnd/skills";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import { getProficiencyBonus } from "../../data/dnd/rules";
import { AdvantageConfirm } from "./AdvantageConfirm";
import type { InventoryItemAction } from "../../services/character.service";

interface PlayableSheetDrawerProps {
  character: CampaignCharacterLite;
  onClose: () => void;
  onRollSkill: (skill: Skill, options?: { advantage?: boolean }) => void;
  onRollAbility: (ability: Ability, options?: { advantage?: boolean }) => void;
  onUseFeature: (
    name: string,
    description: string,
    abilityId?: string
  ) => void;
  onCastSpell: (spell: Spell, options?: { advantage?: boolean }) => void;
  readOnly?: boolean;
  /** Mestre pode gerenciar inventário mesmo em ficha “somente leitura”. */
  allowInventoryEdit?: boolean;
  inventoryRecipients?: Array<{ id: number; name: string }>;
  inventoryBusy?: boolean;
  onUpdateWallet?: (wallet: CharacterWallet) => Promise<void>;
  onDiscardItem?: (payload: InventoryItemAction) => Promise<void>;
  onTransferItem?: (
    payload: InventoryItemAction & { targetCharacterId: number }
  ) => Promise<void>;
}

function formatMod(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function asFormData(character: CampaignCharacterLite): CharacterFormData | null {
  if (!character.sheet || typeof character.sheet !== "object") return null;
  return character.sheet as CharacterFormData;
}

export function PlayableSheetDrawer({
  character,
  onClose,
  onRollSkill,
  onRollAbility,
  onUseFeature,
  onCastSpell,
  readOnly = false,
  allowInventoryEdit = false,
  inventoryRecipients = [],
  inventoryBusy = false,
  onUpdateWallet,
  onDiscardItem,
  onTransferItem,
}: PlayableSheetDrawerProps) {
  const sheet = asFormData(character);
  const [pendingRoll, setPendingRoll] = useState<{
    type: "skill" | "ability";
    key: Ability | Skill;
    label: string;
  } | null>(null);

  const abilities = useMemo(
    () => (sheet ? getFinalAbilities(sheet) : null),
    [sheet]
  );

  if (!sheet || !abilities) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-overlay)] px-4">
        <div
          className="w-full max-w-lg border-2 p-6"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-wood)" }}
        >
          <div className="mb-4 flex items-start justify-between">
            <h2
              className="text-xl text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {character.name}
            </h2>
            <button type="button" onClick={onClose} className="text-xl text-[var(--color-border-strong)]">
              ×
            </button>
          </div>
          <p className="text-sm text-[var(--color-ink-muted)]">
            Esta ficha ainda não tem dados completos para revisão.
          </p>
        </div>
      </div>
    );
  }

  const proficiency = getProficiencyBonus(
    sheet.classes?.reduce((sum, item) => sum + (item.level || 0), 0) || 1
  );
  const proficient = getProficientSkills(sheet);

  function skillModifier(skillId: Skill) {
    const skill = DND_SKILLS.find((item) => item.id === skillId);
    if (!skill) return 0;
    const abilityMod = getAbilityModifier(abilities[skill.ability]);
    const isProficient = proficient.has(skillId);
    const expertise = Boolean(sheet.skills?.[skillId]?.expertise);
    const profBonus = isProficient ? proficiency : 0;
    const expertiseBonus = expertise ? proficiency : 0;
    const extra = getSkillExtraBonus(sheet, skillId, abilities);
    return abilityMod + profBonus + expertiseBonus + extra;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-overlay)] px-4 py-6">
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col border-2"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-wood)" }}
      >
        <div
          className="flex items-start justify-between gap-3 border-b px-5 py-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <h2
              className="text-xl text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {character.name}
            </h2>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Ficha completa · mesma visão de /characters/{character.id}
              {readOnly ? " · visualização" : ""}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
              Clique em atributos, perícias, habilidades ou magias para enviar ao
              chat. Magias com ataque/dano são roladas automaticamente.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-xl text-[var(--color-border-strong)]">
            ×
          </button>
        </div>

        <div
          className="shrink-0 space-y-3 border-b px-5 py-3"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
        >
          <div className="flex flex-wrap gap-2">
            {ABILITIES.map((ability) => {
              const mod = getAbilityModifier(abilities[ability.id]);
              return (
                <button
                  key={ability.id}
                  type="button"
                  onClick={() =>
                    setPendingRoll({
                      type: "ability",
                      key: ability.id,
                      label: ability.name,
                    })
                  }
                  className="border px-2 py-1 text-xs"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
                >
                  {ability.name} ({formatMod(mod)})
                </button>
              );
            })}
          </div>
          <div className="flex max-h-24 flex-wrap gap-1 overflow-y-auto">
            {DND_SKILLS.map((skill) => {
              const mod = skillModifier(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() =>
                    setPendingRoll({
                      type: "skill",
                      key: skill.id,
                      label: skill.name,
                    })
                  }
                  className="border px-2 py-0.5 text-[11px]"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
                >
                  {skill.name} {formatMod(mod)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
          <CharacterSheetReview
            data={sheet}
            backgrounds={DND_BACKGROUNDS}
            canRoll
            onRollAbility={onRollAbility}
            onRollSkill={onRollSkill}
            onUseFeature={onUseFeature}
            onCastSpell={onCastSpell}
            inventoryManage={
              (!readOnly || allowInventoryEdit) &&
              onUpdateWallet &&
              onDiscardItem &&
              onTransferItem
                ? {
                    recipients: inventoryRecipients,
                    busy: inventoryBusy,
                    onUpdateWallet,
                    onDiscardItem,
                    onTransferItem,
                  }
                : undefined
            }
          />
        </div>
      </div>

      {pendingRoll && (
        <AdvantageConfirm
          title={`Teste de ${pendingRoll.label}`}
          onCancel={() => setPendingRoll(null)}
          onConfirm={(advantage) => {
            if (pendingRoll.type === "skill") {
              onRollSkill(pendingRoll.key as Skill, { advantage });
            } else {
              onRollAbility(pendingRoll.key as Ability, { advantage });
            }
            setPendingRoll(null);
          }}
        />
      )}
    </div>
  );
}
