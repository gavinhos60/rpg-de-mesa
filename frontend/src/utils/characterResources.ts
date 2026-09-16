import type {
  Ability,
  CharacterFormData,
  CharacterResourcesState,
  RestKind,
} from "../types/character";
import { getAbilityModifier } from "../data/dnd/abilities";
import { getFinalAbilities } from "../data/dnd/characterStats";
import {
  getCombinedSpellSlots,
  getSpellLimits,
} from "../data/dnd/spellcasting";

export interface ResourcePoolDef {
  id: string;
  classId: string;
  name: string;
  recovery: RestKind;
  minLevel: number;
  getMax: (level: number, abilities: Record<Ability, number>) => number;
}

function rageMax(level: number): number {
  if (level >= 20) return 99;
  if (level >= 17) return 6;
  if (level >= 12) return 5;
  if (level >= 6) return 4;
  if (level >= 3) return 3;
  return 2;
}

function channelDivinityMax(level: number): number {
  if (level >= 18) return 3;
  if (level >= 6) return 2;
  return 1;
}

function actionSurgeMax(level: number): number {
  if (level >= 17) return 2;
  return 1;
}

function indomitableMax(level: number): number {
  if (level >= 17) return 3;
  if (level >= 13) return 2;
  if (level >= 9) return 1;
  return 0;
}

/** Recursos de classe rastreados na ficha (usos / pontos restantes). */
export const RESOURCE_POOL_DEFS: ResourcePoolDef[] = [
  {
    id: "barbarian-rage",
    classId: "barbarian",
    name: "Fúrias",
    recovery: "long",
    minLevel: 1,
    getMax: (level) => rageMax(level),
  },
  {
    id: "bard-inspiration",
    classId: "bard",
    name: "Inspiração Bárdica",
    recovery: "short", // nível 5+; abaixo força long em getResourceRecovery
    minLevel: 1,
    getMax: (_level, abilities) => Math.max(1, getAbilityModifier(abilities.charisma)),
  },
  {
    id: "cleric-channel-divinity",
    classId: "cleric",
    name: "Canalizar Divindade",
    recovery: "short",
    minLevel: 2,
    getMax: (level) => channelDivinityMax(level),
  },
  {
    id: "paladin-channel-divinity",
    classId: "paladin",
    name: "Canalizar Divindade",
    recovery: "short",
    minLevel: 3,
    getMax: () => 1,
  },
  {
    id: "druid-wild-shape",
    classId: "druid",
    name: "Forma Selvagem",
    recovery: "short",
    minLevel: 2,
    getMax: (level) => (level >= 20 ? 99 : 2),
  },
  {
    id: "fighter-second-wind",
    classId: "fighter",
    name: "Segundo Fôlego",
    recovery: "short",
    minLevel: 1,
    getMax: () => 1,
  },
  {
    id: "fighter-action-surge",
    classId: "fighter",
    name: "Surto de Ação",
    recovery: "short",
    minLevel: 2,
    getMax: (level) => actionSurgeMax(level),
  },
  {
    id: "fighter-indomitable",
    classId: "fighter",
    name: "Indomável",
    recovery: "long",
    minLevel: 9,
    getMax: (level) => indomitableMax(level),
  },
  {
    id: "monk-ki",
    classId: "monk",
    name: "Pontos de Ki",
    recovery: "short",
    minLevel: 2,
    getMax: (level) => level,
  },
  {
    id: "paladin-lay-on-hands",
    classId: "paladin",
    name: "Cura pelas Mãos",
    recovery: "long",
    minLevel: 1,
    getMax: (level) => level * 5,
  },
  {
    id: "sorcerer-sorcery-points",
    classId: "sorcerer",
    name: "Pontos de Feitiçaria",
    recovery: "long",
    minLevel: 2,
    getMax: (level) => level,
  },
];

export interface ResolvedResourcePool {
  id: string;
  classId: string;
  name: string;
  recovery: RestKind;
  max: number;
  current: number;
}

export function emptyResourcesState(): CharacterResourcesState {
  return {
    pools: {},
    spellSlotsSpent: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pactSlotsSpent: 0,
  };
}

