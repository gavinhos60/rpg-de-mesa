/**
 * Baixa PNGs oficiais do SRD (dnd5eapi.co / magic-items) e gera mapa local.
 * Fonte: https://www.dnd5eapi.co/api/images/magic-items/{index}.png
 *
 * node scripts/download-equipment-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EQUIPMENT_TS = path.join(ROOT, "src", "data", "dnd", "equipment.ts");
const OUT_DIR = path.join(ROOT, "public", "art", "equipment", "items");
const SOURCES_DIR = path.join(ROOT, "public", "art", "equipment", "_sources");
const MAP_OUT = path.join(ROOT, "src", "data", "dnd", "equipmentImageMap.generated.ts");

const DND5E = "https://www.dnd5eapi.co";

/**
 * Catálogo → arte SRD mais coerente (itens mágicos com PNG na API).
 * Evitar bracers-of-archery em armas (são manoplas, não arco/besta).
 */
const ITEM_MAGIC_SOURCE = {
    // —— Armas corpo a corpo ——
    dagger: "dagger-of-venom",
    sickle: "dagger-of-venom",
    "small-knife": "dagger-of-venom",
    "belaying-pin": "dagger-of-venom",
    club: "broom-of-flying",
    greatclub: "broom-of-flying",
    quarterstaff: "broom-of-flying",
    staff: "broom-of-flying",
    handaxe: "berserker-axe",
    battleaxe: "berserker-axe",
    greataxe: "berserker-axe",
    "war-pick": "berserker-axe",
    "light-hammer": "dwarven-thrower",
    mace: "dwarven-thrower",
    maul: "dwarven-thrower",
    warhammer: "dwarven-thrower",
    morningstar: "dwarven-thrower",
    flail: "dwarven-thrower",
    longsword: "dancing-sword",
    shortsword: "dancing-sword",
    rapier: "defender",
    scimitar: "defender",
    greatsword: "dragon-slayer",
    halberd: "dragon-slayer",
    glaive: "dragon-slayer",
    pike: "dragon-slayer",
    trident: "dragon-slayer",
    spear: "defender",
    lance: "defender",
    javelin: "dwarven-thrower",
    whip: "dimensional-shackles",
    net: "dimensional-shackles",

    // —— Armas à distância ——
    shortbow: "efficient-quiver",
    longbow: "efficient-quiver",
    // API não tem arte de besta; munição SRD evita manoplas (bracers-of-archery).
    "light-crossbow": "ammunition",
    "hand-crossbow": "ammunition",
    "heavy-crossbow": "ammunition",
    sling: "ammunition",
    blowgun: "ammunition",
    dart: "arrow-of-slaying",

    // —— Munição ——
    arrows: "efficient-quiver",
    "crossbow-bolts": "ammunition",

    // —— Armaduras e escudos ——
    "leather-armor": "armor",
    "scale-mail": "dragon-scale-mail",
    "chain-mail": "adamantine-armor",
    shield: "animated-shield",
    "wooden-shield": "animated-shield",

    // —— Pacotes ——
    "burglar-pack": "bag-of-holding",
    "diplomat-pack": "bag-of-holding",
    "dungeoneer-pack": "bag-of-holding",
    "entertainer-pack": "bag-of-holding",
    "explorer-pack": "bag-of-holding",
    "priest-pack": "bag-of-holding",
    "scholar-pack": "deck-of-many-things",

    // —— Ferramentas e instrumentos ——
    "thieves-tools": "chime-of-opening",
    lute: "chime-of-opening",
    flute: "chime-of-opening",
    drum: "brazier-of-commanding-fire-elementals",
    lyre: "chime-of-opening",
    horn: "chime-of-opening",
    "alchemists-supplies": "apparatus-of-the-crab",
    "brewers-supplies": "decanter-of-endless-water",
    "calligraphers-supplies": "deck-of-illusions",
    "carpenters-tools": "chime-of-opening",
    "cartographers-tools": "crystal-ball",
    "cobblers-tools": "boots-of-elvenkind",
    "cooks-utensils": "brazier-of-commanding-fire-elementals",
    "glassblowers-tools": "decanter-of-endless-water",
    "jewelers-tools": "circlet-of-blasting",
    "leatherworkers-tools": "cloak-of-elvenkind",
    "masons-tools": "chime-of-opening",
    "painters-supplies": "deck-of-illusions",
    "potters-tools": "decanter-of-endless-water",
    "smiths-tools": "adamantine-armor",
    "tinkers-tools": "apparatus-of-the-crab",
    "weavers-tools": "cloak-of-protection",
    "woodcarvers-tools": "chime-of-opening",
    "disguise-kit": "cloak-of-displacement",
    "forgery-kit": "deck-of-illusions",
    "herbalism-kit": "elemental-gem",
    "navigator-tools": "crystal-ball",
    "dice-set": "bag-of-tricks",
    "playing-card-set": "deck-of-illusions",

    // —— Focos ——
    "component-pouch": "bead-of-force",
    "arcane-focus": "crystal-ball",
    "druidic-focus": "elemental-gem",
    "holy-symbol": "amulet-of-health",
    spellbook: "deck-of-many-things",

    // —— Equipamento diverso ——
    "common-clothes": "cloak-of-protection",
    "fine-clothes": "cloak-of-elvenkind",
    "travelers-clothes": "boots-of-the-winterlands",
    costume: "cloak-of-the-bat",
    crowbar: "chime-of-opening",
    shovel: "chime-of-opening",
    "iron-pot": "brazier-of-commanding-fire-elementals",
    "hunting-trap": "dimensional-shackles",
    "silk-rope": "dimensional-shackles",
    "holy-text": "deck-of-many-things",
    incense: "candle-of-invocation",
    vestments: "cloak-of-protection",
    "signet-ring": "brooch-of-shielding",
    "scroll-case": "efficient-quiver",
    "ink-bottle": "decanter-of-endless-water",
    "ink-pen": "deck-of-illusions",
    "winter-blanket": "cloak-of-the-manta-ray",
    "city-map": "crystal-ball",
    "pet-mouse": "bag-of-tricks",
    token: "brooch-of-shielding",
    "guild-letter": "deck-of-illusions",
    "pedigree-scroll": "deck-of-many-things",
    "rank-insignia": "circlet-of-blasting",
    trophy: "dragon-slayer",
    "admirer-favor": "amulet-of-health",
    "con-tools": "chime-of-opening",
};

