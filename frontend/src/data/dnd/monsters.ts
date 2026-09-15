export type MonsterSize = "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";

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
export const MM_MONSTERS: Monster[] = [
  {
    "id": "aboleth",
    "name": "Abolete",
    "nameEn": "Aboleth",
    "type": "aberração",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 17,
    "hp": 135,
    "hitDice": "18d10",
    "cr": "10",
    "xp": 5900,
    "speed": "caminhada: 3 m; natação: 12 m",
    "abilities": {
      "strength": 21,
      "dexterity": 9,
      "constitution": 15,
      "intelligence": 18,
      "wisdom": 15,
      "charisma": 18
    },
    "skills": "History +12, Perception +10",
    "senses": "visão no escuro 36 m, Percepção passiva 20",
    "languages": "Deep Speech, telepathy 36 m",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) aboleth can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mucous Cloud",
        "description": "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 1.5 m of it must make a DC 14 Constituição teste de resistência. On a failure, the creature is diseased for 1d4 hours. O(a) diseased creature can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Probing Telepathy",
        "description": "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) aboleth faz três ataques de Tentáculo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Tentáculo",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, um alvo. Acerto: 12 (2d6 + 5) dano de concussão. If the target is a creature, it must succeed on a DC 14 Constituição teste de resistência or become diseased. O(a) disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) dano de ácido every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
        "attackBonus": 9,
        "damage": "2d6+5 + 1d12"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, um alvo. Acerto: 15 (3d6 + 5) dano de concussão.",
        "attackBonus": 9,
        "damage": "3d6+5"
      },
      {
        "name": "Enslave",
        "description": "O(a) aboleth targets uma criatura it can see within 9 m of it. O(a) target must succeed on a DC 14 Sabedoria teste de resistência or be magically enfeitiçado by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. O(a) enfeitiçado target is under the aboleth's control and can't take reaçãos, and the aboleth and the target can communicate telepathically with each other over any distance.\nWhenever the enfeitiçado target takes damage, the target can repeat the teste de resistência. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the teste de resistência when it is at least 1 mile away from the aboleth.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) aboleth makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Swipe",
        "description": "O(a) aboleth makes one Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Psychic Drain (Costs 2 Actions)",
        "description": "uma criatura enfeitiçado by the aboleth takes 10 (3d6) dano psíquico, and the aboleth regains hit points equal to the damage the creature takes.",
        "attackBonus": null,
        "damage": "3d6"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/aboleth.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/aboleth.png",
    "color": "#6B3FA0",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "vulture",
    "name": "Abutre",
    "nameEn": "Vulture",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 5,
    "hitDice": "1d8",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 3 m; voo: 15 m",
    "abilities": {
      "strength": 7,
      "dexterity": 10,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 4
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada and Smell",
        "description": "O(a) vulture has advantage on Sabedoria (Perception) checks that rely on sight or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 2 (1d4) dano perfurante.",
        "attackBonus": 2,
        "damage": "1d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/vulture.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/vulture.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-vulture",
    "name": "Abutre Gigante",
    "nameEn": "Giant Vulture",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e mau",
    "ac": 10,
    "hp": 22,
    "hitDice": "3d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 3 m; voo: 18 m",
    "abilities": {
      "strength": 15,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 6,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "compreende Comum mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada and Smell",
        "description": "O(a) vulture has advantage on Sabedoria (Perception) checks that rely on sight or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) vulture makes two attacks: one with its beak and one with its talons.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d4 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "2d4+2"
      },
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (2d6 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "2d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-vulture.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-vulture.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "acolyte",
    "name": "Acólito",
    "nameEn": "Acolyte",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 10,
    "hp": 9,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 10,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 14,
      "charisma": 11
    },
    "skills": "Medicine +4, Religion +2",
    "senses": "Percepção passiva 12",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração",
        "description": "O(a) acolyte is a 1st-level spellcaster. Its Conjuração ability is Sabedoria (spell save DC 12, +4 para acertar with spell attacks). O(a) acolyte has following cleric spells prepared:\n\n- Cantrips (at will): light, sacred flame, thaumaturgy\n- 1st level (3 slots): bless, cure wounds, sanctuary",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Clava",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 2 (1d4) dano de concussão.",
        "attackBonus": 2,
        "damage": "1d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/acolyte.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/acolyte.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "eagle",
    "name": "Águia",
    "nameEn": "Eagle",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 3,
    "hitDice": "1d6",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 3 m; voo: 18 m",
    "abilities": {
      "strength": 6,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 2,
      "wisdom": 14,
      "charisma": 7
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada",
        "description": "O(a) eagle has advantage on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/eagle.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/eagle.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-eagle",
    "name": "Águia Gigante",
    "nameEn": "Giant Eagle",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e bom",
    "ac": 13,
    "hp": 26,
    "hitDice": "4d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 3 m; voo: 24 m",
    "abilities": {
      "strength": 16,
      "dexterity": 17,
      "constitution": 13,
      "intelligence": 8,
      "wisdom": 14,
      "charisma": 10
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "Giant Eagle, compreende Comum and Auran mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada",
        "description": "O(a) eagle has advantage on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) eagle makes two attacks: one with its beak and one with its talons.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-eagle.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-eagle.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "elk",
    "name": "Alce",
    "nameEn": "Elk",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 13,
    "hitDice": "2d10",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 16,
      "dexterity": 10,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the elk moves at least 6 m straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, one pruma criatura. Acerto: 8 (2d4 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "2d4+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/elk.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/elk.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-elk",
    "name": "Alce Gigante",
    "nameEn": "Giant Elk",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 42,
    "hitDice": "5d12",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 18 m",
    "abilities": {
      "strength": 19,
      "dexterity": 16,
      "constitution": 14,
      "intelligence": 7,
      "wisdom": 14,
      "charisma": 10
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "Giant Elk, compreende Comum, Elvish, and Sylvan mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the elk moves at least 6 m straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d6+4"
      },
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, one pruma criatura. Acerto: 22 (4d8 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "4d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-elk.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-elk.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "androsphinx",
    "name": "Androesfinge",
    "nameEn": "Androsphinx",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e neutro",
    "ac": 17,
    "hp": 199,
    "hitDice": "19d10",
    "cr": "17",
    "xp": 18000,
    "speed": "caminhada: 12 m; voo: 18 m",
    "abilities": {
      "strength": 22,
      "dexterity": 10,
      "constitution": 20,
      "intelligence": 16,
      "wisdom": 18,
      "charisma": 23
    },
    "skills": "Arcana +9, Perception +10, Religion +15",
    "senses": "visão verdadeira 36 m, Percepção passiva 20",
    "languages": "Comum, Sphinx",
    "damageResistances": "—",
    "damageImmunities": "psychic, bludgeoning, piercing, and slashing from nonmagical weapons",
    "conditionImmunities": "enfeitiçado, amedrontado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Inscrutable",
        "description": "O(a) sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Sabedoria (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) sphinx's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) sphinx is a 12th-level spellcaster. Its Conjuração ability is Sabedoria (spell save DC 18, +10 para acertar with spell attacks). It requires no material components to cast its spells. O(a) sphinx has the following cleric spells prepared:\n\n- Cantrips (at will): sacred flame, spare the dying, thaumaturgy\n- 1st level (4 slots): command, detect evil and good, detect magic\n- 2nd level (3 slots): lesser restoration, zone of truth\n- 3rd level (3 slots): dispel magic, tongues\n- 4th level (3 slots): banishment, freedom of movement\n- 5th level (2 slots): flame strike, greater restoration\n- 6th level (1 slot): heroes' feast",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) sphinx faz dois ataques de Garra.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1.5 m, um alvo. Acerto: 17 (2d10 + 6) dano cortante.",
        "attackBonus": 12,
        "damage": "2d10+6"
      },
      {
        "name": "Roar",
        "description": "O(a) sphinx emits a magical roar. Each time it roars before finishing a long rest, the roar is louder and the effect is different, as deCaudaed below. Each creature within 500 feet of the sphinx and able to hear the roar must make a teste de resistência.\n\nFirst Roar. Each creature that fails a DC 18 Sabedoria teste de resistência is amedrontado for 1 minute. A amedrontado creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.\n\nSecond Roar. Each creature that fails a DC 18 Sabedoria teste de resistência is Surdo and amedrontado for 1 minute. A amedrontado creature is paralisado and can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.\n\nThird Roar. Each creature makes a DC 18 Constituição teste de resistência. On a failed save, a creature takes 44 (8d10) dano de trovão and is knocked caído. On a successful save, the creature takes half as much damage and isn't knocked caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Garra Attack",
        "description": "O(a) sphinx makes one Garra attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Teleport (Costs 2 Actions)",
        "description": "O(a) sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cast a Spell (Costs 3 Actions)",
        "description": "O(a) sphinx casts a spell from its list of prepared spells, using a spell slot as normal.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/androsphinx.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/androsphinx.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ankheg",
    "name": "Ankheg",
    "nameEn": "Ankheg",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 39,
    "hitDice": "6d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; escavação: 3 m",
    "abilities": {
      "strength": 17,
      "dexterity": 11,
      "constitution": 13,
      "intelligence": 1,
      "wisdom": 13,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante plus 3 (1d6) dano de ácido. If the target is a Large or smaller creature, it is agarrado (escape DC 13). Until this grapple ends, the ankheg can Mordida only the agarrado creature and has advantage on attack rolls to do so.",
        "attackBonus": 5,
        "damage": "2d6+3 + 1d6"
      },
      {
        "name": "Acid Spray",
        "description": "O(a) ankheg spits acid in a line that is 9 m long and 1.5 m wide, provided that it has no creature agarrado. Each creature in that line must make a DC 13 Destreza teste de resistência, taking 10 (3d6) dano de ácido on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "3d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ankheg.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ankheg.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "spider",
    "name": "Aranha",
    "nameEn": "Spider",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 6 m; escalada: 6 m",
    "abilities": {
      "strength": 2,
      "dexterity": 14,
      "constitution": 8,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 2
    },
    "skills": "Stealth +4",
    "senses": "visão no escuro 9 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Spider escalada",
        "description": "O(a) spider can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web Sense",
        "description": "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web caminhadaer",
        "description": "O(a) spider ignores movement restrictions caused by webbing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 1 dano perfurante, and the target must succeed on a DC 9 Constituição teste de resistência or take 2 (1d4) dano de veneno.",
        "attackBonus": 4,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/spider.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/spider.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "phase-spider",
    "name": "Aranha Fantasma",
    "nameEn": "Phase Spider",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 32,
    "hitDice": "5d10",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 6
    },
    "skills": "Stealth +6",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Ethereal Jaunt",
        "description": "As a ação bônus, the spider can magically shift from the Material Plane to the Ethereal Plane, or vice versa.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) spider can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web caminhadaer",
        "description": "O(a) spider ignores movement restrictions caused by webbing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 7 (1d10 + 2) dano perfurante, and the target must make a DC 11 Constituição teste de resistência, taking 18 (4d8) dano de veneno on a failed save, or half as much damage on a successful one. If the dano de veneno reduces the target to 0 hit points, the target is stable but envenenado for 1 hour, even after regaining hit points, and is paralisado while envenenado in this way.",
        "attackBonus": 4,
        "damage": "1d10+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/phase-spider.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/phase-spider.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-spider",
    "name": "Aranha Gigante",
    "nameEn": "Giant Spider",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 26,
    "hitDice": "4d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 14,
      "dexterity": 16,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 11,
      "charisma": 4
    },
    "skills": "Stealth +7",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Spider escalada",
        "description": "O(a) spider can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web Sense",
        "description": "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web caminhadaer",
        "description": "O(a) spider ignores movement restrictions caused by webbing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, uma criatura. Acerto: 7 (1d8 + 3) dano perfurante, and the target must make a DC 11 Constituição teste de resistência, taking 9 (2d8) dano de veneno on a failed save, or half as much damage on a successful one. If the dano de veneno reduces the target to 0 hit points, the target is stable but envenenado for 1 hour, even after regaining hit points, and is paralisado while envenenado in this way.",
        "attackBonus": 5,
        "damage": "1d8+3"
      },
      {
        "name": "Web",
        "description": "Ataque à distância com arma: +5 para acertar, range 30/18 m, uma criatura. Acerto: O(a) target is impedido by webbing. As an action, the impedido target can make a DC 12 Força check, burFerrão the webbing on a success. O(a) webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to dano de fogo; immunity to bludgeoning, poison, and dano psíquico).",
        "attackBonus": 5,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-spider.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-spider.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-wolf-spider",
    "name": "Aranha-Lobo Gigante",
    "nameEn": "Giant Wolf Spider",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 12 m; escalada: 12 m",
    "abilities": {
      "strength": 12,
      "dexterity": 16,
      "constitution": 13,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 4
    },
    "skills": "Perception +3, Stealth +7",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Spider escalada",
        "description": "O(a) spider can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web Sense",
        "description": "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web caminhadaer",
        "description": "O(a) spider ignores movement restrictions caused by webbing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, uma criatura. Acerto: 4 (1d6 + 1) dano perfurante, and the target must make a DC 11 Constituição teste de resistência, taking 7 (2d6) dano de veneno on a failed save, or half as much damage on a successful one. If the dano de veneno reduces the target to 0 hit points, the target is stable but envenenado for 1 hour, even after regaining hit points, and is paralisado while envenenado in this way.",
        "attackBonus": 3,
        "damage": "1d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-wolf-spider.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-wolf-spider.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "awakened-shrub",
    "name": "Arbusto Desperto",
    "nameEn": "Awakened Shrub",
    "type": "planta",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 9,
    "hp": 10,
    "hitDice": "3d6",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 3,
      "dexterity": 8,
      "constitution": 11,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "one language known by its creator",
    "damageResistances": "piercing",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "fire",
    "traits": [
      {
        "name": "False Appearance",
        "description": "While the shrub remains motionless, it is indiFerrãouishable from a normal shrub.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Rake",
        "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1.5 m, um alvo. Acerto: 1 (1d4 - 1) dano cortante.",
        "attackBonus": 1,
        "damage": "1d4-1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/awakened-shrub.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/awakened-shrub.png",
    "color": "#2F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "animated-armor",
    "name": "Armadura Animada",
    "nameEn": "Animated Armor",
    "type": "constructo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 18,
    "hp": 33,
    "hitDice": "6d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 7.5 m",
    "abilities": {
      "strength": 14,
      "dexterity": 11,
      "constitution": 13,
      "intelligence": 1,
      "wisdom": 3,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 6",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "Cego, enfeitiçado, Surdo, Exaustão, amedrontado, paralisado, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "description": "O(a) armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constituição teste de resistência against the caster's spell save DC or fall unconscious for 1 minute.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "False Appearance",
        "description": "While the armor remains motionless, it is indiFerrãouishable from a normal suit of armor.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) armor faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano de concussão.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/animated-armor.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/animated-armor.png",
    "color": "#5A5A5A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "archmage",
    "name": "Arquimago",
    "nameEn": "Archmage",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 15,
    "hp": 99,
    "hitDice": "18d8",
    "cr": "12",
    "xp": 8400,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 20,
      "wisdom": 15,
      "charisma": 16
    },
    "skills": "Arcana +13, History +13",
    "senses": "Percepção passiva 12",
    "languages": "any six languages",
    "damageResistances": "damage from spells, bludgeoning, piercing, and slashing from nonmagical attacks (from stoneskin)",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência à Magia",
        "description": "O(a) archmage has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) archmage is an 18th-level spellcaster. Its Conjuração ability is Inteligência (spell save DC 17, +9 para acertar with spell attacks). O(a) archmage can cast disguise self and invisibility at will and has the following wizard spells prepared:\n\n- Cantrips (at will): fire bolt, light, mage hand, prestidigitation, shocking grasp\n- 1st level (4 slots): detect magic, identify, mage armor*, magic missile\n- 2nd level (3 slots): detect thoughts, mirror image, misty step\n- 3rd level (3 slots): counterspell, voo, lightning bolt\n- 4th level (3 slots): banishment, fire shield, stoneskin*\n- 5th level (3 slots): cone of cold, scrying, wall of force\n- 6th level (1 slot): globe of invulnerability\n- 7th level (1 slot): teleport\n- 8th level (1 slot): mind blank*\n- 9th level (1 slot): time stop\n* O(a) archmage casts these spells on itself before combat.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Adaga",
        "description": "Melee or Ataque à distância com arma: +6 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/archmage.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/archmage.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "awakened-tree",
    "name": "Árvore Desperta",
    "nameEn": "Awakened Tree",
    "type": "planta",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 59,
    "hitDice": "7d12",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 19,
      "dexterity": 6,
      "constitution": 15,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 7
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "one language known by its creator",
    "damageResistances": "bludgeoning, piercing",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "fire",
    "traits": [
      {
        "name": "False Appearance",
        "description": "While the tree remains motionless, it is indiFerrãouishable from a normal tree.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, um alvo. Acerto: 14 (3d6 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "3d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/awakened-tree.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/awakened-tree.png",
    "color": "#2F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "treant",
    "name": "Arvorente",
    "nameEn": "Treant",
    "type": "planta",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e bom",
    "ac": 16,
    "hp": 138,
    "hitDice": "12d12",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 23,
      "dexterity": 8,
      "constitution": 21,
      "intelligence": 12,
      "wisdom": 16,
      "charisma": 12
    },
    "skills": "—",
    "senses": "Percepção passiva 13",
    "languages": "Comum, Druidic, Elvish, Sylvan",
    "damageResistances": "bludgeoning, piercing",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "fire",
    "traits": [
      {
        "name": "False Appearance",
        "description": "While the treant remains motionless, it is indiFerrãouishable from a normal tree.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Siege Monster",
        "description": "O(a) treant deals double damage to objects and structures.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) treant faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 16 (3d6 + 6) dano de concussão.",
        "attackBonus": 10,
        "damage": "3d6+6"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +10 para acertar, range 60/54 m, um alvo. Acerto: 28 (4d10 + 6) dano de concussão.",
        "attackBonus": 10,
        "damage": "4d10+6"
      },
      {
        "name": "Animate Trees",
        "description": "O(a) treant magically animates one or two trees it can see within 60 feet of it. These trees have the same statistics as a treant, except they have Inteligência and Carisma scores of 1, they Não pode falar, and they have only the Pancada action option. An animated tree acts as an ally of the treant. O(a) tree remains animate for 1 day or until it dies; until the treant dies or is more than 120 feet from the tree; or until the treant takes a ação bônus to turn it back into an inanimate tree. O(a) tree then takes root if possible.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/treant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/treant.png",
    "color": "#2F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "assassin",
    "name": "Assassino",
    "nameEn": "Assassin",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any non-good alignment",
    "ac": 15,
    "hp": 78,
    "hitDice": "12d8",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 16,
      "constitution": 14,
      "intelligence": 13,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Acrobatics +6, Deception +3, Perception +3, Stealth +9",
    "senses": "Percepção passiva 13",
    "languages": "Thieves' cant plus any two languages",
    "damageResistances": "poison",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Assassinate",
        "description": "During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Evasion",
        "description": "If the assassin is subjected to an effect that allows it to make a Destreza teste de resistência to take only half damage, the assassin instead takes no damage if it succeeds on the teste de resistência, and only half damage if it fails.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sneak Attack (1/Turn)",
        "description": "O(a) assassin deals an extra 13 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 1.5 m of an ally of the assassin that isn't incapacitated and the assassin doesn't have disadvantage on the attack roll.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) assassin faz dois ataques de Espada curta.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante, and the target must make a DC 15 Constituição teste de resistência, taking 24 (7d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 6,
        "damage": "1d6+3 + 7d6"
      },
      {
        "name": "Light Besta",
        "description": "Ataque à distância com arma: +6 para acertar, range 80/96 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante, and the target must make a DC 15 Constituição teste de resistência, taking 24 (7d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 6,
        "damage": "1d8+3 + 7d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/assassin.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/assassin.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "azer",
    "name": "Azer",
    "nameEn": "Azer",
    "type": "elemental",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e neutro",
    "ac": 17,
    "hp": 39,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 17,
      "dexterity": 12,
      "constitution": 15,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 10
    },
    "skills": "—",
    "senses": "Percepção passiva 11",
    "languages": "Ignan",
    "damageResistances": "—",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Heated Body",
        "description": "A creature that touches the azer or hits it with a melee attack while within 1.5 m of it takes 5 (1d10) dano de fogo.",
        "attackBonus": null,
        "damage": "1d10"
      },
      {
        "name": "Heated Weapons",
        "description": "When the azer hits with a metal melee weapon, it deals an extra 3 (1d6) dano de fogo (included in the attack).",
        "attackBonus": null,
        "damage": "1d6"
      },
      {
        "name": "Illumination",
        "description": "O(a) azer sheds bright light in a 10-foot radius and dim light for an additional 3 m.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Martelo de guerra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano de concussão, or 8 (1d10 + 3) dano de concussão if used with two hands to make a melee attack, plus 3 (1d6) dano de fogo.",
        "attackBonus": 5,
        "damage": "1d8+3 + 1d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/azer.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/azer.png",
    "color": "#2F4F7A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "baboon",
    "name": "Babuíno",
    "nameEn": "Baboon",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 3,
    "hitDice": "1d6",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 8,
      "dexterity": 14,
      "constitution": 11,
      "intelligence": 4,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Táticas de Bando",
        "description": "O(a) baboon has advantage on an attack roll against a creature if at least one of the baboon's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1.5 m, um alvo. Acerto: 1 (1d4 - 1) dano perfurante.",
        "attackBonus": 1,
        "damage": "1d4-1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/baboon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/baboon.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "balor",
    "name": "Balor",
    "nameEn": "Balor",
    "type": "demônio",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e mau",
    "ac": 19,
    "hp": 262,
    "hitDice": "21d12",
    "cr": "19",
    "xp": 22000,
    "speed": "caminhada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 26,
      "dexterity": 15,
      "constitution": 22,
      "intelligence": 20,
      "wisdom": 16,
      "charisma": 22
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 13",
    "languages": "Abyssal, telepathy 36 m",
    "damageResistances": "cold, lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Death Throes",
        "description": "When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Destreza teste de resistência, taking 70 (20d6) dano de fogo on a failed save, or half as much damage on a successful one. O(a) explosion ignites flammable objects in that area that aren't being worn or carried, and it destroys the balor's weapons.",
        "attackBonus": null,
        "damage": "20d6"
      },
      {
        "name": "Fire Aura",
        "description": "At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) dano de fogo, and flammable objects in the aura that aren't being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 10 (3d6) dano de fogo.",
        "attackBonus": null,
        "damage": "3d6"
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) balor has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) balor's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) balor makes two attacks: one with its Espada longa and one with its whip.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 21 (3d8 + 8) dano cortante plus 13 (3d8) dano elétrico. If the balor scores a critical hit, it rolls damage dice three times, instead of twice.",
        "attackBonus": 14,
        "damage": "3d8+8 + 3d8"
      },
      {
        "name": "Whip",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 9 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante plus 10 (3d6) dano de fogo, and the target must succeed on a DC 20 Força teste de resistência or be pulled up to 25 feet toward the balor.",
        "attackBonus": 14,
        "damage": "2d6+8 + 3d6"
      },
      {
        "name": "Teleport",
        "description": "O(a) balor magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/balor.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/balor.png",
    "color": "#5C1A1A",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bandit",
    "name": "Bandido",
    "nameEn": "Bandit",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any non-lawful alignment",
    "ac": 12,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 10
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "1d6+1"
      },
      {
        "name": "Light Besta",
        "description": "Ataque à distância com arma: +3 para acertar, range 80/96 m, um alvo. Acerto: 5 (1d8 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d8+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bandit.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bandit.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "basilisk",
    "name": "Basilisco",
    "nameEn": "Basilisk",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 52,
    "hitDice": "8d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 16,
      "dexterity": 8,
      "constitution": 15,
      "intelligence": 2,
      "wisdom": 8,
      "charisma": 7
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Petrifying Gaze",
        "description": "If a creature starts its turn within 9 m of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constituição teste de resistência if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is impedido. It must repeat the teste de resistência at the end of its next turn. On a success, the effect ends. On a failure, the creature is Petrificado until freed by the greater restoration spell or other magic.\nA creature that isn't surprised can avert its eyes to avoid the teste de resistência at the start of its turn. If it does so, it can't see the basilisk until the start of its next turn, when it can avert its eyes again. If it looks at the basilisk in the meantime, it must immediately make the save.\nIf the basilisk sees its reflection within 9 m of it in bright light, it mistakes itself for a rival and targets itself with its gaze.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano perfurante plus 7 (2d6) dano de veneno.",
        "attackBonus": 5,
        "damage": "2d6+3 + 2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/basilisk.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/basilisk.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "scout",
    "name": "Batedor",
    "nameEn": "Scout",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 13,
    "hp": 16,
    "hitDice": "3d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 11,
      "wisdom": 13,
      "charisma": 11
    },
    "skills": "Nature +4, Perception +5, Stealth +6, Survival +5",
    "senses": "Percepção passiva 15",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Sight",
        "description": "O(a) scout has advantage on Sabedoria (Perception) checks that rely on hearing or sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) scout faz dois ataques de melee or two ranged attacks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +4 para acertar, range 150/180 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/scout.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/scout.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "behir",
    "name": "Behir",
    "nameEn": "Behir",
    "type": "monstruosidade",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "neutro e mau",
    "ac": 17,
    "hp": 168,
    "hitDice": "16d12",
    "cr": "11",
    "xp": 7200,
    "speed": "caminhada: 15 m; escalada: 12 m",
    "abilities": {
      "strength": 23,
      "dexterity": 16,
      "constitution": 18,
      "intelligence": 7,
      "wisdom": 14,
      "charisma": 12
    },
    "skills": "Perception +6, Stealth +7",
    "senses": "visão no escuro 27 m, Percepção passiva 16",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) behir makes two attacks: one with its Mordida and one to constrict.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 22 (3d10 + 6) dano perfurante.",
        "attackBonus": 10,
        "damage": "3d10+6"
      },
      {
        "name": "Constrict",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, one Large or smaller creature. Acerto: 17 (2d10 + 6) dano de concussão plus 17 (2d10 + 6) dano cortante. O(a) target is agarrado (escape DC 16) if the behir isn't already constricting a creature, and the target is impedido until this grapple ends.",
        "attackBonus": 10,
        "damage": "2d10+6 + 2d10+6"
      },
      {
        "name": "Lightning Breath",
        "description": "O(a) behir exhales a line of lightning that is 6 m long and 1.5 m wide. Each creature in that line must make a DC 16 Destreza teste de resistência, taking 66 (12d10) dano elétrico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "12d10"
      },
      {
        "name": "Swallow",
        "description": "O(a) behir makes one Mordida attack against a Medium or smaller target it is grappling. If the attack hits, the target is also swallowed, and the grapple ends. While swallowed, the target is Cego and impedido, it has total cover against attacks and other effects outside the behir, and it takes 21 (6d6) dano de ácido at the start of each of the behir's turns. A behir can have only uma criatura swallowed at a time.\nIf the behir takes 30 damage or more on a single turn from the swallowed creature, the behir must succeed on a DC 14 Constituição teste de resistência at the end of that turn or regurgitate the creature, which falls caído in a space within 3 m of the behir. If the behir dies, a swallowed creature is no longer impedido by it and can escape from the corpse by using 4.5 m of movement, exiting caído.",
        "attackBonus": null,
        "damage": "6d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/behir.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/behir.png",
    "color": "#4A2F18",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "berserker",
    "name": "Berserker",
    "nameEn": "Berserker",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any chaotic alignment",
    "ac": 13,
    "hp": 67,
    "hitDice": "9d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 12,
      "constitution": 17,
      "intelligence": 9,
      "wisdom": 11,
      "charisma": 9
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Reckless",
        "description": "At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Machado grande",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (1d12 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d12+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/berserker.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/berserker.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-fire-beetle",
    "name": "Besouro de Fogo Gigante",
    "nameEn": "Giant Fire Beetle",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 4,
    "hitDice": "1d6",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 8,
      "dexterity": 10,
      "constitution": 12,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão às cegas 9 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Illumination",
        "description": "O(a) beetle sheds bright light in a 10-foot radius and dim light for an additional 3 m.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1.5 m, um alvo. Acerto: 2 (1d6 - 1) dano cortante.",
        "attackBonus": 1,
        "damage": "1d6-1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-fire-beetle.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-fire-beetle.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "axe-beak",
    "name": "Bico-de-Machado",
    "nameEn": "Axe Beak",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 14,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/axe-beak.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/axe-beak.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gibbering-mouther",
    "name": "Boca Balbuciante",
    "nameEn": "Gibbering Mouther",
    "type": "aberração",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 9,
    "hp": 67,
    "hitDice": "9d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 3 m; natação: 3 m",
    "abilities": {
      "strength": 10,
      "dexterity": 8,
      "constitution": 16,
      "intelligence": 3,
      "wisdom": 10,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "caído",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Aberrant Ground",
        "description": "O(a) ground in a 10-foot radius around the mouther is doughlike difficult terrain. Each creature that starts its turn in that area must succeed on a DC 10 Força teste de resistência or have its speed reduced to 0 until the start of its next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Gibbering",
        "description": "O(a) mouther babbles incoherently while it can see any creature and isn't incapacitated. Each creature that starts its turn within 20 feet of the mouther and can hear the gibbering must succeed on a DC 10 Sabedoria teste de resistência. On a failure, the creature can't take reaçãos until the start of its next turn and rolls a d8 to determine what it does during its turn. On a 1 to 4, the creature does nothing. On a 5 or 6, the creature takes no action or ação bônus and uses all its movement to move in a randomly determined direction. On a 7 or 8, the creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can't make such an attack.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) gibbering mouther makes one Mordida attack and, if it can, uses its Blinding Spittle.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, uma criatura. Acerto: 17 (5d6) dano perfurante. If the target is Medium or smaller, it must succeed on a DC 10 Força teste de resistência or be knocked caído. If the target is killed by this damage, it is absorbed into the mouther.",
        "attackBonus": 2,
        "damage": "5d6"
      },
      {
        "name": "Blinding Spittle",
        "description": "O(a) mouther spits a chemical glob at a point it can see within 15 feet of it. O(a) glob explodes in a blinding flash of light on impact. Each creature within 5 feet of the flash must succeed on a DC 13 Destreza teste de resistência or be Cego until the end of the mouther's next turn.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gibbering-mouther.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gibbering-mouther.png",
    "color": "#6B3FA0",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "night-hag",
    "name": "Bruxa da Noite",
    "nameEn": "Night Hag",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 17,
    "hp": 112,
    "hitDice": "15d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 16,
      "wisdom": 14,
      "charisma": 16
    },
    "skills": "Deception +7, Insight +6, Perception +6, Stealth +6",
    "senses": "visão no escuro 36 m, Percepção passiva 16",
    "languages": "Abyssal, Comum, Infernal, Primordial",
    "damageResistances": "cold, fire, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração Inata",
        "description": "O(a) hag's Conjuração Inata ability is Carisma (spell save DC 14, +6 para acertar with spell attacks). She can innately cast the following spells, requiring no material components:\n\nAt will: detect magic, magic missile\n2/day each: plane shift (self only), ray of enfeeblement, sleep",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) hag has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Night Hag Items",
        "description": "A night hag carries two very rare magic items that she must craft for herself If either object is lost, the night hag will go to great lengths to retrieve it, as creating a new tool takes time and effort.\nHeartstone: This lustrous black gem allows a night hag to become ethereal while it is in her possession. O(a) touch of a heartstone also cures any disease. Crafting a heartstone takes 30 days.\nSoul Bag: When an evil humanoid dies as a result of a night hag's Nightmare Haunting, the hag catches the soul in this black sack made of stitched flesh. A soul bag can hold only one evil soul at a time, and only the night hag who crafted the bag can catch a soul with it. Crafting a soul bag takes 7 days and a humanoid sacrifice (whose flesh is used to make the bag).",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras (Hag Form Only)",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d8+4"
      },
      {
        "name": "Change Shape",
        "description": "O(a) hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn't transformed. She reverts to her true form if she dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Etherealness",
        "description": "O(a) hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a heartstone in her possession.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Nightmare Haunting",
        "description": "While on the Ethereal Plane, the hag magically touches a sleeping humanoid on the Material Plane. A protection from evil and good spell cast on the target prevents this contact, as does a magic circle. As long as the contact persists, the target has dreadful visions. If these visions last for at least 1 hour, the target gains no benefit from its rest, and its hit point maximum is reduced by 5 (1d10). If this effect reduces the target's hit point maximum to 0, the target dies, and if the target was evil, its soul is trapped in the hag's soul bag. O(a) reduction to the target's hit point maximum lasts until removed by the greater restoration spell or similar magic.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/night-hag.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/night-hag.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "sea-hag",
    "name": "Bruxa do Mar",
    "nameEn": "Sea Hag",
    "type": "fada",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 14,
    "hp": 52,
    "hitDice": "7d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; natação: 12 m",
    "abilities": {
      "strength": 16,
      "dexterity": 13,
      "constitution": 16,
      "intelligence": 12,
      "wisdom": 12,
      "charisma": 13
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "Aquan, Comum, Giant",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) hag can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Horrific Appearance",
        "description": "Any humanoid that starts its turn within 30 feet of the hag and can see the hag's true form must make a DC 11 Sabedoria teste de resistência. On a failed save, the creature is amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, with disadvantage if the hag is within line of sight, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the hag's Horrific Appearance for the next 24 hours.\nUnless the target is surprised or the revelation of the hag's true form is sudden, the target can avert its eyes and avoid making the initial teste de resistência. Until the start of its next turn, a creature that averts its eyes has disadvantage on attack rolls against the hag.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "2d6+3"
      },
      {
        "name": "Death Glare",
        "description": "O(a) hag targets one amedrontado creature she can see within 9 m of her. If the target can see the hag, it must succeed on a DC 11 Sabedoria teste de resistência against this magic or drop to 0 hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Illusory Appearance",
        "description": "O(a) hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like an ugly creature of her general size and humanoid shape. O(a) effect ends if the hag takes a ação bônus to end it or if she dies.\nO(a) changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have no Garras, but someone touching her hand might feel the Garras. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 16 Inteligência (Investigation) check to discern that the hag is disguised.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/sea-hag.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/sea-hag.png",
    "color": "#6B3FA0",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "green-hag",
    "name": "Bruxa Verde",
    "nameEn": "Green Hag",
    "type": "fada",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 17,
    "hp": 82,
    "hitDice": "11d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 12,
      "constitution": 16,
      "intelligence": 13,
      "wisdom": 14,
      "charisma": 14
    },
    "skills": "Arcana +3, Deception +4, Perception +4, Stealth +3",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Comum, Draconic, Sylvan",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) hag can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) hag's Conjuração Inata ability is Carisma (spell save DC 12). She can innately cast the following spells, requiring no material components:\n\nAt will: dancing lights, minor illusion, vicious mockery",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mimicry",
        "description": "O(a) hag can mimic animal sounds and humanoid voices. A creature that hears the sounds can tell they are imitations with a successful DC 14 Sabedoria (Insight) check.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano cortante.",
        "attackBonus": 6,
        "damage": "2d8+4"
      },
      {
        "name": "Illusory Appearance",
        "description": "O(a) hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like another creature of her general size and humanoid shape. O(a) illusion ends if the hag takes a ação bônus to end it or if she dies.\nO(a) changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have smooth skin, but someone touching her would feel her rough flesh. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 20 Inteligência (Investigation) check to discern that the hag is disguised.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "invisível Passage",
        "description": "O(a) hag magically turns invisível until she attacks or casts a spell, or until her concentration ends (as if concentrating on a spell). While invisível, she leaves no physical evidence of her passage, so she can be tracked only by magic. Any equipment she wears or carries is invisível with her.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/green-hag.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/green-hag.png",
    "color": "#6B3FA0",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bugbear",
    "name": "Bugbear",
    "nameEn": "Bugbear",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 16,
    "hp": 27,
    "hitDice": "5d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 13,
      "intelligence": 8,
      "wisdom": 11,
      "charisma": 9
    },
    "skills": "Stealth +6, Survival +2",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Comum, Goblin",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Brute",
        "description": "A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack).",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Surprise Attack",
        "description": "If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Maça-estrela",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "2d8+2"
      },
      {
        "name": "Dardo",
        "description": "Melee or Ataque à distância com arma: +4 para acertar, alcance 1.5 m or range 30/36 m, um alvo. Acerto: 9 (2d6 + 2) dano perfurante in melee or 5 (1d6 + 2) dano perfurante at range.",
        "attackBonus": 4,
        "damage": "2d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bugbear.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bugbear.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bulette",
    "name": "Bulette",
    "nameEn": "Bulette",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 17,
    "hp": 94,
    "hitDice": "9d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 12 m; escavação: 12 m",
    "abilities": {
      "strength": 19,
      "dexterity": 11,
      "constitution": 21,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "Perception +6",
    "senses": "visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 16",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Standing Leap",
        "description": "O(a) bulette's long jump is up to 9 m and its high jump is up to 4.5 m, with or without a running start.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 30 (4d12 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "4d12+4"
      },
      {
        "name": "Deadly Leap",
        "description": "If the bulette jumps at least 4.5 m as part of its movement, it can then use this action to land on its feet in a space that contains one or more other creatures. Each of those creatures must succeed on a DC 16 Força or Destreza teste de resistência (target's choice) or be knocked caído and take 14 (3d6 + 4) dano de concussão plus 14 (3d6 + 4) dano cortante. On a successful save, the creature takes only half the damage, isn't knocked caído, and is pushed 1.5 m out of the bulette's space into an unoccupied space of the creature's choice. If no unoccupied space is within range, the creature instead falls caído in the bulette's space.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bulette.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bulette.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "goat",
    "name": "Cabra",
    "nameEn": "Goat",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 4,
    "hitDice": "1d8",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 12,
      "dexterity": 10,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the goat moves at least 6 m straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) dano de concussão. If the target is a creature, it must succeed on a DC 10 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sure-Footed",
        "description": "O(a) goat has advantage on Força and Destreza teste de resistências made against effects that would knock it caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d4 + 1) dano de concussão.",
        "attackBonus": 3,
        "damage": "1d4+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/goat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/goat.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-goat",
    "name": "Cabra Gigante",
    "nameEn": "Giant Goat",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 17,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the goat moves at least 6 m straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 5 (2d4) dano de concussão. If the target is a creature, it must succeed on a DC 13 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sure-Footed",
        "description": "O(a) goat has advantage on Força and Destreza teste de resistências made against effects that would knock it caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (2d4 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "2d4+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-goat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-goat.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "camel",
    "name": "Camelo",
    "nameEn": "Camel",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 9,
    "hp": 15,
    "hitDice": "2d10",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 16,
      "dexterity": 8,
      "constitution": 14,
      "intelligence": 2,
      "wisdom": 8,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 2 (1d4) dano de concussão.",
        "attackBonus": 5,
        "damage": "1d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/camel.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/camel.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "death-dog",
    "name": "Cão da Morte",
    "nameEn": "Death Dog",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 12,
    "hp": 39,
    "hitDice": "6d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 3,
      "wisdom": 13,
      "charisma": 6
    },
    "skills": "Perception +5, Stealth +4",
    "senses": "visão no escuro 36 m, Percepção passiva 15",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Two-Headed",
        "description": "O(a) dog has advantage on Sabedoria (Perception) checks and on teste de resistências against being Cego, enfeitiçado, Surdo, amedrontado, atordoado, or knocked unconscious.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dog faz dois ataques de Mordida.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante. If the target is a creature, it must succeed on a DC 12 Constituição teste de resistência against disease or become envenenado until the disease is cured. Every 24 hours that elapse, the creature must repeat the teste de resistência, reducing its hit point maximum by 5 (1d10) on a failure. This reduction lasts until the disease is cured. O(a) creature dies if the disease reduces its hit point maximum to 0.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/death-dog.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/death-dog.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hell-hound",
    "name": "Cão Infernal",
    "nameEn": "Hell Hound",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 15,
    "hp": 45,
    "hitDice": "7d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 17,
      "dexterity": 12,
      "constitution": 14,
      "intelligence": 6,
      "wisdom": 13,
      "charisma": 6
    },
    "skills": "Perception +5",
    "senses": "visão no escuro 18 m, Percepção passiva 15",
    "languages": "compreende Infernal mas não pode falar it",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) hound has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) hound has advantage on an attack roll against a creature if at least one of the hound's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante plus 7 (2d6) dano de fogo.",
        "attackBonus": 5,
        "damage": "1d8+3 + 2d6"
      },
      {
        "name": "Fire Breath",
        "description": "O(a) hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Destreza teste de resistência, taking 21 (6d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "6d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hell-hound.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hell-hound.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "blink-dog",
    "name": "Cão Pestanejante",
    "nameEn": "Blink Dog",
    "type": "fada",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e bom",
    "ac": 13,
    "hp": 22,
    "hitDice": "4d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 12,
      "dexterity": 17,
      "constitution": 12,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 11
    },
    "skills": "Perception +3, Stealth +5",
    "senses": "Percepção passiva 10",
    "languages": "Blink Dog, compreende Sylvan mas não pode falar it",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) dog has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d6+1"
      },
      {
        "name": "Teleport",
        "description": "O(a) dog magically teleports, along with any equipment it is wearing or carrying, up to 12 m to an unoccupied space it can see. Before or after teleporting, the dog can make one Mordida attack.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/blink-dog.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/blink-dog.png",
    "color": "#6B3FA0",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bandit-captain",
    "name": "Capitão Bandido",
    "nameEn": "Bandit Captain",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any non-lawful alignment",
    "ac": 15,
    "hp": 65,
    "hitDice": "10d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 16,
      "constitution": 14,
      "intelligence": 14,
      "wisdom": 11,
      "charisma": 14
    },
    "skills": "Athletics +4, Deception +4",
    "senses": "Percepção passiva 10",
    "languages": "any two languages",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) captain faz três ataques de melee: two with its Cimitarra and one with its Adaga. Or the captain faz dois ataques de ranged with its Adagas.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Adaga",
        "description": "Melee or Ataque à distância com arma: +5 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 5 (1d4 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d4+3"
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "description": "O(a) captain adds 2 to its AC against one melee attack that would hit it. To do so, the captain must see the attacker and be wielding a melee weapon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bandit-captain.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bandit-captain.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-crab",
    "name": "Caranguejo Gigante",
    "nameEn": "Giant Crab",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 15,
    "hp": 13,
    "hitDice": "3d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 13,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 1,
      "wisdom": 9,
      "charisma": 3
    },
    "skills": "Stealth +4",
    "senses": "visão às cegas 9 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) crab can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano de concussão, and the target is agarrado (escape DC 11). O(a) crab has two Garras, each of which can grapple only um alvo.",
        "attackBonus": 3,
        "damage": "1d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-crab.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-crab.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ghoul",
    "name": "Carniçal",
    "nameEn": "Ghoul",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 13,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 7,
      "wisdom": 10,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado, enfeitiçado, Exaustão",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, uma criatura. Acerto: 9 (2d6 + 2) dano perfurante.",
        "attackBonus": 2,
        "damage": "2d6+2"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d4 + 2) dano cortante. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constituição teste de resistência or be paralisado for 1 minute. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 4,
        "damage": "2d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ghoul.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ghoul.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ghast",
    "name": "Carniçal Maior",
    "nameEn": "Ghast",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 13,
    "hp": 36,
    "hitDice": "8d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 17,
      "constitution": 10,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 8
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Comum",
    "damageResistances": "necrotic",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado, enfeitiçado, Exaustão",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Stench",
        "description": "Any creature that starts its turn within 1.5 m of the ghast must succeed on a DC 10 Constituição teste de resistência or be envenenado until the start of its next turn. On a successful teste de resistência, the creature is immune to the ghast's Stench for 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Turn Defiance",
        "description": "O(a) ghast and any ghouls within 9 m of it have advantage on teste de resistências against effects that turn undead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, uma criatura. Acerto: 12 (2d8 + 3) dano perfurante.",
        "attackBonus": 3,
        "damage": "2d8+3"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante. If the target is a creature other than an undead, it must succeed on a DC 10 Constituição teste de resistência or be paralisado for 1 minute. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ghast.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ghast.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "knight",
    "name": "Cavaleiro",
    "nameEn": "Knight",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 18,
    "hp": 52,
    "hitDice": "8d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 11,
      "constitution": 14,
      "intelligence": 11,
      "wisdom": 11,
      "charisma": 15
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Brave",
        "description": "O(a) knight has advantage on teste de resistências against being amedrontado.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) knight faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada grande",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "2d6+3"
      },
      {
        "name": "Heavy Besta",
        "description": "Ataque à distância com arma: +2 para acertar, range 100/120 m, um alvo. Acerto: 5 (1d10) dano perfurante.",
        "attackBonus": 2,
        "damage": "1d10"
      },
      {
        "name": "Leadership",
        "description": "For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 9 m of it makes an attack roll or a teste de resistência. O(a) creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "description": "O(a) knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/knight.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/knight.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "warhorse",
    "name": "Cavalo de Guerra",
    "nameEn": "Warhorse",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 18 m",
    "abilities": {
      "strength": 18,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "—",
    "senses": "Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Trampling Charge",
        "description": "If the horse moves at least 6 m straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Força teste de resistência or be knocked caído. If the target is caído, the horse can make another attack with its hooves against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/warhorse.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/warhorse.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "riding-horse",
    "name": "Cavalo de Montaria",
    "nameEn": "Riding Horse",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 13,
    "hitDice": "2d10",
    "cr": "0.25",
    "xp": 25,
    "speed": "caminhada: 18 m",
    "abilities": {
      "strength": 16,
      "dexterity": 10,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 11,
      "charisma": 7
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (2d4 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "2d4+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/riding-horse.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/riding-horse.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "draft-horse",
    "name": "Cavalo de Tração",
    "nameEn": "Draft Horse",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 10,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 11,
      "charisma": 7
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (2d4 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d4+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/draft-horse.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/draft-horse.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "sea-horse",
    "name": "Cavalo-Marinho",
    "nameEn": "Sea Horse",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 0,
    "speed": "natação: 6 m",
    "abilities": {
      "strength": 1,
      "dexterity": 12,
      "constitution": 8,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 2
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Water Breathing",
        "description": "O(a) sea horse can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/sea-horse.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/sea-horse.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-sea-horse",
    "name": "Cavalo-Marinho Gigante",
    "nameEn": "Giant Sea Horse",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 16,
    "hitDice": "3d10",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 0 m; natação: 12 m",
    "abilities": {
      "strength": 12,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the sea horse moves at least 6 m straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) dano de concussão. If the target is a creature, it must succeed on a DC 11 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) sea horse can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano de concussão.",
        "attackBonus": 3,
        "damage": "1d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-sea-horse.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-sea-horse.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "centaur",
    "name": "Centauro",
    "nameEn": "Centaur",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e bom",
    "ac": 12,
    "hp": 45,
    "hitDice": "6d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 18,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 9,
      "wisdom": 13,
      "charisma": 11
    },
    "skills": "Athletics +6, Perception +3, Survival +3",
    "senses": "Percepção passiva 13",
    "languages": "Elvish, Sylvan",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the centaur moves at least 9 m straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 10 (3d6) dano perfurante.",
        "attackBonus": null,
        "damage": "3d6"
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) centaur makes two attacks: one with its pike and one with its hooves or two with its Arco longo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pike",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, um alvo. Acerto: 9 (1d10 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d10+4"
      },
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d6+4"
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +4 para acertar, range 150/180 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/centaur.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/centaur.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-centipede",
    "name": "Centopeia Gigante",
    "nameEn": "Giant Centipede",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 4,
    "hitDice": "1d6",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 5,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão às cegas 9 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 4 (1d4 + 2) dano perfurante, and the target must succeed on a DC 11 Constituição teste de resistência or take 10 (3d6) dano de veneno. If the dano de veneno reduces the target to 0 hit points, the target is stable but envenenado for 1 hour, even after regaining hit points, and is paralisado while envenenado in this way.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-centipede.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-centipede.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "deer",
    "name": "Cervo",
    "nameEn": "Deer",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 4,
    "hitDice": "1d8",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 11,
      "dexterity": 16,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 14,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 2 (1d4) dano perfurante.",
        "attackBonus": 2,
        "damage": "1d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/deer.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/deer.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "jackal",
    "name": "Chacal",
    "nameEn": "Jackal",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 3,
    "hitDice": "1d6",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 8,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) jackal has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) jackal has advantage on an attack roll against a creature if at least one of the jackal's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1.5 m, um alvo. Acerto: 1 (1d4 - 1) dano perfurante.",
        "attackBonus": 1,
        "damage": "1d4-1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/jackal.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/jackal.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "chuul",
    "name": "Chuul",
    "nameEn": "Chuul",
    "type": "aberração",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 16,
    "hp": 93,
    "hitDice": "11d10",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 16,
      "intelligence": 5,
      "wisdom": 11,
      "charisma": 5
    },
    "skills": "Perception +4",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "compreende Deep Speech mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) chuul can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sense Magic",
        "description": "O(a) chuul senses magic within 120 feet of it at will. This trait otherwise works like the detect magic spell but isn't itself magical.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) chuul faz dois ataques de pincer. If the chuul is grappling a creature, the chuul can also use its Tentáculos once.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pincer",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão. O(a) target is agarrado (escape DC 14) if it is a Large or smaller creature and the chuul doesn't have two other creatures agarrado.",
        "attackBonus": 6,
        "damage": "2d6+4"
      },
      {
        "name": "Tentáculos",
        "description": "uma criatura agarrado by the chuul must succeed on a DC 13 Constituição teste de resistência or be envenenado for 1 minute. Until this poison ends, the target is paralisado. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/chuul.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/chuul.png",
    "color": "#6B3FA0",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "constrictor-snake",
    "name": "Cobra Constritora",
    "nameEn": "Constrictor Snake",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 13,
    "hitDice": "2d10",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Constrict",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 6 (1d8 + 2) dano de concussão, and the target is agarrado (escape DC 14). Until this grapple ends, the creature is impedido, and the snake can't constrict another target.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/constrictor-snake.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/constrictor-snake.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-constrictor-snake",
    "name": "Cobra Constritora Gigante",
    "nameEn": "Giant Constrictor Snake",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 60,
    "hitDice": "8d12",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "Perception +2",
    "senses": "visão às cegas 3 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, uma criatura. Acerto: 11 (2d6 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "2d6+4"
      },
      {
        "name": "Constrict",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, uma criatura. Acerto: 13 (2d8 + 4) dano de concussão, and the target is agarrado (escape DC 16). Until this grapple ends, the creature is impedido, and the snake can't constrict another target.",
        "attackBonus": 6,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-constrictor-snake.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-constrictor-snake.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "poisonous-snake",
    "name": "Cobra Venenosa",
    "nameEn": "Poisonous Snake",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 2,
    "hitDice": "1d4",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 2,
      "dexterity": 16,
      "constitution": 11,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano perfurante, and the target must make a DC 10 Constituição teste de resistência, taking 5 (2d4) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 5,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/poisonous-snake.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/poisonous-snake.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-poisonous-snake",
    "name": "Cobra Venenosa Gigante",
    "nameEn": "Giant Poisonous Snake",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 18,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "Perception +2",
    "senses": "visão às cegas 3 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, um alvo. Acerto: 6 (1d4 + 4) dano perfurante, and the target must make a DC 11 Constituição teste de resistência, taking 10 (3d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 6,
        "damage": "1d4+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-poisonous-snake.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-poisonous-snake.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "flying-snake",
    "name": "Cobra Voadora",
    "nameEn": "Flying Snake",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 5,
    "hitDice": "2d4",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m; voo: 18 m; natação: 9 m",
    "abilities": {
      "strength": 4,
      "dexterity": 18,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "vooby",
        "description": "O(a) snake doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano perfurante plus 7 (3d4) dano de veneno.",
        "attackBonus": 6,
        "damage": "1 + 3d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/flying-snake.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/flying-snake.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "cockatrice",
    "name": "Cocatrix",
    "nameEn": "Cockatrice",
    "type": "monstruosidade",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 27,
    "hitDice": "6d6",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 6 m; voo: 12 m",
    "abilities": {
      "strength": 6,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 13,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, uma criatura. Acerto: 3 (1d4 + 1) dano perfurante, and the target must succeed on a DC 11 Constituição teste de resistência against being magically Petrificado. On a failed save, the creature begins to turn to stone and is impedido. It must repeat the teste de resistência at the end of its next turn. On a success, the effect ends. On a failure, the creature is Petrificado for 24 hours.",
        "attackBonus": 3,
        "damage": "1d4+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/cockatrice.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/cockatrice.png",
    "color": "#4A2F18",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-owl",
    "name": "Coruja Gigante",
    "nameEn": "Giant Owl",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro",
    "ac": 12,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 1.5 m; voo: 18 m",
    "abilities": {
      "strength": 13,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 8,
      "wisdom": 13,
      "charisma": 10
    },
    "skills": "Perception +5, Stealth +4",
    "senses": "visão no escuro 36 m, Percepção passiva 15",
    "languages": "Giant Owl, compreende Comum, Elvish, and Sylvan mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "vooby",
        "description": "O(a) owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Sight",
        "description": "O(a) owl has advantage on Sabedoria (Perception) checks that rely on hearing or sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (2d6 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "2d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-owl.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-owl.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "raven",
    "name": "Corvo",
    "nameEn": "Raven",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 3 m; voo: 15 m",
    "abilities": {
      "strength": 2,
      "dexterity": 14,
      "constitution": 8,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Mimicry",
        "description": "O(a) raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Sabedoria (Insight) check.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano perfurante.",
        "attackBonus": 4,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/raven.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/raven.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "couatl",
    "name": "Couatl",
    "nameEn": "Couatl",
    "type": "celestial",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e bom",
    "ac": 19,
    "hp": 97,
    "hitDice": "13d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m; voo: 27 m",
    "abilities": {
      "strength": 16,
      "dexterity": 20,
      "constitution": 17,
      "intelligence": 18,
      "wisdom": 20,
      "charisma": 18
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 15",
    "languages": "all, telepathy 36 m",
    "damageResistances": "radiant",
    "damageImmunities": "psychic, bludgeoning, piercing, and slashing from nonmagical weapons",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração Inata",
        "description": "O(a) couatl's Conjuração ability is Carisma (spell save DC 14). It can innately cast the following spells, requiring only verbal components:\n\nAt will: detect evil and good, detect magic, detect thoughts\n3/day each: bless, create food and water, cure wounds, lesser restoration, protection from poison, sanctuary, shield\n1/day each: dream, greater restoration, scrying",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) couatl's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Shielded Mind",
        "description": "O(a) couatl is immune to scrying and to any effect that would sense its emotions, read its thoughts, or detect its location.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, uma criatura. Acerto: 8 (1d6 + 5) dano perfurante, and the target must succeed on a DC 13 Constituição teste de resistência or be envenenado for 24 hours. Until this poison ends, the target is unconscious. Another creature can use an action to shake the target awake.",
        "attackBonus": 8,
        "damage": "1d6+5"
      },
      {
        "name": "Constrict",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, one Medium or smaller creature. Acerto: 10 (2d6 + 3) dano de concussão, and the target is agarrado (escape DC 15). Until this grapple ends, the target is impedido, and the couatl can't constrict another target.",
        "attackBonus": 6,
        "damage": "2d6+3"
      },
      {
        "name": "Change Shape",
        "description": "O(a) couatl magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the couatl's choice).\nIn a new form, the couatl retains its game statistics and ability to speak, but its AC, movement modes, Força, Destreza, and other actions are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks. If the new form has a Mordida attack, the couatl can use its Mordida in that form.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/couatl.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/couatl.png",
    "color": "#8A5A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "crab",
    "name": "Crab",
    "nameEn": "Crab",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 2,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 6 m; natação: 6 m",
    "abilities": {
      "strength": 2,
      "dexterity": 11,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 8,
      "charisma": 2
    },
    "skills": "Stealth +2",
    "senses": "visão às cegas 9 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) crab can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano de concussão.",
        "attackBonus": 0,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/crab.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/crab.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "crocodile",
    "name": "Crocodilo",
    "nameEn": "Crocodile",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 6 m; natação: 6 m",
    "abilities": {
      "strength": 15,
      "dexterity": 10,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "Stealth +2",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hold Breath",
        "description": "O(a) crocodile can hold its breath for 15 minutes.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 7 (1d10 + 2) dano perfurante, and the target is agarrado (escape DC 12). Until this grapple ends, the target is impedido, and the crocodile can't Mordida another target",
        "attackBonus": 4,
        "damage": "1d10+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/crocodile.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/crocodile.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-crocodile",
    "name": "Crocodilo Gigante",
    "nameEn": "Giant Crocodile",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 85,
    "hitDice": "9d12",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m; natação: 15 m",
    "abilities": {
      "strength": 21,
      "dexterity": 9,
      "constitution": 17,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 7
    },
    "skills": "Stealth +5",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hold Breath",
        "description": "O(a) crocodile can hold its breath for 30 minutes.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) crocodile makes two attacks: one with its Mordida and one with its Cauda.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 21 (3d10 + 5) dano perfurante, and the target is agarrado (escape DC 16). Until this grapple ends, the target is impedido, and the crocodile can't Mordida another target.",
        "attackBonus": 8,
        "damage": "3d10+5"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo not agarrado by the crocodile. Acerto: 14 (2d8 + 5) dano de concussão. If the target is a creature, it must succeed on a DC 16 Força teste de resistência or be knocked caído.",
        "attackBonus": 8,
        "damage": "2d8+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-crocodile.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-crocodile.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gelatinous-cube",
    "name": "Cubo Gelatinoso",
    "nameEn": "Gelatinous Cube",
    "type": "lodo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 6,
    "hp": 84,
    "hitDice": "8d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 4.5 m",
    "abilities": {
      "strength": 14,
      "dexterity": 3,
      "constitution": 20,
      "intelligence": 1,
      "wisdom": 6,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 8",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "Cego, enfeitiçado, Surdo, Exaustão, amedrontado, caído",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Ooze Cube",
        "description": "O(a) cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the teste de resistência.\nCreatures inside the cube can be seen but have total cover.\nA creature within 5 feet of the cube can take an action to pull a creature or object out of the cube. Doing so requires a successful DC 12 Força check, and the creature making the attempt takes 10 (3d6) dano de ácido.\nO(a) cube can hold only one Large creature or up to four Medium or smaller creatures inside it at a time.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Transparent",
        "description": "Even when the cube is in plain sight, it takes a successful DC 15 Sabedoria (Perception) check to spot a cube that has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of the cube is surprised by the cube.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 10 (3d6) dano de ácido.",
        "attackBonus": 4,
        "damage": "3d6"
      },
      {
        "name": "Engulf",
        "description": "O(a) cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Destreza teste de resistência.\nOn a successful save, the creature can choose to be pushed 5 feet back or to the side of the cube. A creature that chooses not to be pushed suffers the consequences of a failed teste de resistência.\nOn a failed save, the cube enters the creature's space, and the creature takes 10 (3d6) dano de ácido and is engulfed. O(a) engulfed creature can't breathe, is impedido, and takes 21 (6d6) dano de ácido at the start of each of the cube's turns. When the cube moves, the engulfed creature moves with it.\nAn engulfed creature can try to escape by taking an action to make a DC 12 Força check. On a success, the creature escapes and enters a space of its choice within 5 feet of the cube.",
        "attackBonus": null,
        "damage": "3d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gelatinous-cube.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gelatinous-cube.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "cultist",
    "name": "Cultista",
    "nameEn": "Cultist",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any non-good alignment",
    "ac": 12,
    "hp": 9,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 12,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Deception +2, Religion +2",
    "senses": "Percepção passiva 10",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Dark Devotion",
        "description": "O(a) cultist has advantage on teste de resistências against being enfeitiçado or amedrontado.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, uma criatura. Acerto: 4 (1d6 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "1d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/cultist.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/cultist.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "deva",
    "name": "Deva",
    "nameEn": "Deva",
    "type": "celestial",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e bom",
    "ac": 17,
    "hp": 136,
    "hitDice": "16d8",
    "cr": "10",
    "xp": 5900,
    "speed": "caminhada: 9 m; voo: 27 m",
    "abilities": {
      "strength": 18,
      "dexterity": 18,
      "constitution": 18,
      "intelligence": 17,
      "wisdom": 20,
      "charisma": 20
    },
    "skills": "Insight +9, Perception +9",
    "senses": "visão no escuro 36 m, Percepção passiva 19",
    "languages": "all, telepathy 36 m",
    "damageResistances": "radiant, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Angelic Weapons",
        "description": "O(a) deva's weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 dano radiante (included in the attack).",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) deva's Conjuração ability is Carisma (spell save DC 17). O(a) deva can innately cast the following spells, requiring only verbal components:\nAt will: detect evil and good\n1/day each: commune, raise dead",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) deva has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) deva faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mace",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d6 + 4) dano de concussão plus 18 (4d8) dano radiante.",
        "attackBonus": 8,
        "damage": "1d6+4 + 4d8"
      },
      {
        "name": "Healing Touch",
        "description": "O(a) deva touches another creature. O(a) target magically regains 20 (4d8 + 2) hit points and is freed from any curse, disease, poison, blindness, or deafness.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Change Shape",
        "description": "O(a) deva magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the deva's choice).\nIn a new form, the deva retains its game statistics and ability to speak, but its AC, movement modes, Força, Destreza, and special senses are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/deva.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/deva.png",
    "color": "#8A5A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bearded-devil",
    "name": "Diabo Barbado",
    "nameEn": "Bearded Devil",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 13,
    "hp": 52,
    "hitDice": "8d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 15,
      "constitution": 15,
      "intelligence": 9,
      "wisdom": 11,
      "charisma": 11
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 10",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the devil's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) devil has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Steadfast",
        "description": "O(a) devil can't be amedrontado while it can see an allied creature within 30 feet of it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) devil makes two attacks: one with its beard and one with its glaive.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beard",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, uma criatura. Acerto: 6 (1d8 + 2) dano perfurante, and the target must succeed on a DC 12 Constituição teste de resistência or be envenenado for 1 minute. While envenenado in this way, the target can't regain hit points. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 5,
        "damage": "1d8+2"
      },
      {
        "name": "Glaive",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 3 m, um alvo. Acerto: 8 (1d10 + 3) dano cortante. If the target is a creature other than an undead or a construct, it must succeed on a DC 12 Constituição teste de resistência or lose 5 (1d10) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 5 (1d10). Any creature can take an action to stanch the wound with a successful DC 12 Sabedoria (Medicine) check. O(a) wound also closes if the target receives magical healing.",
        "attackBonus": 5,
        "damage": "1d10+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bearded-devil.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bearded-devil.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "horned-devil",
    "name": "Diabo Cornudo",
    "nameEn": "Horned Devil",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 18,
    "hp": 178,
    "hitDice": "17d10",
    "cr": "11",
    "xp": 7200,
    "speed": "caminhada: 6 m; voo: 18 m",
    "abilities": {
      "strength": 22,
      "dexterity": 17,
      "constitution": 21,
      "intelligence": 12,
      "wisdom": 16,
      "charisma": 17
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 13",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the devil's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) devil has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) devil faz três ataques de melee: two with its fork and one with its Cauda. It can use Hurl Flame in place of any melee attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Fork",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d8 + 6) dano perfurante.",
        "attackBonus": 10,
        "damage": "2d8+6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 10 (1d8 + 6) dano perfurante. If the target is a creature other than an undead or a construct, it must succeed on a DC 17 Constituição teste de resistência or lose 10 (3d6) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 10 (3d6). Any creature can take an action to stanch the wound with a successful DC 12 Sabedoria (Medicine) check. O(a) wound also closes if the target receives magical healing.",
        "attackBonus": 10,
        "damage": "1d8+6"
      },
      {
        "name": "Hurl Flame",
        "description": "Ataque à distância com magia: +7 para acertar, range 45 m, um alvo. Acerto: 14 (4d6) dano de fogo. If the target is a flammable object that isn't being worn or carried, it also catches fire.",
        "attackBonus": 7,
        "damage": "4d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/horned-devil.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/horned-devil.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "chain-devil",
    "name": "Diabo das Correntes",
    "nameEn": "Chain Devil",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 16,
    "hp": 85,
    "hitDice": "10d8",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 18,
      "intelligence": 11,
      "wisdom": 12,
      "charisma": 14
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 11",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the devil's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) devil has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) devil makes two attacks with its chains.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Chain",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante. O(a) target is agarrado (escape DC 14) if the devil isn't already grappling a creature. Until this grapple ends, the target is impedido and takes 7 (2d6) dano perfurante at the start of each of its turns.",
        "attackBonus": 8,
        "damage": "2d6+4"
      },
      {
        "name": "Animate Chains",
        "description": "Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil's control, provided that the chains aren't being worn or carried.\nEach animated chain is an object with AC 20, 20 hit points, resistance to dano perfurante, and immunity to psychic and dano de trovão. When the devil uses Ataque Múltiplo on its turn, it can use each animated chain to make one additional chain attack. An animated chain can grapple uma criatura of its own but can't make attacks while grappling. An animated chain reverts to its inanimate state if reduced to 0 hit points or if the devil is incapacitated or dies.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [
      {
        "name": "Unnerving Mask",
        "description": "When a creature the devil can see starts its turn within 30 feet of the devil, the devil can create the illusion that it looks like one of the creature's departed loved ones or bitter enemies. If the creature can see the devil, it must succeed on a DC 14 Sabedoria teste de resistência or be amedrontado until the end of its turn.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/chain-devil.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/chain-devil.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ice-devil",
    "name": "Diabo do Gelo",
    "nameEn": "Ice Devil",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 18,
    "hp": 180,
    "hitDice": "19d10",
    "cr": "14",
    "xp": 11500,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 21,
      "dexterity": 14,
      "constitution": 18,
      "intelligence": 18,
      "wisdom": 15,
      "charisma": 18
    },
    "skills": "—",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 12",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the devil's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) devil has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) devil makes three attacks: one with its Mordida, one with its Garras, and one with its Cauda.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 12 (2d6 + 5) dano perfurante plus 10 (3d6) dano de frio.",
        "attackBonus": 10,
        "damage": "2d6+5 + 3d6"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d4 + 5) dano cortante plus 10 (3d6) dano de frio.",
        "attackBonus": 10,
        "damage": "2d4+5 + 3d6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 12 (2d6 + 5) dano de concussão plus 10 (3d6) dano de frio.",
        "attackBonus": 10,
        "damage": "2d6+5 + 3d6"
      },
      {
        "name": "Wall of Ice",
        "description": "O(a) devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. O(a) wall is 1 foot thick and up to 30 feet long and 10 feet high, or it's a hemispherical dome up to 20 feet in diameter.\nWhen the wall appears, each creature in its space is pushed out of it by the shortest route. O(a) creature chooses which side of the wall to end up on, unless the creature is incapacitated. O(a) creature then makes a DC 17 Destreza teste de resistência, taking 35 (10d6) dano de frio on a failed save, or half as much damage on a successful one.\nO(a) wall lasts for 1 minute or until the devil is incapacitated or dies. O(a) wall can be damaged and breached; each 10-foot section has AC 5, 30 hit points, vulnerability to dano de fogo, and immunity to acid, cold, necrotic, poison, and dano psíquico. If a section is destroyed, it leaves behind a sheet of frigid air in the space the wall occupied. Whenever a creature finishes moving through the frigid air on a turn, willingly or otherwise, the creature must make a DC 17 Constituição teste de resistência, taking 17 (5d6) dano de frio on a failed save, or half as much damage on a successful one. O(a) frigid air dissipates when the rest of the wall vanishes.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ice-devil.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ice-devil.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bone-devil",
    "name": "Diabo dos Ossos",
    "nameEn": "Bone Devil",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 19,
    "hp": 142,
    "hitDice": "15d10",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 12 m; voo: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 16,
      "constitution": 18,
      "intelligence": 13,
      "wisdom": 14,
      "charisma": 16
    },
    "skills": "Deception +7, Insight +6",
    "senses": "visão no escuro 36 m, Percepção passiva 12",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the devil's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) devil has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) devil makes three attacks: two with its Garras and one with its Ferrão.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo. Acerto: 8 (1d8 + 4) dano cortante.",
        "attackBonus": 8,
        "damage": "1d8+4"
      },
      {
        "name": "Ferrão",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo. Acerto: 13 (2d8 + 4) dano perfurante plus 17 (5d6) dano de veneno, and the target must succeed on a DC 14 Constituição teste de resistência or become envenenado for 1 minute. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 8,
        "damage": "2d8+4 + 5d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bone-devil.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bone-devil.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "barbed-devil",
    "name": "Diabo Farpado",
    "nameEn": "Barbed Devil",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 15,
    "hp": 110,
    "hitDice": "13d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 17,
      "constitution": 18,
      "intelligence": 12,
      "wisdom": 14,
      "charisma": 14
    },
    "skills": "Deception +5, Insight +5, Perception +8",
    "senses": "visão no escuro 36 m, Percepção passiva 18",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Barbed Hide",
        "description": "At the start of each of its turns, the barbed devil deals 5 (1d10) dano perfurante to any creature grappling it.",
        "attackBonus": null,
        "damage": "1d10"
      },
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the devil's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) devil has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) devil faz três ataques de melee: one with its Cauda and two with its Garras. Alternatively, it can use Hurl Flame twice.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d6+3"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano perfurante.",
        "attackBonus": 6,
        "damage": "2d6+3"
      },
      {
        "name": "Hurl Flame",
        "description": "Ataque à distância com magia: +5 para acertar, range 45 m, um alvo. Acerto: 10 (3d6) dano de fogo. If the target is a flammable object that isn't being worn or carried, it also catches fire.",
        "attackBonus": 5,
        "damage": "3d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/barbed-devil.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/barbed-devil.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "imp",
    "name": "Diabrete",
    "nameEn": "Imp",
    "type": "demônio",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "leal e mau",
    "ac": 13,
    "hp": 10,
    "hitDice": "3d4",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 6 m; voo: 12 m",
    "abilities": {
      "strength": 6,
      "dexterity": 17,
      "constitution": 13,
      "intelligence": 11,
      "wisdom": 12,
      "charisma": 14
    },
    "skills": "Deception +4, Insight +3, Persuasion +4, Stealth +5",
    "senses": "visão no escuro 36 m, Percepção passiva 11",
    "languages": "Infernal, Comum",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) imp can use its action to polymorph into a beast form that resembles a rat (speed 6 m), a raven (6 m, voo 18 m), or a spider (6 m, escalada 6 m), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the imp's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) imp has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ferrão (Mordida in Beast Form)",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d4 + 3) dano perfurante, and the target must make on a DC 11 Constituição teste de resistência, taking 10 (3d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 5,
        "damage": "1d4+3"
      },
      {
        "name": "Invisibility",
        "description": "O(a) imp magically turns invisível until it attacks, or until its concentration ends (as if concentrating on a spell). Any equipment the imp wears or carries is invisível with it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/imp.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/imp.png",
    "color": "#5C1A1A",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "djinni",
    "name": "Djinn",
    "nameEn": "Djinni",
    "type": "elemental",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e bom",
    "ac": 17,
    "hp": 161,
    "hitDice": "14d10",
    "cr": "11",
    "xp": 7200,
    "speed": "caminhada: 9 m; voo: 27 m",
    "abilities": {
      "strength": 21,
      "dexterity": 15,
      "constitution": 22,
      "intelligence": 15,
      "wisdom": 16,
      "charisma": 20
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 13",
    "languages": "Auran",
    "damageResistances": "—",
    "damageImmunities": "lightning, thunder",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Elemental Demise",
        "description": "If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) djinni's Conjuração Inata ability is Carisma (spell save DC 17, +9 para acertar with spell attacks). It can innately cast the following spells, requiring no material components:\n\nAt will: detect evil and good, detect magic, thunderwave\n3/day each: create food and water (can create wine instead of water), tongues, wind caminhada\n1/day each: conjure elemental (air elemental only), creation, gaseous form, invisibility, major image, plane shift",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) djinni faz três ataques de Cimitarra.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 12 (2d6 + 5) dano cortante plus 3 (1d6) lightning or dano de trovão (djinni's choice).",
        "attackBonus": 9,
        "damage": "2d6+5"
      },
      {
        "name": "Create Whirlwind",
        "description": "A 5-foot-radius, 30-foot-tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. O(a) whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Força teste de resistência or be impedido by it. O(a) djinni can move the whirlwind up to 60 feet as an action, and creatures impedido by the whirlwind move with it. O(a) whirlwind ends if the djinni loses sight of it.\nA creature can use its action to free a creature impedido by the whirlwind, including itself, by succeeding on a DC 18 Força check. If the check succeeds, the creature is no longer impedido and moves to the nearest space outside the whirlwind.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/djinni.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/djinni.png",
    "color": "#2F4F7A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "weasel",
    "name": "Doninha",
    "nameEn": "Weasel",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 3,
      "dexterity": 16,
      "constitution": 8,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 3
    },
    "skills": "Perception +3, Stealth +5",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) weasel has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, uma criatura. Acerto: 1 dano perfurante.",
        "attackBonus": 5,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/weasel.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/weasel.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-weasel",
    "name": "Doninha Gigante",
    "nameEn": "Giant Weasel",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 9,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 11,
      "dexterity": 16,
      "constitution": 10,
      "intelligence": 4,
      "wisdom": 12,
      "charisma": 5
    },
    "skills": "Perception +3, Stealth +5",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) weasel has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d4 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d4+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-weasel.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-weasel.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "doppelganger",
    "name": "Doppelganger",
    "nameEn": "Doppelganger",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 52,
    "hitDice": "8d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 18,
      "constitution": 14,
      "intelligence": 11,
      "wisdom": 12,
      "charisma": 14
    },
    "skills": "Deception +6, Insight +3",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) doppelganger can use its action to polymorph into a Small or Medium humanoid it has seen, or back into its true form. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Ambusher",
        "description": "In the first round of combat, the doppelganger has advantage on attack rolls against any creature it has surprised.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Surprise Attack",
        "description": "If the doppelganger surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 10 (3d6) damage from the attack.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) doppelganger faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d6 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "1d6+4"
      },
      {
        "name": "Read Thoughts",
        "description": "O(a) doppelganger magically reads the surface thoughts of uma criatura within 18 m of it. O(a) effect can penetrate barriers, but 0.9 m of wood or dirt, 0.6 m of stone, 2 inches of metal, or a thin sheet of lead blocks it. While the target is in range, the doppelganger can continue reading its thoughts, as long as the doppelganger's concentration isn't broken (as if concentrating on a spell). While reading the target's mind, the doppelganger has advantage on Sabedoria (Insight) and Carisma (Deception, Intimidation, and Persuasion) checks against the target.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/doppelganger.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/doppelganger.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-blue-dragon",
    "name": "Dragão Azul Adulto",
    "nameEn": "Adult Blue Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "leal e mau",
    "ac": 19,
    "hp": 225,
    "hitDice": "18d12",
    "cr": "16",
    "xp": 15000,
    "speed": "caminhada: 12 m; escavação: 9 m; voo: 24 m",
    "abilities": {
      "strength": 25,
      "dexterity": 10,
      "constitution": 23,
      "intelligence": 16,
      "wisdom": 15,
      "charisma": 19
    },
    "skills": "Perception +12, Stealth +5",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 22",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 3 m, um alvo. Acerto: 18 (2d10 + 7) dano perfurante plus 5 (1d10) dano elétrico.",
        "attackBonus": 12,
        "damage": "2d10+7 + 1d10"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d6 + 7) dano cortante.",
        "attackBonus": 12,
        "damage": "2d6+7"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 4.5 m, um alvo. Acerto: 16 (2d8 + 7) dano de concussão.",
        "attackBonus": 12,
        "damage": "2d8+7"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 36 m of the dragon and aware of it must succeed on a DC 17 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Lightning Breath",
        "description": "O(a) dragon exhales lightning in a 90-foot line that is 1.5 m wide. Each creature in that line must make a DC 19 Destreza teste de resistência, taking 66 (12d10) dano elétrico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "12d10"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 20 Destreza teste de resistência or take 14 (2d6 + 7) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+7"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-blue-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-blue-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-blue-dragon",
    "name": "Dragão Azul Ancestral",
    "nameEn": "Ancient Blue Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "leal e mau",
    "ac": 22,
    "hp": 481,
    "hitDice": "26d20",
    "cr": "23",
    "xp": 50000,
    "speed": "caminhada: 12 m; escavação: 12 m; voo: 24 m",
    "abilities": {
      "strength": 29,
      "dexterity": 10,
      "constitution": 27,
      "intelligence": 18,
      "wisdom": 17,
      "charisma": 21
    },
    "skills": "Perception +17, Stealth +7",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 27",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 4.5 m, um alvo. Acerto: 20 (2d10 + 9) dano perfurante plus 11 (2d10) dano elétrico.",
        "attackBonus": 16,
        "damage": "2d10+9 + 2d10"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 3 m, um alvo. Acerto: 16 (2d6 + 9) dano cortante.",
        "attackBonus": 16,
        "damage": "2d6+9"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 6 m, um alvo. Acerto: 18 (2d8 + 9) dano de concussão.",
        "attackBonus": 16,
        "damage": "2d8+9"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Lightning Breath",
        "description": "O(a) dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Destreza teste de resistência, taking 88 (16d10) dano elétrico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "16d10"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 24 Destreza teste de resistência or take 16 (2d6 + 9) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+9"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-blue-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-blue-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-blue-dragon",
    "name": "Dragão Azul Jovem",
    "nameEn": "Young Blue Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 18,
    "hp": 152,
    "hitDice": "16d10",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 12 m; escavação: 6 m; voo: 24 m",
    "abilities": {
      "strength": 21,
      "dexterity": 10,
      "constitution": 19,
      "intelligence": 14,
      "wisdom": 13,
      "charisma": 17
    },
    "skills": "Perception +9, Stealth +4",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 19",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, um alvo. Acerto: 16 (2d10 + 5) dano perfurante plus 5 (1d10) dano elétrico.",
        "attackBonus": 9,
        "damage": "2d10+5 + 1d10"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 12 (2d6 + 5) dano cortante.",
        "attackBonus": 9,
        "damage": "2d6+5"
      },
      {
        "name": "Lightning Breath",
        "description": "O(a) dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Destreza teste de resistência, taking 55 (10d10) dano elétrico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "10d10"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-blue-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-blue-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-white-dragon",
    "name": "Dragão Branco Adulto",
    "nameEn": "Adult White Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e mau",
    "ac": 18,
    "hp": 200,
    "hitDice": "16d12",
    "cr": "13",
    "xp": 10000,
    "speed": "caminhada: 12 m; escavação: 9 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 22,
      "dexterity": 10,
      "constitution": 22,
      "intelligence": 8,
      "wisdom": 12,
      "charisma": 12
    },
    "skills": "Perception +11, Stealth +5",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 21",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Ice caminhada",
        "description": "O(a) dragon can move across and escalada icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante plus 4 (1d8) dano de frio.",
        "attackBonus": 11,
        "damage": "2d10+6 + 1d8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 11,
        "damage": "2d6+6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4.5 m, um alvo. Acerto: 15 (2d8 + 6) dano de concussão.",
        "attackBonus": 11,
        "damage": "2d8+6"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 36 m of the dragon and aware of it must succeed on a DC 14 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cold Breath",
        "description": "O(a) dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constituição teste de resistência, taking 54 (12d8) dano de frio on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "12d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 19 Destreza teste de resistência or take 13 (2d6 + 6) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+6"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-white-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-white-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-white-dragon",
    "name": "Dragão Branco Ancestral",
    "nameEn": "Ancient White Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "caótico e mau",
    "ac": 20,
    "hp": 333,
    "hitDice": "18d20",
    "cr": "20",
    "xp": 25000,
    "speed": "caminhada: 12 m; escavação: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 26,
      "dexterity": 10,
      "constitution": 26,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 14
    },
    "skills": "Perception +13, Stealth +6",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 23",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Ice caminhada",
        "description": "O(a) dragon can move across and escalada icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4.5 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante plus 9 (2d8) dano de frio.",
        "attackBonus": 14,
        "damage": "2d10+8 + 2d8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante.",
        "attackBonus": 14,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 6 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 14,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cold Breath",
        "description": "O(a) dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constituição teste de resistência, taking 72 (16d8) dano de frio on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "16d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 22 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-white-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-white-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-white-dragon",
    "name": "Dragão Branco Jovem",
    "nameEn": "Young White Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 17,
    "hp": 133,
    "hitDice": "14d10",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 12 m; escavação: 6 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 10,
      "constitution": 18,
      "intelligence": 6,
      "wisdom": 11,
      "charisma": 12
    },
    "skills": "Perception +6, Stealth +3",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 16",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Ice caminhada",
        "description": "O(a) dragon can move across and escalada icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante plus 4 (1d8) dano de frio.",
        "attackBonus": 7,
        "damage": "2d10+4 + 1d8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Cold Breath",
        "description": "O(a) dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 15 Constituição teste de resistência, taking 45 (10d8) dano de frio on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "10d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-white-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-white-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-bronze-dragon",
    "name": "Dragão de Bronze Adulto",
    "nameEn": "Adult Bronze Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "leal e bom",
    "ac": 19,
    "hp": 212,
    "hitDice": "17d12",
    "cr": "15",
    "xp": 13000,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 25,
      "dexterity": 10,
      "constitution": 23,
      "intelligence": 16,
      "wisdom": 15,
      "charisma": 19
    },
    "skills": "Insight +7, Perception +12, Stealth +5",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 22",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 3 m, um alvo. Acerto: 18 (2d10 + 7) dano perfurante.",
        "attackBonus": 12,
        "damage": "2d10+7"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d6 + 7) dano cortante.",
        "attackBonus": 12,
        "damage": "2d6+7"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 4.5 m, um alvo. Acerto: 16 (2d8 + 7) dano de concussão.",
        "attackBonus": 12,
        "damage": "2d8+7"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nLightning Breath. O(a) dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Destreza teste de resistência, taking 66 (12d10) dano elétrico on a failed save, or half as much damage on a successful one.\nRepulsion Breath. O(a) dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 19 Força teste de resistência. On a failed save, the creature is pushed 60 feet away from the dragon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 20 Destreza teste de resistência or take 14 (2d6 + 7) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+7"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-bronze-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-bronze-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-bronze-dragon",
    "name": "Dragão de Bronze Ancestral",
    "nameEn": "Ancient Bronze Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "leal e bom",
    "ac": 22,
    "hp": 444,
    "hitDice": "24d20",
    "cr": "22",
    "xp": 41000,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 29,
      "dexterity": 10,
      "constitution": 27,
      "intelligence": 18,
      "wisdom": 17,
      "charisma": 21
    },
    "skills": "Insight +10, Perception +17, Stealth +7",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 27",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 4.5 m, um alvo. Acerto: 20 (2d10 + 9) dano perfurante.",
        "attackBonus": 16,
        "damage": "2d10+9"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 3 m, um alvo. Acerto: 16 (2d6 + 9) dano cortante.",
        "attackBonus": 16,
        "damage": "2d6+9"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 6 m, um alvo. Acerto: 18 (2d8 + 9) dano de concussão.",
        "attackBonus": 16,
        "damage": "2d8+9"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nLightning Breath. O(a) dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Destreza teste de resistência, taking 88 (16d10) dano elétrico on a failed save, or half as much damage on a successful one.\nRepulsion Breath. O(a) dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 23 Força teste de resistência. On a failed save, the creature is pushed 60 feet away from the dragon.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Change Shape",
        "description": "O(a) dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Resistência Lendária, lair actions, and Inteligência, Sabedoria, and Carisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 24 Destreza teste de resistência or take 16 (2d6 + 9) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+9"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-bronze-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-bronze-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-bronze-dragon",
    "name": "Dragão de Bronze Jovem",
    "nameEn": "Young Bronze Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e bom",
    "ac": 18,
    "hp": 142,
    "hitDice": "15d10",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 21,
      "dexterity": 10,
      "constitution": 19,
      "intelligence": 14,
      "wisdom": 13,
      "charisma": 17
    },
    "skills": "Insight +4, Perception +7, Stealth +3",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 17",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo. Acerto: 16 (2d10 + 5) dano perfurante.",
        "attackBonus": 8,
        "damage": "2d10+5"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 12 (2d6 + 5) dano cortante.",
        "attackBonus": 8,
        "damage": "2d6+5"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nLightning Breath. O(a) dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Destreza teste de resistência, taking 55 (10d10) dano elétrico on a failed save, or half as much damage on a successful one.\nRepulsion Breath. O(a) dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 15 Força teste de resistência. On a failed save, the creature is pushed 40 feet away from the dragon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-bronze-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-bronze-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-copper-dragon",
    "name": "Dragão de Cobre Adulto",
    "nameEn": "Adult Copper Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e bom",
    "ac": 18,
    "hp": 184,
    "hitDice": "16d12",
    "cr": "14",
    "xp": 11500,
    "speed": "caminhada: 12 m; escalada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 23,
      "dexterity": 12,
      "constitution": 21,
      "intelligence": 18,
      "wisdom": 15,
      "charisma": 17
    },
    "skills": "Deception +8, Perception +12, Stealth +6",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 22",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante.",
        "attackBonus": 11,
        "damage": "2d10+6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 11,
        "damage": "2d6+6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4.5 m, um alvo. Acerto: 15 (2d8 + 6) dano de concussão.",
        "attackBonus": 11,
        "damage": "2d8+6"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nAcid Breath. O(a) dragon exhales acid in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Destreza teste de resistência, taking 54 (12d8) dano de ácido on a failed save, or half as much damage on a successful one.\nSlowing Breath. O(a) dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constituição teste de resistência. On a failed save, the creature can't use reaçãos, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a ação bônus on its turn, but not both. These effects last for 1 minute. O(a) creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself with a successful save.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 19 Destreza teste de resistência or take 13 (2d6 + 6) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+6"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-copper-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-copper-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-copper-dragon",
    "name": "Dragão de Cobre Ancestral",
    "nameEn": "Ancient Copper Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "caótico e bom",
    "ac": 21,
    "hp": 350,
    "hitDice": "20d20",
    "cr": "21",
    "xp": 33000,
    "speed": "caminhada: 12 m; escalada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 27,
      "dexterity": 12,
      "constitution": 25,
      "intelligence": 20,
      "wisdom": 17,
      "charisma": 19
    },
    "skills": "Deception +11, Perception +17, Stealth +8",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 27",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 4.5 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante.",
        "attackBonus": 15,
        "damage": "2d10+8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante.",
        "attackBonus": 15,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 6 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 15,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nAcid Breath. O(a) dragon exhales acid in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Destreza teste de resistência, taking 63 (14d8) dano de ácido on a failed save, or half as much damage on a successful one.\nSlowing Breath. O(a) dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 22 Constituição teste de resistência. On a failed save, the creature can't use reaçãos, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a ação bônus on its turn, but not both. These effects last for 1 minute. O(a) creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself with a successful save.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Change Shape",
        "description": "O(a) dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Resistência Lendária, lair actions, and Inteligência, Sabedoria, and Carisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 23 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-copper-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-copper-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-copper-dragon",
    "name": "Dragão de Cobre Jovem",
    "nameEn": "Young Copper Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e bom",
    "ac": 17,
    "hp": 119,
    "hitDice": "14d10",
    "cr": "7",
    "xp": 2900,
    "speed": "caminhada: 12 m; escalada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 19,
      "dexterity": 12,
      "constitution": 17,
      "intelligence": 16,
      "wisdom": 13,
      "charisma": 15
    },
    "skills": "Deception +5, Perception +7, Stealth +4",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 17",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "2d10+4"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nAcid Breath. O(a) dragon exhales acid in an 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Destreza teste de resistência, taking 40 (9d8) dano de ácido on a failed save, or half as much damage on a successful one.\nSlowing Breath. O(a) dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constituição teste de resistência. On a failed save, the creature can't use reaçãos, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a ação bônus on its turn, but not both. These effects last for 1 minute. O(a) creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself with a successful save.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-copper-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-copper-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-brass-dragon",
    "name": "Dragão de Latão Adulto",
    "nameEn": "Adult Brass Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e bom",
    "ac": 18,
    "hp": 172,
    "hitDice": "15d12",
    "cr": "13",
    "xp": 10000,
    "speed": "caminhada: 12 m; escavação: 12 m; voo: 24 m",
    "abilities": {
      "strength": 23,
      "dexterity": 10,
      "constitution": 21,
      "intelligence": 14,
      "wisdom": 13,
      "charisma": 17
    },
    "skills": "History +7, Perception +11, Persuasion +8, Stealth +5",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 21",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante.",
        "attackBonus": 11,
        "damage": "2d10+6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 11,
        "damage": "2d6+6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4.5 m, um alvo. Acerto: 15 (2d8 + 6) dano de concussão.",
        "attackBonus": 11,
        "damage": "2d8+6"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nFire Breath. O(a) dragon exhales fire in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Destreza teste de resistência, taking 45 (13d6) dano de fogo on a failed save, or half as much damage on a successful one.\nSleep Breath. O(a) dragon exhales sleep gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constituição teste de resistência or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 19 Destreza teste de resistência or take 13 (2d6 + 6) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+6"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-brass-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-brass-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-brass-dragon",
    "name": "Dragão de Latão Ancestral",
    "nameEn": "Ancient Brass Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "caótico e bom",
    "ac": 20,
    "hp": 297,
    "hitDice": "17d20",
    "cr": "20",
    "xp": 25000,
    "speed": "caminhada: 12 m; escavação: 12 m; voo: 24 m",
    "abilities": {
      "strength": 27,
      "dexterity": 10,
      "constitution": 25,
      "intelligence": 16,
      "wisdom": 15,
      "charisma": 19
    },
    "skills": "History +9, Perception +14, Persuasion +10, Stealth +6",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 24",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4.5 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante.",
        "attackBonus": 14,
        "damage": "2d10+8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante.",
        "attackBonus": 14,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 6 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 14,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons:\nFire Breath. O(a) dragon exhales fire in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Destreza teste de resistência, taking 56 (16d6) dano de fogo on a failed save, or half as much damage on a successful one.\nSleep Breath. O(a) dragon exhales sleep gas in a 90-foot cone. Each creature in that area must succeed on a DC 21 Constituição teste de resistência or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Change Shape",
        "description": "O(a) dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Resistência Lendária, lair actions, and Inteligência, Sabedoria, and Carisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 22 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-brass-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-brass-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-brass-dragon",
    "name": "Dragão de Latão Jovem",
    "nameEn": "Young Brass Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e bom",
    "ac": 17,
    "hp": 110,
    "hitDice": "13d10",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 12 m; escavação: 6 m; voo: 24 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 12,
      "wisdom": 11,
      "charisma": 15
    },
    "skills": "Perception +6, Persuasion +5, Stealth +3",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 16",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "2d10+4"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nFire Breath. O(a) dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Destreza teste de resistência, taking 42 (12d6) dano de fogo on a failed save, or half as much damage on a successful one.\nSleep Breath. O(a) dragon exhales sleep gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constituição teste de resistência or fall unconscious for 5 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-brass-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-brass-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-gold-dragon",
    "name": "Dragão Dourado Adulto",
    "nameEn": "Adult Gold Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "leal e bom",
    "ac": 19,
    "hp": 256,
    "hitDice": "19d12",
    "cr": "17",
    "xp": 18000,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 27,
      "dexterity": 14,
      "constitution": 25,
      "intelligence": 16,
      "wisdom": 15,
      "charisma": 24
    },
    "skills": "Insight +8, Perception +14, Persuasion +13, Stealth +8",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 24",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante.",
        "attackBonus": 14,
        "damage": "2d10+8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 1.5 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante.",
        "attackBonus": 14,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4.5 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 14,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nFire Breath. O(a) dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Destreza teste de resistência, taking 66 (12d10) dano de fogo on a failed save, or half as much damage on a successful one.\nWeakening Breath. O(a) dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 21 Força teste de resistência or have disadvantage on Força-based attack rolls, Força checks, and Força teste de resistências for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 22 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-gold-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-gold-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-gold-dragon",
    "name": "Dragão Dourado Ancestral",
    "nameEn": "Ancient Gold Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "leal e bom",
    "ac": 22,
    "hp": 546,
    "hitDice": "28d20",
    "cr": "24",
    "xp": 62000,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 30,
      "dexterity": 14,
      "constitution": 29,
      "intelligence": 18,
      "wisdom": 17,
      "charisma": 28
    },
    "skills": "Insight +10, Perception +17, Persuasion +16, Stealth +9",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 27",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 4.5 m, um alvo. Acerto: 21 (2d10 + 10) dano perfurante.",
        "attackBonus": 17,
        "damage": "2d10+10"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d6 + 10) dano cortante.",
        "attackBonus": 17,
        "damage": "2d6+10"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 6 m, um alvo. Acerto: 19 (2d8 + 10) dano de concussão.",
        "attackBonus": 17,
        "damage": "2d8+10"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 24 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nFire Breath. O(a) dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Destreza teste de resistência, taking 71 (13d10) dano de fogo on a failed save, or half as much damage on a successful one.\nWeakening Breath. O(a) dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Força teste de resistência or have disadvantage on Força-based attack rolls, Força checks, and Força teste de resistências for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Change Shape",
        "description": "O(a) dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Resistência Lendária, lair actions, and Inteligência, Sabedoria, and Carisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 25 Destreza teste de resistência or take 17 (2d6 + 10) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+10"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-gold-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-gold-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-gold-dragon",
    "name": "Dragão Dourado Jovem",
    "nameEn": "Young Gold Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e bom",
    "ac": 18,
    "hp": 178,
    "hitDice": "17d10",
    "cr": "10",
    "xp": 5900,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 23,
      "dexterity": 14,
      "constitution": 21,
      "intelligence": 16,
      "wisdom": 13,
      "charisma": 20
    },
    "skills": "Insight +5, Perception +9, Persuasion +9, Stealth +6",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 19",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante.",
        "attackBonus": 10,
        "damage": "2d10+6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 10,
        "damage": "2d6+6"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nFire Breath. O(a) dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Destreza teste de resistência, taking 55 (10d10) dano de fogo on a failed save, or half as much damage on a successful one.\nWeakening Breath. O(a) dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Força teste de resistência or have disadvantage on Força-based attack rolls, Força checks, and Força teste de resistências for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-gold-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-gold-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-black-dragon",
    "name": "Dragão Negro Adulto",
    "nameEn": "Adult Black Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e mau",
    "ac": 19,
    "hp": 195,
    "hitDice": "17d12",
    "cr": "14",
    "xp": 11500,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 23,
      "dexterity": 14,
      "constitution": 21,
      "intelligence": 14,
      "wisdom": 13,
      "charisma": 17
    },
    "skills": "Perception +11, Stealth +7",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 21",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante plus 4 (1d8) dano de ácido.",
        "attackBonus": 11,
        "damage": "2d10+6 + 1d8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 11,
        "damage": "2d6+6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4.5 m, um alvo. Acerto: 15 (2d8 + 6) dano de concussão.",
        "attackBonus": 11,
        "damage": "2d8+6"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Acid Breath",
        "description": "O(a) dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Destreza teste de resistência, taking 54 (12d8) dano de ácido on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "12d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 19 Destreza teste de resistência or take 13 (2d6 + 6) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+6"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-black-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-black-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-black-dragon",
    "name": "Dragão Negro Ancestral",
    "nameEn": "Ancient Black Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "caótico e mau",
    "ac": 22,
    "hp": 367,
    "hitDice": "21d20",
    "cr": "21",
    "xp": 33000,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 27,
      "dexterity": 14,
      "constitution": 25,
      "intelligence": 16,
      "wisdom": 15,
      "charisma": 19
    },
    "skills": "Perception +16, Stealth +9",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 26",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 4.5 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante plus 9 (2d8) dano de ácido.",
        "attackBonus": 15,
        "damage": "2d10+8 + 2d8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante.",
        "attackBonus": 15,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 6 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 15,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Acid Breath",
        "description": "O(a) dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Destreza teste de resistência, taking 67 (15d8) dano de ácido on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "15d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 23 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-black-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-black-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-black-dragon",
    "name": "Dragão Negro Jovem",
    "nameEn": "Young Black Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 18,
    "hp": 127,
    "hitDice": "15d10",
    "cr": "7",
    "xp": 2900,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 19,
      "dexterity": 14,
      "constitution": 17,
      "intelligence": 12,
      "wisdom": 11,
      "charisma": 15
    },
    "skills": "Perception +6, Stealth +5",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 16",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante plus 4 (1d8) dano de ácido.",
        "attackBonus": 7,
        "damage": "2d10+4 + 1d8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Acid Breath",
        "description": "O(a) dragon exhales acid in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Destreza teste de resistência, taking 49 (11d8) dano de ácido on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "11d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-black-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-black-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-silver-dragon",
    "name": "Dragão Prateado Adulto",
    "nameEn": "Adult Silver Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "leal e bom",
    "ac": 19,
    "hp": 243,
    "hitDice": "18d12",
    "cr": "16",
    "xp": 15000,
    "speed": "caminhada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 27,
      "dexterity": 10,
      "constitution": 25,
      "intelligence": 16,
      "wisdom": 13,
      "charisma": 21
    },
    "skills": "Arcana +8, History +8, Perception +11, Stealth +5",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 21",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante.",
        "attackBonus": 13,
        "damage": "2d10+8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 1.5 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante.",
        "attackBonus": 13,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 4.5 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 13,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nCold Breath. O(a) dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 20 Constituição teste de resistência, taking 58 (13d8) dano de frio on a failed save, or half as much damage on a successful one.\nParalyzing Breath. O(a) dragon exhales paralyzing gas in a 60-foot cone. Each creature in that area must succeed on a DC 20 Constituição teste de resistência or be paralisado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 22 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-silver-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-silver-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-silver-dragon",
    "name": "Dragão Prateado Ancestral",
    "nameEn": "Ancient Silver Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "leal e bom",
    "ac": 22,
    "hp": 487,
    "hitDice": "25d20",
    "cr": "23",
    "xp": 50000,
    "speed": "caminhada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 30,
      "dexterity": 10,
      "constitution": 29,
      "intelligence": 18,
      "wisdom": 15,
      "charisma": 23
    },
    "skills": "Arcana +11, History +11, Perception +16, Stealth +7",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 26",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 4.5 m, um alvo. Acerto: 21 (2d10 + 10) dano perfurante.",
        "attackBonus": 17,
        "damage": "2d10+10"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d6 + 10) dano cortante.",
        "attackBonus": 17,
        "damage": "2d6+10"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 6 m, um alvo. Acerto: 19 (2d8 + 10) dano de concussão.",
        "attackBonus": 17,
        "damage": "2d8+10"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nCold Breath. O(a) dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 24 Constituição teste de resistência, taking 67 (15d8) dano de frio on a failed save, or half as much damage on a successful one.\nParalyzing Breath. O(a) dragon exhales paralyzing gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Constituição teste de resistência or be paralisado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Change Shape",
        "description": "O(a) dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Resistência Lendária, lair actions, and Inteligência, Sabedoria, and Carisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 25 Destreza teste de resistência or take 17 (2d6 + 10) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+10"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-silver-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-silver-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-silver-dragon",
    "name": "Dragão Prateado Jovem",
    "nameEn": "Young Silver Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e bom",
    "ac": 18,
    "hp": 168,
    "hitDice": "16d10",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 23,
      "dexterity": 10,
      "constitution": 21,
      "intelligence": 14,
      "wisdom": 11,
      "charisma": 19
    },
    "skills": "Arcana +6, History +6, Perception +8, Stealth +4",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 18",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante.",
        "attackBonus": 10,
        "damage": "2d10+6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 10,
        "damage": "2d6+6"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nCold Breath. O(a) dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 17 Constituição teste de resistência, taking 54 (12d8) dano de frio on a failed save, or half as much damage on a successful one.\nParalyzing Breath. O(a) dragon exhales paralyzing gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Constituição teste de resistência or be paralisado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-silver-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-silver-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-green-dragon",
    "name": "Dragão Verde Adulto",
    "nameEn": "Adult Green Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "leal e mau",
    "ac": 19,
    "hp": 207,
    "hitDice": "18d12",
    "cr": "15",
    "xp": 13000,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 23,
      "dexterity": 12,
      "constitution": 21,
      "intelligence": 18,
      "wisdom": 15,
      "charisma": 17
    },
    "skills": "Deception +8, Insight +7, Perception +12, Persuasion +8, Stealth +6",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 22",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante plus 7 (2d6) dano de veneno.",
        "attackBonus": 11,
        "damage": "2d10+6 + 2d6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 11,
        "damage": "2d6+6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4.5 m, um alvo. Acerto: 15 (2d8 + 6) dano de concussão.",
        "attackBonus": 11,
        "damage": "2d8+6"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Poison Breath",
        "description": "O(a) dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constituição teste de resistência, taking 56 (16d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "16d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 19 Destreza teste de resistência or take 13 (2d6 + 6) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+6"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-green-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-green-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-green-dragon",
    "name": "Dragão Verde Ancestral",
    "nameEn": "Ancient Green Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "leal e mau",
    "ac": 21,
    "hp": 385,
    "hitDice": "22d20",
    "cr": "22",
    "xp": 41000,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 27,
      "dexterity": 12,
      "constitution": 25,
      "intelligence": 20,
      "wisdom": 17,
      "charisma": 19
    },
    "skills": "Deception +11, Insight +10, Perception +17, Persuasion +11, Stealth +8",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 27",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 4.5 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante plus 10 (3d6) dano de veneno.",
        "attackBonus": 15,
        "damage": "2d10+8 + 3d6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 3 m, um alvo. Acerto: 22 (4d6 + 8) dano cortante.",
        "attackBonus": 15,
        "damage": "4d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 6 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 15,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Poison Breath",
        "description": "O(a) dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constituição teste de resistência, taking 77 (22d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "22d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 23 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-green-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-green-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-green-dragon",
    "name": "Dragão Verde Jovem",
    "nameEn": "Young Green Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 18,
    "hp": 136,
    "hitDice": "16d10",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 12 m; voo: 24 m; natação: 12 m",
    "abilities": {
      "strength": 19,
      "dexterity": 12,
      "constitution": 17,
      "intelligence": 16,
      "wisdom": 13,
      "charisma": 15
    },
    "skills": "Deception +5, Perception +7, Stealth +4",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 17",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante plus 7 (2d6) dano de veneno.",
        "attackBonus": 7,
        "damage": "2d10+4 + 2d6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Poison Breath",
        "description": "O(a) dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constituição teste de resistência, taking 42 (12d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "12d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-green-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-green-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "adult-red-dragon",
    "name": "Dragão Vermelho Adulto",
    "nameEn": "Adult Red Dragon",
    "type": "dragão",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e mau",
    "ac": 19,
    "hp": 256,
    "hitDice": "19d12",
    "cr": "17",
    "xp": 18000,
    "speed": "caminhada: 12 m; escalada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 27,
      "dexterity": 10,
      "constitution": 25,
      "intelligence": 16,
      "wisdom": 13,
      "charisma": 21
    },
    "skills": "Perception +13, Stealth +6",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 23",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 19 (2d10 + 8) dano perfurante plus 7 (2d6) dano de fogo.",
        "attackBonus": 14,
        "damage": "2d10+8 + 2d6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 1.5 m, um alvo. Acerto: 15 (2d6 + 8) dano cortante.",
        "attackBonus": 14,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4.5 m, um alvo. Acerto: 17 (2d8 + 8) dano de concussão.",
        "attackBonus": 14,
        "damage": "2d8+8"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 36 m of the dragon and aware of it must succeed on a DC 19 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Fire Breath",
        "description": "O(a) dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Destreza teste de resistência, taking 63 (18d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "18d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 3 m of the dragon must succeed on a DC 22 Destreza teste de resistência or take 15 (2d6 + 8) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+8"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-red-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/adult-red-dragon.png",
    "color": "#7A2530",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ancient-red-dragon",
    "name": "Dragão Vermelho Ancestral",
    "nameEn": "Ancient Red Dragon",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "caótico e mau",
    "ac": 22,
    "hp": 546,
    "hitDice": "28d20",
    "cr": "24",
    "xp": 62000,
    "speed": "caminhada: 12 m; escalada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 30,
      "dexterity": 10,
      "constitution": 29,
      "intelligence": 18,
      "wisdom": 15,
      "charisma": 23
    },
    "skills": "Perception +16, Stealth +7",
    "senses": "visão às cegas 18 m, visão no escuro 36 m, Percepção passiva 26",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon can use its Frightful Presence. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 4.5 m, um alvo. Acerto: 21 (2d10 + 10) dano perfurante plus 14 (4d6) dano de fogo.",
        "attackBonus": 17,
        "damage": "2d10+10 + 4d6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d6 + 10) dano cortante.",
        "attackBonus": 17,
        "damage": "2d6+10"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 6 m, um alvo. Acerto: 19 (2d8 + 10) dano de concussão.",
        "attackBonus": 17,
        "damage": "2d8+10"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Fire Breath",
        "description": "O(a) dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Destreza teste de resistência, taking 91 (26d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "26d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Detect",
        "description": "O(a) dragon makes a Sabedoria (Perception) check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cauda Attack",
        "description": "O(a) dragon makes a Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "description": "O(a) dragon beats its wings. Each creature within 4.5 m of the dragon must succeed on a DC 25 Destreza teste de resistência or take 17 (2d6 + 10) dano de concussão and be knocked caído. O(a) dragon can then voo up to half its vooing speed.",
        "attackBonus": null,
        "damage": "2d6+10"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-red-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ancient-red-dragon.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "young-red-dragon",
    "name": "Dragão Vermelho Jovem",
    "nameEn": "Young Red Dragon",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 18,
    "hp": 178,
    "hitDice": "17d10",
    "cr": "10",
    "xp": 5900,
    "speed": "caminhada: 12 m; escalada: 12 m; voo: 24 m",
    "abilities": {
      "strength": 23,
      "dexterity": 10,
      "constitution": 21,
      "intelligence": 14,
      "wisdom": 11,
      "charisma": 19
    },
    "skills": "Perception +8, Stealth +4",
    "senses": "visão às cegas 9 m, visão no escuro 36 m, Percepção passiva 18",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d10 + 6) dano perfurante plus 3 (1d6) dano de fogo.",
        "attackBonus": 10,
        "damage": "2d10+6 + 1d6"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante.",
        "attackBonus": 10,
        "damage": "2d6+6"
      },
      {
        "name": "Fire Breath",
        "description": "O(a) dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Destreza teste de resistência, taking 56 (16d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "16d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/young-red-dragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/young-red-dragon.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "blue-dragon-wyrmling",
    "name": "Dragonete Azul",
    "nameEn": "Blue Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 17,
    "hp": 52,
    "hitDice": "8d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m; escavação: 4.5 m; voo: 18 m",
    "abilities": {
      "strength": 17,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 12,
      "wisdom": 11,
      "charisma": 15
    },
    "skills": "Perception +4, Stealth +2",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d10 + 3) dano perfurante plus 3 (1d6) dano elétrico.",
        "attackBonus": 5,
        "damage": "1d10+3 + 1d6"
      },
      {
        "name": "Lightning Breath",
        "description": "O(a) dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Destreza teste de resistência, taking 22 (4d10) dano elétrico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "4d10"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/blue-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/blue-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "white-dragon-wyrmling",
    "name": "Dragonete Branco",
    "nameEn": "White Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 16,
    "hp": 32,
    "hitDice": "5d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; escavação: 4.5 m; voo: 18 m; natação: 9 m",
    "abilities": {
      "strength": 14,
      "dexterity": 10,
      "constitution": 14,
      "intelligence": 5,
      "wisdom": 10,
      "charisma": 11
    },
    "skills": "Perception +4, Stealth +2",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d10 + 2) dano perfurante plus 2 (1d4) dano de frio.",
        "attackBonus": 4,
        "damage": "1d10+2 + 1d4"
      },
      {
        "name": "Cold Breath",
        "description": "O(a) dragon exhales an icy blast of hail in a 15-foot cone. Each creature in that area must make a DC 12 Constituição teste de resistência, taking 22 (5d8) dano de frio on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "5d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/white-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/white-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bronze-dragon-wyrmling",
    "name": "Dragonete de Bronze",
    "nameEn": "Bronze Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e bom",
    "ac": 17,
    "hp": 32,
    "hitDice": "5d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; voo: 18 m; natação: 9 m",
    "abilities": {
      "strength": 17,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 12,
      "wisdom": 11,
      "charisma": 15
    },
    "skills": "Perception +4, Stealth +2",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "lightning",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d10 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d10+3"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nLightning Breath. O(a) dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Destreza teste de resistência, taking 16 (3d10) dano elétrico on a failed save, or half as much damage on a successful one.\nRepulsion Breath. O(a) dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Força teste de resistência. On a failed save, the creature is pushed 30 feet away from the dragon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bronze-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bronze-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "copper-dragon-wyrmling",
    "name": "Dragonete de Cobre",
    "nameEn": "Copper Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e bom",
    "ac": 16,
    "hp": 22,
    "hitDice": "4d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 9 m; escalada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 15,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 14,
      "wisdom": 11,
      "charisma": 13
    },
    "skills": "Perception +4, Stealth +3",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d10 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d10+2"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nAcid Breath. O(a) dragon exhales acid in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Destreza teste de resistência, taking 18 (4d8) dano de ácido on a failed save, or half as much damage on a successful one.\nSlowing Breath. O(a) dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constituição teste de resistência. On a failed save, the creature can't use reaçãos, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a ação bônus on its turn, but not both. These effects last for 1 minute. O(a) creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself with a successful save.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/copper-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/copper-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "brass-dragon-wyrmling",
    "name": "Dragonete de Latão",
    "nameEn": "Brass Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e bom",
    "ac": 16,
    "hp": 16,
    "hitDice": "3d8",
    "cr": "1",
    "xp": 100,
    "speed": "caminhada: 9 m; escavação: 4.5 m; voo: 18 m",
    "abilities": {
      "strength": 15,
      "dexterity": 10,
      "constitution": 13,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 13
    },
    "skills": "Perception +4, Stealth +2",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d10 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d10+2"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nFire Breath. O(a) dragon exhales fire in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Destreza teste de resistência, taking 14 (4d6) dano de fogo on a failed save, or half as much damage on a successful one.\nSleep Breath. O(a) dragon exhales sleep gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constituição teste de resistência or fall unconscious for 1 minute. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/brass-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/brass-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gold-dragon-wyrmling",
    "name": "Dragonete Dourado",
    "nameEn": "Gold Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e bom",
    "ac": 17,
    "hp": 60,
    "hitDice": "8d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m; voo: 18 m; natação: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 14,
      "constitution": 17,
      "intelligence": 14,
      "wisdom": 11,
      "charisma": 16
    },
    "skills": "Perception +4, Stealth +4",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (1d10 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d10+4"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nFire Breath. O(a) dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Destreza teste de resistência, taking 22 (4d10) dano de fogo on a failed save, or half as much damage on a successful one.\nWeakening Breath. O(a) dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Força teste de resistência or have disadvantage on Força-based attack rolls, Força checks, and Força teste de resistências for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gold-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gold-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "black-dragon-wyrmling",
    "name": "Dragonete Negro",
    "nameEn": "Black Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 17,
    "hp": 33,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; voo: 18 m; natação: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 13,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 13
    },
    "skills": "Perception +4, Stealth +4",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d10 + 2) dano perfurante plus 2 (1d4) dano de ácido.",
        "attackBonus": 4,
        "damage": "1d10+2 + 1d4"
      },
      {
        "name": "Acid Breath",
        "description": "O(a) dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Destreza teste de resistência, taking 22 (5d8) dano de ácido on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "5d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/black-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/black-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "silver-dragon-wyrmling",
    "name": "Dragonete Prateado",
    "nameEn": "Silver Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e bom",
    "ac": 17,
    "hp": 45,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 12,
      "wisdom": 11,
      "charisma": 15
    },
    "skills": "Perception +4, Stealth +2",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (1d10 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d10+4"
      },
      {
        "name": "Breath Weapons",
        "description": "O(a) dragon uses one of the following breath weapons.\nCold Breath. O(a) dragon exhales an icy blast in a 15-foot cone. Each creature in that area must make a DC 13 Constituição teste de resistência, taking 18 (4d8) dano de frio on a failed save, or half as much damage on a successful one.\nParalyzing Breath. O(a) dragon exhales paralyzing gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Constituição teste de resistência or be paralisado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/silver-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/silver-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "green-dragon-wyrmling",
    "name": "Dragonete Verde",
    "nameEn": "Green Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 17,
    "hp": 38,
    "hitDice": "7d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; voo: 18 m; natação: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 14,
      "wisdom": 11,
      "charisma": 13
    },
    "skills": "Perception +4, Stealth +3",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d10 + 2) dano perfurante plus 3 (1d6) dano de veneno.",
        "attackBonus": 4,
        "damage": "1d10+2 + 1d6"
      },
      {
        "name": "Poison Breath",
        "description": "O(a) dragon exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 11 Constituição teste de resistência, taking 21 (6d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "6d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/green-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/green-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "red-dragon-wyrmling",
    "name": "Dragonete Vermelho",
    "nameEn": "Red Dragon Wyrmling",
    "type": "dragão",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 17,
    "hp": 75,
    "hitDice": "10d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m; escalada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 12,
      "wisdom": 11,
      "charisma": 15
    },
    "skills": "Perception +4, Stealth +2",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 14",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (1d10 + 4) dano perfurante plus 3 (1d6) dano de fogo.",
        "attackBonus": 6,
        "damage": "1d10+4 + 1d6"
      },
      {
        "name": "Fire Breath",
        "description": "O(a) dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Destreza teste de resistência, taking 24 (7d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "7d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/red-dragon-wyrmling.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/red-dragon-wyrmling.png",
    "color": "#7A2530",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "dretch",
    "name": "Dretch",
    "nameEn": "Dretch",
    "type": "demônio",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "caótico e mau",
    "ac": 11,
    "hp": 18,
    "hitDice": "4d6",
    "cr": "0.25",
    "xp": 25,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 11,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 5,
      "wisdom": 8,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "Abyssal, telepathy 18 m (works only with creatures that understand Abyssal)",
    "damageResistances": "cold, fire, lightning",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dretch makes two attacks: one with its Mordida and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d6) dano perfurante.",
        "attackBonus": 2,
        "damage": "1d6"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (2d4) dano cortante.",
        "attackBonus": 2,
        "damage": "2d4"
      },
      {
        "name": "Fetid Cloud",
        "description": "A 10-foot radius of disguFerrão green gas extends out from the dretch. O(a) gas spreads around corners, and its area is lightly obscured. It lasts for 1 minute or until a strong wind disperses it. Any creature that starts its turn in that area must succeed on a DC 11 Constituição teste de resistência or be envenenado until the start of its next turn. While envenenado in this way, the target can take either an action or a ação bônus on its turn, not both, and can't take reaçãos.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/dretch.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/dretch.png",
    "color": "#5C1A1A",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "dryad",
    "name": "Dríade",
    "nameEn": "Dryad",
    "type": "fada",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 16,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 12,
      "constitution": 11,
      "intelligence": 14,
      "wisdom": 15,
      "charisma": 18
    },
    "skills": "Perception +4, Stealth +5",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Elvish, Sylvan",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração Inata",
        "description": "O(a) dryad's Conjuração Inata ability is Carisma (spell save DC 14). O(a) dryad can innately cast the following spells, requiring no material components:\n\nAt will: druidcraft\n3/day each: entangle, goodberry\n1/day each: barkskin, pass without trace, shillelagh",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) dryad has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Speak with Beasts and Plants",
        "description": "O(a) dryad can communicate with beasts and plants as if they shared a language.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Tree Stride",
        "description": "Once on her turn, the dryad can use 3 m of her movement to step magically into one living tree within her reach and emerge from a second living tree within 18 m of the first tree, appearing in an unoccupied space within 1.5 m of the second tree. Both trees must be large or bigger.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Clava",
        "description": "Ataque corpo a corpo com arma: +2 para acertar (+6 para acertar with shillelagh), alcance 1.5 m, um alvo. Acerto: 2 (1d4) dano de concussão, or 8 (1d8 + 4) dano de concussão with shillelagh.",
        "attackBonus": 2,
        "damage": "1d4"
      },
      {
        "name": "Fey Charm",
        "description": "O(a) dryad targets one humanoid or beast that she can see within 30 feet of her. If the target can see the dryad, it must succeed on a DC 14 Sabedoria teste de resistência or be magically enfeitiçado. O(a) enfeitiçado creature regards the dryad as a trusted friend to be heeded and protected. Although the target isn't under the dryad's control, it takes the dryad's requests or actions in the most favorable way it can.\nEach time the dryad or its allies do anything harmful to the target, it can repeat the teste de resistência, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the dryad dies, is on a different plane of existence from the target, or ends the effect as a ação bônus. If a target's teste de resistência is successful, the target is immune to the dryad's Fey Charm for the next 24 hours.\nO(a) dryad can have no more than one humanoid and up to three beasts enfeitiçado at a time.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/dryad.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/dryad.png",
    "color": "#6B3FA0",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "drider",
    "name": "Drider",
    "nameEn": "Drider",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 19,
    "hp": 123,
    "hitDice": "13d10",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 16,
      "constitution": 18,
      "intelligence": 13,
      "wisdom": 14,
      "charisma": 12
    },
    "skills": "Perception +5, Stealth +9",
    "senses": "visão no escuro 36 m, Percepção passiva 15",
    "languages": "Elvish, Undercommon",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Fey Ancestry",
        "description": "O(a) drider has advantage on teste de resistências against being enfeitiçado, and magic can't put the drider to sleep.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) drider's Conjuração Inata ability is Sabedoria (spell save DC 13). O(a) drider can innately cast the following spells, requiring no material components:\nAt will: dancing lights\n1/day each: darkness, faerie fire",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) drider can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sunlight Sensitivity",
        "description": "While in sunlight, the drider has disadvantage on attack rolls, as well as on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web caminhadaer",
        "description": "O(a) drider ignores movement restrictions caused by webbing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) drider faz três ataques de attacks, either with its Espada longa or its Arco longo. It can replace one of those with a Mordida attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, uma criatura. Acerto: 2 (1d4) dano perfurante plus 9 (2d8) dano de veneno.",
        "attackBonus": 6,
        "damage": "1d4 + 2d8"
      },
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano cortante, or 8 (1d10 + 3) dano cortante if used with two hands.",
        "attackBonus": 6,
        "damage": null
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +6 para acertar, range 150/180 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante plus 4 (1d8) dano de veneno.",
        "attackBonus": 6,
        "damage": "1d8+3 + 1d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/drider.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/drider.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "drow",
    "name": "Drow",
    "nameEn": "Drow",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 15,
    "hp": 13,
    "hitDice": "3d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 11,
      "wisdom": 11,
      "charisma": 12
    },
    "skills": "Perception +2, Stealth +4",
    "senses": "visão no escuro 36 m, Percepção passiva 12",
    "languages": "Elvish, Undercommon",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Fey Ancestry",
        "description": "O(a) drow has advantage on teste de resistências against being enfeitiçado, and magic can't put the drow to sleep.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) drow's Conjuração ability is Carisma (spell save DC 11). It can innately cast the following spells, requiring no material components:\nAt will: dancing lights\n1/day each: darkness, faerie fire",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sunlight Sensitivity",
        "description": "While in sunlight, the drow has disadvantage on attack rolls, as well as on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Hand Besta",
        "description": "Ataque à distância com arma: +4 para acertar, range 30/36 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante, and the target must succeed on a DC 13 Constituição teste de resistência or be envenenado for 1 hour. If the teste de resistência fails by 5 or more, the target is also unconscious while envenenado in this way. O(a) target wakes up if it takes damage or if another creature takes an action to shake it awake.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/drow.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/drow.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "druid",
    "name": "Druida",
    "nameEn": "Druid",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 16,
    "hp": 27,
    "hitDice": "5d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 12,
      "wisdom": 15,
      "charisma": 11
    },
    "skills": "Medicine +4, Nature +3, Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "Druidic plus any two languages",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração",
        "description": "O(a) druid is a 4th-level spellcaster. Its Conjuração ability is Sabedoria (spell save DC 12, +4 para acertar with spell attacks). It has the following druid spells prepared:\n\n- Cantrips (at will): druidcraft, produce flame, shillelagh\n- 1st level (4 slots): entangle, longstrider, speak with animals, thunderwave\n- 2nd level (3 slots): animal messenger, barkskin",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Quarterstaff",
        "description": " Ataque corpo a corpo com arma: +2 para acertar (+4 para acertar with shillelagh), alcance 1.5 m, um alvo. Acerto: 3 (1d6) dano de concussão, 4 (1d8) dano de concussão if wielded with two hands, or 6 (1d8 + 2) dano de concussão with shillelagh.",
        "attackBonus": 2,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/druid.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/druid.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "duergar",
    "name": "Duergar",
    "nameEn": "Duergar",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 16,
    "hp": 26,
    "hitDice": "4d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 7.5 m",
    "abilities": {
      "strength": 14,
      "dexterity": 11,
      "constitution": 14,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 9
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 10",
    "languages": "Dwarvish, Undercommon",
    "damageResistances": "poison",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Duergar Resilience",
        "description": "O(a) duergar has advantage on teste de resistências against poison, spells, and illusions, as well as to resist being enfeitiçado or paralisado.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sunlight Sensitivity",
        "description": "While in sunlight, the duergar has disadvantage on attack rolls, as well as on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Enlarge",
        "description": "For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying. While enlarged, the duergar is Large, doubles its damage dice on Força-based weapon attacks (included in the attacks), and makes Força checks and Força teste de resistências with advantage. If the duergar lacks the room to become Large, it attains the maximum size possible in the space available.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "War Pick",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante, or 11 (2d8 + 2) dano perfurante while enlarged.",
        "attackBonus": 4,
        "damage": "1d8+2"
      },
      {
        "name": "Dardo",
        "description": "Melee or Ataque à distância com arma: +4 para acertar, alcance 1.5 m or range 30/36 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante, or 9 (2d6 + 2) dano perfurante while enlarged.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Invisibility",
        "description": "O(a) duergar magically turns invisível until it attacks, casts a spell, or uses its Enlarge, or until its concentration is broken, up to 1 hour (as if concentrating on a spell). Any equipment the duergar wears or carries is invisível with it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/duergar.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/duergar.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "efreeti",
    "name": "Efreeti",
    "nameEn": "Efreeti",
    "type": "elemental",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 17,
    "hp": 200,
    "hitDice": "16d10",
    "cr": "11",
    "xp": 7200,
    "speed": "caminhada: 12 m; voo: 18 m",
    "abilities": {
      "strength": 22,
      "dexterity": 12,
      "constitution": 24,
      "intelligence": 16,
      "wisdom": 15,
      "charisma": 16
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 12",
    "languages": "Ignan",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Elemental Demise",
        "description": "If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the djinni was wearing or carrying.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) efreeti's innate spell caFerrão ability is Carisma (spell save DC 15, +7 para acertar with spell attacks). It can innately cast the following spells, requiring no material components:\n\nAt will: detect magic\n3/day: enlarge/reduce, tongues\n1/day each: conjure elemental (fire elemental only), gaseous form, invisibility, major image, plane shift, wall of fire",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) efreeti faz dois ataques de Cimitarra or uses its Hurl Flame twice.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d6 + 6) dano cortante plus 7 (2d6) dano de fogo.",
        "attackBonus": 10,
        "damage": "2d6+6 + 2d6"
      },
      {
        "name": "Hurl Flame",
        "description": "Ataque à distância com magia: +7 para acertar, range 36 m, um alvo. Acerto: 17 (5d6) dano de fogo.",
        "attackBonus": 7,
        "damage": "5d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/efreeti.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/efreeti.png",
    "color": "#2F4F7A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "elephant",
    "name": "Elefante",
    "nameEn": "Elephant",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 76,
    "hitDice": "8d12",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 22,
      "dexterity": 9,
      "constitution": 17,
      "intelligence": 3,
      "wisdom": 11,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Trampling Charge",
        "description": "If the elephant moves at least 6 m straight toward a creature and then hits it with a Chifrada attack on the same turn, that target must succeed on a DC 12 Força teste de resistência or be knocked caído. If the target is caído, the elephant can make one stomp attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Chifrada",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 19 (3d8 + 6) dano perfurante.",
        "attackBonus": 8,
        "damage": "3d8+6"
      },
      {
        "name": "Stomp",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, one pruma criatura. Acerto: 22 (3d10 + 6) dano de concussão.",
        "attackBonus": 8,
        "damage": "3d10+6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/elephant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/elephant.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "water-elemental",
    "name": "Elemental da Água",
    "nameEn": "Water Elemental",
    "type": "elemental",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro",
    "ac": 14,
    "hp": 114,
    "hitDice": "12d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m; natação: 27 m",
    "abilities": {
      "strength": 18,
      "dexterity": 14,
      "constitution": 18,
      "intelligence": 5,
      "wisdom": 10,
      "charisma": 8
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Aquan",
    "damageResistances": "acid, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, agarrado, paralisado, Petrificado, envenenado, caído, impedido, Unconscious",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Water Form",
        "description": "O(a) elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Freeze",
        "description": "If the elemental takes dano de frio, it partially freezes; its speed is reduced by 6 m until the end of its next turn.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) elemental faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano de concussão.",
        "attackBonus": 7,
        "damage": "2d8+4"
      },
      {
        "name": "Whelm",
        "description": "Each creature in the elemental's space must make a DC 15 Força teste de resistência. On a failure, a target takes 13 (2d8 + 4) dano de concussão. If it is Large or smaller, it is also agarrado (escape DC 14). Until this grapple ends, the target is impedido and unable to breathe unless it can breathe water. If the teste de resistência is successful, the target is pushed out of the elemental's space.\nO(a) elemental can grapple one Large creature or up to two Medium or smaller creatures at one time. At the start of each of the elemental's turns, each target agarrado by it takes 13 (2d8 + 4) dano de concussão. A creature within 5 feet of the elemental can pull a creature or object out of it by taking an action to make a DC 14 Força and succeeding.",
        "attackBonus": null,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/water-elemental.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/water-elemental.png",
    "color": "#2F4F7A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "earth-elemental",
    "name": "Elemental da Terra",
    "nameEn": "Earth Elemental",
    "type": "elemental",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro",
    "ac": 17,
    "hp": 126,
    "hitDice": "12d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m; escavação: 9 m",
    "abilities": {
      "strength": 20,
      "dexterity": 8,
      "constitution": 20,
      "intelligence": 5,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 10",
    "languages": "Terran",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, paralisado, Petrificado, envenenado, Unconscious",
    "damageVulnerabilities": "thunder",
    "traits": [
      {
        "name": "Earth Glide",
        "description": "O(a) elemental can escavação through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Siege Monster",
        "description": "O(a) elemental deals double damage to objects and structures.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) elemental faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo. Acerto: 14 (2d8 + 5) dano de concussão.",
        "attackBonus": 8,
        "damage": "2d8+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/earth-elemental.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/earth-elemental.png",
    "color": "#2F4F7A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "air-elemental",
    "name": "Elemental do Ar",
    "nameEn": "Air Elemental",
    "type": "elemental",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro",
    "ac": 15,
    "hp": 90,
    "hitDice": "12d10",
    "cr": "5",
    "xp": 1800,
    "speed": "voo: 27 m; flutuar: true",
    "abilities": {
      "strength": 14,
      "dexterity": 20,
      "constitution": 14,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Auran",
    "damageResistances": "lightning, thunder, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, agarrado, paralisado, Petrificado, envenenado, caído, impedido, Unconscious",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Air Form",
        "description": "O(a) elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) elemental faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d8 + 5) dano de concussão.",
        "attackBonus": 8,
        "damage": "2d8+5"
      },
      {
        "name": "Whirlwind",
        "description": "Each creature in the elemental's space must make a DC 13 Força teste de resistência. On a failure, a target takes 15 (3d8 + 2) dano de concussão and is flung up 20 feet away from the elemental in a random direction and knocked caído. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) dano de concussão for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Destreza teste de resistência or take the same damage and be knocked caído.\nIf the teste de resistência is successful, the target takes half the dano de concussão and isn't flung away or knocked caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/air-elemental.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/air-elemental.png",
    "color": "#2F4F7A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "fire-elemental",
    "name": "Elemental do Fogo",
    "nameEn": "Fire Elemental",
    "type": "elemental",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro",
    "ac": 13,
    "hp": 102,
    "hitDice": "12d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 10,
      "dexterity": 17,
      "constitution": 16,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 7
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Ignan",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "Exaustão, agarrado, paralisado, Petrificado, envenenado, caído, impedido, Unconscious",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Fire Form",
        "description": "O(a) elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 1.5 m of it takes 5 (1d10) dano de fogo. In addition, the elemental can enter a hostile creature's space and stop there. O(a) first time it enters a creature's space on a turn, that creature takes 5 (1d10) dano de fogo and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) dano de fogo at the start of each of its turns.",
        "attackBonus": null,
        "damage": "1d10"
      },
      {
        "name": "Illumination",
        "description": "O(a) elemental sheds bright light in a 30-foot radius and dim light in an additional 9 m.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Susceptibility",
        "description": "For every 1.5 m the elemental moves in water, or for every gallon of water splashed on it, it takes 1 dano de frio.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) elemental faz dois ataques de touch.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Touch",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano de fogo. If the target is a creature or a flammable object, it ignites. Until a creature takes an action to douse the fire, the target takes 5 (1d10) dano de fogo at the start of each of its turns.",
        "attackBonus": 6,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/fire-elemental.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/fire-elemental.png",
    "color": "#2F4F7A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-spiders",
    "name": "Enxame de Aranhas",
    "nameEn": "Swarm of Spiders",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 6 m; escalada: 6 m",
    "abilities": {
      "strength": 3,
      "dexterity": 13,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) swarm can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web Sense",
        "description": "While in contact with a web, the swarm knows the exact location of any other creature in contact with the same web.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web caminhadaer",
        "description": "O(a) swarm ignores movement restrictions caused by webbing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 0 m, um alvo in the swarm's space. Acerto: 10 (4d4) dano perfurante, or 5 (2d4) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 3,
        "damage": "4d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-spiders.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-spiders.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-beetles",
    "name": "Enxame de Beetles",
    "nameEn": "Swarm of Beetles",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 6 m; escavação: 1.5 m; escalada: 6 m",
    "abilities": {
      "strength": 3,
      "dexterity": 13,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 0 m, um alvo in the swarm's space. Acerto: 10 (4d4) dano perfurante, or 5 (2d4) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 3,
        "damage": "4d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-beetles.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-beetles.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-centipedes",
    "name": "Enxame de Centipedes",
    "nameEn": "Swarm of Centipedes",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 6 m; escalada: 6 m",
    "abilities": {
      "strength": 3,
      "dexterity": 13,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 0 m, um alvo in the swarm's space. Acerto: 10 (4d4) dano perfurante, or 5 (2d4) dano perfurante if the swarm has half of its hit points or fewer.\nA creature reduced to 0 hit points by a swarm of centipedes is stable but envenenado for 1 hour, even after regaining hit points, and paralisado while envenenado in this way.",
        "attackBonus": 3,
        "damage": "4d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-centipedes.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-centipedes.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-poisonous-snakes",
    "name": "Enxame de Cobras Venenosas",
    "nameEn": "Swarm of Poisonous Snakes",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 36,
    "hitDice": "8d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 8,
      "dexterity": 18,
      "constitution": 11,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny snake. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 0 m, uma criatura in the swarm's space. Acerto: 7 (2d6) dano perfurante, or 3 (1d6) dano perfurante if the swarm has half of its hit points or fewer. O(a) target must make a DC 10 Constituição teste de resistência, taking 14 (4d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 6,
        "damage": "2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-poisonous-snakes.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-poisonous-snakes.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-ravens",
    "name": "Enxame de Corvos",
    "nameEn": "Swarm of Ravens",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 24,
    "hitDice": "7d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 3 m; voo: 15 m",
    "abilities": {
      "strength": 6,
      "dexterity": 14,
      "constitution": 8,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 15",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny raven. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Beaks",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo in the swarm's space. Acerto: 7 (2d6) dano perfurante, or 3 (1d6) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 4,
        "damage": "2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-ravens.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-ravens.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-insects",
    "name": "Enxame de Insetos",
    "nameEn": "Swarm of Insects",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 6 m; escalada: 6 m",
    "abilities": {
      "strength": 3,
      "dexterity": 13,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 0 m, um alvo in the swarm's space. Acerto: 10 (4d4) dano perfurante, or 5 (2d4) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 3,
        "damage": "4d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-insects.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-insects.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-bats",
    "name": "Enxame de Morcegos",
    "nameEn": "Swarm of Bats",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 0 m; voo: 9 m",
    "abilities": {
      "strength": 5,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 4
    },
    "skills": "—",
    "senses": "visão às cegas 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Echolocation",
        "description": "O(a) swarm can't use its visão às cegas while Surdo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada",
        "description": "O(a) swarm has advantage on Sabedoria (Perception) checks that rely on hearing.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 0 m, uma criatura in the swarm's space. Acerto: 5 (2d4) dano perfurante, or 2 (1d4) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 4,
        "damage": "2d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-bats.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-bats.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-quippers",
    "name": "Enxame de Quippers",
    "nameEn": "Swarm of Quippers",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 28,
    "hitDice": "8d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 0 m; natação: 12 m",
    "abilities": {
      "strength": 13,
      "dexterity": 16,
      "constitution": 9,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 2
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Blood Frenzy",
        "description": "O(a) swarm has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny quipper. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) swarm can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 0 m, uma criatura in the swarm's space. Acerto: 14 (4d6) dano perfurante, or 7 (2d6) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 5,
        "damage": "4d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-quippers.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-quippers.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-rats",
    "name": "Enxame de Ratos",
    "nameEn": "Swarm of Rats",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 24,
    "hitDice": "7d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 9,
      "dexterity": 11,
      "constitution": 9,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão no escuro 9 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) swarm has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 0 m, um alvo in the swarm's space. Acerto: 7 (2d6) dano perfurante, or 3 (1d6) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 2,
        "damage": "2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-rats.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-rats.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "swarm-of-wasps",
    "name": "Enxame de Vespas",
    "nameEn": "Swarm of Wasps",
    "type": "swarm of Tiny beasts",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 1.5 m; voo: 9 m",
    "abilities": {
      "strength": 3,
      "dexterity": 13,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, amedrontado, agarrado, paralisado, Petrificado, caído, impedido, atordoado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Swarm",
        "description": "O(a) swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. O(a) swarm can't regain hit points or gain temporary hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordidas",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 0 m, um alvo in the swarm's space. Acerto: 10 (4d4) dano perfurante, or 5 (2d4) dano perfurante if the swarm has half of its hit points or fewer.",
        "attackBonus": 3,
        "damage": "4d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-wasps.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/swarm-of-wasps.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "erinyes",
    "name": "Erínias",
    "nameEn": "Erinyes",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 18,
    "hp": 153,
    "hitDice": "18d8",
    "cr": "12",
    "xp": 8400,
    "speed": "caminhada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 18,
      "dexterity": 16,
      "constitution": 18,
      "intelligence": 14,
      "wisdom": 14,
      "charisma": 18
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 12",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hellish Weapons",
        "description": "O(a) erinyes's weapon attacks are magical and deal an extra 13 (3d8) dano de veneno on a hit (included in the attacks).",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) erinyes has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) erinyes makes three attacks",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d8 + 4) dano cortante, or 9 (1d10 + 4) dano cortante if used with two hands, plus 13 (3d8) dano de veneno.",
        "attackBonus": 8,
        "damage": "3d8"
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +7 para acertar, range 150/180 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante plus 13 (3d8) dano de veneno, and the target must succeed on a DC 14 Constituição teste de resistência or be envenenado. O(a) poison lasts until it is removed by the lesser restoration spell or similar magic.",
        "attackBonus": 7,
        "damage": "1d8+3 + 3d8"
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "description": "O(a) erinyes adds 4 to its AC against one melee attack that would hit it. To do so, the erinyes must see the attacker and be wielding a melee weapon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/erinyes.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/erinyes.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "scorpion",
    "name": "Escorpião",
    "nameEn": "Scorpion",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 3 m",
    "abilities": {
      "strength": 2,
      "dexterity": 11,
      "constitution": 8,
      "intelligence": 1,
      "wisdom": 8,
      "charisma": 2
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ferrão",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, uma criatura. Acerto: 1 dano perfurante, and the target must make a DC 9 Constituição teste de resistência, taking 4 (1d8) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 2,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/scorpion.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/scorpion.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-scorpion",
    "name": "Escorpião Gigante",
    "nameEn": "Giant Scorpion",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 15,
    "hp": 52,
    "hitDice": "7d10",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 15,
      "dexterity": 13,
      "constitution": 15,
      "intelligence": 1,
      "wisdom": 9,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão às cegas 18 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano de concussão, and the target is agarrado (escape DC 12). O(a) scorpion has two Garras, each of which can grapple only um alvo.",
        "attackBonus": 4,
        "damage": "1d8+2"
      },
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) scorpion makes three attacks: two with its Garras and one with its Ferrão.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Ferrão",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 7 (1d10 + 2) dano perfurante, and the target must make a DC 12 Constituição teste de resistência, taking 22 (4d10) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 4,
        "damage": "1d10+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-scorpion.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-scorpion.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "flying-sword",
    "name": "Espada Voadora",
    "nameEn": "Flying Sword",
    "type": "constructo",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 17,
    "hp": 17,
    "hitDice": "5d6",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 0 m; voo: 15 m; flutuar: true",
    "abilities": {
      "strength": 12,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 1,
      "wisdom": 5,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 7",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "Cego, enfeitiçado, Cego, amedrontado, paralisado, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "description": "O(a) sword is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the sword must succeed on a Constituição teste de resistência against the caster's spell save DC or fall unconscious for 1 minute.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "False Appearance",
        "description": "While the sword remains motionless and isn't vooing, it is indiFerrãouishable from a normal sword.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d8 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "1d8+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/flying-sword.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/flying-sword.png",
    "color": "#5A5A5A",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "specter",
    "name": "Espectro",
    "nameEn": "Specter",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 12,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 0 m; voo: 15 m; flutuar: true",
    "abilities": {
      "strength": 1,
      "dexterity": 14,
      "constitution": 11,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 11
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "compreende all languages it knew in life mas não pode falar",
    "damageResistances": "acid, cold, fire, lightning, thunder, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "enfeitiçado, Exaustão, agarrado, paralisado, Petrificado, envenenado, caído, impedido, Unconscious",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Incorporeal Movement",
        "description": "O(a) specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) dano de força if it ends its turn inside an object.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sunlight Sensitivity",
        "description": "While in sunlight, the specter has disadvantage on attack rolls, as well as on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Life Drain",
        "description": "Ataque corpo a corpo com magia: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 10 (3d6) dano necrótico. O(a) target must succeed on a DC 10 Constituição teste de resistência or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the creature finishes a long rest. O(a) target dies if this effect reduces its hit point maximum to 0.",
        "attackBonus": 4,
        "damage": "3d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/specter.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/specter.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wraith",
    "name": "Espectro Maior",
    "nameEn": "Wraith",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 13,
    "hp": 67,
    "hitDice": "9d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 0 m; voo: 18 m; flutuar: true",
    "abilities": {
      "strength": 6,
      "dexterity": 16,
      "constitution": 16,
      "intelligence": 12,
      "wisdom": 14,
      "charisma": 15
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "the languages it knew in life",
    "damageResistances": "acid, cold, fire, lightning, thunder, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "enfeitiçado, Exaustão, agarrado, paralisado, Petrificado, envenenado, caído, impedido",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Incorporeal Movement",
        "description": "O(a) wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) dano de força if it ends its turn inside an object.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sunlight Sensitivity",
        "description": "While in sunlight, the wraith has disadvantage on attack rolls, as well as on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Life Drain",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, uma criatura. Acerto: 21 (4d8 + 3) dano necrótico. O(a) target must succeed on a DC 14 Constituição teste de resistência or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. O(a) target dies if this effect reduces its hit point maximum to 0.",
        "attackBonus": 6,
        "damage": "4d8+3"
      },
      {
        "name": "Create Specter",
        "description": "O(a) wraith targets a humanoid within 10 feet of it that has been dead for no longer than 1 minute and died violently. O(a) target's spirit rises as a specter in the space of its corpse or in the nearest unoccupied space. O(a) specter is under the wraith's control. O(a) wraith can have no more than seven specters under its control at one time.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wraith.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wraith.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "spy",
    "name": "Espião",
    "nameEn": "Spy",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 12,
    "hp": 27,
    "hitDice": "6d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 12,
      "wisdom": 14,
      "charisma": 16
    },
    "skills": "Deception +5, Insight +4, Investigation +5, Perception +6, Persuasion +5, Stealth +4",
    "senses": "Percepção passiva 16",
    "languages": "any two languages",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Cunning Action",
        "description": "em cada um de seus turnos, the spy can use a ação bônus to take the Dash, Disengage, or Hide action.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sneak Attack (1/Turn)",
        "description": "O(a) spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 1.5 m of an ally of the spy that isn't incapacitated and the spy doesn't have disadvantage on the attack roll.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) spy faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Hand Besta",
        "description": "Ataque à distância com arma: +4 para acertar, range 30/36 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/spy.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/spy.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "invisible-stalker",
    "name": "Espreitador Invisível",
    "nameEn": "Invisible Stalker",
    "type": "elemental",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 14,
    "hp": 104,
    "hitDice": "16d8",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 15 m; voo: 15 m; flutuar: true",
    "abilities": {
      "strength": 16,
      "dexterity": 19,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 15,
      "charisma": 11
    },
    "skills": "Perception +8, Stealth +10",
    "senses": "visão no escuro 18 m, Percepção passiva 18",
    "languages": "Auran, compreende Comum but doesn't speak it",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, agarrado, paralisado, Petrificado, envenenado, caído, impedido, Unconscious",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Invisibility",
        "description": "O(a) stalker is invisível.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Faultless Tracker",
        "description": "O(a) stalker is given a quarry by its summoner. O(a) stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. O(a) stalker also knows the location of its summoner.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) stalker faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/invisible-stalker.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/invisible-stalker.png",
    "color": "#2F4F7A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "skeleton",
    "name": "Esqueleto",
    "nameEn": "Skeleton",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 13,
    "hp": 13,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 14,
      "constitution": 15,
      "intelligence": 6,
      "wisdom": 8,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "compreende all languages it spoke in life mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado, Exaustão",
    "damageVulnerabilities": "bludgeoning",
    "traits": [],
    "actions": [
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Arco curto",
        "description": "Ataque à distância com arma: +4 para acertar, range 80/96 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/skeleton.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/skeleton.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "warhorse-skeleton",
    "name": "Esqueleto de Cavalo de Guerra",
    "nameEn": "Warhorse Skeleton",
    "type": "morto-vivo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 13,
    "hp": 22,
    "hitDice": "3d10",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 18 m",
    "abilities": {
      "strength": 18,
      "dexterity": 12,
      "constitution": 15,
      "intelligence": 2,
      "wisdom": 8,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, envenenado",
    "damageVulnerabilities": "bludgeoning",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/warhorse-skeleton.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/warhorse-skeleton.png",
    "color": "#5C4A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "minotaur-skeleton",
    "name": "Esqueleto de Minotauro",
    "nameEn": "Minotaur Skeleton",
    "type": "morto-vivo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 12,
    "hp": 67,
    "hitDice": "9d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 11,
      "constitution": 15,
      "intelligence": 6,
      "wisdom": 8,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "compreende Abyssal mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, envenenado",
    "damageVulnerabilities": "bludgeoning",
    "traits": [
      {
        "name": "Charge",
        "description": "If the skeleton moves at least 10 feet straight toward a target and then hits it with a Chifrada attack on the same turn, the target takes an extra 9 (2d8) dano perfurante. If the target is a creature, it must succeed on a DC 14 Força teste de resistência or be pushed up to 10 feet away and knocked caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Machado grande",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 17 (2d12 + 4) dano cortante.",
        "attackBonus": 6,
        "damage": "2d12+4"
      },
      {
        "name": "Chifrada",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/minotaur-skeleton.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/minotaur-skeleton.png",
    "color": "#5C4A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ettercap",
    "name": "Ettercap",
    "nameEn": "Ettercap",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 13,
    "hp": 44,
    "hitDice": "8d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 14,
      "dexterity": 15,
      "constitution": 13,
      "intelligence": 7,
      "wisdom": 12,
      "charisma": 8
    },
    "skills": "Perception +3, Stealth +4, Survival +3",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Spider escalada",
        "description": "O(a) ettercap can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web Sense",
        "description": "While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Web caminhadaer",
        "description": "O(a) ettercap ignores movement restrictions caused by webbing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) ettercap makes two attacks: one with its Mordida and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 6 (1d8 + 2) dano perfurante plus 4 (1d8) dano de veneno. O(a) target must succeed on a DC 11 Constituição teste de resistência or be envenenado for 1 minute. O(a) creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 4,
        "damage": "1d8+2 + 1d8"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d4 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "2d4+2"
      },
      {
        "name": "Web",
        "description": "Ataque à distância com arma: +4 para acertar, range 30/18 m, one Large or smaller creature. Acerto: O(a) creature is impedido by webbing. As an action, the impedido creature can make a DC 11 Força check, escaping from the webbing on a success. O(a) effect ends if the webbing is destroyed. O(a) webbing has AC 10, 5 hit points, is vulnerable to dano de fogo and immune to dano de concussão.",
        "attackBonus": 4,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ettercap.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ettercap.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ettin",
    "name": "Ettin",
    "nameEn": "Ettin",
    "type": "gigante",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 12,
    "hp": 85,
    "hitDice": "10d10",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 21,
      "dexterity": 8,
      "constitution": 17,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 8
    },
    "skills": "Perception +4",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Giant, Orc",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Two Heads",
        "description": "O(a) ettin has advantage on Sabedoria (Perception) checks and on teste de resistências against being Cego, enfeitiçado, Surdo, amedrontado, atordoado, and knocked unconscious.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wakeful",
        "description": "When one of the ettin's heads is asleep, its other head is awake.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) ettin makes two attacks: one with its Machado de batalha and one with its Maça-estrela.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Machado de batalha",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d8 + 5) dano cortante.",
        "attackBonus": 7,
        "damage": "2d8+5"
      },
      {
        "name": "Maça-estrela",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d8 + 5) dano perfurante.",
        "attackBonus": 7,
        "damage": "2d8+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ettin.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ettin.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hawk",
    "name": "Falcão",
    "nameEn": "Hawk",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 3 m; voo: 18 m",
    "abilities": {
      "strength": 5,
      "dexterity": 16,
      "constitution": 8,
      "intelligence": 2,
      "wisdom": 14,
      "charisma": 6
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada",
        "description": "O(a) hawk has advantage on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano cortante.",
        "attackBonus": 5,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hawk.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hawk.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "blood-hawk",
    "name": "Falcão Sangrento",
    "nameEn": "Blood Hawk",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 7,
    "hitDice": "2d6",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 3 m; voo: 18 m",
    "abilities": {
      "strength": 6,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 3,
      "wisdom": 14,
      "charisma": 5
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada",
        "description": "O(a) hawk has advantage on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) hawk has advantage on an attack roll against a creature if at least one of the hawk's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/blood-hawk.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/blood-hawk.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "cult-fanatic",
    "name": "Fanático do Culto",
    "nameEn": "Cult Fanatic",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any non-good alignment",
    "ac": 13,
    "hp": 22,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 14
    },
    "skills": "Deception +4, Persuasion +4, Religion +2",
    "senses": "Percepção passiva 11",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Dark Devotion",
        "description": "O(a) fanatic has advantage on teste de resistências against being enfeitiçado or amedrontado.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) fanatic is a 4th-level spellcaster. Its spell caFerrão ability is Sabedoria (spell save DC 11, +3 para acertar with spell attacks). O(a) fanatic has the following cleric spells prepared:\n\nCantrips (at will): light, sacred flame, thaumaturgy\n- 1st level (4 slots): command, inflict wounds, shield of faith\n- 2nd level (3 slots): hold person, spiritual weapon",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) fanatic faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Adaga",
        "description": "Melee or Ataque à distância com arma: +4 para acertar, alcance 1.5 m or range 20/18 m, uma criatura. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/cult-fanatic.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/cult-fanatic.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ghost",
    "name": "Fantasma",
    "nameEn": "Ghost",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 11,
    "hp": 45,
    "hitDice": "10d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 0 m; voo: 12 m; flutuar: true",
    "abilities": {
      "strength": 7,
      "dexterity": 13,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 12,
      "charisma": 17
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "any languages it knew in life",
    "damageResistances": "acid, fire, lightning, thunder, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "cold, necrotic, poison",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, agarrado, paralisado, Petrificado, envenenado, caído, impedido",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Ethereal Sight",
        "description": "O(a) ghost can see 18 m into the Ethereal Plane when it is on the Material Plane, and vice versa.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Incorporeal Movement",
        "description": "O(a) ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) dano de força if it ends its turn inside an object.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Withering Touch",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 17 (4d6 + 3) dano necrótico.",
        "attackBonus": 5,
        "damage": "4d6+3"
      },
      {
        "name": "Etherealness",
        "description": "O(a) ghost enters the Ethereal Plane from the Material Plane, or vice versa. It is visible on the Material Plane while it is in the Border Ethereal, and vice versa, yet it can't affect or be affected by anything on the other plane.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Horrifying Visage",
        "description": "Each non-undead creature within 18 m of the ghost that can see it must succeed on a DC 13 Sabedoria teste de resistência or be amedrontado for 1 minute. If the save fails by 5 or more, the target also ages 1d4 × 10 years. A amedrontado target can repeat the teste de resistência at the end of each of its turns, ending the amedrontado condition on itself on a success. If a target's teste de resistência is successful or the effect ends for it, the target is immune to this ghost's Horrifying Visage for the next 24 hours. O(a) aging effect can be reversed with a greater restoration spell, but only within 24 hours of it occurring.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Possession",
        "description": "One humanoid that the ghost can see within 1.5 m of it must succeed on a DC 13 Carisma teste de resistência or be possessed by the ghost; the ghost then disappears, and the target is incapacitated and loses control of its body. O(a) ghost now controls the body but doesn't deprive the target of awareness. O(a) ghost can't be targeted by any attack, spell, or other effect, except ones that turn undead, and it retains its alignment, Inteligência, Sabedoria, Carisma, and immunity to being enfeitiçado and amedrontado. It otherwise uses the possessed target's statistics, but doesn't gain access to the target's knowledge, class features, or proficiencies.\nO(a) possession lasts until the body drops to 0 hit points, the ghost ends it as a ação bônus, or the ghost is turned or forced out by an effect like the dispel evil and good spell. When the possession ends, the ghost reappears in an unoccupied space within 1.5 m of the body. O(a) target is immune to this ghost's Possession for 24 hours after succeeding on the teste de resistência or after the possession ends.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ghost.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ghost.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "will-o-wisp",
    "name": "Fogo-Fátuo",
    "nameEn": "Will-o'-Wisp",
    "type": "morto-vivo",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "caótico e mau",
    "ac": 19,
    "hp": 22,
    "hitDice": "9d4",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 0 m; voo: 15 m; flutuar: true",
    "abilities": {
      "strength": 1,
      "dexterity": 28,
      "constitution": 10,
      "intelligence": 13,
      "wisdom": 14,
      "charisma": 11
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 12",
    "languages": "the languages it knew in life",
    "damageResistances": "acid, cold, fire, necrotic, thunder, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "lightning, poison",
    "conditionImmunities": "Exaustão, agarrado, paralisado, envenenado, caído, impedido, Unconscious",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Consume Life",
        "description": "As a ação bônus, the will-o'-wisp can target uma criatura it can see within 1.5 m of it that has 0 hit points and is still alive. O(a) target must succeed on a DC 10 Constituição teste de resistência against this magic or die. If the target dies, the will-o'-wisp regains 10 (3d6) hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Ephemeral",
        "description": "O(a) will-o'-wisp can't wear or carry anything.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Incorporeal Movement",
        "description": "O(a) will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) dano de força if it ends its turn inside an object.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Variable Illumination",
        "description": "O(a) will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of ft. equal to the chosen radius. O(a) will-o'-wisp can alter the radius as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Shock",
        "description": "Ataque corpo a corpo com magia: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 9 (2d8) dano elétrico.",
        "attackBonus": 4,
        "damage": "2d8"
      },
      {
        "name": "Invisibility",
        "description": "O(a) will-o'-wisp and its light magically become invisível until it attacks or uses its Consume Life, or until its concentration ends (as if concentrating on a spell).",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/will-o-wisp.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/will-o-wisp.png",
    "color": "#5C4A1E",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "violet-fungus",
    "name": "Fungo Violeta",
    "nameEn": "Violet Fungus",
    "type": "planta",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 5,
    "hp": 18,
    "hitDice": "4d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 1.5 m",
    "abilities": {
      "strength": 3,
      "dexterity": 1,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 3,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 9 m (blind beyond this radius), Percepção passiva 6",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "Cego, Cego, amedrontado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "False Appearance",
        "description": "While the violet fungus remains motionless, it is indiFerrãouishable from an ordinary fungus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) fungus makes 1d4 Rotting Touch attacks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Rotting Touch",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 3 m, uma criatura. Acerto: 4 (1d8) dano necrótico.",
        "attackBonus": 2,
        "damage": "1d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/violet-fungus.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/violet-fungus.png",
    "color": "#2F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gargoyle",
    "name": "Gargoyle",
    "nameEn": "Gargoyle",
    "type": "elemental",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 15,
    "hp": 52,
    "hitDice": "7d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 15,
      "dexterity": 11,
      "constitution": 16,
      "intelligence": 6,
      "wisdom": 11,
      "charisma": 7
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Terran",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "False Appearance",
        "description": "While the gargoyle remains motion less, it is indiFerrãouishable from an inanimate statue.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) gargoyle makes two attacks: one with its Mordida and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gargoyle.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gargoyle.png",
    "color": "#2F4F7A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "cat",
    "name": "Gato",
    "nameEn": "Cat",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 2,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 12 m; escalada: 9 m",
    "abilities": {
      "strength": 3,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3, Stealth +4",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) cat has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano cortante.",
        "attackBonus": 0,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/cat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/cat.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ochre-jelly",
    "name": "Geleia Ocre",
    "nameEn": "Ochre Jelly",
    "type": "lodo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 8,
    "hp": 45,
    "hitDice": "6d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 3 m; escalada: 3 m",
    "abilities": {
      "strength": 15,
      "dexterity": 6,
      "constitution": 14,
      "intelligence": 2,
      "wisdom": 6,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 8",
    "languages": "—",
    "damageResistances": "acid",
    "damageImmunities": "lightning, slashing",
    "conditionImmunities": "Cego, enfeitiçado, Cego, Exaustão, amedrontado, caído",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Amorphous",
        "description": "O(a) jelly can move through a space as narrow as 1 inch wide without squeezing.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) jelly can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (2d6 + 2) dano de concussão plus 3 (1d6) dano de ácido.",
        "attackBonus": 4,
        "damage": "2d6+2 + 1d6"
      }
    ],
    "reactions": [
      {
        "name": "Split",
        "description": "When a jelly that is Medium or larger is subjected to lightning or dano cortante, it splits into two new jellies if it has at least 10 hit points. Each new jelly has hit points equal to half the original jelly's, rounded down. New jellies are one size smaller than the original jelly.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ochre-jelly.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ochre-jelly.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "stone-giant",
    "name": "Gigante da Pedra",
    "nameEn": "Stone Giant",
    "type": "gigante",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "neutro",
    "ac": 17,
    "hp": 126,
    "hitDice": "11d12",
    "cr": "7",
    "xp": 2900,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 23,
      "dexterity": 15,
      "constitution": 20,
      "intelligence": 10,
      "wisdom": 12,
      "charisma": 9
    },
    "skills": "Athletics +12, Perception +4",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Giant",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Stone Camouflage",
        "description": "O(a) giant has advantage on Destreza (Stealth) checks made to hide in Rochay terrain.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) giant faz dois ataques de greatClava.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "GreatClava",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 4.5 m, um alvo. Acerto: 19 (3d8 + 6) dano de concussão.",
        "attackBonus": 9,
        "damage": "3d8+6"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +9 para acertar, range 60/72 m, um alvo. Acerto: 28 (4d10 + 6) dano de concussão. If the target is a creature, it must succeed on a DC 17 Força teste de resistência or be knocked caído.",
        "attackBonus": 9,
        "damage": "4d10+6"
      }
    ],
    "reactions": [
      {
        "name": "Rocha Catching",
        "description": "If a Rocha or similar object is hurled at the giant, the giant can, with a successful DC 10 Destreza teste de resistência, catch the missile and take no dano de concussão from it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/stone-giant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/stone-giant.png",
    "color": "#8A5A1E",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "storm-giant",
    "name": "Gigante da Tempestade",
    "nameEn": "Storm Giant",
    "type": "gigante",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e bom",
    "ac": 16,
    "hp": 230,
    "hitDice": "20d12",
    "cr": "13",
    "xp": 10000,
    "speed": "caminhada: 15 m; natação: 15 m",
    "abilities": {
      "strength": 29,
      "dexterity": 14,
      "constitution": 20,
      "intelligence": 16,
      "wisdom": 18,
      "charisma": 18
    },
    "skills": "Arcana +8, Athletics +14, History +8, Perception +9",
    "senses": "Percepção passiva 19",
    "languages": "Comum, Giant",
    "damageResistances": "cold",
    "damageImmunities": "lightning, thunder",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) giant can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) giant's Conjuração Inata ability is Carisma (spell save DC 17). It can innately cast the following spells, requiring no material components:\n\nAt will: detect magic, feather fall, levitate, light\n3/day each: control weather, water breathing",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) giant faz dois ataques de Espada grande.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada grande",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 30 (6d6 + 9) dano cortante.",
        "attackBonus": 14,
        "damage": "6d6+9"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +14 para acertar, range 60/72 m, um alvo. Acerto: 35 (4d12 + 9) dano de concussão.",
        "attackBonus": 14,
        "damage": "4d12+9"
      },
      {
        "name": "Lightning Strike",
        "description": "O(a) giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Destreza teste de resistência, taking 54 (12d8) dano elétrico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "12d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/storm-giant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/storm-giant.png",
    "color": "#8A5A1E",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hill-giant",
    "name": "Gigante das Colinas",
    "nameEn": "Hill Giant",
    "type": "gigante",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "caótico e mau",
    "ac": 13,
    "hp": 105,
    "hitDice": "10d12",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 21,
      "dexterity": 8,
      "constitution": 19,
      "intelligence": 5,
      "wisdom": 9,
      "charisma": 6
    },
    "skills": "Perception +2",
    "senses": "Percepção passiva 12",
    "languages": "Giant",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) giant faz dois ataques de greatClava.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "GreatClava",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo. Acerto: 18 (3d8 + 5) dano de concussão.",
        "attackBonus": 8,
        "damage": "3d8+5"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +8 para acertar, range 60/72 m, um alvo. Acerto: 21 (3d10 + 5) dano de concussão.",
        "attackBonus": 8,
        "damage": "3d10+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hill-giant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hill-giant.png",
    "color": "#8A5A1E",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "cloud-giant",
    "name": "Gigante das Nuvens",
    "nameEn": "Cloud Giant",
    "type": "gigante",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "neutral good (50%) or neutral evil (50%)",
    "ac": 14,
    "hp": 200,
    "hitDice": "16d12",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 27,
      "dexterity": 10,
      "constitution": 22,
      "intelligence": 12,
      "wisdom": 16,
      "charisma": 16
    },
    "skills": "Insight +7, Perception +7",
    "senses": "Percepção passiva 17",
    "languages": "Comum, Giant",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) giant has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) giant's Conjuração Inata ability is Carisma. It can innately cast the following spells, requiring no material components:\n\nAt will: detect magic, fog cloud, light\n3/day each: feather fall, voo, misty step, telekinesis\n1/day each: control weather, gaseous form",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) giant faz dois ataques de Maça-estrela.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Maça-estrela",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 3 m, um alvo. Acerto: 21 (3d8 + 8) dano perfurante.",
        "attackBonus": 12,
        "damage": "3d8+8"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +12 para acertar, range 60/72 m, um alvo. Acerto: 30 (4d10 + 8) dano de concussão.",
        "attackBonus": 12,
        "damage": "4d10+8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/cloud-giant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/cloud-giant.png",
    "color": "#8A5A1E",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "fire-giant",
    "name": "Gigante do Fogo",
    "nameEn": "Fire Giant",
    "type": "gigante",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "leal e mau",
    "ac": 18,
    "hp": 162,
    "hitDice": "13d12",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 25,
      "dexterity": 9,
      "constitution": 23,
      "intelligence": 10,
      "wisdom": 14,
      "charisma": 13
    },
    "skills": "Athletics +11, Perception +6",
    "senses": "Percepção passiva 16",
    "languages": "Giant",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) giant faz dois ataques de Espada grande.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada grande",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 m, um alvo. Acerto: 28 (6d6 + 7) dano cortante.",
        "attackBonus": 11,
        "damage": "6d6+7"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +11 para acertar, range 60/72 m, um alvo. Acerto: 29 (4d10 + 7) dano de concussão.",
        "attackBonus": 11,
        "damage": "4d10+7"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/fire-giant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/fire-giant.png",
    "color": "#8A5A1E",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "frost-giant",
    "name": "Gigante do Gelo",
    "nameEn": "Frost Giant",
    "type": "gigante",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "neutro e mau",
    "ac": 15,
    "hp": 138,
    "hitDice": "12d12",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 23,
      "dexterity": 9,
      "constitution": 21,
      "intelligence": 9,
      "wisdom": 10,
      "charisma": 12
    },
    "skills": "Athletics +9, Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "Giant",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) giant faz dois ataques de Machado grande.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Machado grande",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, um alvo. Acerto: 25 (3d12 + 6) dano cortante.",
        "attackBonus": 9,
        "damage": "3d12+6"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +9 para acertar, range 60/72 m, um alvo. Acerto: 28 (4d10 + 6) dano de concussão.",
        "attackBonus": 9,
        "damage": "4d10+6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/frost-giant.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/frost-giant.png",
    "color": "#8A5A1E",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-rat-diseased",
    "name": "Gigante Rat (Diseased)",
    "nameEn": "Giant Rat (Diseased)",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 7,
    "hitDice": "2d6",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 7,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 4
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) rat has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d4 + 2) dano perfurante. If the target is a creature, it must succeed on a DC 10 Constituição teste de resistência or contract a disease. Until the disease is cured, the target can't regain hit points except by magical means, and the target's hit point maximum decreases by 3 (1d6) every 24 hours. If the target's hit point maximum drops to 0 as a result of this disease, the target dies.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-rat-diseased.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-rat-diseased.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gynosphinx",
    "name": "Ginoesfinge",
    "nameEn": "Gynosphinx",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e neutro",
    "ac": 17,
    "hp": 136,
    "hitDice": "16d10",
    "cr": "11",
    "xp": 7200,
    "speed": "caminhada: 12 m; voo: 18 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 18,
      "wisdom": 18,
      "charisma": 18
    },
    "skills": "Arcana +12, History +12, Perception +8, Religion +8",
    "senses": "visão verdadeira 36 m, Percepção passiva 18",
    "languages": "Comum, Sphinx",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "psychic",
    "conditionImmunities": "enfeitiçado, amedrontado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Inscrutable",
        "description": "O(a) sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Sabedoria (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) sphinx's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) sphinx is a 9th-level spellcaster. Its Conjuração ability is Inteligência (spell save DC 16, +8 para acertar with spell attacks). It requires no material components to cast its spells. O(a) sphinx has the following wizard spells prepared:\n\n- Cantrips (at will): mage hand, minor illusion, prestidigitation\n- 1st level (4 slots): detect magic, identify, shield\n- 2nd level (3 slots): darkness, locate object, suggestion\n- 3rd level (3 slots): dispel magic, remove curse, tongues\n- 4th level (3 slots): banishment, greater invisibility\n- 5th level (1 slot): legend lore",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) sphinx faz dois ataques de Garra.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano cortante.",
        "attackBonus": 9,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Garra Attack",
        "description": "O(a) sphinx makes one Garra attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Teleport (Costs 2 Actions)",
        "description": "O(a) sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cast a Spell (Costs 3 Actions)",
        "description": "O(a) sphinx casts a spell from its list of prepared spells, using a spell slot as normal.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gynosphinx.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gynosphinx.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "glabrezu",
    "name": "Glabrezu",
    "nameEn": "Glabrezu",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 17,
    "hp": 157,
    "hitDice": "15d10",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 20,
      "dexterity": 15,
      "constitution": 21,
      "intelligence": 19,
      "wisdom": 17,
      "charisma": 16
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 13",
    "languages": "Abyssal, telepathy 36 m",
    "damageResistances": "cold, fire, lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração Inata",
        "description": "O(a) glabrezu's Conjuração ability is Inteligência (spell save DC 16). O(a) glabrezu can innately cast the following spells, requiring no material components:\nAt will: darkness, detect magic, dispel magic\n1/day each: confusion, voo, power word stun",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) glabrezu has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) glabrezu makes four attacks: two with its pincers and two with its punhos. Alternatively, it makes two attacks with its pincers and casts one spell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pincer",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, um alvo. Acerto: 16 (2d10 + 5) dano de concussão. If the target is a Medium or smaller creature, it is agarrado (escape DC 15). O(a) glabrezu has two pincers, each of which can grapple only um alvo.",
        "attackBonus": 9,
        "damage": "2d10+5"
      },
      {
        "name": "punho",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d4 + 2) dano de concussão.",
        "attackBonus": 9,
        "damage": "2d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/glabrezu.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/glabrezu.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gladiator",
    "name": "Gladiador",
    "nameEn": "Gladiator",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 16,
    "hp": 112,
    "hitDice": "15d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 10,
      "wisdom": 12,
      "charisma": 15
    },
    "skills": "Athletics +10, Intimidation +5",
    "senses": "Percepção passiva 11",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Brave",
        "description": "O(a) gladiator has advantage on teste de resistências against being amedrontado.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Brute",
        "description": "A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) gladiator faz três ataques de melee or two ranged attacks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +7 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 11 (2d6 + 4) dano perfurante, or 13 (2d8 + 4) dano perfurante if used with two hands to make a melee attack.",
        "attackBonus": 7,
        "damage": null
      },
      {
        "name": "Shield Bash",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, uma criatura. Acerto: 9 (2d4 + 4) dano de concussão. If the target is a Medium or smaller creature, it must succeed on a DC 15 Força teste de resistência or be knocked caído.",
        "attackBonus": 7,
        "damage": "2d4+4"
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "description": "O(a) gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gladiator.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gladiator.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gnoll",
    "name": "Gnoll",
    "nameEn": "Gnoll",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 15,
    "hp": 22,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 14,
      "dexterity": 12,
      "constitution": 11,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 7
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Gnoll",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Rampage",
        "description": "When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a ação bônus to move up to half its speed and make a Mordida attack.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      },
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +4 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante, or 6 (1d8 + 2) dano perfurante if used with two hands to make a melee attack.",
        "attackBonus": 4,
        "damage": null
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +3 para acertar, range 150/180 m, um alvo. Acerto: 5 (1d8 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d8+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gnoll.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gnoll.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "deep-gnome-svirfneblin",
    "name": "Gnomo das Profundezas",
    "nameEn": "Deep Gnome (Svirfneblin)",
    "type": "humanoide",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "neutro e bom",
    "ac": 15,
    "hp": 16,
    "hitDice": "3d6",
    "cr": "0.5",
    "xp": 50,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 12,
      "wisdom": 10,
      "charisma": 9
    },
    "skills": "Investigation +3, Perception +2, Stealth +4",
    "senses": "visão no escuro 36 m, Percepção passiva 12",
    "languages": "Gnomish, Terran, Undercommon",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Stone Camouflage",
        "description": "O(a) gnome has advantage on Destreza (Stealth) checks made to hide in Rochay terrain.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Gnome Cunning",
        "description": "O(a) gnome has advantage on Inteligência, Sabedoria, and Carisma teste de resistências against magic.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) gnome's Conjuração Inata ability is Inteligência (spell save DC 11). It can innately cast the following spells, requiring no material components:\nAt will: nondetection (self only)\n1/day each: blindness/deafness, blur, disguise self",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "War Pick",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      },
      {
        "name": "envenenado Dart",
        "description": "Ataque à distância com arma: +4 para acertar, range 30/36 m, uma criatura. Acerto: 4 (1d4 + 2) dano perfurante, and the target must succeed on a DC 12 Constituição teste de resistência or be envenenado for 1 minute. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/deep-gnome-svirfneblin.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/deep-gnome-svirfneblin.png",
    "color": "#6B4423",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "goblin",
    "name": "Goblin",
    "nameEn": "Goblin",
    "type": "humanoide",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "neutro e mau",
    "ac": 15,
    "hp": 7,
    "hitDice": "2d6",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 8,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 8,
      "charisma": 8
    },
    "skills": "Stealth +6",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "Comum, Goblin",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Fuga Ágil",
        "description": "O(a) goblin can take the Disengage or Hide action as a ação bônus em cada um de seus turnos.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Arco curto",
        "description": "Ataque à distância com arma: +4 para acertar, range 80/96 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/goblin.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/goblin.png",
    "color": "#6B4423",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "clay-golem",
    "name": "Golem de Argila",
    "nameEn": "Clay Golem",
    "type": "constructo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 133,
    "hitDice": "14d10",
    "cr": "9",
    "xp": 5000,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 20,
      "dexterity": 9,
      "constitution": 18,
      "intelligence": 3,
      "wisdom": 8,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "compreende the languages of its creator mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "acid, poison, psychic, bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Acid Absorption",
        "description": "Whenever the golem is subjected to dano de ácido, it takes no damage and instead regains a number of hit points equal to the dano de ácido dealt.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Berserk",
        "description": "Whenever the golem starts its turn with 60 hit points or fewer, roll a d6. On a 6, the golem goes berserk. em cada um de seus turnos while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Forma Imutável",
        "description": "O(a) golem is immune to any spell or effect that would alter its form.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) golem has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) golem's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) golem faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 16 (2d10 + 5) dano de concussão. If the target is a creature, it must succeed on a DC 15 Constituição teste de resistência or have its hit point maximum reduced by an amount equal to the damage taken. O(a) target dies if this attack reduces its hit point maximum to 0. O(a) reduction lasts until removed by the greater restoration spell or other magic.",
        "attackBonus": 8,
        "damage": "2d10+5"
      },
      {
        "name": "Haste",
        "description": "Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Destreza teste de resistências, and can use its Pancada attack as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/clay-golem.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/clay-golem.png",
    "color": "#5A5A5A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "flesh-golem",
    "name": "Golem de Carne",
    "nameEn": "Flesh Golem",
    "type": "constructo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 9,
    "hp": 93,
    "hitDice": "11d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 9,
      "constitution": 18,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "compreende the languages of its creator mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "lightning, poison, bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Berserk",
        "description": "Whenever the golem starts its turn with 40 hit points or fewer, roll a d6. On a 6, the golem goes berserk. em cada um de seus turnos while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.\nO(a) golem's creator, if within 60 feet of the berserk golem, can try to calm it by speaking firmly and persuasively. O(a) golem must be able to hear its creator, who must take an action to make a DC 15 Carisma (Persuasion) check. If the check succeeds, the golem ceases being berserk. If it takes damage while still at 40 hit points or fewer, the golem might go berserk again.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Aversion of Fire",
        "description": "If the golem takes dano de fogo, it has disadvantage on attack rolls and ability checks until the end of its next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Forma Imutável",
        "description": "O(a) golem is immune to any spell or effect that would alter its form.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Lightning Absorption",
        "description": "Whenever the golem is subjected to dano elétrico, it takes no damage and instead regains a number of hit points equal to the dano elétrico dealt.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) golem has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) golem's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) golem faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano de concussão.",
        "attackBonus": 7,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/flesh-golem.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/flesh-golem.png",
    "color": "#5A5A5A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "iron-golem",
    "name": "Golem de Ferro",
    "nameEn": "Iron Golem",
    "type": "constructo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 20,
    "hp": 210,
    "hitDice": "20d10",
    "cr": "16",
    "xp": 15000,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 24,
      "dexterity": 9,
      "constitution": 20,
      "intelligence": 3,
      "wisdom": 11,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 10",
    "languages": "compreende the languages of its creator mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "fire, poison, psychic, bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Fire Absorption",
        "description": "Whenever the golem is subjected to dano de fogo, it takes no damage and instead regains a number of hit points equal to the dano de fogo dealt.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Forma Imutável",
        "description": "O(a) golem is immune to any spell or effect that would alter its form.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) golem has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) golem's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) golem faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 1.5 m, um alvo. Acerto: 20 (3d8 + 7) dano de concussão.",
        "attackBonus": 13,
        "damage": "3d8+7"
      },
      {
        "name": "Sword",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 m, um alvo. Acerto: 23 (3d10 + 7) dano cortante.",
        "attackBonus": 13,
        "damage": "3d10+7"
      },
      {
        "name": "Poison Breath",
        "description": "O(a) golem exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 19 Constituição teste de resistência, taking 45 (10d8) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "10d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/iron-golem.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/iron-golem.png",
    "color": "#5A5A5A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "stone-golem",
    "name": "Golem de Pedra",
    "nameEn": "Stone Golem",
    "type": "constructo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 17,
    "hp": 178,
    "hitDice": "17d10",
    "cr": "10",
    "xp": 5900,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 22,
      "dexterity": 9,
      "constitution": 20,
      "intelligence": 3,
      "wisdom": 11,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 10",
    "languages": "compreende the languages of its creator mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison, psychic, bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Forma Imutável",
        "description": "O(a) golem is immune to any spell or effect that would alter its form.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) golem has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) golem's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) golem faz dois ataques de Pancada.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 19 (3d8 + 6) dano de concussão.",
        "attackBonus": 10,
        "damage": "3d8+6"
      },
      {
        "name": "Slow",
        "description": "O(a) golem targets one or more creatures it can see within 3 m of it. Each target must make a DC 17 Sabedoria teste de resistência against this magic. On a failed save, a target can't use reaçãos, its speed is halved, and it can't make more than one attack on its turn. In addition, the target can take either an action or a ação bônus on its turn, not both. These effects last for 1 minute. A target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/stone-golem.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/stone-golem.png",
    "color": "#5A5A5A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gorgon",
    "name": "Gorgon",
    "nameEn": "Gorgon",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 19,
    "hp": 114,
    "hitDice": "12d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 20,
      "dexterity": 11,
      "constitution": 18,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +4",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "Petrificado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Trampling Charge",
        "description": "If the gorgon moves at least 20 feet straight toward a creature and then hits it with a Chifrada attack on the same turn, that target must succeed on a DC 16 Força teste de resistência or be knocked caído. If the target is caído, the gorgon can make one attack with its hooves against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Chifrada",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 18 (2d12 + 5) dano perfurante.",
        "attackBonus": 8,
        "damage": "2d12+5"
      },
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1.5 m, um alvo. Acerto: 16 (2d10 + 5) dano de concussão.",
        "attackBonus": 8,
        "damage": "2d10+5"
      },
      {
        "name": "Petrifying Breath",
        "description": "O(a) gorgon exhales petrifying gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constituição teste de resistência. On a failed save, a target begins to turn to stone and is impedido. O(a) impedido target must repeat the teste de resistência at the end of its next turn. On a success, the effect ends on the target. On a failure, the target is Petrificado until freed by the greater restoration spell or other magic.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gorgon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gorgon.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "grick",
    "name": "Grick",
    "nameEn": "Grick",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 14,
    "hp": 27,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 14,
      "dexterity": 14,
      "constitution": 11,
      "intelligence": 3,
      "wisdom": 14,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Stone Camouflage",
        "description": "O(a) grick has advantage on Destreza (Stealth) checks made to hide in Rochay terrain.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) grick makes one attack with its Tentáculos. If that attack hits, the grick can make one beak attack against the same target.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Tentáculos",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (2d6 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "2d6+2"
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/grick.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/grick.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "griffon",
    "name": "Grifo",
    "nameEn": "Griffon",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 59,
    "hitDice": "7d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m; voo: 24 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 2,
      "wisdom": 13,
      "charisma": 8
    },
    "skills": "Perception +5",
    "senses": "visão no escuro 18 m, Percepção passiva 15",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada",
        "description": "O(a) griffon has advantage on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) griffon makes two attacks: one with its beak and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d8 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d8+4"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 6,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/griffon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/griffon.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "grimlock",
    "name": "Grimlock",
    "nameEn": "Grimlock",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 11,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 9,
      "wisdom": 8,
      "charisma": 6
    },
    "skills": "Athletics +5, Perception +3, Stealth +3",
    "senses": "visão às cegas 9 m or 3 m while deafened (blind beyond this radius), Percepção passiva 13",
    "languages": "Undercommon",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "Cego",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Blind Senses",
        "description": "O(a) grimlock can't use its visão às cegas while Surdo and unable to smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) grimlock has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Stone Camouflage",
        "description": "O(a) grimlock has advantage on Destreza (Stealth) checks made to hide in Rochay terrain.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Spiked Bone Clava",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d4 + 3) dano de concussão plus 2 (1d4) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d4+3 + 1d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/grimlock.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/grimlock.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "guard",
    "name": "Guarda",
    "nameEn": "Guard",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 16,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 13,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Perception +2",
    "senses": "Percepção passiva 12",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +3 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 4 (1d6 + 1) dano perfurante or 5 (1d8 + 1) dano perfurante if used with two hands to make a melee attack.",
        "attackBonus": 3,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/guard.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/guard.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "shield-guardian",
    "name": "Guardião de Escudo",
    "nameEn": "Shield Guardian",
    "type": "constructo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 17,
    "hp": 142,
    "hitDice": "15d10",
    "cr": "7",
    "xp": 2900,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 8,
      "constitution": 18,
      "intelligence": 7,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 10",
    "languages": "compreende commands given in any language mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Bound",
        "description": "O(a) shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet's wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60 feet of the amulet's wearer, half of any damage the wearer takes (rounded up) is transferred to the guardian.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Regeneration",
        "description": "O(a) shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit. point.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spell Storing",
        "description": "A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. O(a) spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises that was predefined by the spellcaster, the guardian casts the stored spell with any parameters set by the original caster, requiring no components. When the spell is cast or a new spell is stored, any previously stored spell is lost.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) guardian faz dois ataques de punho.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "punho",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão.",
        "attackBonus": 7,
        "damage": "2d6+4"
      }
    ],
    "reactions": [
      {
        "name": "Shield",
        "description": "When a creature makes an attack against the wearer of the guardian's amulet, the guardian grants a +2 bonus to the wearer's AC if the guardian is within 5 feet of the wearer.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/shield-guardian.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/shield-guardian.png",
    "color": "#5A5A5A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "tribal-warrior",
    "name": "Guerreiro Tribal",
    "nameEn": "Tribal Warrior",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 12,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 13,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 8,
      "wisdom": 11,
      "charisma": 8
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "any one language",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Táticas de Bando",
        "description": "O(a) warrior has advantage on an attack roll against a creature if at least one of the warrior's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +3 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 4 (1d6 + 1) dano perfurante, or 5 (1d8 + 1) dano perfurante if used with two hands to make a melee attack.",
        "attackBonus": 3,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/tribal-warrior.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/tribal-warrior.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "harpy",
    "name": "Harpia",
    "nameEn": "Harpy",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 11,
    "hp": 38,
    "hitDice": "7d8",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 6 m; voo: 12 m",
    "abilities": {
      "strength": 12,
      "dexterity": 13,
      "constitution": 12,
      "intelligence": 7,
      "wisdom": 10,
      "charisma": 13
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) harpy makes two attacks: one with its Garras and one with its Clava.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (2d4 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "2d4+1"
      },
      {
        "name": "Clava",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d4 + 1) dano de concussão.",
        "attackBonus": 3,
        "damage": "1d4+1"
      },
      {
        "name": "Luring Song",
        "description": "O(a) harpy sings a magical melody. Every humanoid and giant within 90 m of the harpy that can hear the song must succeed on a DC 11 Sabedoria teste de resistência or be enfeitiçado until the song ends. O(a) harpy must take a ação bônus on its subsequent turns to continue singing. It can stop singing at any time. O(a) song ends if the harpy is incapacitated.\nWhile enfeitiçado by the harpy, a target is incapacitated and ignores the songs of other harpies. If the enfeitiçado target is more than 1.5 m away from the harpy, the must move on its turn toward the harpy by the most direct route. It doesn't avoid opportunity attacks, but before moving into damaging terrain, such as lava or a pit, and whenever it takes damage from a source other than the harpy, a target can repeat the teste de resistência. A creature can also repeat the teste de resistência at the end of each of its turns. If a creature's teste de resistência is successful, the effect ends on it.\nA target that successfully saves is immune to this harpy's song for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/harpy.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/harpy.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hezrou",
    "name": "Hezrou",
    "nameEn": "Hezrou",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 16,
    "hp": 136,
    "hitDice": "13d10",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 17,
      "constitution": 20,
      "intelligence": 5,
      "wisdom": 12,
      "charisma": 13
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 11",
    "languages": "Abyssal, telepathy 36 m",
    "damageResistances": "cold, fire, lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência à Magia",
        "description": "O(a) hezrou has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Stench",
        "description": "Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constituição teste de resistência or be envenenado until the start of its next turn. On a successful teste de resistência, the creature is immune to the hezrou's stench for 24 hours.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) hezrou makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "2d10+4"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hezrou.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hezrou.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hydra",
    "name": "Hidra",
    "nameEn": "Hydra",
    "type": "monstruosidade",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 15,
    "hp": 172,
    "hitDice": "15d12",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 20,
      "dexterity": 12,
      "constitution": 20,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 7
    },
    "skills": "Perception +6",
    "senses": "visão no escuro 18 m, Percepção passiva 16",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hold Breath",
        "description": "O(a) hydra can hold its breath for 1 hour.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Multiple Heads",
        "description": "O(a) hydra has five heads. While it has more than one head, the hydra has advantage on teste de resistências against being Cego, enfeitiçado, Surdo, amedrontado, atordoado, and knocked unconscious.\nWhenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies.\nAt the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken dano de fogo since its last turn. O(a) hydra regains 10 hit points for each head regrown in this way.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Reactive Heads",
        "description": "For each head the hydra has beyond one, it gets an extra reação that can be used only for opportunity attacks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Wakeful",
        "description": "While the hydra sleeps, at least one of its heads is awake.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) hydra makes as many Mordida attacks as it has heads.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, um alvo. Acerto: 10 (1d10 + 5) dano perfurante.",
        "attackBonus": 8,
        "damage": "1d10+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hydra.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hydra.png",
    "color": "#4A2F18",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hyena",
    "name": "Hiena",
    "nameEn": "Hyena",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 5,
    "hitDice": "1d8",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 11,
      "dexterity": 13,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 5
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Táticas de Bando",
        "description": "O(a) hyena has advantage on an attack roll against a creature if at least one of the hyena's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d6) dano perfurante.",
        "attackBonus": 2,
        "damage": "1d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hyena.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hyena.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-hyena",
    "name": "Hiena Gigante",
    "nameEn": "Giant Hyena",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 45,
    "hitDice": "6d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 16,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Rampage",
        "description": "When the hyena reduces a creature to 0 hit points with a melee attack on its turn, the hyena can take a ação bônus to move up to half its speed and make a Mordida attack.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-hyena.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-hyena.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hippogriff",
    "name": "Hipogrifo",
    "nameEn": "Hippogriff",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 12 m; voo: 18 m",
    "abilities": {
      "strength": 17,
      "dexterity": 13,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 8
    },
    "skills": "Perception +5",
    "senses": "Percepção passiva 15",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada",
        "description": "O(a) hippogriff has advantage on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) hippogriff makes two attacks: one with its beak and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d10 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d10+3"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hippogriff.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hippogriff.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hobgoblin",
    "name": "Hobgoblin",
    "nameEn": "Hobgoblin",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 18,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 13,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 9
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Comum, Goblin",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Martial Advantage",
        "description": "Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 1.5 m of an ally of the hobgoblin that isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d8 + 1) dano cortante, or 6 (1d10 + 1) dano cortante if used with two hands.",
        "attackBonus": 3,
        "damage": null
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +3 para acertar, range 150/180 m, um alvo. Acerto: 5 (1d8 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d8+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hobgoblin.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hobgoblin.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "lizardfolk",
    "name": "Homem-Lagarto",
    "nameEn": "Lizardfolk",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 15,
    "hp": 22,
    "hitDice": "4d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 10,
      "constitution": 13,
      "intelligence": 7,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3, Stealth +4, Survival +5",
    "senses": "Percepção passiva 13",
    "languages": "Draconic",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hold Breath",
        "description": "O(a) lizardfolk can hold its breath for 15 minutes.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) lizardfolk faz dois ataques de melee, each one with a different weapon.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Heavy Clava",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano de concussão.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Dardo",
        "description": "Melee or Ataque à distância com arma: +4 para acertar, alcance 1.5 m or range 30/36 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Spiked Shield",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/lizardfolk.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/lizardfolk.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "merfolk",
    "name": "Homem-Peixe",
    "nameEn": "Merfolk",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 11,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 3 m; natação: 12 m",
    "abilities": {
      "strength": 10,
      "dexterity": 13,
      "constitution": 12,
      "intelligence": 11,
      "wisdom": 11,
      "charisma": 12
    },
    "skills": "Perception +2",
    "senses": "Percepção passiva 12",
    "languages": "Aquan, Comum",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) merfolk can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +2 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 3 (1d6) dano perfurante, or 4 (1d8) dano perfurante if used with two hands to make a melee attack.",
        "attackBonus": 2,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/merfolk.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/merfolk.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "homunculus",
    "name": "Homúnculo",
    "nameEn": "Homunculus",
    "type": "constructo",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "neutro",
    "ac": 13,
    "hp": 5,
    "hitDice": "2d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 6 m; voo: 12 m",
    "abilities": {
      "strength": 4,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 7
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "compreende the languages of its creator mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "enfeitiçado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Telepathic Bond",
        "description": "While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 1 dano perfurante, and the target must succeed on a DC 10 Constituição teste de resistência or be envenenado for 1 minute. If the teste de resistência fails by 5 or more, the target is instead envenenado for 5 (1d10) minutes and unconscious while envenenado in this way.",
        "attackBonus": 4,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/homunculus.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/homunculus.png",
    "color": "#5A5A5A",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "boar",
    "name": "Javali",
    "nameEn": "Boar",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 13,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 9,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the boar moves at least 6 m straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) dano cortante. If the target is a creature, it must succeed on a DC 11 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": "1d6"
      },
      {
        "name": "Relentless",
        "description": "If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Tusk",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "1d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/boar.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/boar.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-boar",
    "name": "Javali Gigante",
    "nameEn": "Giant Boar",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 42,
    "hitDice": "5d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 17,
      "dexterity": 10,
      "constitution": 16,
      "intelligence": 2,
      "wisdom": 7,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 8",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the boar moves at least 6 m straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) dano cortante. If the target is a creature, it must succeed on a DC 13 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Relentless",
        "description": "If the boar takes 10 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Tusk",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-boar.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-boar.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "kobold",
    "name": "Kobold",
    "nameEn": "Kobold",
    "type": "humanoide",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "leal e mau",
    "ac": 12,
    "hp": 5,
    "hitDice": "2d6",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 7,
      "dexterity": 15,
      "constitution": 9,
      "intelligence": 8,
      "wisdom": 7,
      "charisma": 8
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 8",
    "languages": "Comum, Draconic",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Sunlight Sensitivity",
        "description": "While in sunlight, the kobold has disadvantage on attack rolls, as well as on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) kobold has advantage on an attack roll against a creature if at least one of the kobold's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Adaga",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      },
      {
        "name": "Sling",
        "description": "Ataque à distância com arma: +4 para acertar, range 30/36 m, um alvo. Acerto: 4 (1d4 + 2) dano de concussão.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/kobold.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/kobold.png",
    "color": "#6B4423",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "kraken",
    "name": "Kraken",
    "nameEn": "Kraken",
    "type": "monstruosidade",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "caótico e mau",
    "ac": 18,
    "hp": 472,
    "hitDice": "27d20",
    "cr": "23",
    "xp": 50000,
    "speed": "caminhada: 6 m; natação: 18 m",
    "abilities": {
      "strength": 30,
      "dexterity": 11,
      "constitution": 25,
      "intelligence": 22,
      "wisdom": 18,
      "charisma": 20
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 14",
    "languages": "compreende Abyssal, Celestial, Infernal, and Primordial mas não pode falar, telepathy 36 m",
    "damageResistances": "—",
    "damageImmunities": "lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "conditionImmunities": "amedrontado, paralisado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) kraken can breathe air and water.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Freedom of Movement",
        "description": "O(a) kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be impedido. It can spend 5 feet of movement to escape from nonmagical restraints or being agarrado.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Siege Monster",
        "description": "O(a) kraken deals double damage to objects and structures.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) kraken faz três ataques de Tentáculo, each of which it can replace with one use of Fling.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 23 (3d8 + 10) dano perfurante. If the target is a Large or smaller creature agarrado by the kraken, that creature is swallowed, and the grapple ends. While swallowed, the creature is Cego and impedido, it has total cover against attacks and other effects outside the kraken, and it takes 42 (12d6) dano de ácido at the start of each of the kraken's turns. If the kraken takes 50 damage or more on a single turn from a creature inside it, the kraken must succeed on a DC 25 Constituição teste de resistência at the end of that turn or regurgitate all swallowed creatures, which fall caído in a space within 10 feet of the kraken. If the kraken dies, a swallowed creature is no longer impedido by it and can escape from the corpse using 15 feet of movement, exiting caído.",
        "attackBonus": 7,
        "damage": "3d8+10"
      },
      {
        "name": "Tentáculo",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 9 m, um alvo. Acerto: 20 (3d6 + 10) dano de concussão, and the target is agarrado (escape DC 18). Until this grapple ends, the target is impedido. O(a) kraken has ten Tentáculos, each of which can grapple um alvo.",
        "attackBonus": 7,
        "damage": "3d6+10"
      },
      {
        "name": "Fling",
        "description": "One Large or smaller object held or creature agarrado by the kraken is thrown up to 60 feet in a random direction and knocked caído. If a thrown target strikes a solid surface, the target takes 3 (1d6) dano de concussão for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 18 Destreza teste de resistência or take the same damage and be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Lightning Storm",
        "description": "O(a) kraken magically creates three bolts of lightning, each of which can strike a target the kraken can see within 120 feet of it. A target must make a DC 23 Destreza teste de resistência, taking 22 (4d10) dano elétrico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "4d10"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Tentáculo Attack or Fling",
        "description": "O(a) kraken makes one Tentáculo attack or uses its Fling.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Lightning Storm (Costs 2 Actions)",
        "description": "O(a) kraken uses Lightning Storm.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Ink Cloud (Costs 3 Actions)",
        "description": "While underwater, the kraken expels an ink cloud in a 60-foot radius. O(a) cloud spreads around corners, and that area is heavily obscured to creatures other than the kraken. Each creature other than the kraken that ends its turn there must succeed on a DC 23 Constituição teste de resistência, taking 16 (3d10) dano de veneno on a failed save, or half as much damage on a successful one. A strong current disperses the cloud, which otherwise disappears at the end of the kraken's next turn.",
        "attackBonus": null,
        "damage": "3d10"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/kraken.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/kraken.png",
    "color": "#4A2F18",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "lizard",
    "name": "Lagarto",
    "nameEn": "Lizard",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 2,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 6 m; escalada: 6 m",
    "abilities": {
      "strength": 2,
      "dexterity": 11,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 8,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão no escuro 9 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano perfurante.",
        "attackBonus": 0,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/lizard.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/lizard.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-lizard",
    "name": "Lagarto Gigante",
    "nameEn": "Giant Lizard",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 19,
    "hitDice": "3d10",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 9 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-lizard.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-lizard.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "lamia",
    "name": "Lâmia",
    "nameEn": "Lamia",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 13,
    "hp": 97,
    "hitDice": "13d10",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 13,
      "constitution": 15,
      "intelligence": 14,
      "wisdom": 15,
      "charisma": 16
    },
    "skills": "Deception +7, Insight +4, Stealth +3",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "Abyssal, Comum",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração Inata",
        "description": "O(a) lamia's Conjuração Inata ability is Carisma (spell save DC 13). It can innately cast the following spells, requiring no material components. At will: disguise self (any humanoid form), major image 3/day each: charm person, mirror image, scrying, suggestion 1/day: geas",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) lamia makes two attacks: one with its Garras and one with its Adaga or Intoxicating Touch.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d10 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "2d10+3"
      },
      {
        "name": "Adaga",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d4 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d4+3"
      },
      {
        "name": "Intoxicating Touch",
        "description": "Ataque corpo a corpo com magia: +5 para acertar, alcance 1.5 m, uma criatura. Acerto: O(a) target is magically cursed for 1 hour. Until the curse ends, the target has disadvantage on Sabedoria teste de resistências and all ability checks.",
        "attackBonus": 5,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/lamia.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/lamia.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "lion",
    "name": "Leão",
    "nameEn": "Lion",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 26,
    "hitDice": "4d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 13,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 8
    },
    "skills": "Perception +3, Stealth +6",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) lion has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) lion has advantage on an attack roll against a creature if at least one of the lion's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pounce",
        "description": "If the lion moves at least 6 m straight toward a creature and then hits it with a Garra attack on the same turn, that target must succeed on a DC 13 Força teste de resistência or be knocked caído. If the target is caído, the lion can make one Mordida attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Running Leap",
        "description": "With a 10-foot running start, the lion can long jump up to 7.5 m.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d8+3"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/lion.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/lion.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "lemure",
    "name": "Lêmure",
    "nameEn": "Lemure",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 7,
    "hp": 13,
    "hitDice": "3d8",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 4.5 m",
    "abilities": {
      "strength": 10,
      "dexterity": 5,
      "constitution": 11,
      "intelligence": 1,
      "wisdom": 11,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 10",
    "languages": "compreende infernal mas não pode falar",
    "damageResistances": "cold",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "enfeitiçado, amedrontado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Devil's Sight",
        "description": "Magical darkness doesn't impede the lemure's visão no escuro.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Hellish Rejuvenation",
        "description": "A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a bless spell cast on that creature or its remains are sprinkled with holy water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "punho",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 2 (1d4) dano de concussão.",
        "attackBonus": 3,
        "damage": "1d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/lemure.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/lemure.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "werebear-bear",
    "name": "Licantropo bear, Bear Form",
    "nameEn": "Werebear, Bear Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e bom",
    "ac": 11,
    "hp": 135,
    "hitDice": "18d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 12 m; escalada: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 11,
      "wisdom": 12,
      "charisma": 12
    },
    "skills": "Perception +7",
    "senses": "Percepção passiva 17",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Olfato Aguçado",
        "description": "O(a) werebear has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "In bear form, the werebear faz dois ataques de Garra. In humanoid form, it faz dois ataques de Machado grande. In hybrid form, it can attack like a bear or a humanoid.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante. If the target is a humanoid, it must succeed on a DC 14 Constituição teste de resistência or be cursed with werebear lycanthropy.",
        "attackBonus": 7,
        "damage": "2d10+4"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/werebear-bear.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/werebear-bear.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "werebear-human",
    "name": "Licantropo bear, Human Form",
    "nameEn": "Werebear, Human Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e bom",
    "ac": 10,
    "hp": 135,
    "hitDice": "18d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 11,
      "wisdom": 12,
      "charisma": 12
    },
    "skills": "Perception +7",
    "senses": "Percepção passiva 17",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Olfato Aguçado",
        "description": "O(a) werebear has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "In bear form, the werebear faz dois ataques de Garra. In humanoid form, it faz dois ataques de Machado grande. In hybrid form, it can attack like a bear or a humanoid.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Machado grande",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (1d12 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "1d12+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/werebear-human.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/werebear-human.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "werebear-hybrid",
    "name": "Licantropo bear, Hybrid Form",
    "nameEn": "Werebear, Hybrid Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e bom",
    "ac": 11,
    "hp": 135,
    "hitDice": "18d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 12 m; escalada: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 11,
      "wisdom": 12,
      "charisma": 12
    },
    "skills": "Perception +7",
    "senses": "Percepção passiva 17",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Olfato Aguçado",
        "description": "O(a) werebear has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "In bear form, the werebear faz dois ataques de Garra. In humanoid form, it faz dois ataques de Machado grande. In hybrid form, it can attack like a bear or a humanoid.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 15 (2d10 + 4) dano perfurante. If the target is a humanoid, it must succeed on a DC 14 Constituição teste de resistência or be cursed with werebear lycanthropy.",
        "attackBonus": 7,
        "damage": "2d10+4"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d8+4"
      },
      {
        "name": "Machado grande",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (1d12 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "1d12+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/werebear-hybrid.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/werebear-hybrid.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wereboar-boar",
    "name": "Licantropo boar, Boar Form",
    "nameEn": "Wereboar, Boar Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 11,
    "hp": 78,
    "hitDice": "12d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 17,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 8
    },
    "skills": "Perception +2",
    "senses": "Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Charge (Boar or Hybrid Form Only)",
        "description": "If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) dano cortante. If the target is a creature, it must succeed on a DC 13 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Relentless",
        "description": "If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Tusks",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante. If the target is a humanoid, it must succeed on a DC 12 Constituição teste de resistência or be cursed with wereboar lycanthropy.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wereboar-boar.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wereboar-boar.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wereboar-human",
    "name": "Licantropo boar, Human Form",
    "nameEn": "Wereboar, Human Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 10,
    "hp": 78,
    "hitDice": "12d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 17,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 8
    },
    "skills": "Perception +2",
    "senses": "Percepção passiva 12",
    "languages": "Comum (Não pode falar in boar form)",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Relentless",
        "description": "If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) wereboar makes two attacks, only one of which can be with its tusks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Maul",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wereboar-human.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wereboar-human.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wereboar-hybrid",
    "name": "Licantropo boar, Hybrid Form",
    "nameEn": "Wereboar, Hybrid Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 11,
    "hp": 78,
    "hitDice": "12d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 17,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 8
    },
    "skills": "Perception +2",
    "senses": "Percepção passiva 12",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Charge (Boar or Hybrid Form Only)",
        "description": "If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) dano cortante. If the target is a creature, it must succeed on a DC 13 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Relentless",
        "description": "If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) wereboar makes two attacks, only one of which can be with its tusks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Maul",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "2d6+3"
      },
      {
        "name": "Tusks",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano cortante. If the target is a humanoid, it must succeed on a DC 12 Constituição teste de resistência or be cursed with wereboar lycanthropy.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wereboar-hybrid.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wereboar-hybrid.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wererat-human",
    "name": "Licantropo rat, Human Form",
    "nameEn": "Wererat, Human Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 12,
    "hp": 33,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 8
    },
    "skills": "Perception +2, Stealth +4",
    "senses": "Percepção passiva 12",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Olfato Aguçado",
        "description": "O(a) wererat has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) wererat makes two attacks, only one of which can be a Mordida.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Hand Besta",
        "description": "Ataque à distância com arma: +4 para acertar, range 30/36 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wererat-human.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wererat-human.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wererat-hybrid",
    "name": "Licantropo rat, Hybrid Form",
    "nameEn": "Wererat, Hybrid Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 12,
    "hp": 33,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 8
    },
    "skills": "Perception +2, Stealth +4",
    "senses": "Percepção passiva 12",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Olfato Aguçado",
        "description": "O(a) wererat has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) wererat makes two attacks, only one of which can be a Mordida.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante. If the target is a humanoid, it must succeed on a DC 11 Constituição teste de resistência or be cursed with wererat lycanthropy.",
        "attackBonus": 4,
        "damage": "1d4+2"
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Hand Besta",
        "description": "Ataque à distância com arma: +4 para acertar, range 30/36 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wererat-hybrid.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wererat-hybrid.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wererat-rat",
    "name": "Licantropo rat, Rat Form",
    "nameEn": "Wererat, Rat Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 12,
    "hp": 33,
    "hitDice": "6d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 8
    },
    "skills": "Perception +2, Stealth +4",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Olfato Aguçado",
        "description": "O(a) wererat has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante. If the target is a humanoid, it must succeed on a DC 11 Constituição teste de resistência or be cursed with wererat lycanthropy.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wererat-rat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wererat-rat.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "weretiger-human",
    "name": "Licantropo tiger, Human Form",
    "nameEn": "Weretiger, Human Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 12,
    "hp": 120,
    "hitDice": "16d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 11
    },
    "skills": "Perception +5, Stealth +4",
    "senses": "visão no escuro 18 m, Percepção passiva 15",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) weretiger has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "In humanoid form, the weretiger faz dois ataques de Cimitarra or two Arco longo attacks. In hybrid form, it can attack like a humanoid or make two Garra attacks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +4 para acertar, range 150/180 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/weretiger-human.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/weretiger-human.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "weretiger-hybrid",
    "name": "Licantropo tiger, Hybrid Form",
    "nameEn": "Weretiger, Hybrid Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 12,
    "hp": 120,
    "hitDice": "16d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 11
    },
    "skills": "Perception +5, Stealth +4",
    "senses": "visão no escuro 18 m, Percepção passiva 15",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) weretiger has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pounce",
        "description": "If the weretiger moves at least 15 feet straight toward a creature and then hits it with a Garra attack on the same turn, that target must succeed on a DC 14 Força teste de resistência or be knocked caído. If the target is caído, the weretiger can make one Mordida attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "In humanoid form, the weretiger faz dois ataques de Cimitarra or two Arco longo attacks. In hybrid form, it can attack like a humanoid or make two Garra attacks.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d10 + 3) dano perfurante. If the target is a humanoid, it must succeed on a DC 13 Constituição teste de resistência or be cursed with weretiger lycanthropy.",
        "attackBonus": 5,
        "damage": "1d10+3"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d8+3"
      },
      {
        "name": "Cimitarra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +4 para acertar, range 150/180 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/weretiger-hybrid.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/weretiger-hybrid.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "weretiger-tiger",
    "name": "Licantropo tiger, Tiger Form",
    "nameEn": "Weretiger, Tiger Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 12,
    "hp": 120,
    "hitDice": "16d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 11
    },
    "skills": "Perception +5, Stealth +4",
    "senses": "visão no escuro 18 m, Percepção passiva 15",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) weretiger has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pounce",
        "description": "If the weretiger moves at least 15 feet straight toward a creature and then hits it with a Garra attack on the same turn, that target must succeed on a DC 14 Força teste de resistência or be knocked caído. If the target is caído, the weretiger can make one Mordida attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d10 + 3) dano perfurante. If the target is a humanoid, it must succeed on a DC 13 Constituição teste de resistência or be cursed with weretiger lycanthropy.",
        "attackBonus": 5,
        "damage": "1d10+3"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d8+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/weretiger-tiger.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/weretiger-tiger.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "werewolf-human",
    "name": "Licantropo wolf, Human Form",
    "nameEn": "Werewolf, Human Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 11,
    "hp": 58,
    "hitDice": "9d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) werewolf has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) werewolf makes two attacks: two with its Lança (humanoid form) or one with its Mordida and one with its Garras (hybrid form).",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +4 para acertar, alcance 1.5 m or range 20/18 m, uma criatura. Acerto: 5 (1d6 + 2) dano perfurante, or 6 (1d8 + 2) dano perfurante if used with two hands to make a melee attack.",
        "attackBonus": 4,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/werewolf-human.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/werewolf-human.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "werewolf-hybrid",
    "name": "Licantropo wolf, Hybrid Form",
    "nameEn": "Werewolf, Hybrid Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 12,
    "hp": 58,
    "hitDice": "9d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) werewolf has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) werewolf makes two attacks: two with its Lança (humanoid form) or one with its Mordida and one with its Garras (hybrid form).",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante. If the target is a humanoid, it must succeed on a DC 12 Constituição teste de resistência or be cursed with werewolf lycanthropy.",
        "attackBonus": 4,
        "damage": "1d8+2"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 7 (2d4 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "2d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/werewolf-hybrid.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/werewolf-hybrid.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "werewolf-wolf",
    "name": "Licantropo wolf, Wolf Form",
    "nameEn": "Werewolf, Wolf Form",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 12,
    "hp": 58,
    "hitDice": "9d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 15,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) werewolf has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante. If the target is a humanoid, it must succeed on a DC 12 Constituição teste de resistência or be cursed with werewolf lycanthropy.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/werewolf-wolf.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/werewolf-wolf.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "lich",
    "name": "Lich",
    "nameEn": "Lich",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any evil alignment",
    "ac": 17,
    "hp": 135,
    "hitDice": "18d8",
    "cr": "21",
    "xp": 33000,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 16,
      "constitution": 16,
      "intelligence": 20,
      "wisdom": 14,
      "charisma": 16
    },
    "skills": "Arcana +18, History +12, Insight +9, Perception +9",
    "senses": "visão verdadeira 36 m, Percepção passiva 19",
    "languages": "Comum plus up to five other languages",
    "damageResistances": "cold, lightning, necrotic",
    "damageImmunities": "poison, bludgeoning, piercing, and slashing from nonmagical weapons",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Rejuvenation",
        "description": "If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. O(a) new body appears within 5 feet of the phylactery.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) lich is an 18th-level spellcaster. Its Conjuração ability is Inteligência (spell save DC 20, +12 para acertar with spell attacks). O(a) lich has the following wizard spells prepared:\n\n- Cantrips (at will): mage hand, prestidigitation, ray of frost\n- 1st level (4 slots): detect magic, magic missile, shield, thunderwave\n- 2nd level (3 slots): acid arrow, detect thoughts, invisibility, mirror image\n- 3rd level (3 slots): animate dead, counterspell, dispel magic, fireball\n- 4th level (3 slots): blight, dimension door\n- 5th level (3 slots): cloudkill, scrying\n- 6th level (1 slot): disintegrate, globe of invulnerability\n- 7th level (1 slot): finger of death, plane shift\n- 8th level (1 slot): dominate monster, power word stun\n- 9th level (1 slot): power word kill",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Turn Resistance",
        "description": "O(a) lich has advantage on teste de resistências against any effect that turns undead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Paralyzing Touch",
        "description": "Ataque corpo a corpo com magia: +12 para acertar, alcance 1.5 m, uma criatura. Acerto: 10 (3d6) dano de frio. O(a) target must succeed on a DC 18 Constituição teste de resistência or be paralisado for 1 minute. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 12,
        "damage": "3d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Cantrip",
        "description": "O(a) lich casts a cantrip.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Paralyzing Touch (Costs 2 Actions)",
        "description": "O(a) lich uses its Paralyzing Touch.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Frightening Gaze (Costs 2 Actions)",
        "description": "O(a) lich fixes its gaze on uma criatura it can see within 10 feet of it. O(a) target must succeed on a DC 18 Sabedoria teste de resistência against this magic or become amedrontado for 1 minute. O(a) amedrontado target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a target's teste de resistência is successful or the effect ends for it, the target is immune to the lich's gaze for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Disrupt Life (Costs 3 Actions)",
        "description": "Each living creature within 20 feet of the lich must make a DC 18 Constituição teste de resistência against this magic, taking 21 (6d6) dano necrótico on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "6d6"
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/lich.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/lich.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wolf",
    "name": "Lobo",
    "nameEn": "Wolf",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 12,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "Perception +3, Stealth +4",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) wolf has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d4 + 2) dano perfurante. If the target is a creature, it must succeed on a DC 11 Força teste de resistência or be knocked caído.",
        "attackBonus": 4,
        "damage": "2d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wolf.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wolf.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "winter-wolf",
    "name": "Lobo do Inverno",
    "nameEn": "Winter Wolf",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e mau",
    "ac": 13,
    "hp": 75,
    "hitDice": "10d10",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 18,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 7,
      "wisdom": 12,
      "charisma": 8
    },
    "skills": "Perception +5, Stealth +3",
    "senses": "Percepção passiva 15",
    "languages": "Comum, Giant, Winter Wolf",
    "damageResistances": "—",
    "damageImmunities": "cold",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) wolf has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Snow Camouflage",
        "description": "O(a) wolf has advantage on Destreza (Stealth) checks made to hide in snowy terrain.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano perfurante. If the target is a creature, it must succeed on a DC 14 Força teste de resistência or be knocked caído.",
        "attackBonus": 6,
        "damage": "2d6+4"
      },
      {
        "name": "Cold Breath",
        "description": "O(a) wolf exhales a blast of freezing wind in a 15-foot cone. Each creature in that area must make a DC 12 Destreza teste de resistência, taking 18 (4d8) dano de frio on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "4d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/winter-wolf.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/winter-wolf.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "dire-wolf",
    "name": "Lobo Terrível",
    "nameEn": "Dire Wolf",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 37,
    "hitDice": "5d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 15,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3, Stealth +4",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) wolf has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano perfurante. If the target is a creature, it must succeed on a DC 13 Força teste de resistência or be knocked caído.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/dire-wolf.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/dire-wolf.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "gray-ooze",
    "name": "Lodo Cinzento",
    "nameEn": "Gray Ooze",
    "type": "lodo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 8,
    "hp": 22,
    "hitDice": "3d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 3 m; escalada: 3 m",
    "abilities": {
      "strength": 12,
      "dexterity": 6,
      "constitution": 16,
      "intelligence": 1,
      "wisdom": 6,
      "charisma": 2
    },
    "skills": "Stealth +2",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 8",
    "languages": "—",
    "damageResistances": "acid, cold, fire",
    "damageImmunities": "—",
    "conditionImmunities": "Cego, enfeitiçado, Surdo, Exaustão, amedrontado, caído",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Amorphous",
        "description": "O(a) ooze can move through a space as narrow as 1 inch wide without squeezing.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Corrode Metal",
        "description": "Any nonmagical weapon made of metal that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the ooze is destroyed after dealing damage.\nO(a) ooze can eat through 2-inch-thick, nonmagical metal in 1 round.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "False Appearance",
        "description": "While the ooze remains motionless, it is indiFerrãouishable from an oily pool or wet Rocha.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano de concussão plus 7 (2d6) dano de ácido, and if the target is wearing nonmagical metal armor, its armor is partly corroded and takes a permanent and cumulative -1 penalty to the AC it offers. O(a) armor is destroyed if the penalty reduces its AC to 10.",
        "attackBonus": 3,
        "damage": "1d6+1 + 2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/gray-ooze.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/gray-ooze.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "mummy-lord",
    "name": "Lorde Múmia",
    "nameEn": "Mummy Lord",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 17,
    "hp": 97,
    "hitDice": "13d8",
    "cr": "15",
    "xp": 13000,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 18,
      "dexterity": 10,
      "constitution": 17,
      "intelligence": 11,
      "wisdom": 18,
      "charisma": 16
    },
    "skills": "History +5, Religion +5",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "the languages it knew in life",
    "damageResistances": "—",
    "damageImmunities": "necrotic, poison, bludgeoning, piercing, and slashing from nonmagical weapons",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, envenenado",
    "damageVulnerabilities": "fire",
    "traits": [
      {
        "name": "Resistência à Magia",
        "description": "O(a) mummy lord has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Rejuvenation",
        "description": "A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. O(a) new body appears within 5 feet of the mummy lord's heart.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) mummy lord is a 10th-level spellcaster. Its Conjuração ability is Sabedoria (spell save DC 17, +9 para acertar with spell attacks). O(a) mummy lord has the following cleric spells prepared:\n\n- Cantrips (at will): sacred flame, thaumaturgy\n- 1st level (4 slots): command, guiding bolt, shield of faith\n- 2nd level (3 slots): hold person, silence, spiritual weapon\n- 3rd level (3 slots): animate dead, dispel magic\n- 4th level (3 slots): divination, guardian of faith\n- 5th level (2 slots): contagion, insect plague\n- 6th level (1 slot): harm",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) mummy can use its Dreadful Glare and makes one attack with its rotting punho.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Rotting punho",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (3d6 + 4) dano de concussão plus 21 (6d6) dano necrótico. If the target is a creature, it must succeed on a DC 16 Constituição teste de resistência or be cursed with mummy rot. O(a) cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. O(a) curse lasts until removed by the remove curse spell or other magic.",
        "attackBonus": 9,
        "damage": "3d6+4 + 6d6"
      },
      {
        "name": "Dreadful Glare",
        "description": "O(a) mummy lord targets uma criatura it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Sabedoria teste de resistência against this magic or become amedrontado until the end of the mummy's next turn. If the target fails the teste de resistência by 5 or more, it is also paralisado for the same duration. A target that succeeds on the teste de resistência is immune to the Dreadful Glare of all mummies and mummy lords for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Attack",
        "description": "O(a) mummy lord makes one attack with its rotting punho or uses its Dreadful Glare.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Blinding Dust",
        "description": "Blinding dust and sand swirls magically around the mummy lord. Each creature within 5 feet of the mummy lord must succeed on a DC 16 Constituição teste de resistência or be Cego until the end of the creature's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Blasphemous Word (Costs 2 Actions)",
        "description": "O(a) mummy lord utters a blasphemous word. Each non-undead creature within 10 feet of the mummy lord that can hear the magical utterance must succeed on a DC 16 Constituição teste de resistência or be atordoado until the end of the mummy lord's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Channel Negative Energy (Costs 2 Actions)",
        "description": "O(a) mummy lord magically unleashes negative energy. Creatures within 60 feet of the mummy lord, including ones behind barriers and around corners, can't regain hit points until the end of the mummy lord's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Whirlwind of Sand (Costs 2 Actions)",
        "description": "O(a) mummy lord magically transforms into a whirlwind of sand, moves up to 60 feet, and reverts to its normal form. While in whirlwind form, the mummy lord is immune to all damage, and it can't be agarrado, Petrificado, knocked caído, impedido, or atordoado. Equipment worn or carried by the mummy lord remain in its possession.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/mummy-lord.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/mummy-lord.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ape",
    "name": "Macaco",
    "nameEn": "Ape",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 19,
    "hitDice": "3d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m; escalada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 6,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Athletics +5, Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) ape faz dois ataques de punho.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "punho",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +5 para acertar, range 25/15 m, um alvo. Acerto: 6 (1d6 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": "1d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ape.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ape.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-ape",
    "name": "Macaco Gigante",
    "nameEn": "Giant Ape",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 157,
    "hitDice": "15d12",
    "cr": "7",
    "xp": 2900,
    "speed": "caminhada: 12 m; escalada: 12 m",
    "abilities": {
      "strength": 23,
      "dexterity": 14,
      "constitution": 18,
      "intelligence": 7,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Athletics +9, Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) ape faz dois ataques de punho.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "punho",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, um alvo. Acerto: 22 (3d10 + 6) dano de concussão.",
        "attackBonus": 9,
        "damage": "3d10+6"
      },
      {
        "name": "Rocha",
        "description": "Ataque à distância com arma: +9 para acertar, range 50/30 m, um alvo. Acerto: 30 (7d6 + 6) dano de concussão.",
        "attackBonus": 9,
        "damage": "7d6+6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-ape.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-ape.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "magmin",
    "name": "Magmin",
    "nameEn": "Magmin",
    "type": "elemental",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "caótico e neutro",
    "ac": 14,
    "hp": 9,
    "hitDice": "2d6",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 7,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 8,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Ignan",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Death Burst",
        "description": "When the magmin dies, it explodes in a burst of fire and magma. Each creature within 3 m of it must make a DC 11 Destreza teste de resistência, taking 7 (2d6) dano de fogo on a failed save, or half as much damage on a successful one. Flammable objects that aren't being worn or carried in that area are ignited.",
        "attackBonus": null,
        "damage": "2d6"
      },
      {
        "name": "Ignited Illumination",
        "description": "As a ação bônus, the magmin can set itself ablaze or extinguish its flames. While ablaze, the magmin sheds bright light in a 10-foot radius and dim light for an additional 3 m",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Touch",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d6) dano de fogo. If the target is a creature or a flammable object, it ignites. Until a target takes an action to douse the fire, the target takes 3 (1d6) dano de fogo at the end of each of its turns.",
        "attackBonus": 4,
        "damage": "2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/magmin.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/magmin.png",
    "color": "#2F4F7A",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "mage",
    "name": "Mago",
    "nameEn": "Mage",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 15,
    "hp": 40,
    "hitDice": "9d8",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 9,
      "dexterity": 14,
      "constitution": 11,
      "intelligence": 17,
      "wisdom": 12,
      "charisma": 11
    },
    "skills": "Arcana +6, History +6",
    "senses": "Percepção passiva 11",
    "languages": "any four languages",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração",
        "description": "O(a) mage is a 9th-level spellcaster. Its Conjuração ability is Inteligência (spell save DC 14, +6 para acertar with spell attacks). O(a) mage has the following wizard spells prepared:\n\n- Cantrips (at will): fire bolt, light, mage hand, prestidigitation\n- 1st level (4 slots): detect magic, mage armor, magic missile, shield\n- 2nd level (3 slots): misty step, suggestion\n- 3rd level (3 slots): counterspell, fireball, voo\n- 4th level (3 slots): greater invisibility, ice storm\n- 5th level (1 slot): cone of cold",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Adaga",
        "description": "Melee or Ataque à distância com arma: +5 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/mage.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/mage.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "mammoth",
    "name": "Mamute",
    "nameEn": "Mammoth",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 126,
    "hitDice": "11d12",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 24,
      "dexterity": 9,
      "constitution": 21,
      "intelligence": 3,
      "wisdom": 11,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Trampling Charge",
        "description": "If the mammoth moves at least 6 m straight toward a creature and then hits it with a Chifrada attack on the same turn, that target must succeed on a DC 18 Força teste de resistência or be knocked caído. If the target is caído, the mammoth can make one stomp attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Chifrada",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 25 (4d8 + 7) dano perfurante.",
        "attackBonus": 10,
        "damage": "4d8+7"
      },
      {
        "name": "Stomp",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, one pruma criatura. Acerto: 29 (4d10 + 7) dano de concussão.",
        "attackBonus": 10,
        "damage": "4d10+7"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/mammoth.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/mammoth.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "manticore",
    "name": "Manticora",
    "nameEn": "Manticore",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 14,
    "hp": 68,
    "hitDice": "8d10",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m; voo: 15 m",
    "abilities": {
      "strength": 17,
      "dexterity": 16,
      "constitution": 17,
      "intelligence": 7,
      "wisdom": 12,
      "charisma": 8
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Cauda Spike Regrowth",
        "description": "O(a) manticore has twenty-four Cauda spikes. Used spikes regrow when the manticore finishes a long rest.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) manticore makes three attacks: one with its Mordida and two with its Garras or three with its Cauda spikes.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d8+3"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Cauda Spike",
        "description": "Ataque à distância com arma: +5 para acertar, range 100/60 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d8+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/manticore.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/manticore.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "darkmantle",
    "name": "Manto Sombrio",
    "nameEn": "Darkmantle",
    "type": "monstruosidade",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 22,
    "hitDice": "5d6",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 3 m; voo: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "Stealth +3",
    "senses": "visão às cegas 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Echolocation",
        "description": "O(a) darkmantle can't use its visão às cegas while Surdo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "False Appearance",
        "description": "While the darkmantle remains motionless, it is indiFerrãouishable from a cave formation such as a stalactite or stalagmite.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Crush",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, uma criatura. Acerto: 6 (1d6 + 3) dano de concussão, and the darkmantle attaches to the target. If the target is Medium or smaller and the darkmantle has advantage on the attack roll, it attaches by engulfing the target's head, and the target is also Cego and unable to breathe while the darkmantle is attached in this way.\nWhile attached to the target, the darkmantle can attack no other creature except the target but has advantage on its attack rolls. O(a) darkmantle's speed also becomes 0, it can't benefit from any bonus to its speed, and it moves with the target.\nA creature can detach the darkmantle by making a successful DC 13 Força check as an action. On its turn, the darkmantle can detach itself from the target by using 5 feet of movement.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Darkness Aura",
        "description": "A 15-foot radius of magical darkness extends out from the darkmantle, moves with it, and spreads around corners. O(a) darkness lasts as long as the darkmantle maintains concentration, up to 10 minutes (as if concentrating on a spell). visão no escuro can't penetrate this darkness, and no natural light can illuminate it. If any of the darkness overlaps with an area of light created by a spell of 2nd level or lower, the spell creating the light is dispelled.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/darkmantle.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/darkmantle.png",
    "color": "#4A2F18",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "cloaker",
    "name": "Manto Vivo",
    "nameEn": "Cloaker",
    "type": "aberração",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e neutro",
    "ac": 14,
    "hp": 78,
    "hitDice": "12d10",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 3 m; voo: 12 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 12,
      "intelligence": 13,
      "wisdom": 12,
      "charisma": 14
    },
    "skills": "Stealth +5",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "Deep Speech, Undercommon",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Damage Transfer",
        "description": "While attached to a creature, the cloaker takes only half the damage dealt to it (rounded down). and that creature takes the other half.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "False Appearance",
        "description": "While the cloaker remains motionless without its underside exposed, it is indiFerrãouishable from a dark leather cloak.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Light Sensitivity",
        "description": "While in bright light, the cloaker has disadvantage on attack rolls and Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) cloaker makes two attacks: one with its Mordida and one with its Cauda.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, uma criatura. Acerto: 10 (2d6 + 3) dano perfurante, and if the target is Large or smaller, the cloaker attaches to it. If the cloaker has advantage against the target, the cloaker attaches to the target's head, and the target is Cego and unable to breathe while the cloaker is attached. While attached, the cloaker can make this attack only against the target and has advantage on the attack roll. O(a) cloaker can detach itself by spending 5 feet of its movement. A creature, including the target, can take its action to detach the cloaker by succeeding on a DC 16 Força check.",
        "attackBonus": 6,
        "damage": "2d6+3"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, uma criatura. Acerto: 7 (1d8 + 3) dano cortante.",
        "attackBonus": 6,
        "damage": "1d8+3"
      },
      {
        "name": "Moan",
        "description": "Each creature within 60 feet of the cloaker that can hear its moan and that isn't an aberration must succeed on a DC 13 Sabedoria teste de resistência or become amedrontado until the end of the cloaker's next turn. If a creature's teste de resistência is successful, the creature is immune to the cloaker's moan for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Phantasms",
        "description": "O(a) cloaker magically creates three illusory duplicates of itself if it isn't in bright light. O(a) duplicates move with it and mimic its actions, shifting position so as to make it impossible to track which cloaker is the real one. If the cloaker is ever in an area of bright light, the duplicates disappear.\nWhenever any creature targets the cloaker with an attack or a harmful spell while a duplicate remains, that creature rolls randomly to determine whether it targets the cloaker or one of the duplicates. A creature is unaffected by this magical effect if it can't see or if it relies on senses other than sight.\nA duplicate has the cloaker's AC and uses its teste de resistências. If an attack hits a duplicate, or if a duplicate fails a teste de resistência against an effect that deals damage, the duplicate disappears.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/cloaker.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/cloaker.png",
    "color": "#6B3FA0",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "marilith",
    "name": "Marilith",
    "nameEn": "Marilith",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 18,
    "hp": 189,
    "hitDice": "18d10",
    "cr": "16",
    "xp": 15000,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 20,
      "constitution": 20,
      "intelligence": 18,
      "wisdom": 16,
      "charisma": 20
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 13",
    "languages": "Abyssal, telepathy 36 m",
    "damageResistances": "cold, fire, lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência à Magia",
        "description": "O(a) marilith has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) marilith's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Reactive",
        "description": "O(a) marilith can take one reação on every turn in combat.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) marilith can make seven attacks: six with its Espada longas and one with its Cauda.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano cortante.",
        "attackBonus": 9,
        "damage": "2d8+4"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, uma criatura. Acerto: 15 (2d10 + 4) dano de concussão. If the target is Medium or smaller, it is agarrado (escape DC 19). Until this grapple ends, the target is impedido, the marilith can automatically hit the target with its Cauda, and the marilith can't make Cauda attacks against other targets.",
        "attackBonus": 9,
        "damage": "2d10+4"
      },
      {
        "name": "Teleport",
        "description": "O(a) marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "description": "O(a) marilith adds 5 to its AC against one melee attack that would hit it. To do so, the marilith must see the attacker and be wielding a melee weapon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/marilith.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/marilith.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "mastiff",
    "name": "Mastim",
    "nameEn": "Mastiff",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 5,
    "hitDice": "1d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 13,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) mastiff has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano perfurante. If the target is a creature, it must succeed on a DC 11 Força teste de resistência or be knocked caído.",
        "attackBonus": 3,
        "damage": "1d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/mastiff.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/mastiff.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "medusa",
    "name": "Medusa",
    "nameEn": "Medusa",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 15,
    "hp": 127,
    "hitDice": "17d8",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 15
    },
    "skills": "Deception +5, Insight +4, Perception +4, Stealth +5",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Comum",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Petrifying Gaze",
        "description": "When a creature that can see the medusa's eyes starts its turn within 9 m of the medusa, the medusa can force it to make a DC 14 Constituição teste de resistência if the medusa isn't incapacitated and can see the creature. If the teste de resistência fails by 5 or more, the creature is instantly Petrificado. Otherwise, a creature that fails the save begins to turn to stone and is impedido. O(a) impedido creature must repeat the teste de resistência at the end of its next turn, becoming Petrificado on a failure or ending the effect on a success. O(a) petrification lasts until the creature is freed by the greater restoration spell or other magic.\nUnless surprised, a creature can avert its eyes to avoid the teste de resistência at the start of its turn. If the creature does so, it can't see the medusa until the start of its next turn, when it can avert its eyes again. If the creature looks at the medusa in the meantime, it must immediately make the save.\nIf the medusa sees itself reflected on a polished surface within 9 m of it and in an area of bright light, the medusa is, due to its curse, affected by its own gaze.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) medusa makes either three melee attacks--one with its snake hair and two with its Espada curta--or two ranged attacks with its Arco longo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Snake Hair",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, uma criatura. Acerto: 4 (1d4 + 2) dano perfurante plus 14 (4d6) dano de veneno.",
        "attackBonus": 5,
        "damage": "1d4+2 + 4d6"
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d6+2"
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +5 para acertar, range 150/180 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante plus 7 (2d6) dano de veneno.",
        "attackBonus": 5,
        "damage": "1d8+2 + 2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/medusa.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/medusa.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "dust-mephit",
    "name": "Mefite da Poeira",
    "nameEn": "Dust Mephit",
    "type": "elemental",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "neutro e mau",
    "ac": 12,
    "hp": 17,
    "hitDice": "5d6",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m; voo: 9 m",
    "abilities": {
      "strength": 5,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 9,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Perception +2, Stealth +4",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "Auran, Terran",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "fire",
    "traits": [
      {
        "name": "Death Burst",
        "description": "When the mephit dies, it explodes in a burst of dust. Each creature within 1.5 m of it must then succeed on a DC 10 Constituição teste de resistência or be Cego for 1 minute. A Cego creature can repeat the teste de resistência em cada um de seus turnos, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) mephit can innately cast sleep, requiring no material components. Its Conjuração Inata ability is Carisma.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 4 (1d4 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      },
      {
        "name": "Blinding Breath",
        "description": "O(a) mephit exhales a 15-foot cone of blinding dust. Each creature in that area must succeed on a DC 10 Destreza teste de resistência or be Cego for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/dust-mephit.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/dust-mephit.png",
    "color": "#2F4F7A",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ice-mephit",
    "name": "Mefite do Gelo",
    "nameEn": "Ice Mephit",
    "type": "elemental",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "neutro e mau",
    "ac": 11,
    "hp": 21,
    "hitDice": "6d6",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m; voo: 9 m",
    "abilities": {
      "strength": 7,
      "dexterity": 13,
      "constitution": 10,
      "intelligence": 9,
      "wisdom": 11,
      "charisma": 12
    },
    "skills": "Perception +2, Stealth +3",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "Aquan, Auran",
    "damageResistances": "—",
    "damageImmunities": "cold, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "bludgeoning, fire",
    "traits": [
      {
        "name": "Death Burst",
        "description": "When the mephit dies, it explodes in a burst of jagged ice. Each creature within 1.5 m of it must make a DC 10 Destreza teste de resistência, taking 4 (1d8) dano cortante on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "1d8"
      },
      {
        "name": "False Appearance",
        "description": "While the mephit remains motionless, it is indiFerrãouishable from an ordinary shard of ice.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) mephit can innately cast fog cloud, requiring no material components. Its Conjuração Inata ability is Carisma.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, uma criatura. Acerto: 3 (1d4 + 1) dano cortante plus 2 (1d4) dano de frio.",
        "attackBonus": 3,
        "damage": "1d4+1 + 1d4"
      },
      {
        "name": "Frost Breath",
        "description": "O(a) mephit exhales a 15-foot cone of cold air. Each creature in that area must succeed on a DC 10 Destreza teste de resistência, taking 5 (2d4) dano de frio on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "2d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ice-mephit.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ice-mephit.png",
    "color": "#2F4F7A",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "magma-mephit",
    "name": "Mefite do Magma",
    "nameEn": "Magma Mephit",
    "type": "elemental",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "neutro e mau",
    "ac": 11,
    "hp": 22,
    "hitDice": "5d6",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m; voo: 9 m",
    "abilities": {
      "strength": 8,
      "dexterity": 12,
      "constitution": 12,
      "intelligence": 7,
      "wisdom": 10,
      "charisma": 10
    },
    "skills": "Stealth +3",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Ignan, Terran",
    "damageResistances": "—",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "cold",
    "traits": [
      {
        "name": "Death Burst",
        "description": "When the mephit dies, it explodes in a burst of lava. Each creature within 1.5 m of it must make a DC 11 Destreza teste de resistência, taking 7 (2d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "2d6"
      },
      {
        "name": "False Appearance",
        "description": "While the mephit remains motionless, it is indiFerrãouishable from an ordinary mound of magma.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) mephit can innately cast heat metal (spell save DC 10), requiring no material components. Its Conjuração Inata ability is Carisma.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, uma criatura. Acerto: 3 (1d4 + 1) dano cortante plus 2 (1d4) dano de fogo.",
        "attackBonus": 3,
        "damage": "1d4+1 + 1d4"
      },
      {
        "name": "Fire Breath",
        "description": "O(a) mephit exhales a 15-foot cone of fire. Each creature in that area must make a DC 11 Destreza teste de resistência, taking 7 (2d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/magma-mephit.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/magma-mephit.png",
    "color": "#2F4F7A",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "steam-mephit",
    "name": "Mefite do Vapor",
    "nameEn": "Steam Mephit",
    "type": "elemental",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "neutro e mau",
    "ac": 10,
    "hp": 21,
    "hitDice": "6d6",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m; voo: 9 m",
    "abilities": {
      "strength": 5,
      "dexterity": 11,
      "constitution": 10,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 12
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Aquan, Ignan",
    "damageResistances": "—",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Death Burst",
        "description": "When the mephit dies, it explodes in a cloud of steam. Each creature within 1.5 m of the mephit must succeed on a DC 10 Destreza teste de resistência or take 4 (1d8) dano de fogo.",
        "attackBonus": null,
        "damage": "1d8"
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) mephit can innately cast blur, requiring no material components. Its Conjuração Inata ability is Carisma.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, uma criatura. Acerto: 2 (1d4) dano cortante plus 2 (1d4) dano de fogo.",
        "attackBonus": 2,
        "damage": "1d4 + 1d4"
      },
      {
        "name": "Steam Breath",
        "description": "O(a) mephit exhales a 15-foot cone of scalding steam. Each creature in that area must succeed on a DC 10 Destreza teste de resistência, taking 4 (1d8) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "1d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/steam-mephit.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/steam-mephit.png",
    "color": "#2F4F7A",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "merrow",
    "name": "Merrow",
    "nameEn": "Merrow",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 13,
    "hp": 45,
    "hitDice": "6d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 3 m; natação: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 8,
      "wisdom": 10,
      "charisma": 9
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Abyssal, Aquan",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) merrow can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) merrow makes two attacks: one with its Mordida and one with its Garras or harpoon.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d8 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d8+4"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (2d4 + 4) dano cortante.",
        "attackBonus": 6,
        "damage": "2d4+4"
      },
      {
        "name": "Harpoon",
        "description": "Melee or Ataque à distância com arma: +6 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 11 (2d6 + 4) dano perfurante. If the target is a Huge or smaller creature, it must succeed on a Força contest against the merrow or be pulled up to 20 feet toward the merrow.",
        "attackBonus": 6,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/merrow.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/merrow.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "mimic",
    "name": "Mímico",
    "nameEn": "Mimic",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 12,
    "hp": 58,
    "hitDice": "9d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 4.5 m",
    "abilities": {
      "strength": 17,
      "dexterity": 12,
      "constitution": 15,
      "intelligence": 5,
      "wisdom": 13,
      "charisma": 8
    },
    "skills": "Stealth +5",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "acid",
    "conditionImmunities": "caído",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn 't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Adhesive (Object Form Only)",
        "description": "O(a) mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also agarrado by it (escape DC 13). Ability checks made to escape this grapple have disadvantage.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "False Appearance (Object Form Only)",
        "description": "While the mimic remains motionless, it is indiFerrãouishable from an ordinary object.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Grappler",
        "description": "O(a) mimic has advantage on attack rolls against any creature agarrado by it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano de concussão. If the mimic is in object form, the target is subjected to its Adhesive trait.",
        "attackBonus": 5,
        "damage": "1d8+3"
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano perfurante plus 4 (1d8) dano de ácido.",
        "attackBonus": 5,
        "damage": "1d8+3 + 1d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/mimic.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/mimic.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "minotaur",
    "name": "Minotauro",
    "nameEn": "Minotaur",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 14,
    "hp": 76,
    "hitDice": "9d10",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 11,
      "constitution": 16,
      "intelligence": 6,
      "wisdom": 16,
      "charisma": 9
    },
    "skills": "Perception +7",
    "senses": "visão no escuro 18 m, Percepção passiva 17",
    "languages": "Abyssal",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the minotaur moves at least 3 m straight toward a target and then hits it with a Chifrada attack on the same turn, the target takes an extra 9 (2d8) dano perfurante. If the target is a creature, it must succeed on a DC 14 Força teste de resistência or be pushed up to 3 m away and knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Labyrinthine Recall",
        "description": "O(a) minotaur can perfectly recall any path it has traveled.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Reckless",
        "description": "At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls it makes during that turn, but attack rolls against it have advantage until the start of its next turn.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Machado grande",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 17 (2d12 + 4) dano cortante.",
        "attackBonus": 6,
        "damage": "2d12+4"
      },
      {
        "name": "Chifrada",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/minotaur.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/minotaur.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "rust-monster",
    "name": "Monstro da Ferrugem",
    "nameEn": "Rust Monster",
    "type": "monstruosidade",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 27,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 13,
      "dexterity": 12,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 13,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Iron Scent",
        "description": "O(a) rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Rust Metal",
        "description": "Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the rust monster is destroyed after dealing damage.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d8 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d8+1"
      },
      {
        "name": "Antennae",
        "description": "O(a) rust monster corrodes a nonmagical ferrous metal object it can see within 5 feet of it. If the object isn't being worn or carried, the touch destroys a 1-foot cube of it. If the object is being worn or carried by a creature, the creature can make a DC 11 Destreza teste de resistência to avoid the rust monster's touch.\nIf the object touched is either metal armor or a metal shield being worn or carried, its takes a permanent and cumulative -1 penalty to the AC it offers. Armor reduced to an AC of 10 or a shield that drops to a +0 bonus is destroyed. If the object touched is a held metal weapon, it rusts as described in the Rust Metal trait.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/rust-monster.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/rust-monster.png",
    "color": "#4A2F18",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "shambling-mound",
    "name": "Monturo Ambulante",
    "nameEn": "Shambling Mound",
    "type": "planta",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 15,
    "hp": 136,
    "hitDice": "16d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 6 m; natação: 6 m",
    "abilities": {
      "strength": 18,
      "dexterity": 8,
      "constitution": 16,
      "intelligence": 5,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "Stealth +2",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 10",
    "languages": "—",
    "damageResistances": "cold, fire",
    "damageImmunities": "lightning",
    "conditionImmunities": "Cego, Cego, Exaustão",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Lightning Absorption",
        "description": "Whenever the shambling mound is subjected to dano elétrico, it takes no damage and regains a number of hit points equal to the dano elétrico dealt.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) shambling mound faz dois ataques de Pancada. If both attacks hit a Medium or smaller target, the target is agarrado (escape DC 14), and the shambling mound uses its Engulf on it.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano de concussão.",
        "attackBonus": 7,
        "damage": "2d8+4"
      },
      {
        "name": "Engulf",
        "description": "O(a) shambling mound engulfs a Medium or smaller creature agarrado by it. O(a) engulfed target is Cego, impedido, and unable to breathe, and it must succeed on a DC 14 Constituição teste de resistência at the start of each of the mound's turns or take 13 (2d8 + 4) dano de concussão. If the mound moves, the engulfed target moves with it. O(a) mound can have only uma criatura engulfed at a time.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/shambling-mound.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/shambling-mound.png",
    "color": "#2F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "bat",
    "name": "Morcego",
    "nameEn": "Bat",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 1.5 m; voo: 9 m",
    "abilities": {
      "strength": 2,
      "dexterity": 15,
      "constitution": 8,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 4
    },
    "skills": "—",
    "senses": "visão às cegas 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Echolocation",
        "description": "O(a) bat can't use its visão às cegas while Surdo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada",
        "description": "O(a) bat has advantage on Sabedoria (Perception) checks that rely on hearing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1.5 m, uma criatura. Acerto: 1 dano perfurante.",
        "attackBonus": 0,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/bat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/bat.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-bat",
    "name": "Morcego Gigante",
    "nameEn": "Giant Bat",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 22,
    "hitDice": "4d10",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 3 m; voo: 18 m",
    "abilities": {
      "strength": 15,
      "dexterity": 16,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão às cegas 18 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Echolocation",
        "description": "O(a) bat can't use its visão às cegas while Surdo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada",
        "description": "O(a) bat has advantage on Sabedoria (Perception) checks that rely on hearing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-bat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-bat.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "mule",
    "name": "Mula",
    "nameEn": "Mule",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 14,
      "dexterity": 10,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Beast of Burden",
        "description": "O(a) mule is considered to be a Large animal for the purpose of determining its carrying capacity.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sure-Footed",
        "description": "O(a) mule has advantage on Força and Destreza teste de resistências made against effects that would knock it caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano de concussão.",
        "attackBonus": 2,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/mule.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/mule.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "mummy",
    "name": "Múmia",
    "nameEn": "Mummy",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 11,
    "hp": 58,
    "hitDice": "9d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 16,
      "dexterity": 8,
      "constitution": 15,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 12
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "the languages it knew in life",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, paralisado, envenenado",
    "damageVulnerabilities": "fire",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) mummy can use its Dreadful Glare and makes one attack with its rotting punho.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Rotting punho",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano de concussão plus 10 (3d6) dano necrótico. If the target is a creature, it must succeed on a DC 12 Constituição teste de resistência or be cursed with mummy rot. O(a) cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. O(a) curse lasts until removed by the remove curse spell or other magic.",
        "attackBonus": 5,
        "damage": "2d6+3 + 3d6"
      },
      {
        "name": "Dreadful Glare",
        "description": "O(a) mummy targets uma criatura it can see within 18 m of it. If the target can see the mummy, it must succeed on a DC 11 Sabedoria teste de resistência against this magic or become amedrontado until the end of the mummy's next turn. If the target fails the teste de resistência by 5 or more, it is also paralisado for the same duration. A target that succeeds on the teste de resistência is immune to the Dreadful Glare of all mummies (but not mummy lords) for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/mummy.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/mummy.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "spirit-naga",
    "name": "Naga Espiritual",
    "nameEn": "Spirit Naga",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 15,
    "hp": 75,
    "hitDice": "10d10",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 17,
      "constitution": 14,
      "intelligence": 16,
      "wisdom": 15,
      "charisma": 16
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "Abyssal, Comum",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "enfeitiçado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Rejuvenation",
        "description": "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) naga is a 10th-level spellcaster. Its Conjuração ability is Inteligência (spell save DC 14, +6 para acertar with spell attacks), and it needs only verbal components to cast its spells. It has the following wizard spells prepared:\n\n- Cantrips (at will): mage hand, minor illusion, ray of frost\n- 1st level (4 slots): charm person, detect magic, sleep\n- 2nd level (3 slots): detect thoughts, hold person\n- 3rd level (3 slots): lightning bolt, water breathing\n- 4th level (3 slots): blight, dimension door\n- 5th level (2 slots): dominate person",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, uma criatura. Acerto: 7 (1d6 + 4) dano perfurante, and the target must make a DC 13 Constituição teste de resistência, taking 31 (7d8) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 7,
        "damage": "1d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/spirit-naga.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/spirit-naga.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "guardian-naga",
    "name": "Naga Guardiã",
    "nameEn": "Guardian Naga",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e bom",
    "ac": 18,
    "hp": 127,
    "hitDice": "15d10",
    "cr": "10",
    "xp": 5900,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 19,
      "dexterity": 18,
      "constitution": 16,
      "intelligence": 16,
      "wisdom": 19,
      "charisma": 18
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Celestial, Comum",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "enfeitiçado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Rejuvenation",
        "description": "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) naga is an 11th-level spellcaster. Its Conjuração ability is Sabedoria (spell save DC 16, +8 para acertar with spell attacks), and it needs only verbal components to cast its spells. It has the following cleric spells prepared:\n\n- Cantrips (at will): mending, sacred flame, thaumaturgy\n- 1st level (4 slots): command, cure wounds, shield of faith\n- 2nd level (3 slots): calm emotions, hold person\n- 3rd level (3 slots): bestow curse, clairvoyance\n- 4th level (3 slots): banishment, freedom of movement\n- 5th level (2 slots): flame strike, geas\n- 6th level (1 slot): true seeing",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 m, uma criatura. Acerto: 8 (1d8 + 4) dano perfurante, and the target must make a DC 15 Constituição teste de resistência, taking 45 (10d8) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 8,
        "damage": "1d8+4"
      },
      {
        "name": "Spit Poison",
        "description": "Ataque à distância com arma: +8 para acertar, range 15/9 m, uma criatura. Acerto: O(a) target must make a DC 15 Constituição teste de resistência, taking 45 (10d8) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 8,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/guardian-naga.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/guardian-naga.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "nalfeshnee",
    "name": "Nalfeshnee",
    "nameEn": "Nalfeshnee",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 18,
    "hp": 184,
    "hitDice": "16d10",
    "cr": "13",
    "xp": 10000,
    "speed": "caminhada: 6 m; voo: 9 m",
    "abilities": {
      "strength": 21,
      "dexterity": 10,
      "constitution": 22,
      "intelligence": 19,
      "wisdom": 12,
      "charisma": 15
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 11",
    "languages": "Abyssal, telepathy 36 m",
    "damageResistances": "cold, fire, lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência à Magia",
        "description": "O(a) nalfeshnee has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) nalfeshnee uses Horror Nimbus if it can. It then makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1.5 m, um alvo. Acerto: 32 (5d10 + 5) dano perfurante.",
        "attackBonus": 10,
        "damage": "5d10+5"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 15 (3d6 + 5) dano cortante.",
        "attackBonus": 10,
        "damage": "3d6+5"
      },
      {
        "name": "Horror Nimbus",
        "description": "O(a) nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Sabedoria teste de resistência or be amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the nalfeshnee's Horror Nimbus for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Teleport",
        "description": "O(a) nalfeshnee magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/nalfeshnee.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/nalfeshnee.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "noble",
    "name": "Nobre",
    "nameEn": "Noble",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 15,
    "hp": 9,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 11,
      "dexterity": 12,
      "constitution": 11,
      "intelligence": 12,
      "wisdom": 14,
      "charisma": 16
    },
    "skills": "Deception +5, Insight +4, Persuasion +5",
    "senses": "Percepção passiva 12",
    "languages": "any two languages",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Rapier",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d8 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d8+1"
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "description": "O(a) noble adds 2 to its AC against one melee attack that would hit it. To do so, the noble must see the attacker and be wielding a melee weapon.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/noble.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/noble.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ogre",
    "name": "Ogro",
    "nameEn": "Ogre",
    "type": "gigante",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 11,
    "hp": 59,
    "hitDice": "7d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 19,
      "dexterity": 8,
      "constitution": 16,
      "intelligence": 5,
      "wisdom": 7,
      "charisma": 7
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 8",
    "languages": "Comum, Giant",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "GreatClava",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d8+4"
      },
      {
        "name": "Dardo",
        "description": "Melee or Ataque à distância com arma: +6 para acertar, alcance 1.5 m or range 30/36 m, um alvo. Acerto: 11 (2d6 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ogre.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ogre.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "ogre-zombie",
    "name": "Ogro Zumbi",
    "nameEn": "Ogre Zombie",
    "type": "morto-vivo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e mau",
    "ac": 8,
    "hp": 85,
    "hitDice": "9d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 6,
      "constitution": 18,
      "intelligence": 3,
      "wisdom": 6,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 8",
    "languages": "compreende Comum and Giant mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Undead Fortitude",
        "description": "If damage reduces the zombie to 0 hit points, it must make a Constituição teste de resistência with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Maça-estrela",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/ogre-zombie.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/ogre-zombie.png",
    "color": "#5C4A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "oni",
    "name": "Oni",
    "nameEn": "Oni",
    "type": "gigante",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 16,
    "hp": 110,
    "hitDice": "13d10",
    "cr": "7",
    "xp": 2900,
    "speed": "caminhada: 9 m; voo: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 11,
      "constitution": 16,
      "intelligence": 14,
      "wisdom": 12,
      "charisma": 15
    },
    "skills": "Arcana +5, Deception +8, Perception +4",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Comum, Giant",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Conjuração Inata",
        "description": "O(a) oni's Conjuração Inata ability is Carisma (spell save DC 13). O(a) oni can innately cast the following spells, requiring no material components:\n\nAt will: darkness, invisibility\n1/day each: charm person, cone of cold, gaseous form, sleep",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) oni's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Regeneration",
        "description": "O(a) oni regains 10 hit points at the start of its turn if it has at least 1 hit point.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) oni makes two attacks, either with its Garras or its glaive.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garra (Oni Form Only)",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d8 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "1d8+4"
      },
      {
        "name": "Glaive",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d10 + 4) dano cortante, or 9 (1d10 + 4) dano cortante in Small or Medium form.",
        "attackBonus": 7,
        "damage": "2d10+4"
      },
      {
        "name": "Change Shape",
        "description": "O(a) oni magically polymorphs into a Small or Medium humanoid, into a Large giant, or back into its true form. Other than its size, its statistics are the same in each form. O(a) only equipment that is transformed is its glaive, which shrinks so that it can be wielded in humanoid form. If the oni dies, it reverts to its true form, and its glaive reverts to its normal size.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/oni.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/oni.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "orc",
    "name": "Orc",
    "nameEn": "Orc",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 13,
    "hp": 15,
    "hitDice": "2d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 12,
      "constitution": 16,
      "intelligence": 7,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Intimidation +2",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Comum, Orc",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Aggressive",
        "description": "As a ação bônus, the orc can move up to its speed toward a hostile creature that it can see.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Machado grande",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (1d12 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d12+3"
      },
      {
        "name": "Dardo",
        "description": "Melee or Ataque à distância com arma: +5 para acertar, alcance 1.5 m or range 30/36 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/orc.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/orc.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "killer-whale",
    "name": "Orca",
    "nameEn": "Killer Whale",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 90,
    "hitDice": "12d12",
    "cr": "3",
    "xp": 700,
    "speed": "natação: 18 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 13,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3",
    "senses": "visão às cegas 36 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Echolocation",
        "description": "O(a) whale can't use its visão às cegas while Surdo.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Hold Breath",
        "description": "O(a) whale can hold its breath for 30 minutes",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada",
        "description": "O(a) whale has advantage on Sabedoria (Perception) checks that rely on hearing.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 21 (5d6 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "5d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/killer-whale.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/killer-whale.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "otyugh",
    "name": "Otyugh",
    "nameEn": "Otyugh",
    "type": "aberração",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro",
    "ac": 14,
    "hp": 114,
    "hitDice": "12d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 11,
      "constitution": 19,
      "intelligence": 6,
      "wisdom": 13,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 11",
    "languages": "Otyugh",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Limited Telepathy",
        "description": "O(a) otyugh can magically transmit simple messages and images to any creature within 36 m of it that can understand a language. This form of telepathy doesn't allow the receiving creature to telepathically respond.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) otyugh makes three attacks: one with its Mordida and two with its Tentáculos.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 12 (2d8 + 3) dano perfurante. If the target is a creature, it must succeed on a DC 15 Constituição teste de resistência against disease or become envenenado until the disease is cured. Every 24 hours that elapse, the target must repeat the teste de resistência, reducing its hit point maximum by 5 (1d10) on a failure. O(a) disease is cured on a success. O(a) target dies if the disease reduces its hit point maximum to 0. This reduction to the target's hit point maximum lasts until the disease is cured.",
        "attackBonus": 6,
        "damage": "2d8+3"
      },
      {
        "name": "Tentáculo",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, um alvo. Acerto: 7 (1d8 + 3) dano de concussão plus 4 (1d8) dano perfurante. If the target is Medium or smaller, it is agarrado (escape DC 13) and impedido until the grapple ends. O(a) otyugh has two Tentáculos, each of which can grapple um alvo.",
        "attackBonus": 6,
        "damage": "1d8+3 + 1d8"
      },
      {
        "name": "Tentáculo Pancada",
        "description": "O(a) otyugh Pancadas creatures agarrado by it into each other or a solid surface. Each creature must succeed on a DC 14 Constituição teste de resistência or take 10 (2d6 + 3) dano de concussão and be atordoado until the end of the otyugh's next turn. On a successful save, the target takes half the dano de concussão and isn't atordoado.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/otyugh.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/otyugh.png",
    "color": "#6B3FA0",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "owl",
    "name": "Owl",
    "nameEn": "Owl",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 1.5 m; voo: 18 m",
    "abilities": {
      "strength": 3,
      "dexterity": 13,
      "constitution": 8,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3, Stealth +3",
    "senses": "visão no escuro 36 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "vooby",
        "description": "O(a) owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Audição Aguçada and Sight",
        "description": "O(a) owl has advantage on Sabedoria (Perception) checks that rely on hearing or sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano cortante.",
        "attackBonus": 3,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/owl.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/owl.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "panther",
    "name": "Pantera",
    "nameEn": "Panther",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 13,
    "hitDice": "3d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 15 m; escalada: 12 m",
    "abilities": {
      "strength": 14,
      "dexterity": 15,
      "constitution": 10,
      "intelligence": 3,
      "wisdom": 14,
      "charisma": 7
    },
    "skills": "Perception +4, Stealth +6",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) panther has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pounce",
        "description": "If the panther moves at least 6 m straight toward a creature and then hits it with a Garra attack on the same turn, that target must succeed on a DC 12 Força teste de resistência or be knocked caído. If the target is caído, the panther can make one Mordida attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano cortante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/panther.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/panther.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "pegasus",
    "name": "Pégaso",
    "nameEn": "Pegasus",
    "type": "celestial",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e bom",
    "ac": 12,
    "hp": 59,
    "hitDice": "7d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 18 m; voo: 27 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 10,
      "wisdom": 15,
      "charisma": 13
    },
    "skills": "Perception +6",
    "senses": "Percepção passiva 16",
    "languages": "compreende Celestial, Comum, Elvish, and Sylvan mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão.",
        "attackBonus": 6,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/pegasus.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/pegasus.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "nightmare",
    "name": "Pesadelo",
    "nameEn": "Nightmare",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e mau",
    "ac": 13,
    "hp": 68,
    "hitDice": "8d10",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 18 m; voo: 27 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 15
    },
    "skills": "—",
    "senses": "Percepção passiva 11",
    "languages": "compreende Abyssal, Comum, and Infernal mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Confer Fire Resistance",
        "description": "O(a) nightmare can grant resistance to dano de fogo to anyone riding it.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Illumination",
        "description": "O(a) nightmare sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano de concussão plus 7 (2d6) dano de fogo.",
        "attackBonus": 6,
        "damage": "2d8+4 + 2d6"
      },
      {
        "name": "Ethereal Stride",
        "description": "O(a) nightmare and up to three willing creatures within 5 feet of it magically enter the Ethereal Plane from the Material Plane, or vice versa.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/nightmare.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/nightmare.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "planetar",
    "name": "Planetar",
    "nameEn": "Planetar",
    "type": "celestial",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e bom",
    "ac": 19,
    "hp": 200,
    "hitDice": "16d10",
    "cr": "16",
    "xp": 15000,
    "speed": "caminhada: 12 m; voo: 36 m",
    "abilities": {
      "strength": 24,
      "dexterity": 20,
      "constitution": 24,
      "intelligence": 19,
      "wisdom": 22,
      "charisma": 25
    },
    "skills": "Perception +11",
    "senses": "visão verdadeira 36 m, Percepção passiva 21",
    "languages": "all, telepathy 36 m",
    "damageResistances": "radiant, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Angelic Weapons",
        "description": "O(a) planetar's weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 dano radiante (included in the attack).",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Divine Awareness",
        "description": "O(a) planetar knows if it hears a lie.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) planetar's Conjuração ability is Carisma (spell save DC 20). O(a) planetar can innately cast the following spells, requiring no material components:\nAt will: detect evil and good, invisibility (self only)\n3/day each: blade barrier, dispel evil and good, flame strike, raise dead\n1/day each: commune, control weather, insect plague",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) planetar has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) planetar faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada grande",
        "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1.5 m, um alvo. Acerto: 21 (4d6 + 7) dano cortante plus 22 (5d8) dano radiante.",
        "attackBonus": 12,
        "damage": "4d6+7 + 5d8"
      },
      {
        "name": "Healing Touch",
        "description": "O(a) planetar touches another creature. O(a) target magically regains 30 (6d8 + 3) hit points and is freed from any curse, disease, poison, blindness, or deafness.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/planetar.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/planetar.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "commoner",
    "name": "Plebeu",
    "nameEn": "Commoner",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 10,
    "hp": 4,
    "hitDice": "1d8",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 10,
      "dexterity": 10,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 10
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Clava",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 2 (1d4) dano de concussão.",
        "attackBonus": 2,
        "damage": "1d4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/commoner.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/commoner.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "plesiosaurus",
    "name": "Plesiossauro",
    "nameEn": "Plesiosaurus",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 68,
    "hitDice": "8d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 6 m; natação: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 15,
      "constitution": 16,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 5
    },
    "skills": "Perception +3, Stealth +4",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hold Breath",
        "description": "O(a) plesiosaurus can hold its breath for 1 hour.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 m, um alvo. Acerto: 14 (3d6 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "3d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/plesiosaurus.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/plesiosaurus.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "octopus",
    "name": "Polvo",
    "nameEn": "Octopus",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 3,
    "hitDice": "1d6",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 1.5 m; natação: 9 m",
    "abilities": {
      "strength": 4,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 3,
      "wisdom": 10,
      "charisma": 4
    },
    "skills": "Perception +2, Stealth +4",
    "senses": "visão no escuro 9 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hold Breath",
        "description": "While out of water, the octopus can hold its breath for 30 minutes.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Underwater Camouflage",
        "description": "O(a) octopus has advantage on Destreza (Stealth) checks made while underwater.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) octopus can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Tentáculos",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano de concussão, and the target is agarrado (escape DC 10). Until this grapple ends, the octopus can't use its Tentáculos on another target.",
        "attackBonus": 4,
        "damage": "1"
      },
      {
        "name": "Ink Cloud",
        "description": "A 5-foot-radius cloud of ink extends all around the octopus if it is underwater. O(a) area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a ação bônus.",
        "attackBonus": 0,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/octopus.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/octopus.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-octopus",
    "name": "Polvo Gigante",
    "nameEn": "Giant Octopus",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 52,
    "hitDice": "8d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 3 m; natação: 18 m",
    "abilities": {
      "strength": 17,
      "dexterity": 13,
      "constitution": 13,
      "intelligence": 4,
      "wisdom": 10,
      "charisma": 4
    },
    "skills": "Perception +4, Stealth +5",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Hold Breath",
        "description": "While out of water, the octopus can hold its breath for 1 hour.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Underwater Camouflage",
        "description": "O(a) octopus has advantage on Destreza (Stealth) checks made while underwater.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) octopus can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Tentáculos",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 4.5 m, um alvo. Acerto: 10 (2d6 + 3) dano de concussão. If the target is a creature, it is agarrado (escape DC 16). Until this grapple ends, the target is impedido, and the octopus can't use its Tentáculos on another target.",
        "attackBonus": 5,
        "damage": "2d6+3"
      },
      {
        "name": "Ink Cloud",
        "description": "A 20-foot-radius cloud of ink extends all around the octopus if it is underwater. O(a) area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-octopus.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-octopus.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "pony",
    "name": "Pônei",
    "nameEn": "Pony",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 11,
    "hitDice": "2d8",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 15,
      "dexterity": 10,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 11,
      "charisma": 7
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d4 + 2) dano de concussão.",
        "attackBonus": 4,
        "damage": "2d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/pony.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/pony.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "vampire-spawn",
    "name": "Progênie Vampírica",
    "nameEn": "Vampire Spawn",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 15,
    "hp": 82,
    "hitDice": "11d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 16,
      "constitution": 16,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 12
    },
    "skills": "Perception +3, Stealth +6",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "the languages it knew in life",
    "damageResistances": "necrotic, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Regeneration",
        "description": "O(a) vampire regains 10 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes dano radiante or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) vampire can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Vampire Weaknesses",
        "description": "O(a) vampire has the following flaws:\nForbiddance. O(a) vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. O(a) vampire takes 20 dano de ácido when it ends its turn in running water.\nStake to the Heart. O(a) vampire is destroyed if a piercing weapon made of wood is driven into its heart while it is incapacitated in its reFerrão place.\nSunlight Hypersensitivity. O(a) vampire takes 20 dano radiante when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) vampire makes two attacks, only one of which can be a Mordida attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, one willing creature, or a creature that is agarrado by the vampire, incapacitated, or impedido. Acerto: 6 (1d6 + 3) dano perfurante plus 7 (2d6) dano necrótico. O(a) target's hit point maximum is reduced by an amount equal to the dano necrótico taken, and the vampire regains hit points equal to that amount. O(a) reduction lasts until the target finishes a long rest. O(a) target dies if this effect reduces its hit point maximum to 0.",
        "attackBonus": 6,
        "damage": "1d6+3 + 2d6"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, uma criatura. Acerto: 8 (2d4 + 3) dano cortante. Instead of dealing damage, the vampire can grapple the target (escape DC 13).",
        "attackBonus": 6,
        "damage": "2d4+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-spawn.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-spawn.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "pseudodragon",
    "name": "Pseudodragão",
    "nameEn": "Pseudodragon",
    "type": "dragão",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "neutro e bom",
    "ac": 13,
    "hp": 7,
    "hitDice": "2d4",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 4.5 m; voo: 18 m",
    "abilities": {
      "strength": 6,
      "dexterity": 15,
      "constitution": 13,
      "intelligence": 10,
      "wisdom": 12,
      "charisma": 10
    },
    "skills": "Perception +3, Stealth +4",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 13",
    "languages": "compreende Comum and Draconic mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Keen Senses",
        "description": "O(a) pseudodragon has advantage on Sabedoria (Perception) checks that rely on sight, hearing, or smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) pseudodragon has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Limited Telepathy",
        "description": "O(a) pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 30 m of it that can understand a language.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      },
      {
        "name": "Ferrão",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 4 (1d4 + 2) dano perfurante, and the target must succeed on a DC 11 Constituição teste de resistência or become envenenado for 1 hour. If the teste de resistência fails by 5 or more, the target falls unconscious for the same duration, or until it takes damage or another creature uses an action to shake it awake.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/pseudodragon.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/pseudodragon.png",
    "color": "#7A2530",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "black-pudding",
    "name": "Pudim Negro",
    "nameEn": "Black Pudding",
    "type": "lodo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 7,
    "hp": 85,
    "hitDice": "10d10",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 6 m; escalada: 6 m",
    "abilities": {
      "strength": 16,
      "dexterity": 5,
      "constitution": 16,
      "intelligence": 1,
      "wisdom": 6,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 8",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "acid, cold, lightning, slashing",
    "conditionImmunities": "Cego, enfeitiçado, Exaustão, amedrontado, caído",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Amorphous",
        "description": "O(a) pudding can move through a space as narrow as 1 inch wide without squeezing.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Corrosive Form",
        "description": "A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) dano de ácido. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed after dealing damage. O(a) pudding can eat through 2-inch-thick, nonmagical wood or metal in 1 round.",
        "attackBonus": null,
        "damage": "1d8"
      },
      {
        "name": "Spider escalada",
        "description": "O(a) pudding can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano de concussão plus 18 (4d8) dano de ácido. In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative -1 penalty to the AC it offers. O(a) armor is destroyed if the penalty reduces its AC to 10.",
        "attackBonus": 5,
        "damage": "1d6+3 + 4d8"
      }
    ],
    "reactions": [
      {
        "name": "Split",
        "description": "When a pudding that is Medium or larger is subjected to lightning or dano cortante, it splits into two new puddings if it has at least 10 hit points. Each new pudding has hit points equal to half the original pudding's, rounded down. New puddings are one size smaller than the original pudding.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/black-pudding.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/black-pudding.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "quasit",
    "name": "Quasit",
    "nameEn": "Quasit",
    "type": "demônio",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "caótico e mau",
    "ac": 13,
    "hp": 7,
    "hitDice": "3d4",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 5,
      "dexterity": 17,
      "constitution": 10,
      "intelligence": 7,
      "wisdom": 10,
      "charisma": 10
    },
    "skills": "Stealth +5",
    "senses": "visão no escuro 36 m, Percepção passiva 10",
    "languages": "Abyssal, Comum",
    "damageResistances": "cold, fire, lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "O(a) quasit can use its action to polymorph into a beast form that resembles a bat (speed 3 m voo 12 m), a centipede (12 m, escalada 12 m), or a toad (12 m, natação 12 m), or back into its true form . Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed . It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) quasit has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garra (Mordida in Beast Form)",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d4 + 3) dano perfurante, and the target must succeed on a DC 10 Constituição teste de resistência or take 5 (2d4) dano de veneno and become envenenado for 1 minute. O(a) target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 4,
        "damage": "1d4+3"
      },
      {
        "name": "Scare",
        "description": "uma criatura of the quasit's choice within 6 m of it must succeed on a DC 10 Sabedoria teste de resistência or be amedrontado for 1 minute. O(a) target can repeat the teste de resistência at the end of each of its turns, with disadvantage if the quasit is within line of sight, ending the effect on itself on a success.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Invisibility",
        "description": "O(a) quasit magically turns invisível until it attacks or uses Scare, or until its concentration ends (as if concentrating on a spell). Any equipment the quasit wears or carries is invisível with it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/quasit.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/quasit.png",
    "color": "#5C1A1A",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "chimera",
    "name": "Quimera",
    "nameEn": "Chimera",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 14,
    "hp": 114,
    "hitDice": "12d10",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 19,
      "dexterity": 11,
      "constitution": 19,
      "intelligence": 3,
      "wisdom": 14,
      "charisma": 10
    },
    "skills": "Perception +8",
    "senses": "visão no escuro 18 m, Percepção passiva 18",
    "languages": "compreende Draconic mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) chimera makes three attacks: one with its Mordida, one with its Chifres, and one with its Garras. When its fire breath is available, it can use the breath in place of its Mordida or Chifres.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Chifres",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (1d12 + 4) dano de concussão.",
        "attackBonus": 7,
        "damage": "1d12+4"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Fire Breath",
        "description": "O(a) dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Destreza teste de resistência, taking 31 (7d8) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "7d8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/chimera.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/chimera.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "quipper",
    "name": "Quipper",
    "nameEn": "Quipper",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "natação: 12 m",
    "abilities": {
      "strength": 2,
      "dexterity": 16,
      "constitution": 9,
      "intelligence": 1,
      "wisdom": 7,
      "charisma": 2
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 8",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Blood Frenzy",
        "description": "O(a) quipper has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) quipper can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano perfurante.",
        "attackBonus": 5,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/quipper.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/quipper.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "rakshasa",
    "name": "Rakshasa",
    "nameEn": "Rakshasa",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 16,
    "hp": 110,
    "hitDice": "13d8",
    "cr": "13",
    "xp": 10000,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 14,
      "dexterity": 17,
      "constitution": 18,
      "intelligence": 13,
      "wisdom": 16,
      "charisma": 20
    },
    "skills": "Deception +10, Insight +8",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "Comum, Infernal",
    "damageResistances": "—",
    "damageImmunities": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "conditionImmunities": "—",
    "damageVulnerabilities": "piercing from magic weapons wielded by good creatures",
    "traits": [
      {
        "name": "Limited Magic Immunity",
        "description": "O(a) rakshasa can't be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on teste de resistências against all other spells and magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) rakshasa's Conjuração Inata ability is Carisma (spell save DC 18, +10 para acertar with spell attacks). O(a) rakshasa can innately cast the following spells, requiring no material components:\n\nAt will: detect thoughts, disguise self, mage hand, minor illusion\n3/day each: charm person, detect magic, invisibility, major image, suggestion\n1/day each: dominate person, voo, plane shift, true seeing",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) rakshasa faz dois ataques de Garra",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (2d6 + 2) dano cortante, and the target is cursed if it is a creature. O(a) magical curse takes effect whenever the target takes a short or long rest, filling the target's thoughts with horrible images and dreams. O(a) cursed target gains no benefit from finishing a short or long rest. O(a) curse lasts until it is lifted by a remove curse spell or similar magic.",
        "attackBonus": 7,
        "damage": "2d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/rakshasa.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/rakshasa.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "rat",
    "name": "Rato",
    "nameEn": "Rat",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 2,
      "dexterity": 11,
      "constitution": 9,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 4
    },
    "skills": "—",
    "senses": "visão no escuro 9 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) rat has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano perfurante.",
        "attackBonus": 0,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/rat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/rat.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-rat",
    "name": "Rato Gigante",
    "nameEn": "Giant Rat",
    "type": "fera",
    "size": "Small",
    "sizeLabel": "Pequeno",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 7,
    "hitDice": "2d6",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 7,
      "dexterity": 15,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 4
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) rat has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Táticas de Bando",
        "description": "O(a) rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d4 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-rat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-rat.png",
    "color": "#3F5B34",
    "tokenSize": 40,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "reef-shark",
    "name": "Reef Shark",
    "nameEn": "Reef Shark",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 22,
    "hitDice": "4d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "natação: 12 m",
    "abilities": {
      "strength": 14,
      "dexterity": 13,
      "constitution": 13,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 4
    },
    "skills": "Perception +2",
    "senses": "visão às cegas 9 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Táticas de Bando",
        "description": "O(a) shark has advantage on an attack roll against a creature if at least one of the shark's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) shark can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/reef-shark.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/reef-shark.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "remorhaz",
    "name": "Remorhaz",
    "nameEn": "Remorhaz",
    "type": "monstruosidade",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 17,
    "hp": 195,
    "hitDice": "17d12",
    "cr": "11",
    "xp": 7200,
    "speed": "caminhada: 9 m; escavação: 6 m",
    "abilities": {
      "strength": 24,
      "dexterity": 13,
      "constitution": 21,
      "intelligence": 4,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "cold, fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Heated Body",
        "description": "A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) dano de fogo.",
        "attackBonus": null,
        "damage": "3d6"
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 m, um alvo. Acerto: 40 (6d10 + 7) dano perfurante plus 10 (3d6) dano de fogo. If the target is a creature, it is agarrado (escape DC 17). Until this grapple ends, the target is impedido, and the remorhaz can't Mordida another target.",
        "attackBonus": 11,
        "damage": "6d10+7 + 3d6"
      },
      {
        "name": "Swallow",
        "description": "O(a) remorhaz makes one Mordida attack against a Medium or smaller creature it is grappling. If the attack hits, that creature takes the Mordida's damage and is swallowed, and the grapple ends. While swallowed, the creature is Cego and impedido, it has total cover against attacks and other effects outside the remorhaz, and it takes 21 (6d6) dano de ácido at the start of each of the remorhaz's turns.\nIf the remorhaz takes 30 damage or more on a single turn from a creature inside it, the remorhaz must succeed on a DC 15 Constituição teste de resistência at the end of that turn or regurgitate all swallowed creatures, which fall caído in a space within 10 feet of the remorhaz. If the remorhaz dies, a swallowed creature is no longer impedido by it and can escape from the corpse using 15 feet of movement, exiting caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/remorhaz.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/remorhaz.png",
    "color": "#4A2F18",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "rhinoceros",
    "name": "Rinoceronte",
    "nameEn": "Rhinoceros",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 45,
    "hitDice": "6d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 21,
      "dexterity": 8,
      "constitution": 15,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "—",
    "senses": "Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the rhinoceros moves at least 6 m straight toward a target and then hits it with a Chifrada attack on the same turn, the target takes an extra 9 (2d8) dano de concussão. If the target is a creature, it must succeed on a DC 15 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Chifrada",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d8 + 5) dano de concussão.",
        "attackBonus": 7,
        "damage": "2d8+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/rhinoceros.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/rhinoceros.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "roc",
    "name": "Roca",
    "nameEn": "Roc",
    "type": "monstruosidade",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "sem alinhamento",
    "ac": 15,
    "hp": 248,
    "hitDice": "16d20",
    "cr": "11",
    "xp": 7200,
    "speed": "caminhada: 6 m; voo: 36 m",
    "abilities": {
      "strength": 28,
      "dexterity": 10,
      "constitution": 20,
      "intelligence": 3,
      "wisdom": 10,
      "charisma": 9
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada",
        "description": "O(a) roc has advantage on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) roc makes two attacks: one with its beak and one with its talons.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 m, um alvo. Acerto: 27 (4d8 + 9) dano perfurante.",
        "attackBonus": 13,
        "damage": "4d8+9"
      },
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 1.5 m, um alvo. Acerto: 23 (4d6 + 9) dano cortante, and the target is agarrado (escape DC 19). Until this grapple ends, the target is impedido, and the roc can't use its talons on another target.",
        "attackBonus": 13,
        "damage": "4d6+9"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/roc.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/roc.png",
    "color": "#4A2F18",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "roper",
    "name": "Roper",
    "nameEn": "Roper",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e mau",
    "ac": 20,
    "hp": 93,
    "hitDice": "11d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 3 m; escalada: 3 m",
    "abilities": {
      "strength": 18,
      "dexterity": 8,
      "constitution": 17,
      "intelligence": 7,
      "wisdom": 16,
      "charisma": 6
    },
    "skills": "Perception +6, Stealth +5",
    "senses": "visão no escuro 18 m, Percepção passiva 16",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "False Appearance",
        "description": "While the roper remains motionless, it is indiFerrãouishable from a normal cave formation, such as a stalagmite.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Grasping Tendrils",
        "description": "O(a) roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points; immunity to poison and dano psíquico). Destroying a tendril deals no damage to the roper, which can extrude a replacement tendril on its next turn. A tendril can also be broken if a creature takes an action and succeeds on a DC 15 Força check against it.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) roper can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) roper makes four attacks with its tendrils, uses Reel, and makes one attack with its Mordida.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 22 (4d8 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "4d8+4"
      },
      {
        "name": "Tendril",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 15 m, uma criatura. Acerto: O(a) target is agarrado (escape DC 15). Until the grapple ends, the target is impedido and has disadvantage on Força checks and Força teste de resistências, and the roper can't use the same tendril on another target.",
        "attackBonus": 7,
        "damage": null
      },
      {
        "name": "Reel",
        "description": "O(a) roper pulls each creature agarrado by it up to 7.5 m straight toward it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/roper.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/roper.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "thug",
    "name": "Rufião",
    "nameEn": "Thug",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "any non-good alignment",
    "ac": 11,
    "hp": 32,
    "hitDice": "5d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 11,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 11
    },
    "skills": "Intimidation +2",
    "senses": "Percepção passiva 10",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Táticas de Bando",
        "description": "O(a) thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 1.5 m of the creature and the ally isn't incapacitated.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) thug faz dois ataques de melee.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mace",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 5 (1d6 + 2) dano de concussão.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Heavy Besta",
        "description": "Ataque à distância com arma: +2 para acertar, range 100/120 m, um alvo. Acerto: 5 (1d10) dano perfurante.",
        "attackBonus": 2,
        "damage": "1d10"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/thug.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/thug.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "priest",
    "name": "Sacerdote",
    "nameEn": "Priest",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 13,
    "hp": 27,
    "hitDice": "5d8",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 7.5 m",
    "abilities": {
      "strength": 10,
      "dexterity": 10,
      "constitution": 12,
      "intelligence": 13,
      "wisdom": 16,
      "charisma": 13
    },
    "skills": "Medicine +7, Persuasion +3, Religion +4",
    "senses": "Percepção passiva 13",
    "languages": "any two languages",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Divine Eminence",
        "description": "As a ação bônus, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) dano radiante to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração",
        "description": "O(a) priest is a 5th-level spellcaster. Its Conjuração ability is Sabedoria (spell save DC 13, +5 para acertar with spell attacks). O(a) priest has the following cleric spells prepared:\n\n- Cantrips (at will): light, sacred flame, thaumaturgy\n- 1st level (4 slots): cure wounds, guiding bolt, sanctuary\n- 2nd level (3 slots): lesser restoration, spiritual weapon\n- 3rd level (2 slots): dispel magic, spirit guardians",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mace",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d6) dano de concussão.",
        "attackBonus": 2,
        "damage": "1d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/priest.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/priest.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "sahuagin",
    "name": "Sahuagin",
    "nameEn": "Sahuagin",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 12,
    "hp": 22,
    "hitDice": "4d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 9 m; natação: 12 m",
    "abilities": {
      "strength": 13,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 12,
      "wisdom": 13,
      "charisma": 9
    },
    "skills": "Perception +5",
    "senses": "visão no escuro 36 m, Percepção passiva 15",
    "languages": "Sahuagin",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Blood Frenzy",
        "description": "O(a) sahuagin has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Limited Anfíbioness",
        "description": "O(a) sahuagin can breathe air and water, but it needs to be submerged at least once every 4 hours to avoid suffocating.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Shark Telepathy",
        "description": "O(a) sahuagin can magically command any shark within 120 feet of it, using a limited telepathy.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) sahuagin faz dois ataques de melee: one with its Mordida and one with its Garras or Lança.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d4 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d4+1"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 3 (1d4 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "1d4+1"
      },
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +3 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 4 (1d6 + 1) dano perfurante, or 5 (1d8 + 1) dano perfurante if used with two hands to make a melee attack.",
        "attackBonus": 3,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/sahuagin.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/sahuagin.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "salamander",
    "name": "Salamandra",
    "nameEn": "Salamander",
    "type": "elemental",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e mau",
    "ac": 15,
    "hp": 90,
    "hitDice": "12d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 14,
      "constitution": 15,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 12
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "Ignan",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "fire",
    "conditionImmunities": "—",
    "damageVulnerabilities": "cold",
    "traits": [
      {
        "name": "Heated Body",
        "description": "A creature that touches the salamander or hits it with a melee attack while within 1.5 m of it takes 7 (2d6) dano de fogo.",
        "attackBonus": null,
        "damage": "2d6"
      },
      {
        "name": "Heated Weapons",
        "description": "Any metal melee weapon the salamander wields deals an extra 3 (1d6) dano de fogo on a hit (included in the attack).",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) salamander makes two attacks: one with its Lança and one with its Cauda.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Lança",
        "description": "Melee or Ataque à distância com arma: +7 para acertar, alcance 1.5 m or range 20/18 m, um alvo. Acerto: 11 (2d6 + 4) dano perfurante, or 13 (2d8 + 4) dano perfurante if used with two hands to make a melee attack, plus 3 (1d6) dano de fogo.",
        "attackBonus": 7,
        "damage": "1d6"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão plus 7 (2d6) dano de fogo, and the target is agarrado (escape DC 14). Until this grapple ends, the target is impedido, the salamander can automatically hit the target with its Cauda, and the salamander can't make Cauda attacks against other targets.",
        "attackBonus": 7,
        "damage": "2d6+4 + 2d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/salamander.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/salamander.png",
    "color": "#2F4F7A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "frog",
    "name": "Sapo",
    "nameEn": "Frog",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 1,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 0,
    "speed": "caminhada: 6 m; natação: 6 m",
    "abilities": {
      "strength": 1,
      "dexterity": 13,
      "constitution": 8,
      "intelligence": 1,
      "wisdom": 8,
      "charisma": 3
    },
    "skills": "Perception +1, Stealth +3",
    "senses": "visão no escuro 9 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) frog can breathe air and water",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Standing Leap",
        "description": "O(a) frog's long jump is up to 3 m and its high jump is up to 1.5 m, with or without a running start.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/frog.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/frog.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-frog",
    "name": "Sapo Gigante",
    "nameEn": "Giant Frog",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 18,
    "hitDice": "4d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m; natação: 9 m",
    "abilities": {
      "strength": 12,
      "dexterity": 13,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "Perception +2, Stealth +3",
    "senses": "visão no escuro 9 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) frog can breathe air and water",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Standing Leap",
        "description": "O(a) frog's long jump is up to 6 m and its high jump is up to 3 m, with or without a running start.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano perfurante, and the target is agarrado (escape DC 11). Until this grapple ends, the target is impedido, and the frog can't Mordida another target.",
        "attackBonus": 3,
        "damage": "1d6+1"
      },
      {
        "name": "Swallow",
        "description": "O(a) frog makes one Mordida attack against a Small or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. O(a) swallowed target is Cego and impedido, it has total cover against attacks and other effects outside the frog, and it takes 5 (2d4) dano de ácido at the start of each of the frog's turns. O(a) frog can have only um alvo swallowed at a time. If the frog dies, a swallowed creature is no longer impedido by it and can escape from the corpse using 1.5 m of movement, exiting caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-frog.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-frog.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-toad",
    "name": "Sapo Gigante",
    "nameEn": "Giant Toad",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 39,
    "hitDice": "6d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 6 m; natação: 12 m",
    "abilities": {
      "strength": 15,
      "dexterity": 13,
      "constitution": 13,
      "intelligence": 2,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "—",
    "senses": "visão no escuro 9 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) toad can breathe air and water",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Standing Leap",
        "description": "O(a) toad's long jump is up to 6 m and its high jump is up to 3 m, with or without a running start.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d10 + 2) dano perfurante plus 5 (1d10) dano de veneno, and the target is agarrado (escape DC 13). Until this grapple ends, the target is impedido, and the toad can't Mordida another target.",
        "attackBonus": 4,
        "damage": "1d10+2 + 1d10"
      },
      {
        "name": "Swallow",
        "description": "O(a) toad makes one Mordida attack against a Medium or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. O(a) swallowed target is Cego and impedido, it has total cover against attacks and other effects outside the toad, and it takes 10 (3d6) dano de ácido at the start of each of the toad's turns. O(a) toad can have only um alvo swallowed at a time.\nIf the toad dies, a swallowed creature is no longer impedido by it and can escape from the corpse using 5 feet of movement, exiting caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-toad.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-toad.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "satyr",
    "name": "Sátiro",
    "nameEn": "Satyr",
    "type": "fada",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e neutro",
    "ac": 14,
    "hp": 31,
    "hitDice": "7d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 12,
      "dexterity": 16,
      "constitution": 11,
      "intelligence": 12,
      "wisdom": 10,
      "charisma": 14
    },
    "skills": "Perception +2, Performance +6, Stealth +5",
    "senses": "Percepção passiva 12",
    "languages": "Comum, Elvish, Sylvan",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência à Magia",
        "description": "O(a) satyr has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (2d4 + 1) dano de concussão.",
        "attackBonus": 3,
        "damage": "2d4+1"
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Arco curto",
        "description": "Ataque à distância com arma: +5 para acertar, range 80/96 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/satyr.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/satyr.png",
    "color": "#6B3FA0",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "pit-fiend",
    "name": "Senhor do Abismo",
    "nameEn": "Pit Fiend",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e mau",
    "ac": 19,
    "hp": 300,
    "hitDice": "24d10",
    "cr": "20",
    "xp": 25000,
    "speed": "caminhada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 26,
      "dexterity": 14,
      "constitution": 24,
      "intelligence": 22,
      "wisdom": 18,
      "charisma": 24
    },
    "skills": "—",
    "senses": "visão verdadeira 36 m, Percepção passiva 14",
    "languages": "Infernal, telepathy 36 m",
    "damageResistances": "cold, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Fear Aura",
        "description": "Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Sabedoria teste de resistência, unless the pit fiend is incapacitated. On a failed save, the creature is amedrontado until the start of its next turn. If a creature's teste de resistência is successful, the creature is immune to the pit fiend's Fear Aura for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) pit fiend has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) pit fiend's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) pit fiend's Conjuração ability is Carisma (spell save DC 21). O(a) pit fiend can innately cast the following spells, requiring no material components:\nAt will: detect magic, fireball\n3/day each: hold monster, wall of fire",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) pit fiend makes four attacks: one with its Mordida, one with its Garra, one with its mace, and one with its Cauda.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 1.5 m, um alvo. Acerto: 22 (4d6 + 8) dano perfurante. O(a) target must succeed on a DC 21 Constituição teste de resistência or become envenenado. While envenenado in this way, the target can't regain hit points, and it takes 21 (6d6) dano de veneno at the start of each of its turns. O(a) envenenado target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success.",
        "attackBonus": 14,
        "damage": "4d6+8"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 17 (2d8 + 8) dano cortante.",
        "attackBonus": 14,
        "damage": "2d8+8"
      },
      {
        "name": "Mace",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 15 (2d6 + 8) dano de concussão plus 21 (6d6) dano de fogo.",
        "attackBonus": 14,
        "damage": "2d6+8"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 m, um alvo. Acerto: 24 (3d10 + 8) dano de concussão.",
        "attackBonus": 14,
        "damage": "3d10+8"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/pit-fiend.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/pit-fiend.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "solar",
    "name": "Solar",
    "nameEn": "Solar",
    "type": "celestial",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e bom",
    "ac": 21,
    "hp": 243,
    "hitDice": "18d10",
    "cr": "21",
    "xp": 33000,
    "speed": "caminhada: 15 m; voo: 45 m",
    "abilities": {
      "strength": 26,
      "dexterity": 22,
      "constitution": 26,
      "intelligence": 25,
      "wisdom": 25,
      "charisma": 30
    },
    "skills": "Perception +14",
    "senses": "visão verdadeira 36 m, Percepção passiva 24",
    "languages": "all, telepathy 36 m",
    "damageResistances": "radiant, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "enfeitiçado, Exaustão, amedrontado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Angelic Weapons",
        "description": "O(a) solar's weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 dano radiante (included in the attack).",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Divine Awareness",
        "description": "O(a) solar knows if it hears a lie.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) solar's spell caFerrão ability is Carisma (spell save DC 25). It can innately cast the following spells, requiring no material components:\nAt will: detect evil and good, invisibility (self only)\n3/day each: blade barrier, dispel evil and good, resurrection\n1/day each: commune, control weather",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) solar has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) solar faz dois ataques de Espada grande.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada grande",
        "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 1.5 m, um alvo. Acerto: 22 (4d6 + 8) dano cortante plus 27 (6d8) dano radiante.",
        "attackBonus": 15,
        "damage": "4d6+8 + 6d8"
      },
      {
        "name": "Slaying Arco longo",
        "description": "Ataque à distância com arma: +13 para acertar, range 150/180 m, um alvo. Acerto: 15 (2d8 + 6) dano perfurante plus 27 (6d8) dano radiante. If the target is a creature that has 190 hit points or fewer, it must succeed on a DC 15 Constituição teste de resistência or die.",
        "attackBonus": 13,
        "damage": "2d8+6 + 6d8"
      },
      {
        "name": "vooing Sword",
        "description": "O(a) solar releases its Espada grande to flutuar magically in an unoccupied space within 1.5 m of it. If the solar can see the sword, the solar can mentally command it as a ação bônus to voo up to 15 m and either make one attack against a target or return to the solar's hands. If the flutuaring sword is targeted by any effect, the solar is considered to be holding it. O(a) flutuaring sword falls if the solar dies.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Healing Touch",
        "description": "O(a) solar touches another creature. O(a) target magically regains 40 (8d8 + 4) hit points and is freed from any curse, disease, poison, blindness, or deafness.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Teleport",
        "description": "O(a) solar magically teleports, along with any equipment it is wearing or carrying, up to 36 m to an unoccupied space it can see.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Searing Burst (Costs 2 Actions)",
        "description": "O(a) solar emits magical, divine energy. Each creature of its choice in a 10-foot radius must make a DC 23 Destreza teste de resistência, taking 14 (4d6) dano de fogo plus 14 (4d6) dano radiante on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "4d6 + 4d6"
      },
      {
        "name": "Blinding Gaze (Costs 3 Actions)",
        "description": "O(a) solar targets uma criatura it can see within 9 m of it. If the target can see it, the target must succeed on a DC 15 Constituição teste de resistência or be Cego until magic such as the lesser restoration spell removes the blindness.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/solar.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/solar.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "shadow",
    "name": "Sombra",
    "nameEn": "Shadow",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "caótico e mau",
    "ac": 12,
    "hp": 16,
    "hitDice": "3d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 6,
      "dexterity": 14,
      "constitution": 13,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 8
    },
    "skills": "Stealth +4",
    "senses": "visão no escuro 18 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "acid, cold, fire, lightning, thunder, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "Exaustão, amedrontado, agarrado, paralisado, Petrificado, envenenado, caído, impedido",
    "damageVulnerabilities": "radiant",
    "traits": [
      {
        "name": "Amorphous",
        "description": "O(a) shadow can move through a space as narrow as 1 inch wide without squeezing.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Shadow Stealth",
        "description": "While in dim light or darkness, the shadow can take the Hide action as a ação bônus. Its stealth bonus is also improved to +6.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Sunlight Weakness",
        "description": "While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and teste de resistências.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Força Drain",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 9 (2d6 + 2) dano necrótico, and the target's Força score is reduced by 1d4. O(a) target dies if this reduces its Força to 0. Otherwise, the reduction lasts until the target finishes a short or long rest.\nIf a non-evil humanoid dies from this attack, a new shadow rises from the corpse 1d4 hours later.",
        "attackBonus": 4,
        "damage": "2d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/shadow.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/shadow.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "sprite",
    "name": "Sprite",
    "nameEn": "Sprite",
    "type": "fada",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "neutro e bom",
    "ac": 15,
    "hp": 2,
    "hitDice": "1d4",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 3 m; voo: 12 m",
    "abilities": {
      "strength": 3,
      "dexterity": 18,
      "constitution": 10,
      "intelligence": 14,
      "wisdom": 13,
      "charisma": 11
    },
    "skills": "Perception +3, Stealth +8",
    "senses": "Percepção passiva 13",
    "languages": "Comum, Elvish, Sylvan",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano cortante.",
        "attackBonus": 2,
        "damage": "1"
      },
      {
        "name": "Arco curto",
        "description": "Ataque à distância com arma: +6 para acertar, range 40/48 m, um alvo. Acerto: 1 dano perfurante, and the target must succeed on a DC 10 Constituição teste de resistência or become envenenado for 1 minute. If its teste de resistência result is 5 or lower, the envenenado target falls unconscious for the same duration, or until it takes damage or another creature takes an action to shake it awake.",
        "attackBonus": 6,
        "damage": "1"
      },
      {
        "name": "Heart Sight",
        "description": "O(a) sprite touches a creature and magically knows the creature's current emotional state. If the target fails a DC 10 Carisma teste de resistência, the sprite also knows the creature's alignment. Celestials, fiends, and undead automatically fail the teste de resistência.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Invisibility",
        "description": "O(a) sprite magically turns invisível until it attacks or casts a spell, or until its concentration ends (as if concentrating on a spell). Any equipment the sprite wears or carries is invisível with it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/sprite.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/sprite.png",
    "color": "#6B3FA0",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "stirge",
    "name": "Stirge",
    "nameEn": "Stirge",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 14,
    "hp": 2,
    "hitDice": "1d4",
    "cr": "0.125",
    "xp": 25,
    "speed": "caminhada: 3 m; voo: 12 m",
    "abilities": {
      "strength": 4,
      "dexterity": 16,
      "constitution": 11,
      "intelligence": 2,
      "wisdom": 8,
      "charisma": 6
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Blood Drain",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, uma criatura. Acerto: 5 (1d4 + 3) dano perfurante, and the stirge attaches to the target. While attached, the stirge doesn't attack. Instead, at the start of each of the stirge's turns, the target loses 5 (1d4 + 3) hit points due to blood loss.\nO(a) stirge can detach itself by spending 5 feet of its movement. It does so after it drains 10 hit points of blood from the target or the target dies. A creature, including the target, can use its action to detach the stirge.",
        "attackBonus": 5,
        "damage": "1d4+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/stirge.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/stirge.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "succubus-incubus",
    "name": "Súcubo/Íncubo",
    "nameEn": "Succubus/Incubus",
    "type": "demônio",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 15,
    "hp": 66,
    "hitDice": "12d8",
    "cr": "4",
    "xp": 1100,
    "speed": "caminhada: 9 m; voo: 18 m",
    "abilities": {
      "strength": 8,
      "dexterity": 17,
      "constitution": 13,
      "intelligence": 15,
      "wisdom": 12,
      "charisma": 20
    },
    "skills": "Deception +9, Insight +5, Perception +5, Persuasion +9, Stealth +7",
    "senses": "visão no escuro 18 m, Percepção passiva 15",
    "languages": "Abyssal, Comum, Infernal, telepathy 18 m",
    "damageResistances": "cold, fire, lightning, poison, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Telepathic Bond",
        "description": "O(a) fiend ignores the range restriction on its telepathy when communicating with a creature it has enfeitiçado. O(a) two don't even need to be on the same plane of existence.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Shapechanger",
        "description": "O(a) fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form. Without wings, the fiend loses its vooing speed. Other than its size and speed, its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Garra (Fiend Form Only)",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Charm",
        "description": "One humanoid the fiend can see within 30 feet of it must succeed on a DC 15 Sabedoria teste de resistência or be magically enfeitiçado for 1 day. O(a) enfeitiçado target obeys the fiend's verbal or telepathic commands. If the target suffers any harm or receives a suicidal command, it can repeat the teste de resistência, ending the effect on a success. If the target successfully saves against the effect, or if the effect on it ends, the target is immune to this fiend's Charm for the next 24 hours.\nO(a) fiend can have only um alvo enfeitiçado at a time. If it charms another, the effect on the previous target ends.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Draining Kiss",
        "description": "O(a) fiend kisses a creature enfeitiçado by it or a willing creature. O(a) target must make a DC 15 Constituição teste de resistência against this magic, taking 32 (5d10 + 5) dano psíquico on a failed save, or half as much damage on a successful one. O(a) target's hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. O(a) target dies if this effect reduces its hit point maximum to 0.",
        "attackBonus": null,
        "damage": "5d10+5"
      },
      {
        "name": "Etherealness",
        "description": "O(a) fiend magically enters the Ethereal Plane from the Material Plane, or vice versa.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/succubus-incubus.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/succubus-incubus.png",
    "color": "#5C1A1A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "rug-of-smothering",
    "name": "Tapete Sufocante",
    "nameEn": "Rug of Smothering",
    "type": "constructo",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 33,
    "hitDice": "6d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 3 m",
    "abilities": {
      "strength": 17,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 3,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 18 m (blind beyond this radius), Percepção passiva 6",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "Cego, enfeitiçado, Cego, amedrontado, paralisado, Petrificado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "description": "O(a) rug is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the rug must succeed on a Constituição teste de resistência against the caster's spell save DC or fall unconscious for 1 minute.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Damage Transfer",
        "description": "While it is grappling a creature, the rug takes only half the damage dealt to it, and the creature agarrado by the rug takes the other half.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "False Appearance",
        "description": "While the rug remains motionless, it is indiFerrãouishable from a normal rug.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Smother",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, one Medium or smaller creature. Acerto: O(a) creature is agarrado (escape DC 13). Until this grapple ends, the target is impedido, Cego, and at risk of suffocating, and the rug can't smother another target. In addition, at the start of each of the target's turns, the target takes 10 (2d6 + 3) dano de concussão.",
        "attackBonus": 5,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/rug-of-smothering.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/rug-of-smothering.png",
    "color": "#5A5A5A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "tarrasque",
    "name": "Tarrasque",
    "nameEn": "Tarrasque",
    "type": "monstruosidade",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "sem alinhamento",
    "ac": 25,
    "hp": 676,
    "hitDice": "33d20",
    "cr": "30",
    "xp": 155000,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 30,
      "dexterity": 11,
      "constitution": 30,
      "intelligence": 3,
      "wisdom": 11,
      "charisma": 11
    },
    "skills": "—",
    "senses": "visão às cegas 36 m, Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "fire, poison, bludgeoning, piercing, and slashing from nonmagical weapons",
    "conditionImmunities": "enfeitiçado, amedrontado, paralisado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) tarrasque has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Reflective Carapace",
        "description": "Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Siege Monster",
        "description": "O(a) tarrasque deals double damage to objects and structures.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) tarrasque can use its Frightful Presence. It then makes five attacks: one with its Mordida, two with its Garras, one with its Chifres, and one with its Cauda. It can use its Swallow instead of its Mordida.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 3 m, um alvo. Acerto: 36 (4d12 + 10) dano perfurante. If the target is a creature, it is agarrado (escape DC 20). Until this grapple ends, the target is impedido, and the tarrasque can't Mordida another target.",
        "attackBonus": 19,
        "damage": "4d12+10"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 4.5 m, um alvo. Acerto: 28 (4d8 + 10) dano cortante.",
        "attackBonus": 19,
        "damage": "4d8+10"
      },
      {
        "name": "Chifres",
        "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 3 m, um alvo. Acerto: 32 (4d10 + 10) dano perfurante.",
        "attackBonus": 19,
        "damage": "4d10+10"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 6 m, um alvo. Acerto: 24 (4d6 + 10) dano de concussão. If the target is a creature, it must succeed on a DC 20 Força teste de resistência or be knocked caído.",
        "attackBonus": 19,
        "damage": "4d6+10"
      },
      {
        "name": "Frightful Presence",
        "description": "Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Sabedoria teste de resistência or become amedrontado for 1 minute. A creature can repeat the teste de resistência at the end of each of its turns, with disadvantage if the tarrasque is within line of sight, ending the effect on itself on a success. If a creature's teste de resistência is successful or the effect ends for it, the creature is immune to the tarrasque's Frightful Presence for the next 24 hours.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Swallow",
        "description": "O(a) tarrasque makes one Mordida attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the Mordida's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is Cego and impedido, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) dano de ácido at the start of each of the tarrasque's turns.\nIf the tarrasque takes 60 damage or more on a single turn from a creature inside it, the tarrasque must succeed on a DC 20 Constituição teste de resistência at the end of that turn or regurgitate all swallowed creatures, which fall caído in a space within 10 feet of the tarrasque. If the tarrasque dies, a swallowed creature is no longer impedido by it and can escape from the corpse by using 30 feet of movement, exiting caído.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Attack",
        "description": "O(a) tarrasque makes one Garra attack or Cauda attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Move",
        "description": "O(a) tarrasque moves up to half its speed.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Chomp (Costs 2 Actions)",
        "description": "O(a) tarrasque makes one Mordida attack or uses its Swallow.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/tarrasque.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/tarrasque.png",
    "color": "#4A2F18",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "dragon-turtle",
    "name": "Tartaruga-Dragão",
    "nameEn": "Dragon Turtle",
    "type": "dragão",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "neutro",
    "ac": 20,
    "hp": 341,
    "hitDice": "22d20",
    "cr": "17",
    "xp": 18000,
    "speed": "caminhada: 6 m; natação: 12 m",
    "abilities": {
      "strength": 25,
      "dexterity": 10,
      "constitution": 20,
      "intelligence": 10,
      "wisdom": 12,
      "charisma": 12
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 11",
    "languages": "Aquan, Draconic",
    "damageResistances": "fire",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Anfíbio",
        "description": "O(a) dragon turtle can breathe air and water.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) dragon turtle faz três ataques de attacks: one with its Mordida and two with its Garras. It can make one Cauda attack in place of its two Garra.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 4.5 m, um alvo. Acerto: 26 (3d12 + 7) dano perfurante.",
        "attackBonus": 13,
        "damage": "3d12+7"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 m, um alvo. Acerto: 16 (2d8 + 7) dano cortante.",
        "attackBonus": 13,
        "damage": "2d8+7"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 4.5 m, um alvo. Acerto: 26 (3d12 + 7) dano de concussão. If the target is a creature, it must succeed on a DC 20 Força teste de resistência or be pushed up to 10 feet away from the dragon turtle and knocked caído.",
        "attackBonus": 13,
        "damage": "3d12+7"
      },
      {
        "name": "Steam Breath",
        "description": "O(a) dragon turtle exhales scalding steam in a 60-foot cone. Each creature in that area must make a DC 18 Constituição teste de resistência, taking 52 (15d6) dano de fogo on a failed save, or half as much damage on a successful one. Being underwater doesn't grant resistance against this damage.",
        "attackBonus": null,
        "damage": "15d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/dragon-turtle.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/dragon-turtle.png",
    "color": "#7A2530",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "badger",
    "name": "Texugo",
    "nameEn": "Badger",
    "type": "fera",
    "size": "Tiny",
    "sizeLabel": "Miúdo",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 3,
    "hitDice": "1d4",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 6 m; escavação: 1.5 m",
    "abilities": {
      "strength": 4,
      "dexterity": 11,
      "constitution": 12,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 9 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) badger has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 1.5 m, um alvo. Acerto: 1 dano perfurante.",
        "attackBonus": 2,
        "damage": "1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/badger.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/badger.png",
    "color": "#3F5B34",
    "tokenSize": 32,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-badger",
    "name": "Texugo Gigante",
    "nameEn": "Giant Badger",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 10,
    "hp": 13,
    "hitDice": "2d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 9 m; escavação: 3 m",
    "abilities": {
      "strength": 13,
      "dexterity": 10,
      "constitution": 15,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 9 m, Percepção passiva 11",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) badger has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) badger makes two attacks: one with its Mordida and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d6+1"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (2d4 + 1) dano cortante.",
        "attackBonus": 3,
        "damage": "2d4+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-badger.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-badger.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "tiger",
    "name": "Tigre",
    "nameEn": "Tiger",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 37,
    "hitDice": "5d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 14,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 8
    },
    "skills": "Perception +3, Stealth +6",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) tiger has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pounce",
        "description": "If the tiger moves at least 6 m straight toward a creature and then hits it with a Garra attack on the same turn, that target must succeed on a DC 13 Força teste de resistência or be knocked caído. If the target is caído, the tiger can make one Mordida attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d10 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d10+3"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano cortante.",
        "attackBonus": 5,
        "damage": "1d8+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/tiger.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/tiger.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "saber-toothed-tiger",
    "name": "Tigre-Dentes-de-Sabre",
    "nameEn": "Saber-Toothed Tiger",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 52,
    "hitDice": "7d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 14,
      "constitution": 15,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 8
    },
    "skills": "Perception +3, Stealth +6",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) tiger has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Pounce",
        "description": "If the tiger moves at least 6 m straight toward a creature and then hits it with a Garra attack on the same turn, that target must succeed on a DC 14 Força teste de resistência or be knocked caído. If the target is caído, the tiger can make one Mordida attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (1d10 + 5) dano perfurante.",
        "attackBonus": 6,
        "damage": "1d10+5"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 12 (2d6 + 5) dano cortante.",
        "attackBonus": 6,
        "damage": "2d6+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/saber-toothed-tiger.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/saber-toothed-tiger.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "tyrannosaurus-rex",
    "name": "Tiranossauro Rex",
    "nameEn": "Tyrannosaurus Rex",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 136,
    "hitDice": "13d12",
    "cr": "8",
    "xp": 3900,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 25,
      "dexterity": 10,
      "constitution": 19,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 9
    },
    "skills": "Perception +4",
    "senses": "Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) tyrannosaurus faz dois ataques de attacks: one with its Mordida and one with its Cauda. It can't make both against the same target.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 33 (4d12 + 7) dano perfurante. If the target is a Medium or smaller creature, it is agarrado (escape DC 17). Until this grapple ends, the target is impedido, and the tyrannosaurus can't Mordida another target.",
        "attackBonus": 10,
        "damage": "4d12+7"
      },
      {
        "name": "Cauda",
        "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 m, um alvo. Acerto: 20 (3d8 + 7) dano de concussão.",
        "attackBonus": 10,
        "damage": "3d8+7"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/tyrannosaurus-rex.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/tyrannosaurus-rex.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "triceratops",
    "name": "Tricerátopo",
    "nameEn": "Triceratops",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 95,
    "hitDice": "10d12",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 22,
      "dexterity": 9,
      "constitution": 17,
      "intelligence": 2,
      "wisdom": 11,
      "charisma": 5
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Trampling Charge",
        "description": "If the triceratops moves at least 6 m straight toward a creature and then hits it with a Chifrada attack on the same turn, that target must succeed on a DC 13 Força teste de resistência or be knocked caído. If the target is caído, the triceratops can make one stomp attack against it as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Chifrada",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 24 (4d8 + 6) dano perfurante.",
        "attackBonus": 9,
        "damage": "4d8+6"
      },
      {
        "name": "Stomp",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, one pruma criatura. Acerto: 22 (3d10 + 6) dano de concussão",
        "attackBonus": 9,
        "damage": "3d10+6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/triceratops.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/triceratops.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "troll",
    "name": "Troll",
    "nameEn": "Troll",
    "type": "gigante",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 15,
    "hp": 84,
    "hitDice": "8d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 13,
      "constitution": 20,
      "intelligence": 7,
      "wisdom": 9,
      "charisma": 7
    },
    "skills": "Perception +2",
    "senses": "visão no escuro 18 m, Percepção passiva 12",
    "languages": "Giant",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) troll has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Regeneration",
        "description": "O(a) troll regains 10 hit points at the start of its turn. If the troll takes acid or dano de fogo, this trait doesn't function at the start of the troll's next turn. O(a) troll dies only if it starts its turn with 0 hit points and doesn't regenerate.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) troll makes three attacks: one with its Mordida and two with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d6 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "1d6+4"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/troll.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/troll.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "hunter-shark",
    "name": "Tubarão Caçador",
    "nameEn": "Hunter Shark",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 45,
    "hitDice": "6d10",
    "cr": "2",
    "xp": 450,
    "speed": "natação: 12 m",
    "abilities": {
      "strength": 18,
      "dexterity": 13,
      "constitution": 15,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 4
    },
    "skills": "Perception +2",
    "senses": "visão no escuro 9 m, Percepção passiva 12",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Blood Frenzy",
        "description": "O(a) shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) shark can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano perfurante.",
        "attackBonus": 6,
        "damage": "2d8+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/hunter-shark.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/hunter-shark.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-shark",
    "name": "Tubarão Gigante",
    "nameEn": "Giant Shark",
    "type": "fera",
    "size": "Huge",
    "sizeLabel": "Enorme",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 126,
    "hitDice": "11d12",
    "cr": "5",
    "xp": 1800,
    "speed": "natação: 15 m",
    "abilities": {
      "strength": 23,
      "dexterity": 11,
      "constitution": 21,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 5
    },
    "skills": "Perception +3",
    "senses": "visão às cegas 18 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Blood Frenzy",
        "description": "O(a) shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Water Breathing",
        "description": "O(a) shark can breathe only underwater.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, um alvo. Acerto: 22 (3d10 + 6) dano perfurante.",
        "attackBonus": 9,
        "damage": "3d10+6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-shark.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-shark.png",
    "color": "#3F5B34",
    "tokenSize": 80,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "shrieker",
    "name": "Uivador",
    "nameEn": "Shrieker",
    "type": "planta",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 5,
    "hp": 13,
    "hitDice": "3d8",
    "cr": "0",
    "xp": 10,
    "speed": "caminhada: 0 m",
    "abilities": {
      "strength": 1,
      "dexterity": 1,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 3,
      "charisma": 1
    },
    "skills": "—",
    "senses": "visão às cegas 9 m (blind beyond this radius), Percepção passiva 6",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "Cego, Cego, amedrontado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "False Appearance",
        "description": "While the shrieker remains motionless, it is indiFerrãouishable from an ordinary fungus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [],
    "reactions": [
      {
        "name": "Shriek",
        "description": "When bright light or a creature is within 30 feet of the shrieker, it emits a shriek audible within 300 feet of it. O(a) shrieker continues to shriek until the disturbance moves out of range and for 1d4 of the shrieker's turns afterward",
        "attackBonus": null,
        "damage": null
      }
    ],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/shrieker.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/shrieker.png",
    "color": "#2F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "unicorn",
    "name": "Unicórnio",
    "nameEn": "Unicorn",
    "type": "celestial",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "leal e bom",
    "ac": 12,
    "hp": 67,
    "hitDice": "9d10",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 18,
      "dexterity": 14,
      "constitution": 15,
      "intelligence": 11,
      "wisdom": 17,
      "charisma": 16
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "Celestial, Elvish, Sylvan, telepathy 18 m",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "enfeitiçado, paralisado, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Charge",
        "description": "If the unicorn moves at least 6 m straight toward a target and then hits it with a Chifre attack on the same turn, the target takes an extra 9 (2d8) dano perfurante. If the target is a creature, it must succeed on a DC 15 Força teste de resistência or be knocked caído.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Conjuração Inata",
        "description": "O(a) unicorn's Conjuração Inata ability is Carisma (spell save DC 14). O(a) unicorn can innately cast the following spells, requiring no components:\n\nAt will: detect evil and good, druidcraft, pass without trace\n1/day each: calm emotions, dispel evil and good, entangle",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência à Magia",
        "description": "O(a) unicorn has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Magic Weapons",
        "description": "O(a) unicorn's weapon attacks are magical.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) unicorn makes two attacks: one with its hooves and one with its Chifre.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Hooves",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano de concussão.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Chifre",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d8 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "1d8+4"
      },
      {
        "name": "Healing Touch",
        "description": "O(a) unicorn touches another creature with its Chifre. O(a) target magically regains 11 (2d8 + 2) hit points. In addition, the touch removes all diseases and neutralizes all poisons afflicting the target.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Teleport",
        "description": "O(a) unicorn magically teleports itself and up to three willing creatures it can see within 1.5 m of it, along with any equipment they are wearing or carrying, to a location the unicorn is familiar with, up to 1 mile away.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Hooves",
        "description": "O(a) unicorn makes one attack with its hooves.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Shimmering Shield (Costs 2 Actions)",
        "description": "O(a) unicorn creates a shimmering, magical field around itself or another creature it can see within 18 m of it. O(a) target gains a +2 bonus to AC until the end of the unicorn's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Heal Self (Costs 3 Actions)",
        "description": "O(a) unicorn magically regains 11 (2d8 + 2) hit points.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/unicorn.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/unicorn.png",
    "color": "#8A5A1E",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "black-bear",
    "name": "Urso Negro",
    "nameEn": "Black Bear",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 19,
    "hitDice": "3d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 12 m; escalada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 10,
      "constitution": 14,
      "intelligence": 2,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "—",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) bear has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) bear makes two attacks: one with its Mordida and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 5 (1d6 + 2) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d6+2"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (2d4 + 2) dano cortante.",
        "attackBonus": 3,
        "damage": "2d4+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/black-bear.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/black-bear.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "brown-bear",
    "name": "Urso Pardo",
    "nameEn": "Brown Bear",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 11,
    "hp": 34,
    "hitDice": "4d10",
    "cr": "1",
    "xp": 200,
    "speed": "caminhada: 12 m; escalada: 9 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 16,
      "intelligence": 2,
      "wisdom": 13,
      "charisma": 7
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) bear has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) bear makes two attacks: one with its Mordida and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 8 (1d8 + 4) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d8+4"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 11 (2d6 + 4) dano cortante.",
        "attackBonus": 5,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/brown-bear.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/brown-bear.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "polar-bear",
    "name": "Urso Polar",
    "nameEn": "Polar Bear",
    "type": "fera",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 42,
    "hitDice": "5d10",
    "cr": "2",
    "xp": 450,
    "speed": "caminhada: 12 m; natação: 9 m",
    "abilities": {
      "strength": 20,
      "dexterity": 10,
      "constitution": 16,
      "intelligence": 2,
      "wisdom": 13,
      "charisma": 7
    },
    "skills": "Perception +3",
    "senses": "Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Olfato Aguçado",
        "description": "O(a) bear has advantage on Sabedoria (Perception) checks that rely on smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) bear makes two attacks: one with its Mordida and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 9 (1d8 + 5) dano perfurante.",
        "attackBonus": 7,
        "damage": "1d8+5"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 12 (2d6 + 5) dano cortante.",
        "attackBonus": 7,
        "damage": "2d6+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/polar-bear.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/polar-bear.png",
    "color": "#3F5B34",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "owlbear",
    "name": "Urso-Coruja",
    "nameEn": "Owlbear",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 59,
    "hitDice": "7d10",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 12 m",
    "abilities": {
      "strength": 20,
      "dexterity": 12,
      "constitution": 17,
      "intelligence": 3,
      "wisdom": 12,
      "charisma": 7
    },
    "skills": "Perception +3",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Visão Aguçada and Smell",
        "description": "O(a) owlbear has advantage on Sabedoria (Perception) checks that rely on sight or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) owlbear makes two attacks: one with its beak and one with its Garras.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, uma criatura. Acerto: 10 (1d10 + 5) dano perfurante.",
        "attackBonus": 7,
        "damage": "1d10+5"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d8 + 5) dano cortante.",
        "attackBonus": 7,
        "damage": "2d8+5"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/owlbear.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/owlbear.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "vampire-bat",
    "name": "Vampire, Bat Form",
    "nameEn": "Vampire, Bat Form",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 16,
    "hp": 144,
    "hitDice": "17d8",
    "cr": "13",
    "xp": 10000,
    "speed": "caminhada: 1.5 m; voo: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 18,
      "constitution": 18,
      "intelligence": 17,
      "wisdom": 15,
      "charisma": 18
    },
    "skills": "Perception +7, Stealth +9",
    "senses": "visão no escuro 36 m, Percepção passiva 17",
    "languages": "the languages it knew in life",
    "damageResistances": "necrotic, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form.\nWhile in bat form, the vampire Não pode falar, its caminhadaing speed is 5 feet, and it has a vooing speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies.\nWhile in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a vooing speed of 20 feet, can flutuar, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Força, Destreza, and Constituição teste de resistências, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Misty Escape",
        "description": "When it drops to 0 hit points outside its reFerrão place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed.\nWhile it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its reFerrão place within 2 hours or be destroyed. Once in its reFerrão place, it reverts to its vampire form. It is then paralisado until it regains at least 1 hit point. After spending 1 hour in its reFerrão place with 0 hit points, it regains 1 hit point.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Regeneration",
        "description": "O(a) vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes dano radiante or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) vampire can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Vampire Weaknesses",
        "description": "O(a) vampire has the following flaws:\nForbiddance. O(a) vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. O(a) vampire takes 20 dano de ácido if it ends its turn in running water.\nStake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its reFerrão place, the vampire is paralisado until the stake is removed.\nSunlight Hypersensitivity. O(a) vampire takes 20 dano radiante when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, one willing creature, or a creature that is agarrado by the vampire, incapacitated, or impedido. Acerto: 7 (1d6 + 4) dano perfurante plus 10 (3d6) dano necrótico. O(a) target's hit point maximum is reduced by an amount equal to the dano necrótico taken, and the vampire regains hit points equal to that amount. O(a) reduction lasts until the target finishes a long rest. O(a) target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control.",
        "attackBonus": 9,
        "damage": "1d6+4 + 3d6"
      },
      {
        "name": "Charm",
        "description": "O(a) vampire targets one humanoid it can see within 9 m of it. If the target can see the vampire, the target must succeed on a DC 17 Sabedoria teste de resistência against this magic or be enfeitiçado by the vampire. O(a) enfeitiçado target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack.\nEach time the vampire or the vampire's companions do anything harmful to the target, it can repeat the teste de resistência, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a ação bônus to end the effect.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Children of the Night",
        "description": "O(a) vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. O(a) called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. O(a) beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Move",
        "description": "O(a) vampire moves up to its speed without provoking opportunity attacks.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Unarmed Strike",
        "description": "O(a) vampire makes one unarmed strike.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Mordida (Costs 2 Actions)",
        "description": "O(a) vampire makes one Mordida attack.",
        "attackBonus": 0,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-bat.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-bat.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "vampire-mist",
    "name": "Vampire, Mist Form",
    "nameEn": "Vampire, Mist Form",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 16,
    "hp": 144,
    "hitDice": "17d8",
    "cr": "13",
    "xp": 10000,
    "speed": "voo: 6 m",
    "abilities": {
      "strength": 18,
      "dexterity": 18,
      "constitution": 18,
      "intelligence": 17,
      "wisdom": 15,
      "charisma": 18
    },
    "skills": "Perception +7, Stealth +9",
    "senses": "visão no escuro 36 m, Percepção passiva 17",
    "languages": "the languages it knew in life",
    "damageResistances": "necrotic, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form.\nWhile in bat form, the vampire Não pode falar, its caminhadaing speed is 5 feet, and it has a vooing speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies.\nWhile in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a vooing speed of 20 feet, can flutuar, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Força, Destreza, and Constituição teste de resistências, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Misty Escape",
        "description": "When it drops to 0 hit points outside its reFerrão place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed.\nWhile it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its reFerrão place within 2 hours or be destroyed. Once in its reFerrão place, it reverts to its vampire form. It is then paralisado until it regains at least 1 hit point. After spending 1 hour in its reFerrão place with 0 hit points, it regains 1 hit point.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Regeneration",
        "description": "O(a) vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes dano radiante or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) vampire can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Vampire Weaknesses",
        "description": "O(a) vampire has the following flaws:\nForbiddance. O(a) vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. O(a) vampire takes 20 dano de ácido if it ends its turn in running water.\nStake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its reFerrão place, the vampire is paralisado until the stake is removed.\nSunlight Hypersensitivity. O(a) vampire takes 20 dano radiante when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Move",
        "description": "O(a) vampire moves up to its speed without provoking opportunity attacks.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Unarmed Strike",
        "description": "O(a) vampire makes one unarmed strike.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Mordida (Costs 2 Actions)",
        "description": "O(a) vampire makes one Mordida attack.",
        "attackBonus": 0,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-mist.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-mist.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "vampire-vampire",
    "name": "Vampire, Vampire Form",
    "nameEn": "Vampire, Vampire Form",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "leal e mau",
    "ac": 16,
    "hp": 144,
    "hitDice": "17d8",
    "cr": "13",
    "xp": 10000,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 18,
      "dexterity": 18,
      "constitution": 18,
      "intelligence": 17,
      "wisdom": 15,
      "charisma": 18
    },
    "skills": "Perception +7, Stealth +9",
    "senses": "visão no escuro 36 m, Percepção passiva 17",
    "languages": "the languages it knew in life",
    "damageResistances": "necrotic, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Shapechanger",
        "description": "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form.\nWhile in bat form, the vampire Não pode falar, its caminhadaing speed is 5 feet, and it has a vooing speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies.\nWhile in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a vooing speed of 20 feet, can flutuar, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Força, Destreza, and Constituição teste de resistências, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Resistência Lendária",
        "description": "Se falhar em um teste de resistência, pode escolher ter sucesso em vez disso.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Misty Escape",
        "description": "When it drops to 0 hit points outside its reFerrão place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed.\nWhile it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its reFerrão place within 2 hours or be destroyed. Once in its reFerrão place, it reverts to its vampire form. It is then paralisado until it regains at least 1 hit point. After spending 1 hour in its reFerrão place with 0 hit points, it regains 1 hit point.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Regeneration",
        "description": "O(a) vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes dano radiante or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Spider escalada",
        "description": "O(a) vampire can escalada difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Vampire Weaknesses",
        "description": "O(a) vampire has the following flaws:\nForbiddance. O(a) vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. O(a) vampire takes 20 dano de ácido if it ends its turn in running water.\nStake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its reFerrão place, the vampire is paralisado until the stake is removed.\nSunlight Hypersensitivity. O(a) vampire takes 20 dano radiante when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) vampire makes two attacks, only one of which can be a Mordida attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Unarmed Strike",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, uma criatura. Acerto: 8 (1d8 + 4) dano de concussão. Instead of dealing damage, the vampire can grapple the target (escape DC 18).",
        "attackBonus": 9,
        "damage": "1d8+4"
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1.5 m, one willing creature, or a creature that is agarrado by the vampire, incapacitated, or impedido. Acerto: 7 (1d6 + 4) dano perfurante plus 10 (3d6) dano necrótico. O(a) target's hit point maximum is reduced by an amount equal to the dano necrótico taken, and the vampire regains hit points equal to that amount. O(a) reduction lasts until the target finishes a long rest. O(a) target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control.",
        "attackBonus": 9,
        "damage": "1d6+4 + 3d6"
      },
      {
        "name": "Charm",
        "description": "O(a) vampire targets one humanoid it can see within 9 m of it. If the target can see the vampire, the target must succeed on a DC 17 Sabedoria teste de resistência against this magic or be enfeitiçado by the vampire. O(a) enfeitiçado target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack.\nEach time the vampire or the vampire's companions do anything harmful to the target, it can repeat the teste de resistência, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a ação bônus to end the effect.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Children of the Night",
        "description": "O(a) vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. O(a) called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. O(a) beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a ação bônus.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [
      {
        "name": "Move",
        "description": "O(a) vampire moves up to its speed without provoking opportunity attacks.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Unarmed Strike",
        "description": "O(a) vampire makes one unarmed strike.",
        "attackBonus": 0,
        "damage": null
      },
      {
        "name": "Mordida (Costs 2 Actions)",
        "description": "O(a) vampire makes one Mordida attack.",
        "attackBonus": 0,
        "damage": null
      }
    ],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-vampire.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/vampire-vampire.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "purple-worm",
    "name": "Verme Púrpura",
    "nameEn": "Purple Worm",
    "type": "monstruosidade",
    "size": "Gargantuan",
    "sizeLabel": "Imenso",
    "alignment": "sem alinhamento",
    "ac": 18,
    "hp": 247,
    "hitDice": "15d20",
    "cr": "15",
    "xp": 13000,
    "speed": "caminhada: 15 m; escavação: 9 m",
    "abilities": {
      "strength": 28,
      "dexterity": 7,
      "constitution": 22,
      "intelligence": 1,
      "wisdom": 8,
      "charisma": 4
    },
    "skills": "—",
    "senses": "visão às cegas 9 m, sentido sísmico 18 m, Percepção passiva 9",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Tunneler",
        "description": "O(a) worm can escavação through solid Rocha at half its escavação speed and leaves a 10-foot-diameter tunnel in its wake.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) worm makes two attacks: one with its Mordida and one with its Ferrãoer.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, um alvo. Acerto: 22 (3d8 + 9) dano perfurante. If the target is a Large or smaller creature, it must succeed on a DC 19 Destreza teste de resistência or be swallowed by the worm. A swallowed creature is Cego and impedido, it has total cover against attacks and other effects outside the worm, and it takes 21 (6d6) dano de ácido at the start of each of the worm's turns.\nIf the worm takes 30 damage or more on a single turn from a creature inside it, the worm must succeed on a DC 21 Constituição teste de resistência at the end of that turn or regurgitate all swallowed creatures, which fall caído in a space within 10 feet of the worm. If the worm dies, a swallowed creature is no longer impedido by it and can escape from the corpse by using 20 feet of movement, exiting caído.",
        "attackBonus": 9,
        "damage": "3d8+9"
      },
      {
        "name": "Cauda Ferrãoer",
        "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 m, uma criatura. Acerto: 19 (3d6 + 9) dano perfurante, and the target must make a DC 19 Constituição teste de resistência, taking 42 (12d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 9,
        "damage": "3d6+9"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/purple-worm.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/purple-worm.png",
    "color": "#4A2F18",
    "tokenSize": 96,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "giant-wasp",
    "name": "Vespa Gigante",
    "nameEn": "Giant Wasp",
    "type": "fera",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "sem alinhamento",
    "ac": 12,
    "hp": 13,
    "hitDice": "3d8",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 3 m; voo: 15 m; natação: 15 m",
    "abilities": {
      "strength": 10,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 1,
      "wisdom": 10,
      "charisma": 3
    },
    "skills": "—",
    "senses": "Percepção passiva 10",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ferrão",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 5 (1d6 + 2) dano perfurante, and the target must make a DC 11 Constituição teste de resistência, taking 10 (3d6) dano de veneno on a failed save, or half as much damage on a successful one. If the dano de veneno reduces the target to 0 hit points, the target is stable but envenenado for 1 hour, even after regaining hit points, and is paralisado while envenenado in this way.",
        "attackBonus": 4,
        "damage": "1d6+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-wasp.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/giant-wasp.png",
    "color": "#3F5B34",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "veteran",
    "name": "Veterano",
    "nameEn": "Veteran",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 17,
    "hp": 58,
    "hitDice": "9d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "Athletics +5, Perception +2",
    "senses": "Percepção passiva 12",
    "languages": "any one language (usually Comum)",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) veteran faz dois ataques de Espada longa. If it has a Espada curta drawn, it can also make a Espada curta attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano cortante, or 8 (1d10 + 3) dano cortante if used with two hands.",
        "attackBonus": 5,
        "damage": null
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Heavy Besta",
        "description": "Ataque à distância com arma: +3 para acertar, range 100/120 m, um alvo. Acerto: 6 (1d10 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d10+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/veteran.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/veteran.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "half-red-dragon-veteran",
    "name": "Veterano Meio-Dragão Vermelho",
    "nameEn": "Half-Red Dragon Veteran",
    "type": "humanoide",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "qualquer alinhamento",
    "ac": 18,
    "hp": 65,
    "hitDice": "10d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 16,
      "dexterity": 13,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 11,
      "charisma": 10
    },
    "skills": "—",
    "senses": "visão às cegas 3 m, visão no escuro 18 m, Percepção passiva 12",
    "languages": "Comum, Draconic",
    "damageResistances": "fire",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) veteran faz dois ataques de Espada longa. If it has a Espada curta drawn, it can also make a Espada curta attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 7 (1d8 + 3) dano cortante, or 8 (1d10 + 3) dano cortante if used with two hands.",
        "attackBonus": 5,
        "damage": null
      },
      {
        "name": "Espada curta",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano perfurante.",
        "attackBonus": 5,
        "damage": "1d6+3"
      },
      {
        "name": "Heavy Besta",
        "description": "Ataque à distância com arma: +3 para acertar, range 100/120 m, um alvo. Acerto: 6 (1d10 + 1) dano perfurante.",
        "attackBonus": 3,
        "damage": "1d10+1"
      },
      {
        "name": "Fire Breath",
        "description": "O(a) veteran exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Destreza teste de resistência, taking 24 (7d6) dano de fogo on a failed save, or half as much damage on a successful one.",
        "attackBonus": null,
        "damage": "7d6"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/half-red-dragon-veteran.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/half-red-dragon-veteran.png",
    "color": "#6B4423",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "vrock",
    "name": "Vrock",
    "nameEn": "Vrock",
    "type": "demônio",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "caótico e mau",
    "ac": 15,
    "hp": 104,
    "hitDice": "11d10",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 12 m; voo: 18 m",
    "abilities": {
      "strength": 17,
      "dexterity": 15,
      "constitution": 18,
      "intelligence": 8,
      "wisdom": 13,
      "charisma": 8
    },
    "skills": "—",
    "senses": "visão no escuro 36 m, Percepção passiva 11",
    "languages": "Abyssal, telepathy 36 m",
    "damageResistances": "cold, fire, lightning, bludgeoning, piercing, and slashing from nonmagical weapons",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Resistência à Magia",
        "description": "O(a) vRocha has advantage on teste de resistências against spells and other magical effects.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) vRocha makes two attacks: one with its beak and one with its talons.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Beak",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano perfurante.",
        "attackBonus": 6,
        "damage": "2d6+3"
      },
      {
        "name": "Talons",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 14 (2d10 + 3) dano cortante.",
        "attackBonus": 6,
        "damage": "2d10+3"
      },
      {
        "name": "Spores",
        "description": "A 15-foot-radius cloud of toxic spores extends out from the vRocha. O(a) spores spread around corners. Each creature in that area must succeed on a DC 14 Constituição teste de resistência or become envenenado. While envenenado in this way, a target takes 5 (1d10) dano de veneno at the start of each of its turns. A target can repeat the teste de resistência at the end of each of its turns, ending the effect on itself on a success. Emptying a vial of holy water on the target also ends the effect on it.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Stunning Screech",
        "description": "O(a) vRocha emits a horrific screech. Each creature within 20 feet of it that can hear it and that isn't a demon must succeed on a DC 14 Constituição teste de resistência or be atordoado until the end of the vRocha's next turn .",
        "attackBonus": null,
        "damage": null
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/vrock.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/vrock.png",
    "color": "#5C1A1A",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wight",
    "name": "Wight",
    "nameEn": "Wight",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 14,
    "hp": 45,
    "hitDice": "6d8",
    "cr": "3",
    "xp": 700,
    "speed": "caminhada: 9 m",
    "abilities": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 16,
      "intelligence": 10,
      "wisdom": 13,
      "charisma": 15
    },
    "skills": "Perception +3, Stealth +4",
    "senses": "visão no escuro 18 m, Percepção passiva 13",
    "languages": "the languages it knew in life",
    "damageResistances": "necrotic, bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    "damageImmunities": "poison",
    "conditionImmunities": "Exaustão, envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Sunlight Sensitivity",
        "description": "While in sunlight, the wight has disadvantage on attack rolls, as well as on Sabedoria (Perception) checks that rely on sight.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) wight faz dois ataques de Espada longa or two Arco longo attacks. It can use its Life Drain in place of one Espada longa attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Life Drain",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, uma criatura. Acerto: 5 (1d6 + 2) dano necrótico. O(a) target must succeed on a DC 13 Constituição teste de resistência or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. O(a) target dies if this effect reduces its hit point maximum to 0.\nA humanoid slain by this attack rises 24 hours later as a zombie under the wight's control, unless the humanoid is restored to life or its body is destroyed. O(a) wight can have no more than twelve zombies under its control at one time.",
        "attackBonus": 4,
        "damage": "1d6+2"
      },
      {
        "name": "Espada longa",
        "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d8 + 2) dano cortante, or 7 (1d10 + 2) dano cortante if used with two hands.",
        "attackBonus": 4,
        "damage": null
      },
      {
        "name": "Arco longo",
        "description": "Ataque à distância com arma: +4 para acertar, range 150/180 m, um alvo. Acerto: 6 (1d8 + 2) dano perfurante.",
        "attackBonus": 4,
        "damage": "1d8+2"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wight.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wight.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "worg",
    "name": "Worg",
    "nameEn": "Worg",
    "type": "monstruosidade",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "neutro e mau",
    "ac": 13,
    "hp": 26,
    "hitDice": "4d10",
    "cr": "0.5",
    "xp": 100,
    "speed": "caminhada: 15 m",
    "abilities": {
      "strength": 16,
      "dexterity": 13,
      "constitution": 13,
      "intelligence": 7,
      "wisdom": 11,
      "charisma": 8
    },
    "skills": "Perception +4",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "Goblin, Worg",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Audição Aguçada and Smell",
        "description": "O(a) worg has advantage on Sabedoria (Perception) checks that rely on hearing or smell.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1.5 m, um alvo. Acerto: 10 (2d6 + 3) dano perfurante. If the target is a creature, it must succeed on a DC 13 Força teste de resistência or be knocked caído.",
        "attackBonus": 5,
        "damage": "2d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/worg.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/worg.png",
    "color": "#4A2F18",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "wyvern",
    "name": "Wyvern",
    "nameEn": "Wyvern",
    "type": "dragão",
    "size": "Large",
    "sizeLabel": "Grande",
    "alignment": "sem alinhamento",
    "ac": 13,
    "hp": 110,
    "hitDice": "13d10",
    "cr": "6",
    "xp": 2300,
    "speed": "caminhada: 6 m; voo: 24 m",
    "abilities": {
      "strength": 19,
      "dexterity": 10,
      "constitution": 16,
      "intelligence": 5,
      "wisdom": 12,
      "charisma": 6
    },
    "skills": "Perception +4",
    "senses": "visão no escuro 18 m, Percepção passiva 14",
    "languages": "—",
    "damageResistances": "—",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) wyvern makes two attacks: one with its Mordida and one with its Ferrãoer. While vooing, it can use its Garras in place of one other attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, uma criatura. Acerto: 11 (2d6 + 4) dano perfurante.",
        "attackBonus": 7,
        "damage": "2d6+4"
      },
      {
        "name": "Garras",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (2d8 + 4) dano cortante.",
        "attackBonus": 7,
        "damage": "2d8+4"
      },
      {
        "name": "Ferrãoer",
        "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 m, uma criatura. Acerto: 11 (2d6 + 4) dano perfurante. O(a) target must make a DC 15 Constituição teste de resistência, taking 24 (7d6) dano de veneno on a failed save, or half as much damage on a successful one.",
        "attackBonus": 7,
        "damage": "2d6+4"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/wyvern.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/wyvern.png",
    "color": "#7A2530",
    "tokenSize": 64,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "xorn",
    "name": "Xorn",
    "nameEn": "Xorn",
    "type": "elemental",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro",
    "ac": 19,
    "hp": 73,
    "hitDice": "7d8",
    "cr": "5",
    "xp": 1800,
    "speed": "caminhada: 6 m; escavação: 6 m",
    "abilities": {
      "strength": 17,
      "dexterity": 10,
      "constitution": 22,
      "intelligence": 11,
      "wisdom": 10,
      "charisma": 11
    },
    "skills": "Perception +6, Stealth +3",
    "senses": "visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 16",
    "languages": "Terran",
    "damageResistances": "piercing and slashing from nonmagical weapons that aren't adamantine",
    "damageImmunities": "—",
    "conditionImmunities": "—",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Earth Glide",
        "description": "O(a) xorn can escavação through nonmagical, unworked earth and stone. While doing so, the xorn doesn't disturb the material it moves through.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Stone Camouflage",
        "description": "O(a) xorn has advantage on Destreza (Stealth) checks made to hide in Rochay terrain.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Treasure Sense",
        "description": "O(a) xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 18 m of it.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Ataque Múltiplo",
        "description": "O(a) xorn faz três ataques de Garra and one Mordida attack.",
        "attackBonus": null,
        "damage": null
      },
      {
        "name": "Mordida",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 13 (3d6 + 3) dano perfurante.",
        "attackBonus": 6,
        "damage": "3d6+3"
      },
      {
        "name": "Garra",
        "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1.5 m, um alvo. Acerto: 6 (1d6 + 3) dano cortante.",
        "attackBonus": 6,
        "damage": "1d6+3"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/xorn.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/xorn.png",
    "color": "#2F4F7A",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  },
  {
    "id": "zombie",
    "name": "Zumbi",
    "nameEn": "Zombie",
    "type": "morto-vivo",
    "size": "Medium",
    "sizeLabel": "Médio",
    "alignment": "neutro e mau",
    "ac": 8,
    "hp": 22,
    "hitDice": "3d8",
    "cr": "0.25",
    "xp": 50,
    "speed": "caminhada: 6 m",
    "abilities": {
      "strength": 13,
      "dexterity": 6,
      "constitution": 16,
      "intelligence": 3,
      "wisdom": 6,
      "charisma": 5
    },
    "skills": "—",
    "senses": "visão no escuro 18 m, Percepção passiva 8",
    "languages": "compreende all languages it spoke in life mas não pode falar",
    "damageResistances": "—",
    "damageImmunities": "poison",
    "conditionImmunities": "envenenado",
    "damageVulnerabilities": "—",
    "traits": [
      {
        "name": "Undead Fortitude",
        "description": "If damage reduces the zombie to 0 hit points, it must make a Constituição teste de resistência with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
        "attackBonus": null,
        "damage": null
      }
    ],
    "actions": [
      {
        "name": "Pancada",
        "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1.5 m, um alvo. Acerto: 4 (1d6 + 1) dano de concussão.",
        "attackBonus": 3,
        "damage": "1d6+1"
      }
    ],
    "reactions": [],
    "legendaryActions": [],
    "imageUrl": "https://www.dnd5eapi.co/api/images/monsters/zombie.png",
    "tokenUrl": "https://www.dnd5eapi.co/api/images/monsters/zombie.png",
    "color": "#5C4A1E",
    "tokenSize": 48,
    "document": "dnd5eapi-2014"
  }
] as Monster[];

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
