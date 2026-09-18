import type {
    Ability,
    CharacterClassSelection,
    Spell,
    SpellcasterClassId,
} from "../../types/character";
import { DND_SPELLS, getSpell } from "./spells";

export type CasterKind = "full" | "half" | "third" | "pact" | "none";

export interface SpellLimits {
    kind: CasterKind;
    ability: Ability;
    cantrips: number;
    known: number | null;
    prepared: number | null;
    spellbook: boolean;
    maxSpellLevel: number;
    slots: number[];
    pact?: { count: number; level: number };
    arcanumLevels: number[];
}

const FULL_SLOTS: number[][] = [
    [],
    [2],
    [3],
    [4, 2],
    [4, 3],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

const HALF_SLOTS: number[][] = [
    [],
    [],
    [2],
    [3],
    [3],
    [4, 2],
    [4, 2],
    [4, 3],
    [4, 3],
    [4, 3, 2],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2],
];

const THIRD_SLOTS: number[][] = [
    [],
    [],
    [],
    [2],
    [3],
    [3],
    [3],
    [4, 2],
    [4, 2],
    [4, 2],
    [4, 3],
    [4, 3],
    [4, 3],
    [4, 3, 2],
    [4, 3, 2],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 1],
];

const BARD_KNOWN = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22];
const SORCERER_KNOWN = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15];
const WARLOCK_KNOWN = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15];
const RANGER_KNOWN = [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];
const THIRD_KNOWN = [0, 0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13];