export function normalizeResourcesState(
  raw: CharacterResourcesState | null | undefined
): CharacterResourcesState {
  const base = emptyResourcesState();
  if (!raw || typeof raw !== "object") return base;
  const spent = Array.isArray(raw.spellSlotsSpent)
    ? raw.spellSlotsSpent.map((n) => Math.max(0, Math.floor(Number(n) || 0)))
    : base.spellSlotsSpent;
  while (spent.length < 9) spent.push(0);
  return {
    pools:
      raw.pools && typeof raw.pools === "object" && !Array.isArray(raw.pools)
        ? Object.fromEntries(
            Object.entries(raw.pools).map(([key, value]) => [
              key,
              Math.max(0, Math.floor(Number(value) || 0)),
            ])
          )
        : {},
    spellSlotsSpent: spent.slice(0, 9),
    pactSlotsSpent: Math.max(0, Math.floor(Number(raw.pactSlotsSpent) || 0)),
  };
}

function getResourceRecovery(def: ResourcePoolDef, level: number): RestKind {
  if (def.id === "bard-inspiration" && level < 5) return "long";
  return def.recovery;
}

export function listResourcePools(data: CharacterFormData): ResolvedResourcePool[] {
  const abilities = getFinalAbilities(data);
  const state = normalizeResourcesState(data.resources);
  const result: ResolvedResourcePool[] = [];

  for (const selection of data.classes ?? []) {
    const level = Math.max(0, Math.floor(Number(selection.level) || 0));
    for (const def of RESOURCE_POOL_DEFS) {
      if (def.classId !== selection.classId) continue;
      if (level < def.minLevel) continue;
      const max = Math.max(0, def.getMax(level, abilities));
      if (max <= 0) continue;
      const stored = state.pools[def.id];
      const current =
        typeof stored === "number" && Number.isFinite(stored)
          ? Math.min(max, Math.max(0, stored))
          : max;
      result.push({
        id: def.id,
        classId: def.classId,
        name: def.name,
        recovery: getResourceRecovery(def, level),
        max,
        current,
      });
    }
  }

  return result;
}

export function getWarlockPactFromSheet(
  data: CharacterFormData
): { count: number; level: number } | null {
  const warlock = (data.classes ?? []).find((item) => item.classId === "warlock");
  if (!warlock || warlock.level < 1) return null;
  const abilities = getFinalAbilities(data);
  const limits = getSpellLimits(
    "warlock",
    warlock.level,
    warlock.subclassId || "",
    abilities.charisma
  );
  return limits?.pact ?? null;
}

export function getSpellSlotAvailability(data: CharacterFormData): Array<{
  level: number;
  max: number;
  remaining: number;
}> {
  const maxSlots = getCombinedSpellSlots(data.classes ?? []);
  const state = normalizeResourcesState(data.resources);
  return maxSlots.map((max, index) => {
    const spent = state.spellSlotsSpent[index] ?? 0;
    return {
      level: index + 1,
      max,
      remaining: Math.max(0, max - spent),
    };
  });
}

export function getPactSlotAvailability(data: CharacterFormData): {
  max: number;
  level: number;
  remaining: number;
} | null {
  const pact = getWarlockPactFromSheet(data);
  if (!pact) return null;
  const state = normalizeResourcesState(data.resources);
  return {
    max: pact.count,
    level: pact.level,
    remaining: Math.max(0, pact.count - state.pactSlotsSpent),
  };
}

/** Garante pools inicializados no máximo quando ausentes. */
export function ensureResourcesSynced(data: CharacterFormData): CharacterFormData {
  const pools = listResourcePools(data);
  const state = normalizeResourcesState(data.resources);
  const nextPools = { ...state.pools };
  let changed = false;
  for (const pool of pools) {
    if (nextPools[pool.id] == null) {
      nextPools[pool.id] = pool.max;
      changed = true;
    } else if (nextPools[pool.id] > pool.max) {
      nextPools[pool.id] = pool.max;
      changed = true;
    }
  }
  if (!changed && data.resources) return data;
  return {
    ...data,
    resources: {
      ...state,
      pools: nextPools,
    },
  };
}

function parseSpendCost(description: string, fallback = 1): number {
  const match =
    description.match(
      /gaste\s+(\d+)\s+pontos?\s+de\s+ki/i
    ) ||
    description.match(/(\d+)\s+pontos?\s+de\s+ki/i) ||
    description.match(/gaste\s+(\d+)\s+pontos?\s+de\s+feitiçaria/i);
  if (match) return Math.max(1, Number(match[1]) || fallback);
  return fallback;
}

export interface FeatureSpendRule {
  resourceId: string;
  cost: number;
}

