import type { CharacterFormData, Spell } from "../../types/character";
import { getEquipmentItem, MARTIAL_MELEE_WEAPON_IDS, SIMPLE_MELEE_WEAPON_IDS } from "./equipment";
import {
  canTakeEldritchInvocation,
  getEldritchInvocation,
  getEldritchInvocationLimit,
  getPactBoon,
  getSelectedEldritchInvocations,
  getWarlockCantrips,
} from "./eldritchInvocations";
import { DND_SPELLS, getSpell } from "./spells";

export const WARLOCK_PACT_TOME_CANTRIPS_KEY = "warlock:pact-tome-cantrips";
export const WARLOCK_BOOK_CANTTRIPS_KEY = "warlock:book-secrets-cantrips";
export const WARLOCK_BOOK_RITUALS_KEY = "warlock:book-secrets-rituals";
export const WARLOCK_PACT_BLADE_WEAPON_KEY = "warlock:pact-blade-weapon";
export const WARLOCK_LIFEDRINKER_DAMAGE_KEY = "warlock:lifedrinker-damage";
export const WARLOCK_HEX_WEAPON_KEY = "warlock:hex-warrior-weapon";

export const LIFEDRINKER_DAMAGE_TYPES = [
  { id: "necrotic", name: "Necrótico" },
  { id: "radiant", name: "Radiante" },
  { id: "force", name: "Força" },
] as const;

/** Armas corpo a corpo de uma mão (Guerreiro Hexagonal). */
export const HEX_WARRIOR_WEAPON_IDS = [
  "battleaxe",
  "flail",
  "longsword",
  "morningstar",
  "rapier",
  "scimitar",
  "shortsword",
  "trident",
  "war-pick",
  "warhammer",
  "whip",
  "hand-crossbow",
] as const;

const CASTER_CLASSES = [
  "bard",
  "cleric",
  "druid",
  "sorcerer",
  "warlock",
  "wizard",
] as const;

