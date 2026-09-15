/**
 * Gera catálogo de monstros 5e (SRD 2014) em português.
 * Fonte exclusiva: https://www.dnd5eapi.co/api/2014/monsters
 *
 * node scripts/generate-monsters.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "src", "data", "dnd", "monsters.ts");
const DND5E = "https://www.dnd5eapi.co";
const LIST_URL = `${DND5E}/api/2014/monsters`;

const TYPE_PT = {
  aberration: "aberração",
  beast: "fera",
  celestial: "celestial",
  construct: "constructo",
  dragon: "dragão",
  elemental: "elemental",
  fey: "fada",
  fiend: "demônio",
  giant: "gigante",
  humanoid: "humanoide",
  monstrosity: "monstruosidade",
  ooze: "lodo",
  plant: "planta",
  undead: "morto-vivo",
};

const SIZE_PT = {
  Tiny: "Miúdo",
  Small: "Pequeno",
  Medium: "Médio",
  Large: "Grande",
  Huge: "Enorme",
  Gargantuan: "Imenso",
};

const SIZE_TOKEN = {
  Tiny: 32,
  Small: 40,
  Medium: 48,
  Large: 64,
  Huge: 80,
  Gargantuan: 96,
};

const ALIGN_PT = {
  "lawful good": "leal e bom",
  "neutral good": "neutro e bom",
  "chaotic good": "caótico e bom",
  "lawful neutral": "leal e neutro",
  "true neutral": "neutro",
  neutral: "neutro",
  "chaotic neutral": "caótico e neutro",
  "lawful evil": "leal e mau",
  "neutral evil": "neutro e mau",
  "chaotic evil": "caótico e mau",
  unaligned: "sem alinhamento",
  any: "qualquer",
  "any alignment": "qualquer alinhamento",
  "any evil": "qualquer mau",
  "any non-good": "qualquer não bom",
  "any non-lawful": "qualquer não leal",
};

const COLORS = {
  dragon: "#7A2530",
  fiend: "#5C1A1A",
  undead: "#5C4A1E",
  elemental: "#2F4F7A",
  beast: "#3F5B34",
  humanoid: "#6B4423",
  monstrosity: "#4A2F18",
  aberration: "#6B3FA0",
  construct: "#5A5A5A",
  ooze: "#3F5B34",
  plant: "#2F5B34",
  fey: "#6B3FA0",
  celestial: "#8A5A1E",
  giant: "#8A5A1E",
};

const NAME_PT = JSON.parse(
  fs.readFileSync(path.join(__dirname, "monster-names-pt.json"), "utf8")
);

const PHRASE_PT = [
  [/Multiattack/gi, "Ataque Múltiplo"],
  [/The (\w+)/g, "O(a) $1"],
  [/makes two (.+?) attacks/gi, "faz dois ataques de $1"],
  [/makes three (.+?) attacks/gi, "faz três ataques de $1"],
  [/Hit:/gi, "Acerto:"],
  [/Melee Weapon Attack:/gi, "Ataque corpo a corpo com arma:"],
  [/Ranged Weapon Attack:/gi, "Ataque à distância com arma:"],
  [/Melee Spell Attack:/gi, "Ataque corpo a corpo com magia:"],
  [/Ranged Spell Attack:/gi, "Ataque à distância com magia:"],
  [/to hit/gi, "para acertar"],
  [/reach (\d+(?:\.\d+)?)\s*m/gi, "alcance $1 m"],
  [/reach (\d+)\s*ft\.?/gi, "alcance $1 ft"],
  [/range (\d+)\/(\d+)\s*ft\.?/gi, "alcance $1/$2 ft"],
  [/one target/gi, "um alvo"],
  [/one creature/gi, "uma criatura"],
  [/darkvision/gi, "visão no escuro"],
  [/blindsight/gi, "visão às cegas"],
  [/tremorsense/gi, "sentido sísmico"],
  [/truesight/gi, "visão verdadeira"],
  [/passive Perception/gi, "Percepção passiva"],
  [/passive_perception/gi, "Percepção passiva"],
  [/Common/g, "Comum"],
  [/understands/gi, "compreende"],
  [/but can't speak/gi, "mas não pode falar"],
  [/Can't speak/gi, "Não pode falar"],
  [/Innate Spellcasting/gi, "Conjuração Inata"],
  [/Spellcasting/gi, "Conjuração"],
  [/Magic Resistance/gi, "Resistência à Magia"],
  [/Keen Smell/gi, "Olfato Aguçado"],
  [/Keen Sight/gi, "Visão Aguçada"],
  [/Keen Hearing/gi, "Audição Aguçada"],
  [/Pack Tactics/gi, "Táticas de Bando"],
  [/Amphibious/gi, "Anfíbio"],
  [/Immutable Form/gi, "Forma Imutável"],
  [/Legendary Resistance/gi, "Resistência Lendária"],
  [/If the .+ fails a saving throw/gi, "Se falhar em um teste de resistência"],
  [/it can choose to succeed instead/gi, "pode escolher ter sucesso em vez disso"],
  [/Recharge (\d+)(?:–|-)(\d+)/gi, "Recarga $1–$2"],
  [/Recharge (\d+)/gi, "Recarga $1"],
  [/saving throw/gi, "teste de resistência"],
  [/Strength/g, "Força"],
  [/Dexterity/g, "Destreza"],
  [/Constitution/g, "Constituição"],
  [/Intelligence/g, "Inteligência"],
  [/Wisdom/g, "Sabedoria"],
  [/Charisma/g, "Carisma"],
  [/piercing damage/gi, "dano perfurante"],
  [/slashing damage/gi, "dano cortante"],
  [/bludgeoning damage/gi, "dano de concussão"],
  [/fire damage/gi, "dano de fogo"],
  [/cold damage/gi, "dano de frio"],
  [/lightning damage/gi, "dano elétrico"],
  [/acid damage/gi, "dano de ácido"],
  [/poison damage/gi, "dano de veneno"],
  [/necrotic damage/gi, "dano necrótico"],
  [/radiant damage/gi, "dano radiante"],
  [/psychic damage/gi, "dano psíquico"],
  [/thunder damage/gi, "dano de trovão"],
  [/force damage/gi, "dano de força"],
  [/poisoned/gi, "envenenado"],
  [/frightened/gi, "amedrontado"],
  [/charmed/gi, "enfeitiçado"],
  [/paralyzed/gi, "paralisado"],
  [/stunned/gi, "atordoado"],
  [/restrained/gi, "impedido"],
  [/grappled/gi, "agarrado"],
  [/prone/gi, "caído"],
  [/invisible/gi, "invisível"],
  [/Blinded/gi, "Cego"],
  [/Deafened/gi, "Surdo"],
  [/Exhaustion/gi, "Exaustão"],
  [/Petrified/gi, "Petrificado"],
  [/bonus action/gi, "ação bônus"],
  [/reaction/gi, "reação"],
  [/on each of its turns/gi, "em cada um de seus turnos"],
  [/as a bonus action/gi, "como ação bônus"],
  [/Nimble Escape/gi, "Fuga Ágil"],
  [/Scimitar/gi, "Cimitarra"],
  [/Shortbow/gi, "Arco curto"],
  [/Longsword/gi, "Espada longa"],
  [/Shortsword/gi, "Espada curta"],
  [/Greataxe/gi, "Machado grande"],
  [/Spear/gi, "Lança"],
  [/Club/gi, "Clava"],
  [/Bite/gi, "Mordida"],
  [/Claw/gi, "Garra"],
  [/Claws/gi, "Garras"],
  [/Tail/gi, "Cauda"],
  [/Slam/gi, "Pancada"],
  [/Horn/gi, "Chifre"],
  [/Gore/gi, "Chifrada"],
  [/Sting/gi, "Ferrão"],
  [/Rock/gi, "Rocha"],
  [/Javelin/gi, "Dardo"],
  [/Morningstar/gi, "Maça-estrela"],
  [/Warhammer/gi, "Martelo de guerra"],
  [/Battleaxe/gi, "Machado de batalha"],
  [/Greatsword/gi, "Espada grande"],
  [/Longbow/gi, "Arco longo"],
  [/Crossbow/gi, "Besta"],
  [/Dagger/gi, "Adaga"],
  [/Tentacle/gi, "Tentáculo"],
  [/fist/gi, "punho"],
  [/walk/gi, "caminhada"],
  [/fly/gi, "voo"],
  [/swim/gi, "natação"],
  [/climb/gi, "escalada"],
  [/burrow/gi, "escavação"],
  [/hover/gi, "flutuar"],
];

function ftToMeters(text) {
  if (!text || typeof text !== "string") return text || "";
  return text.replace(/(\d+(?:\.\d+)?)\s*ft\.?/gi, (_, n) => {
    const m = Math.round(Number(n) * 0.3 * 10) / 10;
    return `${m} m`;
  });
}

function translateText(input) {
  if (!input) return "";
  let text = ftToMeters(String(input));
  for (const [pattern, repl] of PHRASE_PT) {
    text = text.replace(pattern, repl);
  }
  return text;
}

function translateName(english) {
  if (NAME_PT[english]) return NAME_PT[english];
  const lower = english.toLowerCase();
  for (const [en, pt] of Object.entries(NAME_PT)) {
    if (en.toLowerCase() === lower) return pt;
  }
  return english
    .replace(/^Adult /i, "Adulto ")
    .replace(/^Ancient /i, "Ancestral ")
    .replace(/^Young /i, "Jovem ")
    .replace(/ Dragon$/i, " Dragão")
    .replace(/^Giant /i, "Gigante ")
    .replace(/^Swarm of /i, "Enxame de ")
    .replace(/^Were/i, "Licantropo ")
    .replace(/ Skeleton$/i, " Esqueleto")
    .replace(/ Zombie$/i, " Zumbi")
    .replace(/ Wyrmling$/i, " Dragonete");
}

function normalizeSize(size) {
  if (!size) return "Medium";
  const s = String(size).trim();
  const found = Object.keys(SIZE_PT).find(
    (key) => key.toLowerCase() === s.toLowerCase()
  );
  return found || "Medium";
}

function armorClass(ac) {
  if (typeof ac === "number") return ac;
  if (Array.isArray(ac) && ac.length) {
    const values = ac.map((item) => Number(item?.value ?? item)).filter(Number.isFinite);
    return values.length ? Math.max(...values) : 10;
  }
  return 10;
}

function listText(value) {
  if (!value) return "—";
  if (typeof value === "string") return translateText(value) || "—";
  if (Array.isArray(value)) {
    if (!value.length) return "—";
    return (
      value
        .map((item) => {
          if (typeof item === "string") return translateText(item);
          if (item?.name) return translateText(item.name);
          return translateText(String(item));
        })
        .filter(Boolean)
        .join(", ") || "—"
    );
  }
  return "—";
}

function sensesText(senses) {
  if (!senses) return "—";
  if (typeof senses === "string") return translateText(ftToMeters(senses));
  return (
    Object.entries(senses)
      .map(([key, value]) => {
        const label = translateText(key.replace(/_/g, " "));
        return `${label} ${ftToMeters(String(value))}`;
      })
      .join(", ") || "—"
  );
}

function speedText(speed) {
  if (!speed) return "—";
  if (typeof speed === "string") return translateText(ftToMeters(speed));
  return Object.entries(speed)
    .map(([k, v]) => `${translateText(k)}: ${ftToMeters(String(v))}`)
    .join("; ");
}

function skillsText(proficiencies) {
  if (!Array.isArray(proficiencies) || !proficiencies.length) return "—";
  const skills = proficiencies.filter((p) =>
    String(p?.proficiency?.index || p?.proficiency?.name || "").startsWith("skill-")
  );
  if (!skills.length) return "—";
  return skills
    .map((p) => {
      const name = String(p.proficiency?.name || "")
        .replace(/^Skill:\s*/i, "");
      const bonus = Number(p.value) || 0;
      return `${translateText(name)} ${bonus >= 0 ? "+" : ""}${bonus}`;
    })
    .join(", ");
}