/** Associa habilidade usada a um recurso consumível. */
export function resolveFeatureSpend(
  abilityId: string | undefined,
  name: string,
  description: string,
  data: CharacterFormData
): FeatureSpendRule | null {
  const id = (abilityId || "").toLowerCase();
  const label = `${name} ${description}`.toLowerCase();
  const classIds = new Set((data.classes ?? []).map((item) => item.classId));

  if (id === "barbarian-rage" || /^fúria$/i.test(name.trim())) {
    return classIds.has("barbarian")
      ? { resourceId: "barbarian-rage", cost: 1 }
      : null;
  }

  if (
    id.includes("bardic-inspiration") ||
    /inspiração bárdica/i.test(name)
  ) {
    return classIds.has("bard")
      ? { resourceId: "bard-inspiration", cost: 1 }
      : null;
  }

  if (id.includes("channel-divinity") || /canalizar divindade/i.test(name)) {
    if (classIds.has("cleric")) {
      return { resourceId: "cleric-channel-divinity", cost: 1 };
    }
    if (classIds.has("paladin")) {
      return { resourceId: "paladin-channel-divinity", cost: 1 };
    }
  }

  if (id.includes("wild-shape") || /forma selvagem/i.test(name)) {
    return classIds.has("druid")
      ? { resourceId: "druid-wild-shape", cost: 1 }
      : null;
  }

  if (id.includes("second-wind") || /segundo fôlego/i.test(name)) {
    return classIds.has("fighter")
      ? { resourceId: "fighter-second-wind", cost: 1 }
      : null;
  }

  if (id.includes("action-surge") || /surto de ação/i.test(name)) {
    return classIds.has("fighter")
      ? { resourceId: "fighter-action-surge", cost: 1 }
      : null;
  }

  if (id.includes("indomitable") || /^indomável$/i.test(name.trim())) {
    return classIds.has("fighter")
      ? { resourceId: "fighter-indomitable", cost: 1 }
      : null;
  }

  if (id.includes("lay-on-hands") || /cura pelas mãos/i.test(name)) {
    if (!classIds.has("paladin")) return null;
    const prompted = window.prompt(
      "Quantos pontos de Cura pelas Mãos deseja gastar?",
      "5"
    );
    if (prompted == null) return { resourceId: "paladin-lay-on-hands", cost: 0 };
    const cost = Math.max(0, Math.floor(Number(prompted) || 0));
    return { resourceId: "paladin-lay-on-hands", cost };
  }

  if (
    classIds.has("monk") &&
    (id.startsWith("monk-") || /ki|ponto de ki/i.test(label)) &&
    /ki|ponto/i.test(label) &&
    !/acumulam pontos de ki iguais/i.test(description)
  ) {
    // Habilidade passiva "Pontos de Ki" não consome
    if (id === "monk-ki" || /^pontos de ki$/i.test(name.trim())) return null;
    return {
      resourceId: "monk-ki",
      cost: parseSpendCost(description, 1),
    };
  }

  if (
    classIds.has("sorcerer") &&
    (id.includes("metamagic") ||
      id.includes("flexible-casting") ||
      /metamagia|pontos de feitiçaria/i.test(label))
  ) {
    if (id === "sorcerer-sorcery-points" || /^pontos de feitiçaria$/i.test(name.trim())) {
      return null;
    }
    return {
      resourceId: "sorcerer-sorcery-points",
      cost: parseSpendCost(description, 1),
    };
  }

  return null;
}

export type ResourceMutationResult =
  | { ok: true; sheet: CharacterFormData; note?: string }
  | { ok: false; error: string };

export function spendPool(
  data: CharacterFormData,
  resourceId: string,
  cost: number
): ResourceMutationResult {
  if (cost <= 0) {
    return { ok: true, sheet: ensureResourcesSynced(data) };
  }
  const synced = ensureResourcesSynced(data);
  const pools = listResourcePools(synced);
  const pool = pools.find((item) => item.id === resourceId);
  if (!pool) {
    return { ok: false, error: "Este personagem não possui esse recurso." };
  }
  if (pool.current < cost) {
    return {
      ok: false,
      error: `${pool.name}: insuficiente (${pool.current}/${pool.max}). Precisa de descanso ${
        pool.recovery === "short" ? "curto ou longo" : "longo"
      }.`,
    };
  }
  const state = normalizeResourcesState(synced.resources);
  return {
    ok: true,
    sheet: {
      ...synced,
      resources: {
        ...state,
        pools: {
          ...state.pools,
          [resourceId]: pool.current - cost,
        },
      },
    },
    note: `${pool.name} ${pool.current - cost}/${pool.max}`,
  };
}

