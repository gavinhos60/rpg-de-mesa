import type { CharacterBackground } from "../../types/character";
import { stack } from "./equipment";

export const ARTISAN_TOOL_IDS = [
    "alchemists-supplies",
    "brewers-supplies",
    "calligraphers-supplies",
    "carpenters-tools",
    "cartographers-tools",
    "cobblers-tools",
    "cooks-utensils",
    "glassblowers-tools",
    "jewelers-tools",
    "leatherworkers-tools",
    "masons-tools",
    "painters-supplies",
    "potters-tools",
    "smiths-tools",
    "tinkers-tools",
    "weavers-tools",
    "woodcarvers-tools",
];

export const MUSICAL_INSTRUMENT_IDS = [
    "lute",
    "flute",
    "drum",
    "lyre",
    "horn",
];

export const GAMING_SET_IDS = [
    "dice-set",
    "playing-card-set",
];

const background = (
    value: CharacterBackground
): CharacterBackground => value;

export const DND_BACKGROUNDS: CharacterBackground[] = [
    background({
        id: "acolyte",
        name: "Acólito",
        skillProficiencies: ["insight", "religion"],
        languageChoices: 2,
        startingEquipment: [
            stack("holy-symbol"),
            stack("holy-text"),
            stack("incense", 5),
            stack("vestments"),
            stack("common-clothes"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Abrigo dos Fiéis",
            description: "Você e seus companheiros recebem cura e abrigo modesto em templos ligados à sua fé.",
        },
    }),
    background({
        id: "charlatan",
        name: "Charlatão",
        skillProficiencies: ["deception", "sleight-of-hand"],
        toolProficiencies: ["disguise-kit", "forgery-kit"],
        startingEquipment: [
            stack("fine-clothes"),
            stack("disguise-kit"),
            stack("con-tools"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Identidade Falsa",
            description: "Você mantém uma segunda identidade completa, com documentos, contatos e disfarces.",
        },
    }),
    background({
        id: "criminal",
        name: "Criminoso",
        skillProficiencies: ["deception", "stealth"],
        toolProficiencies: ["thieves-tools"],
        toolChoice: { count: 1, options: GAMING_SET_IDS },
        startingEquipment: [
            stack("crowbar"),
            stack("common-clothes"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Contato Criminal",
            description: "Você possui um contato confiável que conecta você à rede criminosa.",
        },
    }),
    background({
        id: "spy",
        name: "Espião",
        variantOf: "criminal",
        skillProficiencies: ["deception", "stealth"],
        toolProficiencies: ["thieves-tools"],
        toolChoice: { count: 1, options: GAMING_SET_IDS },
        startingEquipment: [
            stack("crowbar"),
            stack("common-clothes"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Rede de Espionagem",
            description: "Você sabe transmitir mensagens secretas e encontrar contatos em redes clandestinas.",
        },
    }),
    background({
        id: "entertainer",
        name: "Artista",
        skillProficiencies: ["acrobatics", "performance"],
        toolProficiencies: ["disguise-kit"],
        toolChoice: { count: 1, options: MUSICAL_INSTRUMENT_IDS },
        equipmentFromToolChoice: true,
        startingEquipment: [
            stack("admirer-favor"),
            stack("costume"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Pela Demanda Popular",
            description: "Você sempre encontra um lugar para se apresentar e recebe alojamento e comida modestos.",
        },
    }),
    background({
        id: "gladiator",
        name: "Gladiador",
        variantOf: "entertainer",
        skillProficiencies: ["acrobatics", "performance"],
        toolProficiencies: ["disguise-kit"],
        toolChoice: { count: 1, options: MUSICAL_INSTRUMENT_IDS },
        startingEquipment: [
            stack("trident"),
            stack("admirer-favor"),
            stack("costume"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Pela Demanda Popular",
            description: "Sua reputação nas arenas garante oportunidades de apresentação, abrigo e comida modestos.",
        },
    }),
    background({
        id: "folk-hero",
        name: "Herói do Povo",
        skillProficiencies: ["animal-handling", "survival"],
        toolProficiencies: ["vehicles-land"],
        toolChoice: { count: 1, options: ARTISAN_TOOL_IDS },
        equipmentFromToolChoice: true,
        startingEquipment: [
            stack("shovel"),
            stack("iron-pot"),
            stack("common-clothes"),
        ],
        startingGoldGp: 10,
        feature: {
            name: "Hospitalidade Rústica",
            description: "Pessoas comuns escondem, protegem e alimentam você, desde que não ofereça perigo.",
        },
    }),
    background({
        id: "guild-artisan",
        name: "Artesão de Guilda",
        skillProficiencies: ["insight", "persuasion"],
        toolChoice: { count: 1, options: ARTISAN_TOOL_IDS },
        equipmentFromToolChoice: true,
        languageChoices: 1,
        startingEquipment: [
            stack("guild-letter"),
            stack("travelers-clothes"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Membro da Guilda",
            description: "Sua guilda oferece contatos, hospedagem e apoio profissional, esperando contribuições em troca.",
        },
    }),
    background({
        id: "guild-merchant",
        name: "Mercador de Guilda",
        variantOf: "guild-artisan",
        skillProficiencies: ["insight", "persuasion"],
        toolChoice: { count: 1, options: ["navigator-tools"] },
        equipmentFromToolChoice: true,
        languageChoices: 1,
        startingEquipment: [
            stack("guild-letter"),
            stack("travelers-clothes"),
        ],
        startingGoldGp: 15,
        feature: {
            name: "Membro da Guilda",
            description: "Sua rede mercantil fornece contatos comerciais, hospedagem e auxílio profissional.",
        },
    }),
    background({
        id: "hermit",
        name: "Eremita",
        skillProficiencies: ["medicine", "religion"],
        toolProficiencies: ["herbalism-kit"],
        languageChoices: 1,
        startingEquipment: [
            stack("scroll-case"),
            stack("winter-blanket"),
            stack("common-clothes"),
            stack("herbalism-kit"),
        ],
        startingGoldGp: 5,
        feature: {
            name: "Descoberta",
            description: "Durante seu isolamento, você encontrou uma verdade única e potencialmente transformadora.",
        },
    }),
    background({
        id: "noble",
        name: "Nobre",
        skillProficiencies: ["history", "persuasion"],
        toolChoice: { count: 1, options: GAMING_SET_IDS },
        languageChoices: 1,
        startingEquipment: [
            stack("fine-clothes"),
            stack("signet-ring"),
            stack("pedigree-scroll"),
        ],
        startingGoldGp: 25,
        feature: {
            name: "Posição de Privilégio",
            description: "Pessoas presumem que você tem autoridade; a alta sociedade o recebe como um de seus membros.",
        },
    }),
    background({
        id: "knight",
        name: "Cavaleiro",
        variantOf: "noble",
        skillProficiencies: ["history", "persuasion"],
        toolChoice: { count: 1, options: GAMING_SET_IDS },
        languageChoices: 1,
        startingEquipment: [
            stack("fine-clothes"),
            stack("signet-ring"),
            stack("pedigree-scroll"),
        ],
        startingGoldGp: 25,
        feature: {
            name: "Serviçais",
            description: "Três plebeus leais cuidam de tarefas mundanas e um deles atua como seu escudeiro.",
        },
    }),
    background({
        id: "outlander",
        name: "Forasteiro",
        skillProficiencies: ["athletics", "survival"],
        toolChoice: { count: 1, options: MUSICAL_INSTRUMENT_IDS },
        equipmentFromToolChoice: true,
        languageChoices: 1,
        startingEquipment: [
            stack("staff"),
            stack("hunting-trap"),
            stack("trophy"),
            stack("travelers-clothes"),
        ],
        startingGoldGp: 10,
        feature: {
            name: "Andarilho",
            description: "Você recorda mapas e terrenos e encontra alimento e água para até seis pessoas.",
        },
    }),
    background({
        id: "sage",
        name: "Sábio",
        skillProficiencies: ["arcana", "history"],
        languageChoices: 2,
        startingEquipment: [
            stack("ink-bottle"),
            stack("ink-pen"),
            stack("small-knife"),
            stack("common-clothes"),
        ],
        startingGoldGp: 10,
        feature: {
            name: "Pesquisador",
            description: "Quando não sabe uma informação, geralmente sabe onde e com quem encontrá-la.",
        },
    }),
    background({
        id: "sailor",
        name: "Marinheiro",
        skillProficiencies: ["athletics", "perception"],
        toolProficiencies: ["navigator-tools", "vehicles-water"],
        startingEquipment: [
            stack("belaying-pin"),
            stack("silk-rope"),
            stack("token"),
            stack("common-clothes"),
        ],
        startingGoldGp: 10,
        feature: {
            name: "Passagem de Navio",
            description: "Você consegue transporte marítimo para si e seus companheiros em troca de trabalho.",
        },
    }),
    background({
        id: "pirate",
        name: "Pirata",
        variantOf: "sailor",
        skillProficiencies: ["athletics", "perception"],
        toolProficiencies: ["navigator-tools", "vehicles-water"],
        startingEquipment: [
            stack("belaying-pin"),
            stack("silk-rope"),
            stack("token"),
            stack("common-clothes"),
        ],
        startingGoldGp: 10,
        feature: {
            name: "Má Reputação",
            description: "Sua fama intimida pessoas comuns, que evitam denunciar pequenos delitos seus.",
        },
    }),
    background({
        id: "soldier",
        name: "Soldado",
        skillProficiencies: ["athletics", "intimidation"],
        toolProficiencies: ["vehicles-land"],
        toolChoice: { count: 1, options: GAMING_SET_IDS },
        equipmentFromToolChoice: true,
        startingEquipment: [
            stack("rank-insignia"),
            stack("trophy"),
            stack("common-clothes"),
        ],
        startingGoldGp: 10,
        feature: {
            name: "Patente Militar",
            description: "Soldados leais à sua antiga organização reconhecem sua autoridade e influência.",
        },
    }),
    background({
        id: "urchin",
        name: "Órfão",
        skillProficiencies: ["sleight-of-hand", "stealth"],
        toolProficiencies: ["disguise-kit", "thieves-tools"],
        startingEquipment: [
            stack("small-knife"),
            stack("city-map"),
            stack("pet-mouse"),
            stack("token"),
            stack("common-clothes"),
        ],
        startingGoldGp: 10,
        feature: {
            name: "Segredos da Cidade",
            description: "Fora de combate, você e seus companheiros viajam entre locais urbanos com o dobro da velocidade.",
        },
    }),
];
