import type {
    Ability,
    Alignment,
    CharacterFormData,
    CharacterTalent,
    CharacterTalentChoice,
    Skill,
} from "../types/character";
import { ABILITIES } from "../data/dnd/abilities";
import { DND_BACKGROUNDS } from "../data/dnd/backgrounds";
import { getAsiMilestones } from "../data/dnd/classFeatures";
import { DND_CLASSES } from "../data/dnd/classes";
import {
    BATTLE_MASTER_MANEUVERS,
    BATTLE_MASTER_MANEUVERS_KEY,
    getBattleManeuverLimit,
} from "../data/dnd/battleMasterManeuvers";
import {
    BARBARIAN_TOTEM_ASPECT_KEY,
    BARBARIAN_TOTEM_ATTUNEMENT_KEY,
    BARBARIAN_TOTEM_SPIRIT_KEY,
} from "../data/dnd/totemBarbarian";
import {
    DRACONIC_ANCESTRY_KEY,
    DRACONIC_ANCESTRIES,
} from "../data/dnd/draconicAncestry";
import {
    DRUID_LAND_BONUS_CANTRIP_KEY,
    DRUID_LAND_TERRAIN_KEY,
    LAND_TERRAINS,
} from "../data/dnd/landCircle";
import {
    ELEMENTAL_DISCIPLINES,
    FOUR_ELEMENTS_DISCIPLINE_KEY,
    getFourElementsDisciplineLimit,
} from "../data/dnd/elementalDisciplines";
import {
    PACT_BOONS,
    WARLOCK_PACT_BOON_KEY,
} from "../data/dnd/eldritchInvocations";
import {
    FIGHTING_STYLE_2_KEY,
    FIGHTING_STYLE_KEY,
    fightingStylesForClass,
} from "../data/dnd/fightingStyles";
import {
    METAMAGIC_OPTIONS,
    SORCERER_METAMAGIC_KEY,
    getMetamagicLimit,
} from "../data/dnd/metamagicOptions";
import { DND_RACES } from "../data/dnd/races";
import { DND_TALENTS } from "../data/dnd/talents";
import {
    getResolvedSkillChoices,
    getResolvedSkillProficiencies,
} from "../data/dnd/raceResolution";
import { DND_SKILLS, syncSkillProficiencyFlags } from "../data/dnd/skills";
import { getFinalAbilities } from "../data/dnd/characterStats";
import { getSpell } from "../data/dnd/spells";
import {
    getClassSpellList,
    getSpellLimits,
    getSpellcastingAbility,
    getTalentSpellClass,
    getTalentSpellOptions,
} from "../data/dnd/spellcasting";
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
} from "../data/dnd/rangerOptions";
import { ensureClassEquipmentDefaults } from "./equipmentSlots";

const ALIGNMENTS: Alignment[] = [
    "lawful-good",
    "neutral-good",
    "chaotic-good",
    "lawful-neutral",
    "true-neutral",
    "chaotic-neutral",
    "lawful-evil",
    "neutral-evil",
    "chaotic-evil",
];

const RANDOM_NAMES = [
    "Aldric",
    "Bruna",
    "Cael",
    "Darian",
    "Elara",
    "Fenris",
    "Gisela",
    "Haldor",
    "Iria",
    "Jorah",
    "Kaelen",
    "Lyra",
    "Mira",
    "Nolan",
    "Orin",
    "Petra",
    "Quinn",
    "Rurik",
    "Sera",
    "Thalen",
    "Ulma",
    "Viktor",
    "Wren",
    "Yara",
    "Zeph",
    "Amara",
    "Bren",
    "Corin",
    "Dessa",
    "Ewan",
];

const PRIMARY_ABILITY: Record<string, Ability> = {
    barbarian: "strength",
    bard: "charisma",
    cleric: "wisdom",
    druid: "wisdom",
    fighter: "strength",
    monk: "dexterity",
    paladin: "strength",
    ranger: "dexterity",
    rogue: "dexterity",
    sorcerer: "charisma",
    warlock: "charisma",
    wizard: "intelligence",
};