export function spendSpellSlot(
  data: CharacterFormData,
  spellLevel: number
): ResourceMutationResult {
  if (spellLevel <= 0) {
    return { ok: true, sheet: ensureResourcesSynced(data) };
  }

  const synced = ensureResourcesSynced(data);
  const state = normalizeResourcesState(synced.resources);
  const pact = getPactSlotAvailability(synced);
  const slots = getSpellSlotAvailability(synced);
  const hasRegular = slots.some((slot) => slot.max > 0);

  // Bruxo puro (ou magia coberta só por pacto): gasta espaço de pacto.
  const warlockOnly =
    (synced.classes ?? []).length > 0 &&
    (synced.classes ?? []).every((item) => item.classId === "warlock");

  if (pact && spellLevel <= pact.level && (warlockOnly || !hasRegular)) {
    if (pact.remaining <= 0) {
      return {
        ok: false,
        error: `Espaços de Magia de Pacto esgotados. Recupera em descanso curto.`,
      };
    }
    return {
      ok: true,
      sheet: {
        ...synced,
        resources: {
          ...state,
          pactSlotsSpent: state.pactSlotsSpent + 1,
        },
      },
      note: `Pacto ${pact.remaining - 1}/${pact.max} (nível ${pact.level})`,
    };
  }

  // Multiclasse com bruxo: se não houver espaço regular daquele nível, tenta pacto.
  const slot = slots.find((item) => item.level === spellLevel);
  if (!slot || slot.max <= 0) {
    if (pact && spellLevel <= pact.level) {
      if (pact.remaining <= 0) {
        return {
          ok: false,
          error: "Espaços de Magia de Pacto esgotados. Recupera em descanso curto.",
        };
      }
      return {
        ok: true,
        sheet: {
          ...synced,
          resources: {
            ...state,
            pactSlotsSpent: state.pactSlotsSpent + 1,
          },
        },
        note: `Pacto ${pact.remaining - 1}/${pact.max}`,
      };
    }
    return {
      ok: false,
      error: `Sem espaços de magia de ${spellLevel}º círculo.`,
    };
  }

  if (slot.remaining <= 0) {
    // Tenta um espaço de nível superior
    const higher = slots.find(
      (item) => item.level > spellLevel && item.remaining > 0
    );
    if (higher) {
      const spent = [...state.spellSlotsSpent];
      spent[higher.level - 1] = (spent[higher.level - 1] ?? 0) + 1;
      return {
        ok: true,
        sheet: {
          ...synced,
          resources: { ...state, spellSlotsSpent: spent },
        },
        note: `Espaço ${higher.level}º (${higher.remaining - 1}/${higher.max})`,
      };
    }
    if (pact && spellLevel <= pact.level && pact.remaining > 0) {
      return {
        ok: true,
        sheet: {
          ...synced,
          resources: {
            ...state,
            pactSlotsSpent: state.pactSlotsSpent + 1,
          },
        },
        note: `Pacto ${pact.remaining - 1}/${pact.max}`,
      };
    }
    return {
      ok: false,
      error: `Espaços de ${spellLevel}º círculo esgotados. Recupera em descanso longo.`,
    };
  }

  const spent = [...state.spellSlotsSpent];
  spent[spellLevel - 1] = (spent[spellLevel - 1] ?? 0) + 1;
  return {
    ok: true,
    sheet: {
      ...synced,
      resources: { ...state, spellSlotsSpent: spent },
    },
    note: `Espaço ${spellLevel}º (${slot.remaining - 1}/${slot.max})`,
  };
}

export function applyRestToSheet(
  data: CharacterFormData,
  kind: RestKind
): CharacterFormData {
  const synced = ensureResourcesSynced(data);
  const pools = listResourcePools(synced);
  const state = normalizeResourcesState(synced.resources);
  const nextPools = { ...state.pools };

  for (const pool of pools) {
    if (kind === "long" || pool.recovery === "short") {
      nextPools[pool.id] = pool.max;
    }
  }

  if (kind === "long") {
    return {
      ...synced,
      resources: {
        pools: nextPools,
        spellSlotsSpent: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        pactSlotsSpent: 0,
      },
    };
  }

  // Descanso curto: pacto de bruxo volta; espaços de magia comuns não.
  return {
    ...synced,
    resources: {
      ...state,
      pools: nextPools,
      pactSlotsSpent: 0,
    },
  };
}

export function spendFeatureOnSheet(
  data: CharacterFormData,
  abilityId: string | undefined,
  name: string,
  description: string
): ResourceMutationResult {
  const rule = resolveFeatureSpend(abilityId, name, description, data);
  if (!rule) {
    return { ok: true, sheet: ensureResourcesSynced(data) };
  }
  if (rule.cost <= 0 && rule.resourceId === "paladin-lay-on-hands") {
    return { ok: false, error: "Gasto de Cura pelas Mãos cancelado." };
  }
  return spendPool(data, rule.resourceId, rule.cost);
}
