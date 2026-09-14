import type {
    EquipmentAlternative,
    EquipmentCategory,
    EquipmentItem,
    EquipmentStack,
} from "../../types/character";

function item(
    id: string,
    name: string,
    category: EquipmentCategory,
    weight: number
): EquipmentItem {
    return { id, name, category, weight };
}

export const DND_EQUIPMENT: EquipmentItem[] = [
    item("club", "Clava", "weapon", 2),
    item("dagger", "Adaga", "weapon", 1),
    item("greatclub", "Clava grande", "weapon", 10),
    item("handaxe", "Machadinha", "weapon", 2),
    item("javelin", "Azagaia", "weapon", 2),
    item("light-hammer", "Martelo leve", "weapon", 2),
    item("mace", "Maça", "weapon", 4),
    item("quarterstaff", "Bordão", "weapon", 4),
    item("sickle", "Foice", "weapon", 2),
    item("spear", "Lança", "weapon", 3),
    item("light-crossbow", "Besta leve", "weapon", 5),
    item("dart", "Dardo", "weapon", 0.25),
    item("shortbow", "Arco curto", "weapon", 2),
    item("sling", "Funda", "weapon", 0),
    item("battleaxe", "Machado de batalha", "weapon", 4),
    item("flail", "Mangual", "weapon", 2),
    item("glaive", "Glaive", "weapon", 6),
    item("greataxe", "Machado grande", "weapon", 7),
    item("greatsword", "Espada grande", "weapon", 6),
    item("halberd", "Alabarda", "weapon", 6),
    item("lance", "Lança de montaria", "weapon", 6),
    item("longsword", "Espada longa", "weapon", 3),
    item("maul", "Malho", "weapon", 10),
    item("morningstar", "Maça estrela", "weapon", 4),
    item("pike", "Pique", "weapon", 18),
    item("rapier", "Rapieira", "weapon", 2),
    item("scimitar", "Cimitarra", "weapon", 3),
    item("shortsword", "Espada curta", "weapon", 2),
    item("trident", "Tridente", "weapon", 4),
    item("war-pick", "Picareta de guerra", "weapon", 2),
    item("warhammer", "Martelo de guerra", "weapon", 2),
    item("whip", "Chicote", "weapon", 3),
    item("blowgun", "Zarabatana", "weapon", 1),
    item("hand-crossbow", "Besta de mão", "weapon", 3),
    item("heavy-crossbow", "Besta pesada", "weapon", 18),
    item("longbow", "Arco longo", "weapon", 2),
    item("net", "Rede", "weapon", 3),
    item("arrows", "Flechas", "ammunition", 0.05),
    item("crossbow-bolts", "Virotes", "ammunition", 0.075),
    item("leather-armor", "Armadura de couro", "armor", 10),
    item("scale-mail", "Brunea", "armor", 45),
    item("chain-mail", "Cota de malha", "armor", 55),
    item("shield", "Escudo", "shield", 6),
    item("burglar-pack", "Pacote de assaltante", "pack", 44.5),
    item("diplomat-pack", "Pacote de diplomata", "pack", 36),
    item("dungeoneer-pack", "Pacote de aventureiro", "pack", 61.5),
    item("entertainer-pack", "Pacote de artista", "pack", 38),
    item("explorer-pack", "Pacote de explorador", "pack", 59),
    item("priest-pack", "Pacote de sacerdote", "pack", 24),
    item("scholar-pack", "Pacote de estudioso", "pack", 10),
    item("thieves-tools", "Ferramentas de ladrão", "tool", 1),
    item("lute", "Alaúde", "tool", 2),
    item("flute", "Flauta", "tool", 1),
    item("drum", "Tambor", "tool", 3),
    item("lyre", "Lira", "tool", 2),
    item("horn", "Trompa", "tool", 2),
    item("component-pouch", "Bolsa de componentes", "focus", 2),
    item("arcane-focus", "Foco arcano", "focus", 1),
    item("druidic-focus", "Foco druídico", "focus", 1),
    item("holy-symbol", "Símbolo sagrado", "focus", 1),
    item("spellbook", "Livro de magias", "gear", 3),
    item("wooden-shield", "Escudo de madeira", "shield", 6),
    item("alchemists-supplies", "Suprimentos de alquimista", "tool", 8),
    item("brewers-supplies", "Suprimentos de cervejeiro", "tool", 9),
    item("calligraphers-supplies", "Suprimentos de calígrafo", "tool", 5),
    item("carpenters-tools", "Ferramentas de carpinteiro", "tool", 6),
    item("cartographers-tools", "Ferramentas de cartógrafo", "tool", 6),
    item("cobblers-tools", "Ferramentas de sapateiro", "tool", 5),
    item("cooks-utensils", "Utensílios de cozinheiro", "tool", 8),
    item("glassblowers-tools", "Ferramentas de soprador de vidro", "tool", 5),
    item("jewelers-tools", "Ferramentas de joalheiro", "tool", 2),
    item("leatherworkers-tools", "Ferramentas de coureiro", "tool", 5),
    item("masons-tools", "Ferramentas de pedreiro", "tool", 8),
    item("painters-supplies", "Suprimentos de pintor", "tool", 5),
    item("potters-tools", "Ferramentas de oleiro", "tool", 3),
    item("smiths-tools", "Ferramentas de ferreiro", "tool", 8),
    item("tinkers-tools", "Ferramentas de funileiro", "tool", 10),
    item("weavers-tools", "Ferramentas de tecelão", "tool", 5),
    item("woodcarvers-tools", "Ferramentas de entalhador", "tool", 5),
    item("disguise-kit", "Kit de disfarce", "tool", 3),
    item("forgery-kit", "Kit de falsificação", "tool", 5),
    item("herbalism-kit", "Kit de herbalismo", "tool", 3),
    item("navigator-tools", "Ferramentas de navegador", "tool", 2),
    item("dice-set", "Conjunto de dados", "tool", 0),
    item("playing-card-set", "Baralho", "tool", 0),
    item("common-clothes", "Roupas comuns", "gear", 3),
    item("fine-clothes", "Roupas finas", "gear", 6),
    item("travelers-clothes", "Roupas de viajante", "gear", 4),
    item("costume", "Fantasia", "gear", 4),
    item("crowbar", "Pé de cabra", "gear", 5),
    item("shovel", "Pá", "gear", 5),
    item("iron-pot", "Panela de ferro", "gear", 10),
    item("hunting-trap", "Armadilha de caça", "gear", 25),
    item("staff", "Cajado", "gear", 4),
    item("small-knife", "Faca pequena", "gear", 0.5),
    item("belaying-pin", "Cavilha de amarração", "gear", 2),
    item("silk-rope", "Corda de seda (15 m)", "gear", 5),
    item("holy-text", "Livro de orações", "gear", 5),
    item("incense", "Bloco de incenso", "gear", 0),
    item("vestments", "Vestimentas", "gear", 4),
    item("signet-ring", "Anel de sinete", "gear", 0),
    item("scroll-case", "Porta-mapas", "gear", 1),
    item("ink-bottle", "Frasco de tinta", "gear", 0),
    item("ink-pen", "Pena de escrita", "gear", 0),
    item("winter-blanket", "Cobertor de inverno", "gear", 3),
    item("city-map", "Mapa da cidade", "gear", 0),
    item("pet-mouse", "Camundongo de estimação", "gear", 0),
    item("token", "Lembrança pessoal", "gear", 0),
    item("guild-letter", "Carta de apresentação da guilda", "gear", 0),
    item("pedigree-scroll", "Pergaminho de linhagem", "gear", 0),
    item("rank-insignia", "Insígnia de patente", "gear", 0),
    item("trophy", "Troféu de inimigo", "gear", 1),
    item("admirer-favor", "Lembrança de admirador", "gear", 0),
    item("con-tools", "Ferramentas do golpe favorito", "gear", 1),
];