const BARD_CANTRIPS = [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const CLERIC_CANTRIPS = [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const DRUID_CANTRIPS = [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const SORCERER_CANTRIPS = [0, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
const WARLOCK_CANTRIPS = [0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const WIZARD_CANTRIPS = [0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

function clampLevel(level: number): number {
    return Math.min(20, Math.max(0, level));
}

export function getCasterKind(classId: string, subclassId: string): CasterKind {
    if (["bard", "cleric", "druid", "sorcerer", "wizard"].includes(classId)) {
        return "full";
    }

    if (classId === "paladin" || classId === "ranger") {
        return "half";
    }

    if (classId === "warlock") {
        return "pact";
    }

    if (classId === "fighter" && subclassId === "eldritch-knight") {
        return "third";
    }

    if (classId === "rogue" && subclassId === "arcane-trickster") {
        return "third";
    }

    return "none";
}

export function getSpellcastingAbility(classId: string, subclassId = ""): Ability | undefined {
    if (["bard", "paladin", "sorcerer", "warlock"].includes(classId)) {
        return "charisma";
    }

    if (["cleric", "druid", "ranger"].includes(classId)) {
        return "wisdom";
    }

    if (
        classId === "wizard" ||
        subclassId === "eldritch-knight" ||
        subclassId === "arcane-trickster"
    ) {
        return "intelligence";
    }

    return undefined;
}

export function getListClassId(classId: string, subclassId: string): SpellcasterClassId | undefined {
    if (subclassId === "eldritch-knight" || subclassId === "arcane-trickster") {
        return "wizard";
    }

    if (
        ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"].includes(
            classId
        )
    ) {
        return classId as SpellcasterClassId;
    }

    return undefined;
}

const SUBCLASS_EXPANDED: Record<string, string[]> = {
    archfey: [
        "faerie-fire", "sleep", "calm-emotions", "phantasmal-force", "blink",
        "plant-growth", "dominate-beast", "greater-invisibility", "dominate-person", "seeming",
    ],
    fiend: [
        "burning-hands", "command", "blindness-deafness", "scorching-ray", "fireball",
        "stinking-cloud", "fire-shield", "wall-of-fire", "flame-strike", "hallow",
    ],
    "great-old-one": [
        "dissonant-whispers", "tashas-hideous-laughter", "detect-thoughts", "phantasmal-force",
        "clairvoyance", "sending", "dominate-beast", "evards-black-tentacles",
        "dominate-person", "telekinesis",
    ],
    celestial: [
        "cure-wounds", "guiding-bolt", "flaming-sphere", "lesser-restoration",
        "daylight", "revivify", "guardian-of-faith", "wall-of-fire",
        "flame-strike", "greater-restoration",
    ],
    hexblade: [
        "shield", "wrathful-smite", "blur", "branding-smite",
        "blink", "elemental-weapon", "phantasmal-killer", "staggering-smite",
        "banishing-smite", "cone-of-cold",
    ],
};

const ALWAYS_PREPARED: Record<string, Array<{ minLevel: number; spells: string[] }>> = {
    "knowledge-domain": [
        { minLevel: 1, spells: ["command", "identify"] },
        { minLevel: 3, spells: ["suggestion", "augury"] },
        { minLevel: 5, spells: ["nondetection", "speak-with-dead"] },
        { minLevel: 7, spells: ["arcane-eye", "confusion"] },
        { minLevel: 9, spells: ["legend-lore", "scrying"] },
    ],
    "life-domain": [
        { minLevel: 1, spells: ["bless", "cure-wounds"] },
        { minLevel: 3, spells: ["lesser-restoration", "spiritual-weapon"] },
        { minLevel: 5, spells: ["beacon-of-hope", "revivify"] },
        { minLevel: 7, spells: ["death-ward", "guardian-of-faith"] },
        { minLevel: 9, spells: ["mass-cure-wounds", "raise-dead"] },
    ],
    "light-domain": [
        { minLevel: 1, spells: ["burning-hands", "faerie-fire"] },
        { minLevel: 3, spells: ["flaming-sphere", "scorching-ray"] },
        { minLevel: 5, spells: ["daylight", "fireball"] },
        { minLevel: 7, spells: ["guardian-of-faith", "wall-of-fire"] },
        { minLevel: 9, spells: ["flame-strike", "scrying"] },
    ],
    "nature-domain": [
        { minLevel: 1, spells: ["animal-friendship", "speak-with-animals"] },
        { minLevel: 3, spells: ["barkskin", "spike-growth"] },
        { minLevel: 5, spells: ["plant-growth", "wind-wall"] },
        { minLevel: 7, spells: ["dominate-beast", "grasping-vine"] },
        { minLevel: 9, spells: ["insect-plague", "tree-stride"] },
    ],
    "tempest-domain": [
        { minLevel: 1, spells: ["fog-cloud", "thunderwave"] },
        { minLevel: 3, spells: ["gust-of-wind", "shatter"] },
        { minLevel: 5, spells: ["call-lightning", "sleet-storm"] },
        { minLevel: 7, spells: ["control-water", "ice-storm"] },
        { minLevel: 9, spells: ["destructive-wave", "insect-plague"] },
    ],
    "trickery-domain": [
        { minLevel: 1, spells: ["charm-person", "disguise-self"] },
        { minLevel: 3, spells: ["mirror-image", "pass-without-trace"] },
        { minLevel: 5, spells: ["blink", "dispel-magic"] },
        { minLevel: 7, spells: ["dimension-door", "polymorph"] },
        { minLevel: 9, spells: ["dominate-person", "modify-memory"] },
    ],
    "war-domain": [
        { minLevel: 1, spells: ["divine-favor", "shield-of-faith"] },
        { minLevel: 3, spells: ["magic-weapon", "spiritual-weapon"] },
        { minLevel: 5, spells: ["crusaders-mantle", "spirit-guardians"] },
        { minLevel: 7, spells: ["freedom-of-movement", "stoneskin"] },
        { minLevel: 9, spells: ["flame-strike", "hold-monster"] },
    ],
    "oath-of-devotion": [
        { minLevel: 3, spells: ["protection-from-evil-and-good", "sanctuary"] },
        { minLevel: 5, spells: ["lesser-restoration", "zone-of-truth"] },
        { minLevel: 9, spells: ["beacon-of-hope", "dispel-magic"] },
        { minLevel: 13, spells: ["freedom-of-movement", "guardian-of-faith"] },
        { minLevel: 17, spells: ["commune", "flame-strike"] },
    ],
    "oath-of-ancients": [
        { minLevel: 3, spells: ["ensnaring-strike", "speak-with-animals"] },
        { minLevel: 5, spells: ["moonbeam", "misty-step"] },
        { minLevel: 9, spells: ["plant-growth", "protection-from-energy"] },
        { minLevel: 13, spells: ["ice-storm", "stoneskin"] },
        { minLevel: 17, spells: ["commune-with-nature", "tree-stride"] },
    ],
    "oath-of-vengeance": [
        { minLevel: 3, spells: ["bane", "hunters-mark"] },
        { minLevel: 5, spells: ["hold-person", "misty-step"] },
        { minLevel: 9, spells: ["haste", "protection-from-energy"] },
        { minLevel: 13, spells: ["banishment", "dimension-door"] },
        { minLevel: 17, spells: ["hold-monster", "scrying"] },
    ],
};

export function getAlwaysPreparedSpells(
    subclassId: string,
    classLevel: number
): string[] {
    const groups = ALWAYS_PREPARED[subclassId] ?? [];

    return groups
        .filter((group) => classLevel >= group.minLevel)
        .flatMap((group) => group.spells);
}

export function getClassSpellList(classId: string, subclassId: string): Spell[] {
    const listClass = getListClassId(classId, subclassId);

    if (!listClass) {
        return [];
    }

    const extra = new Set([
        ...(SUBCLASS_EXPANDED[subclassId] ?? []),
        ...getAlwaysPreparedSpells(subclassId, 20),
    ]);

    return DND_SPELLS.filter((spell) =>
        spell.classes.includes(listClass) || extra.has(spell.id)
    );
}

function maxLevelFromSlots(slots: number[]): number {
    let max = 0;

    slots.forEach((count, index) => {
        if (count > 0) {
            max = index + 1;
        }
    });

    return max;
}

function getWarlockPact(level: number): { count: number; level: number } {
    const slotLevel = level >= 9 ? 5 : level >= 7 ? 4 : level >= 5 ? 3 : level >= 3 ? 2 : 1;
    const count = level >= 17 ? 4 : level >= 11 ? 3 : level >= 2 ? 2 : 1;

    return { count, level: slotLevel };
}

function getArcanumLevels(warlockLevel: number): number[] {
    const levels: number[] = [];

    if (warlockLevel >= 11) levels.push(6);
    if (warlockLevel >= 13) levels.push(7);
    if (warlockLevel >= 15) levels.push(8);
    if (warlockLevel >= 17) levels.push(9);

    return levels;
}

export function getSpellLimits(
    classId: string,
    level: number,
    subclassId: string,
    abilityScore: number
): SpellLimits | undefined {
    const kind = getCasterKind(classId, subclassId);
    const ability = getSpellcastingAbility(classId, subclassId);

    if (kind === "none" || !ability) {
        return undefined;
    }

    const safeLevel = clampLevel(level);
    const modifier = Math.floor((abilityScore - 10) / 2);

    if (kind === "pact") {
        const pact = getWarlockPact(safeLevel);

        return {
            kind,
            ability,
            cantrips: WARLOCK_CANTRIPS[safeLevel],
            known: WARLOCK_KNOWN[safeLevel],
            prepared: null,
            spellbook: false,
            maxSpellLevel: pact.level,
            slots: [],
            pact,
            arcanumLevels: getArcanumLevels(safeLevel),
        };
    }

    const slots =
        kind === "full"
            ? FULL_SLOTS[safeLevel]
            : kind === "half"
                ? HALF_SLOTS[safeLevel]
                : THIRD_SLOTS[safeLevel];

    const maxSpellLevel = maxLevelFromSlots(slots);

    if (classId === "wizard") {
        return {
            kind,
            ability,
            cantrips: WIZARD_CANTRIPS[safeLevel],
            known: 6 + 2 * Math.max(0, safeLevel - 1),
            prepared: Math.max(1, modifier + safeLevel),
            spellbook: true,
            maxSpellLevel,
            slots,
            arcanumLevels: [],
        };
    }

    if (classId === "cleric") {
        return {
            kind,
            ability,
            cantrips: CLERIC_CANTRIPS[safeLevel],
            known: null,
            prepared: Math.max(1, modifier + safeLevel),
            spellbook: false,
            maxSpellLevel,
            slots,
            arcanumLevels: [],
        };
    }

    if (classId === "druid") {
        return {
            kind,
            ability,
            cantrips: DRUID_CANTRIPS[safeLevel],
            known: null,
            prepared: Math.max(1, modifier + safeLevel),
            spellbook: false,
            maxSpellLevel,
            slots,
            arcanumLevels: [],
        };
    }

    if (classId === "paladin") {
        return {
            kind,
            ability,
            cantrips: 0,
            known: null,
            prepared: safeLevel >= 2 ? Math.max(1, modifier + Math.floor(safeLevel / 2)) : 0,
            spellbook: false,
            maxSpellLevel,
            slots,
            arcanumLevels: [],
        };
    }

    if (classId === "bard") {
        return {
            kind,
            ability,
            cantrips: BARD_CANTRIPS[safeLevel],
            known: BARD_KNOWN[safeLevel],
            prepared: null,
            spellbook: false,
            maxSpellLevel,
            slots,
            arcanumLevels: [],
        };
    }

    if (classId === "sorcerer") {
        return {
            kind,
            ability,
            cantrips: SORCERER_CANTRIPS[safeLevel],
            known: SORCERER_KNOWN[safeLevel],
            prepared: null,
            spellbook: false,
            maxSpellLevel,
            slots,
            arcanumLevels: [],
        };
    }

    if (classId === "ranger") {
        return {
            kind,
            ability,
            cantrips: 0,
            known: RANGER_KNOWN[safeLevel],
            prepared: null,
            spellbook: false,
            maxSpellLevel,
            slots,
            arcanumLevels: [],
        };
    }

    return {
        kind,
        ability,
        cantrips: subclassId === "arcane-trickster"
            ? (safeLevel >= 10 ? 4 : safeLevel >= 3 ? 3 : 0)
            : (safeLevel >= 10 ? 3 : safeLevel >= 3 ? 2 : 0),
        known: THIRD_KNOWN[safeLevel],
        prepared: null,
        spellbook: false,
        maxSpellLevel,
        slots,
        arcanumLevels: [],
    };
}

export function getMulticlassCasterLevel(classes: CharacterClassSelection[]): number {
    return classes.reduce((total, selection) => {
        const kind = getCasterKind(selection.classId, selection.subclassId);

        if (kind === "full") {
            return total + selection.level;
        }

        if (kind === "half") {
            return total + Math.floor(selection.level / 2);
        }

        if (kind === "third") {
            return total + Math.floor(selection.level / 3);
        }

        return total;
    }, 0);
}

export function getCombinedSpellSlots(classes: CharacterClassSelection[]): number[] {
    const casterClasses = classes.filter((selection) => {
        const kind = getCasterKind(selection.classId, selection.subclassId);
        return kind === "full" || kind === "half" || kind === "third";
    });

    if (casterClasses.length === 0) {
        return [];
    }

    if (casterClasses.length === 1) {
        const only = casterClasses[0];
        const kind = getCasterKind(only.classId, only.subclassId);
        const table = kind === "full"
            ? FULL_SLOTS
            : kind === "half"
                ? HALF_SLOTS
                : THIRD_SLOTS;

        return table[clampLevel(only.level)] ?? [];
    }

    return FULL_SLOTS[clampLevel(getMulticlassCasterLevel(classes))] ?? [];
}

export function getTalentSpellClass(talentId: string, talentChoices: Record<string, string | string[]>): SpellcasterClassId | undefined {
    const raw = talentChoices.spellcastingClass ?? talentChoices["spellcasting-class"];
    const classId = Array.isArray(raw) ? raw[0] : raw;

    if (talentId === "ritual-caster" && (classId === "cleric" || classId === "wizard")) {
        return classId;
    }

    if (
        talentId === "magic-initiate" &&
        ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"].includes(classId ?? "")
    ) {
        return classId as SpellcasterClassId;
    }

    return undefined;
}

export function getTalentSpellOptions(
    talentId: string,
    listClass: SpellcasterClassId | undefined
): { cantrips: Spell[]; spells: Spell[] } {
    if (talentId === "magic-initiate" && listClass) {
        const list = getSpellsByClassSafe(listClass);

        return {
            cantrips: list.filter((spell) => spell.level === 0),
            spells: list.filter((spell) => spell.level === 1),
        };
    }

    if (talentId === "ritual-caster" && listClass) {
        return {
            cantrips: [],
            spells: getSpellsByClassSafe(listClass).filter(
                (spell) => spell.level === 1 && spell.ritual
            ),
        };
    }

    if (talentId === "spell-sniper") {
        return {
            cantrips: DND_SPELLS.filter((spell) =>
                spell.level === 0 &&
                spell.attack &&
                spell.classes.some((classId) =>
                    ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"].includes(classId)
                )
            ),
            spells: [],
        };
    }

    return { cantrips: [], spells: [] };
}

function getSpellsByClassSafe(classId: SpellcasterClassId): Spell[] {
    return DND_SPELLS.filter((spell) => spell.classes.includes(classId));
}

export function isPreferredSchool(
    subclassId: string,
    spellId: string
): boolean {
    const spell = getSpell(spellId);

    if (!spell) {
        return false;
    }

    if (subclassId === "eldritch-knight") {
        return spell.school === "abjuration" || spell.school === "evocation";
    }

    if (subclassId === "arcane-trickster") {
        return spell.school === "enchantment" || spell.school === "illusion";
    }

    return true;
}

export function emptyClassSelection() {
    return {
        cantrips: [] as string[],
        known: [] as string[],
        prepared: [] as string[],
    };
}