const LANGUAGE_IDS = [
    "dwarvish",
    "elvish",
    "giant",
    "gnomish",
    "goblin",
    "halfling",
    "orc",
    "abyssal",
    "celestial",
    "draconic",
    "deep-speech",
    "infernal",
    "primordial",
    "sylvan",
    "undercommon",
];

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

function pickRandomMany<T>(items: T[], count: number): T[] {
    const pool = [...items];
    const picked: T[] = [];
    while (picked.length < count && pool.length > 0) {
        const index = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(index, 1)[0]);
    }
    return picked;
}

function roll4d6DropLowest(): number {
    const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((total, value) => total + value, 0);
}

function rollAbilityScores(): Record<Ability, number> {
    const rolled = ABILITIES.map(() => roll4d6DropLowest());
    const shuffled = pickRandomMany(rolled, rolled.length);
    return Object.fromEntries(
        ABILITIES.map((ability, index) => [ability.id, shuffled[index] ?? 10])
    ) as Record<Ability, number>;
}

function resolveSubclassId(
    classId: string,
    level: number
): string {
    const characterClass = DND_CLASSES.find((item) => item.id === classId);
    if (!characterClass?.subclasses.length) return "";
    const available = characterClass.subclasses.filter(
        (subclass) => level >= subclass.level
    );
    return available.length ? pickRandom(available).id : "";
}

function meetsTalentPrerequisites(
    talent: CharacterTalent,
    data: CharacterFormData
): boolean {
    const pre = talent.prerequisites;
    if (!pre) return true;

    const abilities = getFinalAbilities(data);
    if (pre.abilities) {
        for (const [ability, minimum] of Object.entries(pre.abilities)) {
            if ((abilities[ability as Ability] ?? 0) < (minimum ?? 0)) {
                return false;
            }
        }
    }

    if (pre.class?.length) {
        const classId = data.classes[0]?.classId;
        if (!classId || !pre.class.includes(classId)) return false;
    }

    if (pre.race?.length) {
        if (!pre.race.includes(data.raceId)) return false;
    }

    return true;
}

function choicePoolForTalent(
    choice: CharacterTalentChoice,
    data: CharacterFormData
): string[] {
    if (choice.options?.length) return [...choice.options];

    if (choice.type === "maneuver") {
        return BATTLE_MASTER_MANEUVERS.map((maneuver) => maneuver.id);
    }

    if (choice.type === "skill") {
        const fixedRace = getResolvedSkillProficiencies(data);
        const taken = new Set<Skill>([
            ...fixedRace,
            ...(data.skillProficiencies?.class ?? []),
            ...(data.skillProficiencies?.race ?? []),
            ...(data.skillProficiencies?.background ?? []),
            ...(data.skillProficiencies?.talent ?? []),
        ]);
        return DND_SKILLS.map((skill) => skill.id).filter(
            (skill) => !choice.excludeProficient || !taken.has(skill)
        );
    }

    return [];
}

function buildRandomTalentChoices(
    talent: CharacterTalent,
    data: CharacterFormData
): Record<string, string | string[]> {
    const talentChoices: Record<string, string | string[]> = {};

    for (const choice of talent.choices ?? []) {
        const pool = choicePoolForTalent(choice, data);
        const picked = pickRandomMany(pool, choice.count);
        if (picked.length === 0) continue;
        talentChoices[choice.id] =
            choice.count === 1 ? picked[0] : picked;
    }

    const asi = talent.abilityScoreIncrease;
    if (asi?.choices && asi.choices.length > 0) {
        talentChoices.abilityScoreIncrease = pickRandom(asi.choices);
    }

    return talentChoices;
}

function assignRandomTalent(data: CharacterFormData): CharacterFormData {
    const eligible = DND_TALENTS.filter((talent) =>
        meetsTalentPrerequisites(talent, data)
    );
    const talent = pickRandom(
        eligible.length > 0 ? eligible : DND_TALENTS
    );
    const talentChoices = buildRandomTalentChoices(talent, data);

    let talentSkills: Skill[] = [];
    if (talent.id === "skilled") {
        const raw = talentChoices.skills;
        talentSkills = (
            Array.isArray(raw) ? raw : raw ? [raw] : []
        ) as Skill[];
    }

    return {
        ...data,
        talentId: talent.id,
        talentChoices,
        skillProficiencies: {
            ...(data.skillProficiencies ?? {}),
            talent: talentSkills,
        },
    };
}

