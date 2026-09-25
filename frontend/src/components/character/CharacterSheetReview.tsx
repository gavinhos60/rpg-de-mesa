import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
    Ability,
    CharacterBackground,
    CharacterFormData,
    Skill,
    Spell,
} from "../../types/character";
import { ABILITIES, getAbilityModifier } from "../../data/dnd/abilities";
import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_RACES } from "../../data/dnd/races";
import {
    getRaceDisplayName,
    getResolvedRaceTraits,
    getResolvedSpeed,
} from "../../data/dnd/raceResolution";
import { formatMeters } from "../../utils/units";
import {
    DND_SKILLS,
    getProficientSkills,
    getSkillExtraBonus,
} from "../../data/dnd/skills";
import { DND_TALENTS } from "../../data/dnd/talents";
import {
    getAsiMilestones,
    getFeatSavingThrowAbilities,
} from "../../data/dnd/classFeatures";
import { CharacterAbilityTabs } from "./CharacterAbilityTabs";
import { CharacterWarlockChoices } from "./CharacterWarlockChoices";
import { CharacterClassFeatureChoices } from "./CharacterClassFeatureChoices";
import { getClassFeatureSummaryLines } from "../../data/dnd/classFeatureChoices";
import { getProficiencyBonus } from "../../data/dnd/rules";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import {
    getCharacterArmorClass,
    getCarryingCapacity,
    getInitialHitPoints,
    getInitiative,
    getPassivePerception,
    getSavingThrowModifier,
} from "../../data/dnd/combat";
import {
    formatMetricWeight,
    getEquipmentItem,
} from "../../data/dnd/equipment";
import { getSpell, SPELL_SCHOOLS } from "../../data/dnd/spells";
import { getSpellDetail } from "../../data/dnd/spellDetails";
import {
    getAlwaysPreparedSpells,
    getSpellLimits,
    getSpellcastingAbility,
} from "../../data/dnd/spellcasting";
import {
    getPactSlotAvailability,
    getSpellSlotAvailability,
    listResourcePools,
} from "../../utils/characterResources";
import { getLanguageOptions } from "../character/CharacterTalentChoices";
import { AdvantageConfirm } from "../game/AdvantageConfirm";
import {
    COIN_DEFINITIONS,
    COINS_PER_POUND,
    formatPoValue,
    formatWallet,
    resolveCharacterWallet,
    totalCoinCount,
    walletValueInPo,
    walletWeightLb,
} from "../../utils/wallet";
import type { CharacterWallet } from "../../types/character";
import type { InventoryItemAction } from "../../services/character.service";
import { CharacterXpBar } from "./CharacterXpBar";
import { CharacterLevelUpModal } from "./CharacterLevelUpModal";
import { InventoryEquipmentSection } from "./InventoryEquipmentSection";
import { EquipmentCatalogImage } from "./EquipmentCatalogImage";
import { buildCharacterInventory } from "../../utils/characterInventory";
import { sumEquipmentBonuses, applyAbilityEquipmentBonus } from "../../utils/equipmentBonuses";
import type { ActiveSlots, AttunedSlots } from "../../types/character";
import { formatItemBonusLabel } from "../../data/itemBonus";
import { StatBreakdownTooltip } from "./StatBreakdownTooltip";
import {
    getAbilityStatBreakdown,
    getArmorClassBreakdown,
    getSkillStatBreakdown,
} from "../../utils/statBreakdown";

interface CharacterSheetReviewProps {
    data: CharacterFormData;
    backgrounds: CharacterBackground[];
    onRollAbility?: (ability: Ability, options?: { advantage?: boolean }) => void;
    onRollSkill?: (skill: Skill, options?: { advantage?: boolean }) => void;
    onUseFeature?: (name: string, description: string, abilityId?: string) => void;
    onCastSpell?: (spell: Spell, options?: { advantage?: boolean }) => void;
    canRoll?: boolean;
    /** Gerenciar carteira/itens na mesa (ficha do próprio jogador). */
    inventoryManage?: {
        recipients: Array<{ id: number; name: string }>;
        busy?: boolean;
        onUpdateWallet: (wallet: CharacterWallet) => Promise<void>;
        onDiscardItem: (payload: InventoryItemAction) => Promise<void>;
        onTransferItem: (
            payload: InventoryItemAction & { targetCharacterId: number }
        ) => Promise<void>;
        onUpdateAttunedSlots?: (slots: AttunedSlots) => Promise<void>;
        onUpdateActiveSlots?: (slots: ActiveSlots) => Promise<void>;
    };
    /** Editar XP e subir de nível na mesa ou na ficha do jogador. */
    xpManage?: {
        busy?: boolean;
        onUpdateXp: (xp: number) => Promise<void>;
        onLevelUp: (data: CharacterFormData) => Promise<void>;
    };
}

const ALIGNMENT_NAMES: Record<string, string> = {
    "lawful-good": "Leal e Bom",
    "neutral-good": "Neutro e Bom",
    "chaotic-good": "Caótico e Bom",
    "lawful-neutral": "Leal e Neutro",
    "true-neutral": "Neutro",
    "chaotic-neutral": "Caótico e Neutro",
    "lawful-evil": "Leal e Mau",
    "neutral-evil": "Neutro e Mau",
    "chaotic-evil": "Caótico e Mau",
};

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const EQUIPMENT_CATEGORY_NAMES: Record<string, string> = {
    weapon: "Armas",
    armor: "Armaduras",
    shield: "Escudos",
    ammunition: "Munição",
    pack: "Pacotes",
    tool: "Ferramentas",
    focus: "Focos",
    gear: "Equipamentos",
};

const SCHOOL_ACCENTS: Record<string, string> = {
    abjuration: "#4A6B8A",
    conjuration: "#4F7A57",
    divination: "#6D6AA8",
    enchantment: "#A8558A",
    evocation: "#B2532B",
    illusion: "#7B5EA7",
    necromancy: "#55524F",
    transmutation: "#9A7A2C",
};