export const SIMPLE_WEAPON_IDS = [
    "club", "dagger", "greatclub", "handaxe", "javelin", "light-hammer",
    "mace", "quarterstaff", "sickle", "spear", "light-crossbow", "dart",
    "shortbow", "sling",
] as const;

export const SIMPLE_MELEE_WEAPON_IDS = SIMPLE_WEAPON_IDS.slice(0, 10);

export const MARTIAL_WEAPON_IDS = [
    "battleaxe", "flail", "glaive", "greataxe", "greatsword", "halberd",
    "lance", "longsword", "maul", "morningstar", "pike", "rapier",
    "scimitar", "shortsword", "trident", "war-pick", "warhammer", "whip",
    "blowgun", "hand-crossbow", "heavy-crossbow", "longbow", "net",
] as const;

export const MARTIAL_MELEE_WEAPON_IDS = MARTIAL_WEAPON_IDS.slice(0, 18);

export function stack(itemId: string, quantity = 1): EquipmentStack {
    return { itemId, quantity };
}

export function alternatives(
    ids: readonly string[],
    quantity = 1
): EquipmentAlternative[] {
    return ids.map((itemId) => {
        const equipment = DND_EQUIPMENT.find((entry) => entry.id === itemId);
        return {
            id: itemId,
            label: equipment?.name ?? itemId,
            items: [stack(itemId, quantity)],
        };
    });
}

export function getEquipmentItem(itemId: string): EquipmentItem | undefined {
    return DND_EQUIPMENT.find((entry) => entry.id === itemId);
}

const GRAMS_PER_POUND = 453.59237;

export function formatMetricWeight(pounds: number): string {
    const grams = pounds * GRAMS_PER_POUND;

    if (grams === 0) {
        return "0 g";
    }

    if (grams < 1000) {
        const rounded = Math.round(grams);
        return `${rounded} g`;
    }

    const kilos = grams / 1000;
    const formatted = kilos >= 10
        ? kilos.toFixed(1)
        : kilos.toFixed(2);

    return `${formatted.replace(/\.?0+$/, "")} kg`;
}