function fillTalentSpells(data: CharacterFormData): CharacterFormData {
    const listClass = getTalentSpellClass(data.talentId, data.talentChoices);
    const options = getTalentSpellOptions(data.talentId, listClass);
    if (
        options.cantrips.length === 0 &&
        options.spells.length === 0
    ) {
        return data;
    }

    const cantripLimit =
        data.talentId === "spell-sniper"
            ? 1
            : data.talentId === "magic-initiate"
              ? 2
              : 0;
    const spellLimit =
        data.talentId === "ritual-caster"
            ? 2
            : data.talentId === "magic-initiate"
              ? 1
              : 0;

    const cantripIds = pickRandomMany(
        options.cantrips.map((spell) => spell.id),
        cantripLimit
    );
    const spellIds = pickRandomMany(
        options.spells.map((spell) => spell.id),
        spellLimit
    );

    return {
        ...data,
        spells: {
            ...data.spells,
            talent: {
                cantrips: cantripIds,
                spells: spellIds,
            },
        },
    };
}

function fillAsiSelections(
    data: CharacterFormData,
    primaryAbility: Ability
): CharacterFormData {
    const asiSelections = { ...data.asiSelections };
    for (const milestone of getAsiMilestones(data.classes)) {
        if (asiSelections[milestone.key]) continue;
        asiSelections[milestone.key] = {
            kind: "ability",
            mode: "single",
            abilities: [primaryAbility],
        };
    }
    return { ...data, asiSelections };
}