export function CharacterSheetReview({
    data,
    backgrounds,
    onRollAbility,
    onRollSkill,
    onUseFeature,
    onCastSpell,
    canRoll = false,
    inventoryManage,
    xpManage,
}: CharacterSheetReviewProps) {
    const [levelUpOpen, setLevelUpOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<
        "summary" | "combat" | "spells" | "inventory" | "story"
    >("summary");
    const [pendingRoll, setPendingRoll] = useState<{
        type: "skill" | "ability" | "spell";
        key: Ability | Skill | string;
        label: string;
        spell?: Spell;
    } | null>(null);
    const [walletDraft, setWalletDraft] = useState<CharacterWallet>(() =>
        resolveCharacterWallet(data)
    );
    const [itemAction, setItemAction] = useState<{
        kind: "catalog" | "custom";
        itemId?: string;
        customItemId?: string;
        name: string;
        maxQuantity: number;
        quantity: number;
        targetCharacterId: string;
        mode: "discard" | "transfer";
    } | null>(null);

    useEffect(() => {
        setWalletDraft(resolveCharacterWallet(data));
    }, [data]);

    const baseAbilities = getFinalAbilities(data);
    const equipmentBonuses = sumEquipmentBonuses(data);
    const abilities = {
        strength: applyAbilityEquipmentBonus(
            baseAbilities.strength,
            "strength",
            equipmentBonuses
        ),
        dexterity: applyAbilityEquipmentBonus(
            baseAbilities.dexterity,
            "dexterity",
            equipmentBonuses
        ),
        constitution: applyAbilityEquipmentBonus(
            baseAbilities.constitution,
            "constitution",
            equipmentBonuses
        ),
        intelligence: applyAbilityEquipmentBonus(
            baseAbilities.intelligence,
            "intelligence",
            equipmentBonuses
        ),
        wisdom: applyAbilityEquipmentBonus(
            baseAbilities.wisdom,
            "wisdom",
            equipmentBonuses
        ),
        charisma: applyAbilityEquipmentBonus(
            baseAbilities.charisma,
            "charisma",
            equipmentBonuses
        ),
    };
    const rollAbilities = Boolean(canRoll && onRollAbility);
    const rollSkills = Boolean(canRoll && onRollSkill);
    const useFeatures = Boolean(canRoll && onUseFeature);
    const castSpells = Boolean(canRoll && onCastSpell);
    const race = DND_RACES.find((item) => item.id === data.raceId);
    const raceTraits = getResolvedRaceTraits(data);
    const raceLabel = getRaceDisplayName(data) || race?.name;
    const background = backgrounds.find((item) => item.id === data.backgroundId);
    const talent = DND_TALENTS.find((item) => item.id === data.talentId);
    const asiMilestones = getAsiMilestones(data.classes);
    const asiChoices = asiMilestones.map((milestone) => ({
        milestone,
        selection: data.asiSelections[milestone.key],
    }));
    const primaryClass = data.classes[0]
        ? DND_CLASSES.find((item) => item.id === data.classes[0].classId)
        : undefined;
    const warlockSelection = data.classes.find((item) => item.classId === "warlock");
    const warlockLevel = warlockSelection?.level ?? 0;

    const totalLevel = data.classes.reduce((total, item) => total + item.level, 0) || 1;
    const proficiencyBonus = getProficiencyBonus(totalLevel);
    const suggestedHitPoints = primaryClass
        ? getInitialHitPoints(primaryClass, abilities.constitution)
        : 0;
    const hitPoints = data.hitPoints ?? suggestedHitPoints;
    const initiative =
        getInitiative(abilities.dexterity) +
        (hasSelectedFeat(data, "alert") ? 5 : 0);
    const movement = getResolvedSpeed(data);
    const carryingCapacity = getCarryingCapacity(abilities.strength);

    const proficientSkills = getProficientSkills(data);
    const savingThrowProficiencies = [
        ...(primaryClass?.savingThrowProficiencies ?? []),
        ...getFeatSavingThrowAbilities(data),
    ];

    const classLine = data.classes
        .map((selection) => {
            const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
            const subclass = characterClass?.subclasses.find((item) => item.id === selection.subclassId);
            const parts = [
                characterClass?.name ?? selection.classId,
                `${selection.level}`,
            ];
            return subclass ? `${parts[0]} ${selection.level} (${subclass.name})` : `${parts[0]} ${selection.level}`;
        })
        .join(" / ");

    const inventory = buildCharacterInventory(data);
    const wallet = resolveCharacterWallet(data);
    const armorClass = getCharacterArmorClass(data);
    const inventoryWeight = inventory.reduce((total, row) => {
        const item = getEquipmentItem(row.itemId);
        return total + (item?.weight ?? 0) *
            (row.classQuantity + row.manualQuantity);
    }, 0) + (data.equipment.customItems ?? []).reduce(
        (total, item) => total + (item.weight ?? 0) * item.quantity,
        0
    ) + walletWeightLb(wallet);
    const isOverCapacity = inventoryWeight > carryingCapacity;
    const armorClassBreakdown = useMemo(
        () => getArmorClassBreakdown(data),
        [data]
    );
    const abilityBreakdownById = useMemo(
        () =>
            Object.fromEntries(
                ABILITIES.map((ability) => [
                    ability.id,
                    getAbilityStatBreakdown(data, ability.id),
                ])
            ) as Record<Ability, ReturnType<typeof getAbilityStatBreakdown>>,
        [data]
    );
    const skillBreakdownById = useMemo(
        () =>
            Object.fromEntries(
                DND_SKILLS.map((skill) => [
                    skill.id,
                    getSkillStatBreakdown(data, skill.id),
                ])
            ) as Record<Skill, ReturnType<typeof getSkillStatBreakdown>>,
        [data]
    );
    const coinCount = totalCoinCount(wallet);
    const coinWeight = walletWeightLb(wallet);
    const coinValue = walletValueInPo(wallet);

    const slots = getSpellSlotAvailability(data);
    const pactSlots = getPactSlotAvailability(data);
    const resourcePools = listResourcePools(data);
    const spellGroups = collectSpells(data);
    const questLines = (data.quests ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    function formatModifier(value: number): string {
        return value >= 0 ? `+${value}` : `${value}`;
    }

    return (
        <div
            className="border px-5 py-6 md:px-8 md:py-8"
            style={{
                backgroundColor: "var(--color-parchment)",
                borderColor: "var(--color-border-strong)",
                boxShadow: "inset 0 0 0 1px var(--color-border)",
            }}
        >
            <div className="mb-6 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center" style={{ borderColor: "var(--color-border)" }}>
                {data.avatar ? (
                    <img
                        src={data.avatar}
                        alt={data.name || "Avatar"}
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                        style={{
                            boxShadow: "0 0 0 3px var(--color-border), 0 0 0 5px var(--color-border-strong)",
                            backgroundColor: "#1A140F",
                        }}
                    />
                ) : (
                    <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl"
                        style={{
                            ...cinzel,
                            fontWeight: 600,
                            color: "var(--color-ink-inverse)",
                            background: "radial-gradient(circle at 30% 25%, #9A3340, #5A1A22 70%)",
                            boxShadow: "0 0 0 3px var(--color-border), 0 0 0 5px var(--color-border-strong)",
                        }}
                    >
                        {getInitials(data.name)}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <h2
                        className="text-3xl leading-tight text-[var(--color-ink)] md:text-4xl"
                        style={{ ...cinzel, fontWeight: 600, letterSpacing: "0.02em" }}
                    >
                        {data.name.trim() || "Herói sem nome"}
                    </h2>
                    <p className="mt-1 text-sm italic text-[var(--color-ink-muted)]">
                        {[
                            raceLabel,
                            classLine,
                            `Nível ${totalLevel}`,
                            background?.name,
                        ]
                            .filter(Boolean)
                            .join(" · ") || "Origem desconhecida"}
                    </p>
                    <CharacterXpBar
                        data={data}
                        editable={Boolean(xpManage)}
                        busy={xpManage?.busy}
                        onUpdateXp={xpManage?.onUpdateXp}
                        onLevelUp={xpManage ? () => setLevelUpOpen(true) : undefined}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                        {data.alignment && (
                            <Badge>{ALIGNMENT_NAMES[data.alignment]}</Badge>
                        )}
                        <Badge>Bônus de Prof. {formatModifier(proficiencyBonus)}</Badge>
                        {talent && <Badge>{talent.name}</Badge>}
                        {raceTraits.slice(0, 2).map((trait) => (
                            <Badge key={trait.id}>{trait.name}</Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-6 flex overflow-x-auto border-y" style={{ borderColor: "var(--color-border-strong)" }}>
                {([
                    ["summary", "Resumo"],
                    ["combat", "Combate"],
                    ["spells", "Magias"],
                    ["inventory", "Inventário"],
                    ["story", "História"],
                ] as const).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className="min-w-fit flex-1 px-4 py-3 text-sm transition-colors"
                        style={{
                            ...cinzel,
                            backgroundColor: activeTab === id ? "var(--color-crimson)" : "transparent",
                            color: activeTab === id ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className={activeTab === "summary" ? "" : "hidden"}>
                <RuleTitle>Atributos</RuleTitle>
                {rollAbilities && (
                    <p className="mb-2 text-xs text-[var(--color-ink-soft)]">
                        Clique em um atributo para rolar no chat.
                    </p>
                )}
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {ABILITIES.map((ability) => (
                        <AbilityHex
                            key={ability.id}
                            name={ability.name}
                            score={abilities[ability.id]}
                            modifier={formatModifier(getAbilityModifier(abilities[ability.id]))}
                            breakdown={abilityBreakdownById[ability.id]}
                            onRoll={
                                rollAbilities
                                    ? () =>
                                          setPendingRoll({
                                              type: "ability",
                                              key: ability.id,
                                              label: ability.name,
                                          })
                                    : undefined
                            }
                        />
                    ))}
                </div>

                <RuleTitle>Combate &amp; Sentidos</RuleTitle>
                <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <StatBox label="Pontos de vida" value={hitPoints} />
                    <StatBox
                        label="Classe de armadura"
                        value={armorClass}
                        breakdown={armorClassBreakdown}
                    />
                    <StatBox label="Iniciativa" value={formatModifier(initiative)} />
                    <StatBox label="Deslocamento" value={formatMeters(movement)} />
                    <StatBox
                        label="Percepção passiva"
                        value={getPassivePerception(
                            abilities.wisdom,
                            proficientSkills.has("perception"),
                            proficiencyBonus
                        )}
                        hint={`10 ${formatModifier(getAbilityModifier(abilities.wisdom))} SAB${proficientSkills.has("perception")
                                ? ` ${formatModifier(proficiencyBonus)} prof.`
                                : ""
                            }`}
                    />
                </div>

                <RuleTitle>Origem &amp; Progressão</RuleTitle>
                <div className="mb-6 grid gap-6 md:grid-cols-[1.1fr_1fr]">
                    <section className="border p-5" style={{ borderColor: "var(--color-border-strong)", backgroundColor: "var(--color-surface)" }}>
                        <SectionTitle>Identidade e origem</SectionTitle>
                        <p className="text-sm leading-6 text-[var(--color-ink-muted)]">
                            <span className="text-[var(--color-ink)]" style={cinzel}>
                                {data.name.trim() || "Este aventureiro"}
                            </span>{" "}
                            é {raceLabel ? `um membro da raça ${raceLabel}` : "de origem desconhecida"}
                            {background?.name ? `, marcado pelo passado de ${background.name}` : ""}
                            {data.alignment ? ` e de alinhamento ${ALIGNMENT_NAMES[data.alignment]}` : ""}.
                        </p>
                        {((race?.languages?.length ?? 0) > 0 ||
                            data.backgroundChoices.languages.length > 0) && (
                                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
                                    <span className="text-[var(--color-ink)]" style={cinzel}>
                                        Idiomas:
                                    </span>{" "}
                                    {[
                                        ...(race?.languages ?? []),
                                        ...(data.backgroundChoices.languages ?? []),     
                                        ...(data.talentChoices.languages ?? []),
                                                                 
                                    ]
                                        .map((language) => getLanguageOptions([language])[0]?.name ?? language)
                                        .join(", ")}
                                </p>
                            )}
                        {background && (
                            <div className="mt-4 border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
                                <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                                    {background.feature.name}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                                    {background.feature.description}
                                </p>
                                <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                                    Ferramentas: {[
                                        ...(background.toolProficiencies ?? []),
                                        ...data.backgroundChoices.tools,
                                    ].map((id) => getEquipmentItem(id)?.name ?? id).join(", ") || "—"}
                                </p>
                            </div>
                        )}
                        {raceTraits.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {raceTraits.map((trait) => (
                                    <span
                                        key={trait.id}
                                        title={trait.description}
                                        className="border px-2 py-1 text-xs text-[var(--color-ink-muted)]"
                                        style={{ borderColor: "var(--color-border)" }}
                                    >
                                        {trait.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="border p-5" style={{ borderColor: "var(--color-border-strong)", backgroundColor: "var(--color-surface)" }}>
                        <SectionTitle>Talentos e melhorias</SectionTitle>
                        {talent && (
                            <div className="mb-3">
                                <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                                    Talento inicial — {talent.name}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                                    {talent.description}
                                </p>
                            </div>
                        )}
                        {asiChoices.map(({ milestone, selection }) => {
                            const sourceClass = DND_CLASSES.find(
                                (item) => item.id === milestone.classId
                            );
                            const feat = selection?.kind === "feat"
                                ? DND_TALENTS.find((item) => item.id === selection.featId)
                                : undefined;
                            const abilityNames = selection?.kind === "ability"
                                ? selection.abilities.map((id) =>
                                    ABILITIES.find((ability) => ability.id === id)?.name ?? id
                                )
                                : [];

                            return (
                                <div key={milestone.key} className="border-t py-2 text-sm" style={{ borderColor: "var(--color-border)" }}>
                                    <span className="text-[var(--color-ink-soft)]">
                                        {sourceClass?.name} {milestone.classLevel}:
                                    </span>{" "}
                                    <span className="text-[var(--color-ink)]">
                                        {!selection && "Pendente"}
                                        {selection?.kind === "feat" && (feat?.name || "Talento não escolhido")}
                                        {selection?.kind === "ability" &&
                                            (selection.mode === "single"
                                                ? `+2 ${abilityNames[0] ?? "—"}`
                                                : `+1 ${abilityNames[0] ?? "—"} / +1 ${abilityNames[1] ?? "—"}`)}
                                    </span>
                                </div>
                            );
                        })}
                        {!talent && asiChoices.length === 0 && (
                            <p className="text-sm italic text-[var(--color-ink-muted)]">Nenhum talento registrado.</p>
                        )}
                    </section>
                </div>

            </div>

            <div className={activeTab === "combat" ? "" : "hidden"}>
                <div className="mb-6 grid gap-6 md:grid-cols-2">
                    <section>
                        <SectionTitle>Testes de resistência</SectionTitle>
                        <div className="space-y-2">
                            {ABILITIES.map((ability) => {
                                const modifier = getSavingThrowModifier(
                                    ability.id,
                                    abilities[ability.id],
                                    savingThrowProficiencies,
                                    proficiencyBonus
                                );
                                const proficient = savingThrowProficiencies.includes(ability.id);

                                return (
                                    <div key={ability.id} className="flex items-center justify-between border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
                                        <span className="text-sm">
                                            {proficient ? "●" : "○"} {ability.name}
                                        </span>
                                        <span style={cinzel}>{formatModifier(modifier)}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
                            Percepção passiva {getPassivePerception(
                                abilities.wisdom,
                                proficientSkills.has("perception"),
                                proficiencyBonus
                            )} • Carga {formatMetricWeight(carryingCapacity)}
                        </p>
                    </section>

                    <section>
                        <SectionTitle>Perícias</SectionTitle>
                        {rollSkills && (
                            <p className="mb-2 text-xs text-[var(--color-ink-soft)]">
                                Clique em uma perícia para rolar no chat.
                            </p>
                        )}
                        <div className="grid grid-cols-1 gap-1">
                            {DND_SKILLS.map((skill) => {
                                const abilityMod = getAbilityModifier(
                                    abilities[skill.ability]
                                );
                                const proficient = proficientSkills.has(skill.id);
                                const expertise = Boolean(
                                    data.skills?.[skill.id]?.expertise
                                );
                                const profBonus = proficient ? proficiencyBonus : 0;
                                const expertiseBonus = expertise
                                    ? proficiencyBonus
                                    : 0;
                                const modifier =
                                    abilityMod +
                                    profBonus +
                                    expertiseBonus +
                                    getSkillExtraBonus(data, skill.id, abilities);
                                const ability = ABILITIES.find(
                                    (item) => item.id === skill.ability
                                );
                                const breakdown =
                                    skillBreakdownById[skill.id] ?? [];
                                const row = (
                                    <>
                                        <span>
                                            {proficient ? "●" : "○"} {skill.name}
                                            <span className="ml-1 text-xs text-[var(--color-ink-soft)]">
                                                {ability?.shortName}
                                            </span>
                                        </span>
                                        <span style={cinzel}>
                                            {formatModifier(modifier)}
                                        </span>
                                    </>
                                );

                                if (rollSkills) {
                                    return (
                                        <StatBreakdownTooltip
                                            key={skill.id}
                                            lines={breakdown}
                                            className="w-full"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPendingRoll({
                                                        type: "skill",
                                                        key: skill.id,
                                                        label: skill.name,
                                                    })
                                                }
                                                title={`Rolar ${skill.name}`}
                                                className="flex w-full items-center justify-between px-1 py-0.5 text-left text-sm transition hover:bg-[color-mix(in_srgb,var(--color-parchment-soft)_85%,var(--color-crimson)_15%)]"
                                            >
                                                {row}
                                            </button>
                                        </StatBreakdownTooltip>
                                    );
                                }

                                return (
                                    <StatBreakdownTooltip
                                        key={skill.id}
                                        lines={breakdown}
                                        className="w-full"
                                    >
                                        <div className="flex w-full items-center justify-between px-1 py-0.5 text-sm">
                                            {row}
                                        </div>
                                    </StatBreakdownTooltip>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <section className="mb-6">
                    <CharacterClassFeatureChoices data={data} readOnly />
                    {getClassFeatureSummaryLines(data).length > 0 ? (
                        <ul className="mt-2 text-xs text-[var(--color-ink-muted)]">
                            {getClassFeatureSummaryLines(data).map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    ) : null}
                </section>

                {warlockLevel > 0 && (
                    <section className="mb-6">
                        <CharacterWarlockChoices
                            data={data}
                            warlockLevel={warlockLevel}
                            readOnly
                        />
                    </section>
                )}

                <section>
                    <RuleTitle>Habilidades</RuleTitle>
                    <CharacterAbilityTabs
                        data={data}
                        variant="sheet"
                        onUseFeature={useFeatures ? onUseFeature : undefined}
                    />
                </section>
            </div>

            <section className={activeTab === "inventory" ? "" : "hidden"}>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-b pb-1" style={{ borderColor: "var(--color-border)" }}>
                    <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Inventário
                    </h3>
                    <span className={isOverCapacity ? "text-sm text-[var(--color-danger)]" : "text-sm text-[var(--color-ink-muted)]"}>
                        {formatWallet(wallet)}
                        {" • "}
                        {formatMetricWeight(inventoryWeight)} / {formatMetricWeight(carryingCapacity)}
                        {isOverCapacity ? " • Sobrecarga" : ""}
                    </span>
                </div>

                <div
                    className="mb-4 border p-3"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
                >
                    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                                Carteira
                            </p>
                            <p className="mt-0.5 text-[11px] text-[var(--color-ink-soft)]">
                                50 moedas = 1 lb ({formatMetricWeight(1)}) · conversão padrão D&D
                            </p>
                        </div>
                        <div className="text-right text-xs text-[var(--color-ink-muted)]">
                            <p>
                                {coinCount} moeda{coinCount === 1 ? "" : "s"} ·{" "}
                                {formatMetricWeight(coinWeight)}
                            </p>
                            <p style={cinzel} className="text-[var(--color-ink)]">
                                ≈ {formatPoValue(coinValue)}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                            <thead>
                                <tr className="text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]">
                                    <th className="pb-2 pr-2 font-normal">Moeda</th>
                                    <th className="pb-2 pr-2 font-normal">Qtd.</th>
                                    <th className="pb-2 pr-2 font-normal">Valor</th>
                                    <th className="pb-2 font-normal">Peso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COIN_DEFINITIONS.map((coin) => {
                                    const amount = inventoryManage
                                        ? walletDraft[coin.key]
                                        : wallet[coin.key];
                                    const rowWeight = amount / COINS_PER_POUND;
                                    const rowValue = amount * coin.valueInPo;
                                    return (
                                        <tr
                                            key={coin.key}
                                            className="border-t"
                                            style={{ borderColor: "var(--color-border)" }}
                                        >
                                            <td className="py-2 pr-2 align-middle">
                                                <span className="text-[var(--color-ink)]" style={cinzel}>
                                                    {coin.short}
                                                </span>
                                                <span className="ml-2 text-xs text-[var(--color-ink-soft)]">
                                                    {coin.label}
                                                </span>
                                                <span className="mt-0.5 block text-[10px] text-[var(--color-ink-soft)]">
                                                    {coin.valueInPo >= 1
                                                        ? `1 ${coin.short} = ${coin.valueInPo} PO`
                                                        : `10 ${coin.short} = 1 PO`}
                                                </span>
                                            </td>
                                            <td className="py-2 pr-2 align-middle">
                                                {inventoryManage ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step={1}
                                                        value={walletDraft[coin.key]}
                                                        disabled={inventoryManage.busy}
                                                        onChange={(event) =>
                                                            setWalletDraft((previous) => ({
                                                                ...previous,
                                                                [coin.key]: Math.max(
                                                                    0,
                                                                    Math.floor(
                                                                        Number(event.target.value) || 0
                                                                    )
                                                                ),
                                                            }))
                                                        }
                                                        className="w-24 border px-2 py-1 text-sm text-[var(--color-ink)]"
                                                        style={{
                                                            borderColor: "var(--color-border)",
                                                            backgroundColor: "var(--color-surface)",
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-[var(--color-ink)]">{amount}</span>
                                                )}
                                            </td>
                                            <td className="py-2 pr-2 align-middle text-xs text-[var(--color-ink-muted)]">
                                                {formatPoValue(rowValue)}
                                            </td>
                                            <td className="py-2 align-middle text-xs text-[var(--color-ink-muted)]">
                                                {formatMetricWeight(rowWeight)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr
                                    className="border-t text-sm"
                                    style={{ borderColor: "var(--color-border-strong)" }}
                                >
                                    <td className="pt-2 pr-2 text-[var(--color-ink)]" style={cinzel}>
                                        Total
                                    </td>
                                    <td className="pt-2 pr-2 text-[var(--color-ink)]">
                                        {inventoryManage
                                            ? totalCoinCount(walletDraft)
                                            : coinCount}
                                    </td>
                                    <td className="pt-2 pr-2 text-[var(--color-ink)]">
                                        {formatPoValue(
                                            inventoryManage
                                                ? walletValueInPo(walletDraft)
                                                : coinValue
                                        )}
                                    </td>
                                    <td className="pt-2 text-[var(--color-ink)]">
                                        {formatMetricWeight(
                                            inventoryManage
                                                ? walletWeightLb(walletDraft)
                                                : coinWeight
                                        )}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {inventoryManage ? (
                        <div className="mt-3 flex justify-end">
                            <button
                                type="button"
                                disabled={inventoryManage.busy}
                                onClick={() => {
                                    void inventoryManage.onUpdateWallet(walletDraft).catch((err) => {
                                        console.error(err);
                                        alert("Não foi possível atualizar a carteira.");
                                    });
                                }}
                                className="border px-3 py-1.5 text-xs"
                                style={{
                                    borderColor: "var(--color-border-strong)",
                                    backgroundColor: "var(--color-surface)",
                                    fontFamily: "'Cinzel', serif",
                                }}
                            >
                                Salvar carteira
                            </button>
                        </div>
                    ) : null}
                </div>

                <InventoryEquipmentSection
                    data={data}
                    editable={Boolean(
                        inventoryManage?.onUpdateAttunedSlots ||
                            inventoryManage?.onUpdateActiveSlots
                    )}
                    busy={inventoryManage?.busy}
                    onUpdateAttunedSlots={inventoryManage?.onUpdateAttunedSlots}
                    onUpdateActiveSlots={inventoryManage?.onUpdateActiveSlots}
                />

                {inventory.length === 0 &&
                (data.equipment.customItems ?? []).length === 0 ? (
                    <p className="text-sm italic text-[var(--color-ink-muted)]">Nenhum item registrado.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(groupInventory(inventory)).map(([category, rows]) => (
                                <div key={category} className="border p-3" style={{ borderColor: "var(--color-border)" }}>
                                    <p className="mb-2 text-sm text-[var(--color-ink)]" style={cinzel}>
                                        {EQUIPMENT_CATEGORY_NAMES[category] ?? category}
                                    </p>
                                    <ul className="space-y-2 text-sm">
                                        {rows.map((row) => {
                                            const item = getEquipmentItem(row.itemId);
                                            const quantity = row.classQuantity + row.manualQuantity;
                                            return (
                                                <li key={row.itemId} className="flex justify-between gap-3">
                                                    <span className="flex min-w-0 gap-2">
                                                        <EquipmentCatalogImage
                                                            itemId={row.itemId}
                                                            className="h-10 w-10 shrink-0 rounded border object-cover"
                                                        />
                                                        <span className="min-w-0">
                                                        {item?.name ?? row.itemId} × {quantity}
                                                        <span className="block text-xs text-[var(--color-ink-soft)]">
                                                            {row.classQuantity > 0 ? "Inicial" : ""}
                                                            {row.classQuantity > 0 && row.manualQuantity > 0 ? " + " : ""}
                                                            {row.manualQuantity > 0 ? "Adicionado" : ""}
                                                        </span>
                                                        {inventoryManage && quantity > 0 ? (
                                                            <span className="mt-1 flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="text-[11px] underline"
                                                                    style={{ color: "var(--color-crimson)" }}
                                                                    onClick={() =>
                                                                        setItemAction({
                                                                            kind: "catalog",
                                                                            itemId: row.itemId,
                                                                            name: item?.name ?? row.itemId,
                                                                            maxQuantity: quantity,
                                                                            quantity: 1,
                                                                            targetCharacterId: "",
                                                                            mode: "discard",
                                                                        })
                                                                    }
                                                                >
                                                                    Remover
                                                                </button>
                                                                {inventoryManage.recipients.length > 0 ? (
                                                                    <button
                                                                        type="button"
                                                                        className="text-[11px] underline"
                                                                        style={{ color: "var(--color-ink-muted)" }}
                                                                        onClick={() =>
                                                                            setItemAction({
                                                                                kind: "catalog",
                                                                                itemId: row.itemId,
                                                                                name: item?.name ?? row.itemId,
                                                                                maxQuantity: quantity,
                                                                                quantity: 1,
                                                                                targetCharacterId: String(
                                                                                    inventoryManage.recipients[0].id
                                                                                ),
                                                                                mode: "transfer",
                                                                            })
                                                                        }
                                                                    >
                                                                        Enviar
                                                                    </button>
                                                                ) : null}
                                                            </span>
                                                        ) : null}
                                                        </span>
                                                    </span>
                                                    <span className="shrink-0 text-xs text-[var(--color-ink-soft)]">
                                                        {formatMetricWeight((item?.weight ?? 0) * quantity)}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {(data.equipment.customItems ?? []).length > 0 && (
                            <div className="border p-3" style={{ borderColor: "var(--color-crimson)" }}>
                                <p className="mb-2 text-sm text-[var(--color-ink)]" style={cinzel}>
                                    Itens especiais
                                </p>
                                <ul className="space-y-3 text-sm">
                                    {(data.equipment.customItems ?? []).map((item) => (
                                        <li key={item.id} className="flex gap-3">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt=""
                                                    className="h-14 w-14 shrink-0 rounded border object-cover"
                                                    style={{
                                                        borderColor: "var(--color-border)",
                                                    }}
                                                />
                                            ) : null}
                                            <div className="min-w-0 flex-1">
                                            <p className="text-[var(--color-ink)]" style={cinzel}>
                                                {item.name}
                                                {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                                            </p>
                                            {item.description ? (
                                                <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                            {formatItemBonusLabel(
                                                item.itemBonus?.stat,
                                                item.itemBonus?.value
                                            ) ? (
                                                <p className="mt-0.5 text-[10px] text-[var(--color-crimson)]">
                                                    {formatItemBonusLabel(
                                                        item.itemBonus?.stat,
                                                        item.itemBonus?.value
                                                    )}
                                                </p>
                                            ) : null}
                                            {item.requiresAttunement ? (
                                                <p className="mt-0.5 text-[10px] text-[var(--color-ink-soft)]">
                                                    Requer sintonização
                                                </p>
                                            ) : null}
                                            {item.grantedByName ? (
                                                <p className="mt-0.5 text-[10px] text-[var(--color-ink-soft)]">
                                                    Concedido por {item.grantedByName}
                                                </p>
                                            ) : null}
                                            {inventoryManage && item.quantity > 0 ? (
                                                <span className="mt-1 flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className="text-[11px] underline"
                                                        style={{ color: "var(--color-crimson)" }}
                                                        onClick={() =>
                                                            setItemAction({
                                                                kind: "custom",
                                                                customItemId: item.id,
                                                                name: item.name,
                                                                maxQuantity: item.quantity,
                                                                quantity: 1,
                                                                targetCharacterId: "",
                                                                mode: "discard",
                                                            })
                                                        }
                                                    >
                                                        Remover
                                                    </button>
                                                    {inventoryManage.recipients.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            className="text-[11px] underline"
                                                            style={{ color: "var(--color-ink-muted)" }}
                                                            onClick={() =>
                                                                setItemAction({
                                                                    kind: "custom",
                                                                    customItemId: item.id,
                                                                    name: item.name,
                                                                    maxQuantity: item.quantity,
                                                                    quantity: 1,
                                                                    targetCharacterId: String(
                                                                        inventoryManage.recipients[0].id
                                                                    ),
                                                                    mode: "transfer",
                                                                })
                                                            }
                                                        >
                                                            Enviar
                                                        </button>
                                                    ) : null}
                                                </span>
                                            ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {itemAction && inventoryManage ? (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[color:var(--color-overlay)] px-4">
                        <div
                            className="w-full max-w-md border-2 p-5"
                            style={{
                                backgroundColor: "var(--color-surface)",
                                borderColor: "var(--color-border-wood)",
                            }}
                        >
                            <h4 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                {itemAction.mode === "discard" ? "Remover item" : "Enviar item"}
                            </h4>
                            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                                {itemAction.name}
                            </p>
                            <label className="mt-4 block text-xs text-[var(--color-ink-muted)]">
                                Quantidade (máx. {itemAction.maxQuantity})
                                <input
                                    type="number"
                                    min={1}
                                    max={itemAction.maxQuantity}
                                    value={itemAction.quantity}
                                    onChange={(event) =>
                                        setItemAction((previous) =>
                                            previous
                                                ? {
                                                      ...previous,
                                                      quantity: Math.min(
                                                          previous.maxQuantity,
                                                          Math.max(1, Math.floor(Number(event.target.value) || 1))
                                                      ),
                                                  }
                                                : previous
                                        )
                                    }
                                    className="mt-1 w-full border px-2 py-1.5 text-sm"
                                    style={{
                                        borderColor: "var(--color-border)",
                                        backgroundColor: "var(--color-parchment)",
                                    }}
                                />
                            </label>
                            {itemAction.mode === "transfer" ? (
                                <label className="mt-3 block text-xs text-[var(--color-ink-muted)]">
                                    Destinatário
                                    <select
                                        value={itemAction.targetCharacterId}
                                        onChange={(event) =>
                                            setItemAction((previous) =>
                                                previous
                                                    ? {
                                                          ...previous,
                                                          targetCharacterId: event.target.value,
                                                      }
                                                    : previous
                                            )
                                        }
                                        className="mt-1 w-full border px-2 py-1.5 text-sm"
                                        style={{
                                            borderColor: "var(--color-border)",
                                            backgroundColor: "var(--color-parchment)",
                                        }}
                                    >
                                        {inventoryManage.recipients.map((recipient) => (
                                            <option key={recipient.id} value={recipient.id}>
                                                {recipient.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ) : null}
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setItemAction(null)}
                                    className="border px-3 py-1.5 text-xs"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    disabled={inventoryManage.busy}
                                    onClick={() => {
                                        const payload =
                                            itemAction.kind === "catalog"
                                                ? {
                                                      kind: "catalog" as const,
                                                      itemId: itemAction.itemId!,
                                                      quantity: itemAction.quantity,
                                                  }
                                                : {
                                                      kind: "custom" as const,
                                                      customItemId: itemAction.customItemId!,
                                                      quantity: itemAction.quantity,
                                                  };
                                        const run =
                                            itemAction.mode === "discard"
                                                ? inventoryManage.onDiscardItem(payload)
                                                : inventoryManage.onTransferItem({
                                                      ...payload,
                                                      targetCharacterId: Number(itemAction.targetCharacterId),
                                                  });
                                        void run
                                            .then(() => setItemAction(null))
                                            .catch((err) => {
                                                console.error(err);
                                            });
                                    }}
                                    className="border px-3 py-1.5 text-xs"
                                    style={{
                                        borderColor: "var(--color-crimson)",
                                        color: "var(--color-crimson)",
                                        fontFamily: "'Cinzel', serif",
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </section>

            <section className={activeTab === "spells" ? "" : "hidden"}>
                <RuleTitle>Grimório</RuleTitle>
                {(slots.some((slot) => slot.max > 0) || pactSlots) && (
                    <div className="mb-6">
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--color-border)]" style={cinzel}>
                            Espaços de magia (restantes / máximo)
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {slots
                                .filter((slot) => slot.max > 0)
                                .map((slot) => (
                                    <div
                                        key={slot.level}
                                        className="flex h-14 min-w-14 flex-col items-center justify-center rounded-full px-2"
                                        style={{
                                            ...cinzel,
                                            background: "radial-gradient(circle at 35% 25%, var(--color-parchment), var(--color-parchment-soft))",
                                            boxShadow: "0 0 0 1px var(--color-border), inset 0 0 8px rgba(122,37,48,0.18)",
                                            opacity: slot.remaining <= 0 ? 0.45 : 1,
                                        }}
                                        title={`${slot.level}º círculo — recupera em descanso longo`}
                                    >
                                        <span className="text-lg leading-none text-[var(--color-crimson)]" style={{ fontWeight: 700 }}>
                                            {slot.remaining}/{slot.max}
                                        </span>
                                        <span className="text-[10px] text-[var(--color-border)]">{slot.level}º</span>
                                    </div>
                                ))}
                            {pactSlots ? (
                                <div
                                    className="flex h-14 min-w-14 flex-col items-center justify-center rounded-full px-2"
                                    style={{
                                        ...cinzel,
                                        background: "radial-gradient(circle at 35% 25%, var(--color-parchment), var(--color-parchment-soft))",
                                        boxShadow: "0 0 0 1px var(--color-border), inset 0 0 8px rgba(122,37,48,0.18)",
                                        opacity: pactSlots.remaining <= 0 ? 0.45 : 1,
                                    }}
                                    title={`Magia de Pacto ${pactSlots.level}º — recupera em descanso curto`}
                                >
                                    <span className="text-lg leading-none text-[var(--color-crimson)]" style={{ fontWeight: 700 }}>
                                        {pactSlots.remaining}/{pactSlots.max}
                                    </span>
                                    <span className="text-[10px] text-[var(--color-border)]">
                                        Pacto {pactSlots.level}º
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {resourcePools.length > 0 && (
                    <div className="mb-6">
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--color-border)]" style={cinzel}>
                            Recursos de classe
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {resourcePools.map((pool) => (
                                <div
                                    key={pool.id}
                                    className="border px-3 py-2"
                                    style={{
                                        borderColor: "var(--color-border)",
                                        backgroundColor: "var(--color-surface)",
                                    }}
                                >
                                    <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                                        {pool.name}
                                    </p>
                                    <p className="text-lg text-[var(--color-crimson)]" style={{ ...cinzel, fontWeight: 600 }}>
                                        {pool.current}/{pool.max}
                                    </p>
                                    <p className="text-[10px] text-[var(--color-ink-soft)]">
                                        Descanso {pool.recovery === "short" ? "curto" : "longo"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.classes.map((selection) => {
                        const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
                        const abilityId = getSpellcastingAbility(selection.classId, selection.subclassId);
                        const limits = abilityId
                            ? getSpellLimits(selection.classId, selection.level, selection.subclassId, abilities[abilityId])
                            : undefined;
                        if (!limits || !abilityId) return null;
                        const modifier = getAbilityModifier(abilities[abilityId]);
                        const ability = ABILITIES.find((item) => item.id === abilityId);

                        return (
                            <div
                                key={selection.classId}
                                className="border p-4"
                                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
                            >
                                <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {characterClass?.name}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--color-border)]" style={cinzel}>
                                    Conjuração por {ability?.name ?? "—"}
                                </p>
                                <div className="mt-3 flex gap-4 text-sm text-[var(--color-ink-muted)]">
                                    <span>
                                        CD{" "}
                                        <strong className="text-[var(--color-crimson)]" style={cinzel}>
                                            {8 + proficiencyBonus + modifier}
                                        </strong>
                                    </span>
                                    <span>
                                        Ataque{" "}
                                        <strong className="text-[var(--color-crimson)]" style={cinzel}>
                                            {formatModifier(proficiencyBonus + modifier)}
                                        </strong>
                                    </span>
                                </div>
                                {limits.pact && (
                                    <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                                        Magia de Pacto: {limits.pact.count} espaço(s) de {limits.pact.level}º círculo
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {spellGroups.length === 0 ? (
                    <p className="text-sm italic text-[var(--color-ink-muted)]">
                        Este herói não conjura magias — sua força vem do aço e da coragem.
                    </p>
                ) : (
                    spellGroups.map((group) => (
                        <div key={group.title} className="mb-6">
                            <RuleTitle>{group.title}</RuleTitle>
                            {Object.entries(groupSpellsByLevel(group.spells)).map(([level, spells]) => (
                                <div key={level} className="mb-4 last:mb-0">
                                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--color-border)]" style={cinzel}>
                                        {level === "0" ? "Truques" : `${level}º círculo`}
                                        <span className="ml-2 text-[var(--color-ink-soft)]">({spells.length})</span>
                                    </p>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {spells.map((spell) => (
                                            <SpellCard
                                                key={spell.id}
                                                spell={spell}
                                                onCast={
                                                    castSpells
                                                        ? () => {
                                                              if (spell.attack) {
                                                                  setPendingRoll({
                                                                      type: "spell",
                                                                      key: spell.id,
                                                                      label: spell.name,
                                                                      spell,
                                                                  });
                                                              } else {
                                                                  onCastSpell?.(spell);
                                                              }
                                                          }
                                                        : undefined
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </section>

            <div className={activeTab === "story" ? "" : "hidden"}>
                <section className="mb-6">
                    <SectionTitle>Personalidade</SectionTitle>
                    <div className="grid gap-3 md:grid-cols-2">
                        <DetailBox label="Aparência" value={data.loreDetails.appearance} />
                        <DetailBox label="Traços de personalidade" value={data.loreDetails.personalityTraits} />
                        <DetailBox label="Ideais" value={data.loreDetails.ideals} />
                        <DetailBox label="Vínculos" value={data.loreDetails.bonds} />
                        <DetailBox label="Fraquezas" value={data.loreDetails.flaws} />
                    </div>
                </section>

                <section className="mb-6">
                    <SectionTitle>História</SectionTitle>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--color-ink)]">
                        {data.lore.trim() || "Ainda não há uma história escrita neste pergaminho."}
                    </p>
                </section>

                <section>
                    <SectionTitle>Missões</SectionTitle>
                    {questLines.length === 0 ? (
                        <p className="text-sm italic text-[var(--color-ink-muted)]">
                            Nenhuma missão registrada — o destino deste herói ainda está em aberto.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {questLines.map((quest, index) => (
                                <li
                                    key={index}
                                    className="flex gap-3 border px-3 py-2 text-sm leading-6 text-[var(--color-ink)]"
                                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
                                >
                                    <span className="text-[var(--color-crimson)]">❖</span>
                                    <span className="whitespace-pre-wrap">{quest}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {pendingRoll && (
                <AdvantageConfirm
                    title={
                        pendingRoll.type === "spell"
                            ? `Conjurar ${pendingRoll.label}`
                            : `Teste de ${pendingRoll.label}`
                    }
                    onCancel={() => setPendingRoll(null)}
                    onConfirm={(advantage) => {
                        if (pendingRoll.type === "skill") {
                            onRollSkill?.(pendingRoll.key as Skill, { advantage });
                        } else if (pendingRoll.type === "spell" && pendingRoll.spell) {
                            onCastSpell?.(pendingRoll.spell, { advantage });
                        } else {
                            onRollAbility?.(pendingRoll.key as Ability, { advantage });
                        }
                        setPendingRoll(null);
                    }}
                />
            )}

            {xpManage && (
                <CharacterLevelUpModal
                    open={levelUpOpen}
                    data={data}
                    busy={xpManage.busy}
                    onClose={() => setLevelUpOpen(false)}
                    onConfirm={async (updated) => {
                        await xpManage.onLevelUp(updated);
                        setLevelUpOpen(false);
                    }}
                />
            )}
        </div>
    );
}

function Badge({ children }: { children: ReactNode }) {
    return (
        <span
            className="border px-3 py-1 text-xs uppercase tracking-[0.12em] text-[var(--color-border-strong)]"
            style={{ ...cinzel, borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
        >
            {children}
        </span>
    );
}

function RuleTitle({ children }: { children: ReactNode }) {
    return (
        <div className="mb-3 flex items-center gap-3">
            <span
                className="shrink-0 text-sm uppercase tracking-[0.25em] text-[var(--color-crimson)]"
                style={{ ...cinzel, fontWeight: 600 }}
            >
                {children}
            </span>
            <span className="h-px flex-1" style={{ backgroundColor: "var(--color-border)" }} />
        </div>
    );
}

function AbilityHex({
    name,
    score,
    modifier,
    breakdown,
    onRoll,
}: {
    name: string;
    score: number;
    modifier: string;
    breakdown?: ReturnType<typeof getAbilityStatBreakdown>;
    onRoll?: () => void;
}) {
    const body = (
        <>
            <p
                className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-border)]"
                style={cinzel}
            >
                {name}
            </p>
            <p
                className="mt-1 text-3xl leading-none text-[var(--color-crimson)]"
                style={{ ...cinzel, fontWeight: 700 }}
            >
                {modifier}
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink-soft)]" style={cinzel}>
                {score}
            </p>
        </>
    );

    const hexStyle = {
        clipPath: "polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)",
        background:
            "linear-gradient(180deg, var(--color-parchment) 0%, var(--color-parchment-soft) 100%)",
        boxShadow: "inset 0 0 0 1px var(--color-border)",
    } as const;

    const wrapped = (content: ReactNode) => (
        <StatBreakdownTooltip lines={breakdown ?? []} className="w-full">
            {content}
        </StatBreakdownTooltip>
    );

    if (onRoll) {
        return wrapped(
            <button
                type="button"
                onClick={onRoll}
                className="flex w-full flex-col items-center px-2 pb-8 pt-3 transition hover:brightness-95"
                style={hexStyle}
            >
                {body}
            </button>
        );
    }

    return wrapped(
        <div
            className="flex w-full flex-col items-center px-2 pb-8 pt-3"
            style={hexStyle}
        >
            {body}
        </div>
    );
}

function StatBox({
    label,
    value,
    hint,
    breakdown,
}: {
    label: string;
    value: string | number;
    hint?: string;
    breakdown?: ReturnType<typeof getArmorClassBreakdown>;
}) {
    return (
        <StatBreakdownTooltip lines={breakdown ?? []} className="h-full">
            <div
                className="h-full border px-3 py-4 text-center"
                style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                }}
            >
                <p
                    className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-border)]"
                    style={cinzel}
                >
                    {label}
                </p>
                <p
                    className="mt-2 text-2xl leading-none text-[var(--color-crimson)]"
                    style={{ ...cinzel, fontWeight: 600 }}
                >
                    {value}
                </p>
                {hint ? (
                    <p className="mt-1 text-[10px] text-[var(--color-ink-soft)]">{hint}</p>
                ) : null}
            </div>
        </StatBreakdownTooltip>
    );
}

function SpellCard({
    spell,
    onCast,
}: {
    spell: Spell;
    onCast?: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const accent = SCHOOL_ACCENTS[spell.school] ?? "var(--color-border)";
    const detail = getSpellDetail(spell.id);

    const cardBody = (
        <>
            <span
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ backgroundColor: accent }}
            />
            <div className="flex items-start gap-3">
                <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{
                        ...cinzel,
                        fontWeight: 700,
                        color: "var(--color-ink-inverse)",
                        background: `radial-gradient(circle at 35% 25%, ${accent}, #3A2A1C 140%)`,
                        boxShadow: "0 0 0 1px var(--color-border)",
                    }}
                >
                    {spell.level === 0 ? "✦" : spell.level}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        {spell.name}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em]" style={{ ...cinzel, color: accent }}>
                        {SPELL_SCHOOLS[spell.school]}
                        {spell.ritual ? " · Ritual ◇" : ""}
                        {spell.attack ? " · Ataque ⚔" : ""}
                    </p>
                </div>
                {detail && (
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setExpanded((current) => !current);
                        }}
                        aria-expanded={expanded}
                        aria-label={expanded ? "Recolher descrição" : "Ver descrição completa"}
                        className="flex h-7 w-7 shrink-0 items-center justify-center border text-xs transition-transform"
                        style={{
                            borderColor: "var(--color-border)",
                            color: accent,
                            transform: expanded ? "rotate(180deg)" : "none",
                        }}
                    >
                        ▾
                    </button>
                )}
            </div>

            <p className="mt-2 text-sm italic leading-6 text-[var(--color-ink-muted)]">
                {spell.description ?? "Os detalhes desta magia permanecem selados no grimório."}
            </p>
            {onCast && (
                <p className="mt-2 text-[10px] uppercase tracking-wide text-[var(--color-crimson)]">
                    {spell.attack ? "Clique para rolar ataque/dano" : "Clique para enviar / rolar magia"}
                </p>
            )}

            {detail && expanded && (
                <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <SpellMeta label="Tempo de conjuração" value={detail.castingTime} />
                        <SpellMeta label="Alcance" value={detail.range} />
                        <SpellMeta label="Componentes" value={detail.components} />
                        <SpellMeta label="Duração" value={detail.duration} />
                    </dl>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-ink)]">{detail.text}</p>
                    {detail.higherLevels && (
                        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
                            <span className="text-[var(--color-crimson)]" style={cinzel}>
                                Em níveis superiores.
                            </span>{" "}
                            {detail.higherLevels}
                        </p>
                    )}
                </div>
            )}
        </>
    );

    if (onCast) {
        return (
            <button
                type="button"
                onClick={onCast}
                className="relative block w-full overflow-hidden border px-4 py-3 pl-5 text-left transition hover:border-[var(--color-crimson)]"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment-soft)" }}
            >
                {cardBody}
            </button>
        );
    }

    return (
        <article
            className="relative overflow-hidden border px-4 py-3 pl-5"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment-soft)" }}
        >
            {cardBody}
        </article>
    );
}

function SpellMeta({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-border)]" style={cinzel}>
                {label}
            </dt>
            <dd className="text-[var(--color-ink)]">{value}</dd>
        </div>
    );
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function DetailBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="border p-3" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">{label}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--color-ink)]">
                {value.trim() || "—"}
            </p>
        </div>
    );
}

function SectionTitle({ children }: { children: string }) {
    return (
        <h3
            className="mb-3 border-b pb-1 text-lg text-[var(--color-ink)]"
            style={{ ...cinzel, fontWeight: 600, borderColor: "var(--color-border)" }}
        >
            {children}
        </h3>
    );
}

function groupInventory(inventory: ReturnType<typeof buildCharacterInventory>) {
    return inventory.reduce<
        Record<string, ReturnType<typeof buildCharacterInventory>>
    >((groups, row) => {
        const category = getEquipmentItem(row.itemId)?.category ?? "gear";
        groups[category] = [...(groups[category] ?? []), row];
        return groups;
    }, {});
}

function collectSpells(data: CharacterFormData): Array<{ title: string; spells: Spell[] }> {
    const groups: Array<{ title: string; spells: Spell[] }> = [];
    const abilities = getFinalAbilities(data);
    const validAsiKeys = new Set(
        getAsiMilestones(data.classes).map((milestone) => milestone.key)
    );

    for (const selection of data.classes) {
        const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
        const abilityId = getSpellcastingAbility(selection.classId, selection.subclassId);
        const limits = abilityId
            ? getSpellLimits(selection.classId, selection.level, selection.subclassId, abilities[abilityId])
            : undefined;

        if (!limits) {
            continue;
        }

        const picked = data.spells.byClass[selection.classId];
        const always = getAlwaysPreparedSpells(
            selection.subclassId,
            selection.level,
            { featureChoices: data.featureChoices }
        );
        const ids = [
            ...(picked?.cantrips ?? []),
            ...(picked?.known ?? []),
            ...(picked?.prepared ?? []),
            ...always,
        ];
        const unique = [...new Set(ids)]
            .map((id) => getSpell(id))
            .filter((spell): spell is Spell => Boolean(spell));

        if (unique.length > 0) {
            groups.push({
                title: characterClass?.name ?? selection.classId,
                spells: unique,
            });
        }
    }

    const talentIds = [...data.spells.talent.cantrips, ...data.spells.talent.spells];
    const talentSpells = [...new Set(talentIds)]
        .map((id) => getSpell(id))
        .filter((spell): spell is Spell => Boolean(spell));

    if (talentSpells.length > 0) {
        groups.push({ title: "Talento inicial", spells: talentSpells });
    }

    for (const [key, selection] of Object.entries(data.spells.byFeat)) {
        if (!validAsiKeys.has(key)) continue;
        const featSelection = data.asiSelections[key];
        if (featSelection?.kind !== "feat") continue;
        const feat = DND_TALENTS.find((item) => item.id === featSelection.featId);
        const spells = [...new Set([...selection.cantrips, ...selection.spells])]
            .map((id) => getSpell(id))
            .filter((spell): spell is Spell => Boolean(spell));

        if (spells.length > 0) {
            groups.push({
                title: `${feat?.name ?? "Talento"} (${key.replace(":", " nível ")})`,
                spells,
            });
        }
    }

    return groups;
}

function groupSpellsByLevel(spells: Spell[]): Record<string, Spell[]> {
    return spells
        .slice()
        .sort((left, right) =>
            left.level - right.level || left.name.localeCompare(right.name)
        )
        .reduce<Record<string, Spell[]>>((groups, spell) => {
            const key = String(spell.level);
            groups[key] = [...(groups[key] ?? []), spell];
            return groups;
        }, {});
}

function hasSelectedFeat(data: CharacterFormData, featId: string): boolean {
    if (data.talentId === featId) return true;

    const validKeys = new Set(
        getAsiMilestones(data.classes).map((milestone) => milestone.key)
    );
    return Object.entries(data.asiSelections).some(
        ([key, selection]) =>
            validKeys.has(key) &&
            selection.kind === "feat" &&
            selection.featId === featId
    );
}