const CATEGORY_DEFAULT_MAGIC = {
    weapon: "dancing-sword",
    armor: "armor",
    shield: "animated-shield",
    ammunition: "ammunition",
    pack: "bag-of-holding",
    tool: "chime-of-opening",
    focus: "amulet-of-health",
    gear: "bag-of-holding",
};

function parseEquipmentCatalog() {
    const src = fs.readFileSync(EQUIPMENT_TS, "utf8");
    const re = /item\("([^"]+)",\s*"[^"]*",\s*"([^"]+)"/g;
    const rows = [];
    let m;
    while ((m = re.exec(src)) !== null) {
        rows.push({ id: m[1], category: m[2] });
    }
    return rows;
}

async function fetchAllAvailableMagicIndices() {
    const res = await fetch(`${DND5E}/api/2014/magic-items`);
    const { results } = await res.json();
    const available = new Set();

    for (const entry of results) {
        const detail = await fetch(`${DND5E}${entry.url}`).then((r) => r.json());
        if (!detail.image) continue;
        const img = await fetch(`${DND5E}${detail.image}`);
        if (img.ok) {
            available.add(detail.index);
        }
    }

    return available;
}

async function downloadMagicPng(magicIndex) {
    const url = `${DND5E}/api/images/magic-items/${magicIndex}.png`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`${magicIndex}: HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(SOURCES_DIR, { recursive: true });
    const dest = path.join(SOURCES_DIR, `${magicIndex}.png`);
    fs.writeFileSync(dest, buf);
    return dest;
}

async function main() {
    console.log("Verificando PNGs disponíveis na API…");
    const available = await fetchAllAvailableMagicIndices();
    console.log(`${available.size} imagens SRD acessíveis.`);

    const catalog = parseEquipmentCatalog();
    const resolved = new Map();
    const warnings = [];

    for (const row of catalog) {
        let magicIndex =
            ITEM_MAGIC_SOURCE[row.id] ??
            CATEGORY_DEFAULT_MAGIC[row.category] ??
            "bag-of-holding";

        if (!available.has(magicIndex)) {
            warnings.push(
                `${row.id}: "${magicIndex}" indisponível → bag-of-holding`
            );
            magicIndex = available.has("bag-of-holding")
                ? "bag-of-holding"
                : [...available][0];
        }
        resolved.set(row.id, magicIndex);
    }

    const uniqueMagic = [...new Set(resolved.values())];
    console.log(`Baixando ${uniqueMagic.length} imagens únicas…`);

    for (const index of uniqueMagic) {
        try {
            await downloadMagicPng(index);
            console.log("  ok", index);
        } catch (error) {
            console.warn("  falha", index, error.message);
        }
    }

    fs.mkdirSync(OUT_DIR, { recursive: true });
    const publicMap = {};
    const fallbackFile = path.join(SOURCES_DIR, "bag-of-holding.png");

    for (const [itemId, magicIndex] of resolved) {
        const srcFile = path.join(SOURCES_DIR, `${magicIndex}.png`);
        const destFile = path.join(OUT_DIR, `${itemId}.png`);
        if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, destFile);
        } else if (fs.existsSync(fallbackFile)) {
            fs.copyFileSync(fallbackFile, destFile);
        }
        publicMap[itemId] = `/art/equipment/items/${itemId}.png`;
    }

    const mapBody = Object.entries(publicMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, url]) => `    "${id}": "${url}",`)
        .join("\n");

    fs.writeFileSync(
        MAP_OUT,
        `/** Gerado por scripts/download-equipment-images.mjs — não editar à mão. */\n\nexport const EQUIPMENT_IMAGE_URL_BY_ID: Record<string, string> = {\n${mapBody}\n};\n`
    );

    console.log(`\n${catalog.length} itens → ${OUT_DIR}`);
    if (warnings.length) {
        console.warn("\nAvisos de mapeamento:");
        warnings.forEach((line) => console.warn(" ", line));
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