function fillFeatureChoices(data: CharacterFormData): CharacterFormData {
    const featureChoices: Record<string, string[]> = {
        ...(data.featureChoices ?? {}),
    };

    for (const selection of data.classes) {
        const { classId, subclassId, level } = selection;

        if (
            (classId === "fighter" ||
                classId === "paladin" ||
                classId === "ranger") &&
            level >= (classId === "fighter" ? 1 : 2)
        ) {
            if (!featureChoices[FIGHTING_STYLE_KEY]?.[0]) {
                const styles = fightingStylesForClass(
                    classId as "fighter" | "paladin" | "ranger"
                );
                if (styles[0]) {
                    featureChoices[FIGHTING_STYLE_KEY] = [styles[0].id];
                }
            }
        }

        if (
            classId === "fighter" &&
            subclassId === "champion" &&
            level >= 10 &&
            !featureChoices[FIGHTING_STYLE_2_KEY]?.[0]
        ) {
            const styles = fightingStylesForClass("fighter");
            const second =
                styles.find(
                    (style) => style.id !== featureChoices[FIGHTING_STYLE_KEY]?.[0]
                ) ?? styles[1];
            if (second) featureChoices[FIGHTING_STYLE_2_KEY] = [second.id];
        }

        if (classId === "fighter" && subclassId === "battle-master" && level >= 3) {
            const limit = getBattleManeuverLimit(level);
            if ((featureChoices[BATTLE_MASTER_MANEUVERS_KEY] ?? []).length < limit) {
                featureChoices[BATTLE_MASTER_MANEUVERS_KEY] =
                    BATTLE_MASTER_MANEUVERS.slice(0, limit).map(
                        (maneuver) => maneuver.id
                    );
            }
        }

        if (classId === "sorcerer" && level >= 3) {
            const limit = getMetamagicLimit(level);
            if ((featureChoices[SORCERER_METAMAGIC_KEY] ?? []).length < limit) {
                featureChoices[SORCERER_METAMAGIC_KEY] =
                    METAMAGIC_OPTIONS.slice(0, limit).map((entry) => entry.id);
            }
        }

        if (classId === "sorcerer" && subclassId === "draconic-bloodline") {
            if (!featureChoices[DRACONIC_ANCESTRY_KEY]?.[0]) {
                featureChoices[DRACONIC_ANCESTRY_KEY] = [
                    DRACONIC_ANCESTRIES[0].id,
                ];
            }
        }

        if (classId === "druid" && subclassId === "circle-of-the-land" && level >= 2) {
            if (!featureChoices[DRUID_LAND_TERRAIN_KEY]?.[0]) {
                featureChoices[DRUID_LAND_TERRAIN_KEY] = [LAND_TERRAINS[0].id];
            }
            if (!featureChoices[DRUID_LAND_BONUS_CANTRIP_KEY]?.[0]) {
                const cantrip = getClassSpellList("druid", subclassId).find(
                    (spell) => spell.level === 0
                );
                if (cantrip) {
                    featureChoices[DRUID_LAND_BONUS_CANTRIP_KEY] = [cantrip.id];
                }
            }
        }

        if (classId === "barbarian" && subclassId === "totem-warrior") {
            if (level >= 3 && !featureChoices[BARBARIAN_TOTEM_SPIRIT_KEY]?.[0]) {
                featureChoices[BARBARIAN_TOTEM_SPIRIT_KEY] = ["bear"];
            }
            if (level >= 6 && !featureChoices[BARBARIAN_TOTEM_ASPECT_KEY]?.[0]) {
                featureChoices[BARBARIAN_TOTEM_ASPECT_KEY] = ["bear"];
            }
            if (level >= 14 && !featureChoices[BARBARIAN_TOTEM_ATTUNEMENT_KEY]?.[0]) {
                featureChoices[BARBARIAN_TOTEM_ATTUNEMENT_KEY] = ["bear"];
            }
        }

        if (classId === "ranger") {
            const enemyLimit = favoredEnemyLimit(level);
            if (
                (featureChoices[RANGER_FAVORED_ENEMIES_KEY] ?? []).length <
                enemyLimit
            ) {
                featureChoices[RANGER_FAVORED_ENEMIES_KEY] =
                    FAVORED_ENEMY_TYPES.slice(0, enemyLimit).map(
                        (entry) => entry.id
                    );
            }
            const terrainLimit = favoredTerrainLimit(level);
            if (
                (featureChoices[RANGER_FAVORED_TERRAINS_KEY] ?? []).length <
                terrainLimit
            ) {
                featureChoices[RANGER_FAVORED_TERRAINS_KEY] =
                    FAVORED_TERRAINS.slice(0, terrainLimit).map(
                        (entry) => entry.id
                    );
            }
        }

        if (classId === "ranger" && subclassId === "hunter") {
            if (level >= 3 && !featureChoices[RANGER_HUNTER_PREY_KEY]?.[0]) {
                featureChoices[RANGER_HUNTER_PREY_KEY] = [
                    HUNTER_PREY_OPTIONS[0].id,
                ];
            }
            if (level >= 7 && !featureChoices[RANGER_HUNTER_DEFENSE_KEY]?.[0]) {
                featureChoices[RANGER_HUNTER_DEFENSE_KEY] = [
                    HUNTER_DEFENSE_OPTIONS[0].id,
                ];
            }
            if (level >= 11 && !featureChoices[RANGER_HUNTER_MULTIATTACK_KEY]?.[0]) {
                featureChoices[RANGER_HUNTER_MULTIATTACK_KEY] = [
                    HUNTER_MULTIATTACK_OPTIONS[0].id,
                ];
            }
            if (level >= 15 && !featureChoices[RANGER_HUNTER_SUPERIOR_KEY]?.[0]) {
                featureChoices[RANGER_HUNTER_SUPERIOR_KEY] = [
                    HUNTER_SUPERIOR_OPTIONS[0].id,
                ];
            }
        }

        if (classId === "ranger" && subclassId === "beast-master" && level >= 3) {
            if (!featureChoices[RANGER_BEAST_COMPANION_KEY]?.[0]) {
                featureChoices[RANGER_BEAST_COMPANION_KEY] = ["wolf"];
            }
        }

        if (classId === "warlock" && level >= 3) {
            if (!featureChoices[WARLOCK_PACT_BOON_KEY]?.[0]) {
                featureChoices[WARLOCK_PACT_BOON_KEY] = [PACT_BOONS[0].id];
            }
        }

        if (
            classId === "monk" &&
            subclassId === "way-of-four-elements" &&
            level >= 3
        ) {
            const limit = getFourElementsDisciplineLimit(level);
            const current = featureChoices[FOUR_ELEMENTS_DISCIPLINE_KEY] ?? [];
            if (current.length < limit) {
                featureChoices[FOUR_ELEMENTS_DISCIPLINE_KEY] =
                    ELEMENTAL_DISCIPLINES.slice(0, limit).map(
                        (discipline) => discipline.id
                    );
            }
        }
    }

    return { ...data, featureChoices };
}