function actionDamage(action) {
  if (!action) return null;
  if (typeof action.damage_dice === "string") return action.damage_dice;
  if (!Array.isArray(action.damage) || !action.damage.length) return null;
  return (
    action.damage
      .map((d) => d.damage_dice || d.dice)
      .filter(Boolean)
      .join(" + ") || null
  );
}

function mapActions(list) {
  if (!Array.isArray(list)) return [];
  return list.map((action) => ({
    name: translateText(action.name || "Ação"),
    description: translateText(action.desc || action.description || ""),
    attackBonus: action.attack_bonus ?? null,
    damage: actionDamage(action),
  }));
}

function imageUrl(m) {
  if (m.image) {
    return m.image.startsWith("http") ? m.image : `${DND5E}${m.image}`;
  }
  return `${DND5E}/api/images/monsters/${m.index}.png`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function fetchAllMonsters() {
  const list = await fetchJson(LIST_URL);
  const results = list.results || [];
  const monsters = [];
  const concurrency = 12;

  for (let i = 0; i < results.length; i += concurrency) {
    const chunk = results.slice(i, i + concurrency);
    process.stdout.write(`\rBaixando ${Math.min(i + chunk.length, results.length)}/${results.length}…`);
    const details = await Promise.all(
      chunk.map((item) => fetchJson(`${DND5E}${item.url}`))
    );
    monsters.push(...details);
  }
  process.stdout.write("\n");
  return monsters;
}

function toMonster(m) {
  const size = normalizeSize(m.size);
  const typeKey = String(m.type || "")
    .toLowerCase()
    .split(",")[0]
    .trim();
  const alignmentKey = String(m.alignment || "")
    .toLowerCase()
    .trim();
  const img = imageUrl(m);

  return {
    id: m.index,
    name: translateName(m.name),
    nameEn: m.name,
    type: TYPE_PT[typeKey] || translateText(m.type || "criatura"),
    size,
    sizeLabel: SIZE_PT[size] || size,
    alignment: ALIGN_PT[alignmentKey] || translateText(m.alignment || "qualquer"),
    ac: armorClass(m.armor_class),
    hp: Number(m.hit_points) || 1,
    hitDice: m.hit_dice || "",
    cr: String(m.challenge_rating ?? "?"),
    xp: Number(m.xp) || 0,
    speed: speedText(m.speed),
    abilities: {
      strength: m.strength ?? 10,
      dexterity: m.dexterity ?? 10,
      constitution: m.constitution ?? 10,
      intelligence: m.intelligence ?? 10,
      wisdom: m.wisdom ?? 10,
      charisma: m.charisma ?? 10,
    },
    skills: skillsText(m.proficiencies),
    senses: sensesText(m.senses),
    languages: translateText(m.languages || "—") || "—",
    damageResistances: listText(m.damage_resistances),
    damageImmunities: listText(m.damage_immunities),
    conditionImmunities: listText(m.condition_immunities),
    damageVulnerabilities: listText(m.damage_vulnerabilities),
    traits: mapActions(m.special_abilities),
    actions: mapActions(m.actions),
    reactions: mapActions(m.reactions),
    legendaryActions: mapActions(m.legendary_actions),
    imageUrl: img,
    tokenUrl: img,
    color: COLORS[typeKey] || "#4A2F18",
    tokenSize: SIZE_TOKEN[size] || 48,
    document: "dnd5eapi-2014",
  };
}

async function main() {
  console.log("Baixando monstros de", LIST_URL);
  const raw = await fetchAllMonsters();
  const monsters = raw
    .map(toMonster)
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));

  const withImage = monsters.filter((m) => Boolean(m.imageUrl)).length;

  const header = `export type MonsterSize = "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";

export type MonsterAbilityScores = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type MonsterAction = {
  name: string;
  description: string;
  attackBonus?: number | null;
  damage?: string | null;
};

export interface Monster {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  size: MonsterSize;
  sizeLabel: string;
  alignment: string;
  ac: number;
  hp: number;
  hitDice: string;
  cr: string;
  xp: number;
  speed: string;
  abilities: MonsterAbilityScores;
  skills: string;
  senses: string;
  languages: string;
  damageResistances: string;
  damageImmunities: string;
  conditionImmunities: string;
  damageVulnerabilities: string;
  traits: MonsterAction[];
  actions: MonsterAction[];
  reactions: MonsterAction[];
  legendaryActions: MonsterAction[];
  imageUrl: string;
  tokenUrl: string;
  color: string;
  tokenSize: number;
  document?: string;
}

/** Catálogo SRD 2014 (https://www.dnd5eapi.co/api/2014/monsters). */
export const MM_MONSTERS: Monster[] = `;

  const footer = `;

export function getMonsterById(id: string): Monster | undefined {
  return MM_MONSTERS.find((monster) => monster.id === id);
}

export function searchMonsters(query: string): Monster[] {
  const q = query.trim().toLowerCase();
  if (!q) return MM_MONSTERS;
  return MM_MONSTERS.filter(
    (monster) =>
      monster.name.toLowerCase().includes(q) ||
      monster.nameEn.toLowerCase().includes(q) ||
      monster.type.toLowerCase().includes(q) ||
      monster.cr === q ||
      ("nd " + monster.cr).includes(q) ||
      ("cr " + monster.cr).includes(q)
  );
}
`;

  fs.writeFileSync(
    OUT,
    header + JSON.stringify(monsters, null, 2) + " as Monster[]" + footer,
    "utf8"
  );
  console.log(
    `Wrote ${monsters.length} monsters → ${OUT}\n  com imagem: ${withImage}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