export function getUniversalCantrips(): Spell[] {
  const seen = new Set<string>();
  return DND_SPELLS.filter((spell) => {
    if (spell.level !== 0) return false;
    if (!spell.classes.some((classId) => CASTER_CLASSES.includes(classId as typeof CASTER_CLASSES[number]))) {
      return false;
    }
    if (seen.has(spell.id)) return false;
    seen.add(spell.id);
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function getLevel1RitualSpells(): Spell[] {
  return DND_SPELLS.filter(
    (spell) =>
      spell.level === 1 &&
      spell.ritual &&
      spell.classes.some((classId) =>
        CASTER_CLASSES.includes(classId as typeof CASTER_CLASSES[number])
      )
  ).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function getPactBladeWeaponOptions() {
  const ids = [...SIMPLE_MELEE_WEAPON_IDS, ...MARTIAL_MELEE_WEAPON_IDS];
  return ids
    .map((id) => getEquipmentItem(id))
    .filter(Boolean)
    .map((item) => item!);
}

export function getHexWarriorWeaponOptions() {
  return HEX_WARRIOR_WEAPON_IDS.map((id) => getEquipmentItem(id)).filter(Boolean);
}

function choiceValues(
  featureChoices: Record<string, string[]> | undefined,
  key: string
): string[] {
  return (featureChoices?.[key] ?? []).filter(Boolean);
}

export function getPactTomeCantrips(
  featureChoices: Record<string, string[]> | undefined
): string[] {
  return choiceValues(featureChoices, WARLOCK_PACT_TOME_CANTRIPS_KEY);
}

export function getBookOfSecretsCantrips(
  featureChoices: Record<string, string[]> | undefined
): string[] {
  return choiceValues(featureChoices, WARLOCK_BOOK_CANTTRIPS_KEY);
}

export function getBookOfSecretsRituals(
  featureChoices: Record<string, string[]> | undefined
): string[] {
  return choiceValues(featureChoices, WARLOCK_BOOK_RITUALS_KEY);
}

export function getPactBladeWeaponId(
  featureChoices: Record<string, string[]> | undefined
): string | null {
  return choiceValues(featureChoices, WARLOCK_PACT_BLADE_WEAPON_KEY)[0] ?? null;
}

export function getLifedrinkerDamageType(
  featureChoices: Record<string, string[]> | undefined
): string | null {
  return choiceValues(featureChoices, WARLOCK_LIFEDRINKER_DAMAGE_KEY)[0] ?? null;
}

export function getHexWarriorWeaponId(
  featureChoices: Record<string, string[]> | undefined
): string | null {
  return choiceValues(featureChoices, WARLOCK_HEX_WEAPON_KEY)[0] ?? null;
}

export function getWarlockSubclassId(data: CharacterFormData): string | null {
  return data.classes.find((item) => item.classId === "warlock")?.subclassId ?? null;
}

export function getAllWarlockChoicesIssues(
  data: CharacterFormData,
  warlockLevel: number
): string[] {
  const issues: string[] = [];
  const pactBoon = getPactBoon(data.featureChoices);
  const selected = getSelectedEldritchInvocations(data.featureChoices);
  const cantrips = getWarlockCantrips(data);
  const limit = getEldritchInvocationLimit(warlockLevel);

  if (warlockLevel >= 3 && !pactBoon) {
    issues.push("Escolha a Dádiva de Pacto do bruxo.");
  }

  if (warlockLevel >= 2 && selected.length < limit) {
    issues.push(
      `Escolha ${limit} Invocação${limit === 1 ? "" : "ões"} Mística${limit === 1 ? "" : "s"}.`
    );
  }

  selected.forEach((id) => {
    const invocation = getEldritchInvocation(id);
    if (!invocation) {
      issues.push("Remova uma invocação mística inválida.");
      return;
    }
    if (!canTakeEldritchInvocation(invocation, warlockLevel, selected, pactBoon, cantrips)) {
      issues.push(`A invocação "${invocation.name}" não cumpre os pré-requisitos.`);
    }
  });

  issues.push(...getWarlockPactExtrasIssues(data, warlockLevel));
  return issues;
}

export function getWarlockPactExtrasIssues(
  data: CharacterFormData,
  warlockLevel: number
): string[] {
  const issues: string[] = [];
  const pactBoon = getPactBoon(data.featureChoices);
  const invocations = getSelectedEldritchInvocations(data.featureChoices);
  const subclassId = getWarlockSubclassId(data);

  if (pactBoon === "pact-of-the-tome" && warlockLevel >= 3) {
    const tomeCantrips = getPactTomeCantrips(data.featureChoices);
    if (tomeCantrips.length < 3) {
      issues.push("Escolha 3 truques do Pacto do Tomo.");
    }
    const warlockCantrips = data.spells.byClass.warlock?.cantrips ?? [];
    const overlap = tomeCantrips.filter((id) => warlockCantrips.includes(id));
    if (overlap.length > 0) {
      issues.push("Truques do Tomo não podem repetir truques normais do bruxo.");
    }
    if (new Set(tomeCantrips).size !== tomeCantrips.length) {
      issues.push("Os truques do Tomo devem ser únicos.");
    }
  }

  if (pactBoon === "pact-of-the-blade" && warlockLevel >= 3) {
    if (!getPactBladeWeaponId(data.featureChoices)) {
      issues.push("Escolha a arma vinculada do Pacto da Lâmina.");
    }
  }

  if (invocations.includes("book-of-ancient-secrets")) {
    const bookCantrips = getBookOfSecretsCantrips(data.featureChoices);
    const bookRituals = getBookOfSecretsRituals(data.featureChoices);
    if (bookCantrips.length < 2) {
      issues.push("Escolha 2 truques do Livro dos Segredos Antigos.");
    }
    if (bookRituals.length < 2) {
      issues.push("Escolha 2 rituais de 1º nível do Livro dos Segredos Antigos.");
    }
    bookRituals.forEach((id) => {
      const spell = getSpell(id);
      if (!spell?.ritual || spell.level !== 1) {
        issues.push(`"${spell?.name ?? id}" não é um ritual de 1º nível válido.`);
      }
    });
  }

  if (invocations.includes("lifedrinker") && warlockLevel >= 12) {
    const damage = getLifedrinkerDamageType(data.featureChoices);
    if (!damage || !LIFEDRINKER_DAMAGE_TYPES.some((item) => item.id === damage)) {
      issues.push("Escolha o tipo de dano extra do Bebedor de Vida.");
    }
  }

  if (subclassId === "hexblade" && warlockLevel >= 1) {
    if (!getHexWarriorWeaponId(data.featureChoices)) {
      issues.push("Escolha a arma de uma mão do Guerreiro Hexagonal.");
    }
  }

  return issues;
}

/** Truques/magias extras concedidas pelo bruxo (exibição na ficha). */
export function getWarlockGrantedSpells(data: CharacterFormData): Array<{
  id: string;
  name: string;
  source: string;
}> {
  const granted: Array<{ id: string; name: string; source: string }> = [];
  const pactBoon = getPactBoon(data.featureChoices);

  if (getWarlockSubclassId(data) === "celestial") {
    ["light", "sacred-flame"].forEach((id) => {
      const spell = getSpell(id);
      if (spell) {
        granted.push({ id, name: spell.name, source: "Patrono Celestial (truques bônus)" });
      }
    });
  }

  if (pactBoon === "pact-of-the-chain") {
    const spell = getSpell("find-familiar");
    if (spell) {
      granted.push({
        id: spell.id,
        name: spell.name,
        source: "Pacto da Corrente (ritual)",
      });
    }
  }

  getPactTomeCantrips(data.featureChoices).forEach((id) => {
    const spell = getSpell(id);
    if (spell) {
      granted.push({ id, name: spell.name, source: "Pacto do Tomo" });
    }
  });

  getBookOfSecretsCantrips(data.featureChoices).forEach((id) => {
    const spell = getSpell(id);
    if (spell) {
      granted.push({ id, name: spell.name, source: "Livro dos Segredos Antigos" });
    }
  });

  getBookOfSecretsRituals(data.featureChoices).forEach((id) => {
    const spell = getSpell(id);
    if (spell) {
      granted.push({ id, name: spell.name, source: "Livro dos Segredos Antigos (ritual)" });
    }
  });

  return granted;
}

export function getWarlockPactSummary(data: CharacterFormData): string[] {
  const lines: string[] = [];
  const pactBoon = getPactBoon(data.featureChoices);
  const boon = pactBoon
    ? { "pact-of-the-chain": "Pacto da Corrente", "pact-of-the-blade": "Pacto da Lâmina", "pact-of-the-tome": "Pacto do Tomo" }[pactBoon]
    : null;

  if (boon) lines.push(`Dádiva: ${boon}`);

  const bladeWeapon = getPactBladeWeaponId(data.featureChoices);
  if (bladeWeapon) {
    lines.push(`Arma de pacto: ${getEquipmentItem(bladeWeapon)?.name ?? bladeWeapon}`);
  }

  const hexWeapon = getHexWarriorWeaponId(data.featureChoices);
  if (hexWeapon) {
    lines.push(`Guerreiro Hexagonal: ${getEquipmentItem(hexWeapon)?.name ?? hexWeapon}`);
  }

  const lifedrinker = getLifedrinkerDamageType(data.featureChoices);
  if (lifedrinker) {
    const label = LIFEDRINKER_DAMAGE_TYPES.find((item) => item.id === lifedrinker)?.name ?? lifedrinker;
    lines.push(`Bebedor de Vida: dano ${label.toLowerCase()}`);
  }

  return lines;
}