function fillSpells(data: CharacterFormData): CharacterFormData {
    const byClass = { ...data.spells.byClass };
    const abilities = getFinalAbilities(data);

    for (const selection of data.classes) {
        const abilityId = getSpellcastingAbility(
            selection.classId,
            selection.subclassId
        );
        if (!abilityId) continue;

        const limits = getSpellLimits(
            selection.classId,
            selection.level,
            selection.subclassId,
            abilities[abilityId]
        );
        if (!limits || limits.kind === "none") continue;
        if (limits.cantrips === 0 && limits.maxSpellLevel === 0 && !limits.pact) {
            continue;
        }

        const list = getClassSpellList(selection.classId, selection.subclassId);
        const cantripPool = list
            .filter((spell) => spell.level === 0)
            .map((spell) => spell.id);
        const cantripIds = pickRandomMany(cantripPool, limits.cantrips);

        const leveledSpells = list.filter(
            (spell) =>
                spell.level > 0 && spell.level <= limits.maxSpellLevel
        );
        const leveledIds = leveledSpells.map((spell) => spell.id);

        const known: string[] = [...cantripIds];

        if (limits.known != null && limits.known > 0) {
            const regular = leveledIds.filter(
                (id) =>
                    !limits.arcanumLevels.includes(getSpell(id)?.level ?? 0)
            );
            known.push(...pickRandomMany(regular, limits.known));
        }

        if (limits.kind === "pact") {
            for (const circle of limits.arcanumLevels) {
                const pool = leveledSpells
                    .filter((spell) => spell.level === circle)
                    .map((spell) => spell.id);
                const arcanum = pool.length ? pickRandom(pool) : undefined;
                if (arcanum) known.push(arcanum);
            }
        }

        let prepared = [...known];
        if (limits.prepared != null && limits.prepared > 0) {
            prepared = [
                ...pickRandomMany(leveledIds, limits.prepared),
            ];
            for (const id of cantripIds) {
                if (!prepared.includes(id)) prepared.unshift(id);
            }
        }

        byClass[selection.classId] = {
            cantrips: cantripIds,
            known: [...new Set(known)],
            prepared: [...new Set(prepared)],
        };
    }

    return {
        ...data,
        spells: {
            ...data.spells,
            byClass,
        },
    };
}

function fillSkillsAndBackground(data: CharacterFormData): CharacterFormData {
    const primary = data.classes[0];
    const characterClass = primary
        ? DND_CLASSES.find((item) => item.id === primary.classId)
        : undefined;

    const classSkills = pickRandomMany(
        characterClass?.skillProficiencies.from ?? [],
        characterClass?.skillProficiencies.choose ?? 0
    );

    const raceSkillOptions = getResolvedSkillChoices(data);
    const raceSkills = pickRandomMany(
        raceSkillOptions?.skills ?? [],
        raceSkillOptions?.count ?? 0
    );

    const background = DND_BACKGROUNDS.find(
        (item) => item.id === data.backgroundId
    );
    const baseBackgroundSkills = background?.skillProficiencies ?? [];
    const nonBackground = new Set<Skill>([
        ...getResolvedSkillProficiencies(data),
        ...classSkills,
        ...raceSkills,
    ]);
    const replacementCount = baseBackgroundSkills.filter((skill) =>
        nonBackground.has(skill)
    ).length;
    const replacementPool = DND_SKILLS.map((skill) => skill.id).filter(
        (skill) =>
            !nonBackground.has(skill) && !baseBackgroundSkills.includes(skill)
    );
    const replacementSkills = pickRandomMany(
        replacementPool,
        replacementCount
    );

    const backgroundSkills = [
        ...baseBackgroundSkills,
        ...replacementSkills,
    ];

    const talentSkills = (data.skillProficiencies?.talent ??
        []) as Skill[];

    return syncSkillProficiencyFlags({
        ...data,
        skillProficiencies: {
            class: classSkills,
            race: raceSkills,
            background: backgroundSkills,
            talent: talentSkills,
        },
        backgroundChoices: {
            ...data.backgroundChoices,
            skills: replacementSkills,
            tools:
                background?.toolChoice != null
                    ? pickRandomMany(
                          background.toolChoice.options,
                          background.toolChoice.count
                      )
                    : data.backgroundChoices.tools,
            languages:
                background?.languageChoices != null
                    ? pickRandomMany(
                          LANGUAGE_IDS,
                          background.languageChoices
                      )
                    : data.backgroundChoices.languages,
        },
    });
}

export function generateRandomCharacter(
    classId: string,
    level: number
): CharacterFormData {
    const clampedLevel = Math.min(20, Math.max(1, Math.floor(level) || 1));
    const characterClass = DND_CLASSES.find((item) => item.id === classId);
    if (!characterClass) {
        throw new Error("CLASS_NOT_FOUND");
    }

    const race = pickRandom(DND_RACES);
    const subrace =
        race.subraces?.length ? pickRandom(race.subraces) : undefined;
    const background = pickRandom(DND_BACKGROUNDS);
    const primaryAbility = PRIMARY_ABILITY[classId] ?? "strength";
    const subclassId = resolveSubclassId(classId, clampedLevel);

    const abilityScoreChoices =
        subrace?.abilityScoreChoices ?? race.abilityScoreChoices;
    const raceChoices: Record<string, string[]> = {};
    if (abilityScoreChoices) {
        raceChoices.abilityScoreIncrease = pickRandomMany(
            abilityScoreChoices.abilities,
            abilityScoreChoices.count
        );
    }

    let data: CharacterFormData = {
        name: pickRandom(RANDOM_NAMES),
        avatar: null,
        raceId: race.id,
        subraceId: subrace?.id ?? "",
        raceChoices,
        classes: [
            {
                classId,
                level: clampedLevel,
                subclassId,
            },
        ],
        talentId: "",
        talentChoices: {},
        backgroundId: background.id,
        backgroundChoices: {
            skills: [],
            tools: [],
            languages: [],
        },
        alignment: pickRandom(ALIGNMENTS),
        abilities: rollAbilityScores(),
        skills: {
            acrobatics: { proficient: false, expertise: false },
            "animal-handling": { proficient: false, expertise: false },
            arcana: { proficient: false, expertise: false },
            athletics: { proficient: false, expertise: false },
            deception: { proficient: false, expertise: false },
            history: { proficient: false, expertise: false },
            insight: { proficient: false, expertise: false },
            intimidation: { proficient: false, expertise: false },
            investigation: { proficient: false, expertise: false },
            medicine: { proficient: false, expertise: false },
            nature: { proficient: false, expertise: false },
            perception: { proficient: false, expertise: false },
            performance: { proficient: false, expertise: false },
            persuasion: { proficient: false, expertise: false },
            religion: { proficient: false, expertise: false },
            "sleight-of-hand": { proficient: false, expertise: false },
            stealth: { proficient: false, expertise: false },
            survival: { proficient: false, expertise: false },
        },
        skillProficiencies: {
            class: [],
            race: [],
            background: [],
            talent: [],
        },
        equipment: {
            classId: "",
            choiceSelections: {},
            manualItems: [],
            customItems: [],
            removedItems: [],
            attunedSlots: [null, null, null],
            activeSlots: [null, null, null, null, null],
        },
        wallet: { pl: 0, po: 0, pp: 0 },
        spells: {
            byClass: {},
            talent: { cantrips: [], spells: [] },
            byFeat: {},
        },
        lore: "",
        quests: "",
        loreDetails: {
            appearance: "",
            personalityTraits: "",
            ideals: "",
            bonds: "",
            flaws: "",
        },
        hitPoints: null,
        xp: 0,
        asiSelections: {},
        featureChoices: {},
    };

    data = assignRandomTalent(data);
    data = fillSkillsAndBackground(data);
    data = fillAsiSelections(data, primaryAbility);
    data = fillFeatureChoices(data);
    data = fillSpells(data);
    data = fillTalentSpells(data);
    data = ensureClassEquipmentDefaults(data);
    data = syncSkillProficiencyFlags(data);

    return data;
}
