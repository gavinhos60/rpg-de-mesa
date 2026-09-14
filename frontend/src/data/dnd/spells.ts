import type { Spell, SpellSchool, SpellcasterClassId } from "../../types/character";
import { SPELL_DESCRIPTIONS } from "./spellDescriptions";

function parseSpells(source: string): Spell[] {
    return source
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
            const [id, name, level, school, classes, ...flags] = line.split("|");

            return {
                id,
                name,
                level: Number(level),
                school: school as SpellSchool,
                classes: classes.split(",") as SpellcasterClassId[],
                ritual: flags.includes("ritual"),
                attack: flags.includes("attack"),
                description: SPELL_DESCRIPTIONS[id],
            };
        });
}

export const DND_SPELLS: Spell[] = parseSpells(`
acid-splash|Splash Ácido|0|conjuration|sorcerer,wizard
blade-ward|Proteção contra Lâminas|0|abjuration|bard,sorcerer,warlock,wizard
chill-touch|Toque Arrepiante|0|necromancy|sorcerer,warlock,wizard|attack
dancing-lights|Luzes Dançantes|0|evocation|bard,sorcerer,wizard
druidcraft|Druidismo|0|transmutation|druid
eldritch-blast|Explosão Mística|0|evocation|warlock|attack
fire-bolt|Rajada de Fogo|0|evocation|sorcerer,wizard|attack
friends|Amizade|0|enchantment|bard,sorcerer,warlock,wizard
guidance|Orientação|0|divination|cleric,druid
light|Luz|0|evocation|bard,cleric,sorcerer,wizard
mage-hand|Mãos Mágicas|0|conjuration|bard,sorcerer,warlock,wizard
mending|Consertar|0|transmutation|bard,cleric,druid,sorcerer,wizard
message|Mensagem|0|transmutation|bard,sorcerer,wizard
minor-illusion|Ilusão Menor|0|illusion|bard,sorcerer,warlock,wizard
poison-spray|Spray de Veneno|0|conjuration|druid,sorcerer,warlock,wizard
prestidigitation|Prestidigitação|0|transmutation|bard,sorcerer,warlock,wizard
produce-flame|Produzir Chama|0|conjuration|druid|attack
ray-of-frost|Raio de Gelo|0|evocation|sorcerer,wizard|attack
resistance|Resistência|0|abjuration|cleric,druid
sacred-flame|Chama Sagrada|0|evocation|cleric
shillelagh|Bordão Místico|0|transmutation|druid
shocking-grasp|Toque Chocante|0|evocation|sorcerer,wizard|attack
spare-the-dying|Poupar os Moribundos|0|necromancy|cleric
thaumaturgy|Taumaturgia|0|transmutation|cleric
thorn-whip|Chicote de Espinhos|0|transmutation|druid|attack
true-strike|Ataque Certeiro|0|divination|bard,sorcerer,warlock,wizard
vicious-mockery|Zombaria Cruel|0|enchantment|bard
alarm|Alarme|1|abjuration|ranger,wizard|ritual
animal-friendship|Amizade Animal|1|enchantment|bard,druid,ranger
armor-of-agathys|Armadura de Agathys|1|abjuration|warlock
arms-of-hadar|Braços de Hadar|1|conjuration|warlock
bane|Ruína|1|enchantment|bard,cleric
bless|Bênção|1|enchantment|cleric,paladin
burning-hands|Mãos Flamejantes|1|evocation|sorcerer,wizard
charm-person|Enfeitiçar Pessoa|1|enchantment|bard,druid,sorcerer,warlock,wizard
chromatic-orb|Orbe Cromática|1|evocation|sorcerer,wizard
color-spray|Spray de Cores|1|illusion|sorcerer,wizard
command|Comando|1|enchantment|cleric,paladin
compelled-duel|Duelo Forçado|1|enchantment|paladin
comprehend-languages|Compreender Idiomas|1|divination|bard,sorcerer,warlock,wizard|ritual
create-or-destroy-water|Criar ou Destruir Água|1|transmutation|cleric,druid
cure-wounds|Curar Ferimentos|1|evocation|bard,cleric,druid,paladin,ranger
detect-evil-and-good|Detectar o Bem e o Mal|1|divination|cleric,paladin
detect-magic|Detectar Magia|1|divination|bard,cleric,druid,paladin,ranger,sorcerer,wizard|ritual
detect-poison-and-disease|Detectar Veneno e Doença|1|divination|cleric,druid,paladin,ranger|ritual
disguise-self|Disfarçar-se|1|illusion|bard,sorcerer,wizard
dissonant-whispers|Sussurros Dissonantes|1|enchantment|bard
divine-favor|Favor Divino|1|evocation|paladin
ensnaring-strike|Golpe Enredante|1|conjuration|ranger
entangle|Enredar|1|conjuration|druid
expeditious-retreat|Retirada Expedita|1|transmutation|sorcerer,warlock,wizard
faerie-fire|Fogo das Fadas|1|evocation|bard,druid
false-life|Vitalidade Falsa|1|necromancy|sorcerer,wizard
feather-fall|Queda Suave|1|transmutation|bard,sorcerer,wizard
find-familiar|Encontrar Familiar|1|conjuration|wizard|ritual
fog-cloud|Nuvem de Névoa|1|conjuration|druid,ranger,sorcerer,wizard
goodberry|Frutos Bons|1|transmutation|druid,ranger
grease|Graxa|1|conjuration|wizard
guiding-bolt|Raio Guiador|1|evocation|cleric|attack
hail-of-thorns|Chuva de Espinhos|1|conjuration|ranger
healing-word|Palavra Curativa|1|evocation|bard,cleric,druid
hellish-rebuke|Represália Infernal|1|evocation|warlock
heroism|Heroísmo|1|enchantment|bard,paladin
hex|Hex|1|enchantment|warlock
hunters-mark|Marca do Caçador|1|divination|ranger
identify|Identificar|1|divination|bard,wizard|ritual
illusory-script|Escrita Ilusória|1|illusion|bard,warlock,wizard|ritual
inflict-wounds|Infligir Ferimentos|1|necromancy|cleric|attack
jump|Salto|1|transmutation|druid,ranger,sorcerer,wizard
longstrider|Passos Longos|1|transmutation|bard,druid,ranger,wizard
mage-armor|Armadura Arcana|1|abjuration|sorcerer,wizard
magic-missile|Mísseis Mágicos|1|evocation|sorcerer,wizard
protection-from-evil-and-good|Proteção contra o Bem e o Mal|1|abjuration|cleric,paladin,warlock,wizard
purify-food-and-drink|Purificar Comida e Bebida|1|transmutation|cleric,druid,paladin|ritual
ray-of-sickness|Raio da Doença|1|necromancy|sorcerer,wizard|attack
sanctuary|Santuário|1|abjuration|cleric
searing-smite|Golpe Flamejante|1|evocation|paladin
shield|Escudo Arcano|1|abjuration|sorcerer,wizard
shield-of-faith|Escudo da Fé|1|abjuration|cleric,paladin
silent-image|Imagem Silenciosa|1|illusion|bard,sorcerer,wizard
sleep|Sono|1|enchantment|bard,sorcerer,wizard
speak-with-animals|Falar com Animais|1|divination|bard,druid,ranger|ritual
tashas-hideous-laughter|Risada Hedionda de Tasha|1|enchantment|bard,wizard
tensers-floating-disk|Disco Flutuante de Tenser|1|conjuration|wizard|ritual
thunderous-smite|Golpe Trovejante|1|evocation|paladin
thunderwave|Onda Trovejante|1|evocation|bard,druid,sorcerer,wizard
unseen-servant|Servo Invisível|1|conjuration|bard,warlock,wizard|ritual
witch-bolt|Raio da Bruxa|1|evocation|sorcerer,warlock,wizard|attack
wrathful-smite|Golpe Colérico|1|evocation|paladin
aid|Auxílio|2|abjuration|cleric,paladin
alter-self|Alterar-se|2|transmutation|sorcerer,wizard
animal-messenger|Mensageiro Animal|2|enchantment|bard,druid,ranger|ritual
arcane-lock|Tranca Arcana|2|abjuration|wizard
augury|Augúrio|2|divination|cleric|ritual
barkskin|Pele de Árvore|2|transmutation|druid,ranger
beast-sense|Sentidos da Fera|2|divination|druid,ranger|ritual
blindness-deafness|Cegueira/Surdez|2|necromancy|bard,cleric,sorcerer
blur|Des Focalizar|2|illusion|sorcerer,wizard
branding-smite|Golpe Estigmatizante|2|evocation|paladin
calm-emotions|Acalmar Emoções|2|enchantment|bard,cleric
cloud-of-daggers|Nuvem de Adagas|2|conjuration|bard,sorcerer,warlock,wizard
continual-flame|Chama Contínua|2|evocation|cleric,wizard
crown-of-madness|Coroa da Loucura|2|enchantment|bard,sorcerer,warlock,wizard
darkness|Escuridão|2|evocation|sorcerer,warlock,wizard
darkvision|Visão no Escuro|2|transmutation|druid,ranger,sorcerer,wizard
detect-thoughts|Detectar Pensamentos|2|divination|bard,sorcerer,wizard
enhance-ability|Aprimorar Habilidade|2|transmutation|bard,cleric,druid,sorcerer
enlarge-reduce|Aumentar/Reduzir|2|transmutation|sorcerer,wizard
enthrall|Enfeitiçar|2|enchantment|bard,warlock
find-steed|Encontrar Corcel|2|conjuration|paladin
find-traps|Encontrar Armadilhas|2|divination|cleric,druid,ranger
flame-blade|Lâmina Flamejante|2|evocation|druid
flaming-sphere|Esfera Flamejante|2|conjuration|druid,wizard
gentle-repose|Repouso Tranquilo|2|necromancy|cleric,wizard|ritual
gust-of-wind|Rajada de Vento|2|evocation|druid,sorcerer,wizard
heat-metal|Aquecer Metal|2|transmutation|bard,druid
hold-person|Imobilizar Pessoa|2|enchantment|bard,cleric,druid,sorcerer,warlock,wizard
invisibility|Invisibilidade|2|illusion|bard,sorcerer,warlock,wizard
knock|Abrir|2|transmutation|bard,sorcerer,wizard
lesser-restoration|Restauração Menor|2|abjuration|bard,cleric,druid,paladin,ranger
levitate|Levitar|2|transmutation|sorcerer,wizard
locate-animals-or-plants|Localizar Animais ou Plantas|2|divination|bard,druid,ranger|ritual
locate-object|Localizar Objeto|2|divination|bard,cleric,druid,paladin,ranger,wizard
magic-mouth|Boca Mágica|2|illusion|bard,wizard|ritual
magic-weapon|Arma Mágica|2|transmutation|paladin,wizard
melfs-acid-arrow|Flecha Ácida de Melf|2|evocation|wizard
mirror-image|Imagem Espelhada|2|illusion|sorcerer,warlock,wizard
misty-step|Passo Nebuloso|2|conjuration|sorcerer,warlock,wizard
moonbeam|Raio Lunar|2|evocation|druid
nystuls-magic-aura|Aura Mágica de Nystul|2|illusion|wizard
pass-without-trace|Passar sem Rastros|2|abjuration|druid,ranger
phantasmal-force|Força Fantasmagórica|2|illusion|bard,sorcerer,wizard
prayer-of-healing|Prece de Cura|2|evocation|cleric
protection-from-poison|Proteção contra Veneno|2|abjuration|cleric,druid,paladin,ranger
ray-of-enfeeblement|Raio do Enfraquecimento|2|necromancy|warlock,wizard|attack
rope-trick|Truque de Corda|2|transmutation|wizard
scorching-ray|Raio Abrasador|2|evocation|sorcerer,wizard|attack
see-invisibility|Ver o Invisível|2|divination|bard,sorcerer,wizard
shatter|Estilhaçar|2|evocation|bard,sorcerer,warlock,wizard
silence|Silêncio|2|illusion|bard,cleric,ranger|ritual
spider-climb|Escalar como Aranha|2|transmutation|sorcerer,warlock,wizard
spike-growth|Crescimento de Espinhos|2|transmutation|druid,ranger
spiritual-weapon|Arma Espiritual|2|evocation|cleric
suggestion|Sugestão|2|enchantment|bard,sorcerer,warlock,wizard
warding-bond|Vínculo Protetor|2|abjuration|cleric
web|Teia|2|conjuration|sorcerer,wizard
zone-of-truth|Zona da Verdade|2|enchantment|bard,cleric,paladin
animate-dead|Animar Mortos|3|necromancy|cleric,wizard
aura-of-vitality|Aura de Vitalidade|3|evocation|paladin
beacon-of-hope|Farol de Esperança|3|abjuration|cleric
bestow-curse|Lançar Maldição|3|necromancy|bard,cleric,wizard
blinding-smite|Golpe Cegante|3|evocation|paladin
blink|Piscar|3|transmutation|sorcerer,wizard
call-lightning|Evocar Relâmpagos|3|conjuration|druid
clairvoyance|Clarividência|3|divination|bard,cleric,sorcerer,wizard
conjure-animals|Conjurar Animais|3|conjuration|druid,ranger
conjure-barrage|Conjurar Barragem|3|conjuration|ranger
counterspell|Contramágica|3|abjuration|sorcerer,warlock,wizard
create-food-and-water|Criar Comida e Água|3|conjuration|cleric,paladin
crusaders-mantle|Manto do Cruzado|3|evocation|paladin
daylight|Luz do Dia|3|evocation|cleric,druid,paladin,ranger,sorcerer
dispel-magic|Dissipar Magia|3|abjuration|bard,cleric,druid,paladin,sorcerer,warlock,wizard
elemental-weapon|Arma Elemental|3|transmutation|paladin
fear|Medo|3|illusion|bard,sorcerer,warlock,wizard
feign-death|Fingir Morte|3|necromancy|bard,cleric,druid,wizard|ritual
fireball|Bola de Fogo|3|evocation|sorcerer,wizard
fly|Voar|3|transmutation|sorcerer,warlock,wizard
gaseous-form|Forma Gasosa|3|transmutation|sorcerer,warlock,wizard
glyph-of-warding|Glifo de Proteção|3|abjuration|bard,cleric,wizard
haste|Acelerar|3|transmutation|sorcerer,wizard
hunger-of-hadar|Fome de Hadar|3|conjuration|warlock
hypnotic-pattern|Padrão Hipnótico|3|illusion|bard,sorcerer,warlock,wizard
leomunds-tiny-hut|Pequena Cabana de Leomund|3|evocation|bard,wizard|ritual
lightning-arrow|Flecha Relampejante|3|transmutation|ranger
lightning-bolt|Raio|3|evocation|sorcerer,wizard
magic-circle|Círculo Mágico|3|abjuration|cleric,paladin,warlock,wizard
major-image|Imagem Maior|3|illusion|bard,sorcerer,warlock,wizard
mass-healing-word|Palavra Curativa em Massa|3|evocation|cleric
meld-into-stone|Fundir-se em Pedra|3|transmutation|cleric,druid|ritual
nondetection|Indetectável|3|abjuration|bard,ranger,wizard
phantom-steed|Corcel Fantasma|3|illusion|wizard|ritual
plant-growth|Crescimento Vegetal|3|transmutation|bard,druid,ranger
protection-from-energy|Proteção contra Energia|3|abjuration|cleric,druid,ranger,sorcerer,wizard
remove-curse|Remover Maldição|3|abjuration|cleric,paladin,warlock,wizard
revivify|Reviver os Mortos|3|necromancy|cleric,paladin
sending|Enviar Mensagem|3|evocation|bard,cleric,wizard
sleet-storm|Tempestade de Granizo|3|conjuration|druid,sorcerer,wizard
slow|Atrasar|3|transmutation|sorcerer,wizard
speak-with-dead|Falar com os Mortos|3|necromancy|bard,cleric
speak-with-plants|Falar com Plantas|3|transmutation|bard,druid,ranger
spirit-guardians|Guardiões Espirituais|3|conjuration|cleric
stinking-cloud|Nuvem Fétida|3|conjuration|bard,sorcerer,wizard
tongues|Idiomas|3|divination|bard,cleric,sorcerer,warlock,wizard
vampiric-touch|Toque Vampírico|3|necromancy|warlock,wizard|attack
water-breathing|Respirar na Água|3|transmutation|druid,ranger,sorcerer,wizard|ritual
water-walk|Andar na Água|3|transmutation|cleric,druid,ranger,sorcerer|ritual
wind-wall|Muralha de Vento|3|evocation|druid,ranger
aura-of-life|Aura de Vida|4|abjuration|paladin
aura-of-purity|Aura de Pureza|4|abjuration|paladin
banishment|Banimento|4|abjuration|cleric,paladin,sorcerer,warlock,wizard
blight|Praga|4|necromancy|druid,sorcerer,warlock,wizard
compulsion|Compulsão|4|enchantment|bard
confusion|Confusão|4|enchantment|bard,druid,sorcerer,wizard
conjure-minor-elementals|Conjurar Elementais Menores|4|conjuration|druid,wizard
conjure-woodland-beings|Conjurar Seres da Floresta|4|conjuration|druid,ranger
control-water|Controlar Água|4|transmutation|cleric,druid,wizard
death-ward|Proteção contra a Morte|4|abjuration|cleric,paladin
dimension-door|Porta Dimensional|4|conjuration|bard,sorcerer,warlock,wizard
divination|Divinação|4|divination|cleric|ritual
dominate-beast|Dominar Fera|4|enchantment|druid,sorcerer
evards-black-tentacles|Tentáculos Negros de Evard|4|conjuration|wizard
fabricate|Fabricar|4|transmutation|wizard
fire-shield|Escudo de Fogo|4|evocation|wizard
freedom-of-movement|Liberdade de Movimento|4|abjuration|bard,cleric,druid,ranger
giant-insect|Inseto Gigante|4|transmutation|druid
grasping-vine|Videira Agarradora|4|conjuration|druid,ranger
greater-invisibility|Invisibilidade Maior|4|illusion|bard,sorcerer,wizard
guardian-of-faith|Guardião da Fé|4|conjuration|cleric
hallucinatory-terrain|Terreno Alucinatório|4|illusion|bard,druid,warlock,wizard
ice-storm|Tempestade de Gelo|4|evocation|druid,sorcerer,wizard
leomunds-secret-chest|Baú Secreto de Leomund|4|conjuration|wizard
locate-creature|Localizar Criatura|4|divination|bard,cleric,druid,paladin,ranger,wizard
mordenkainens-faithful-hound|Cão Fiel de Mordenkainen|4|conjuration|wizard
mordenkainens-private-sanctum|Santuário Privado de Mordenkainen|4|abjuration|wizard
otilukes-resilient-sphere|Esfera Resiliente de Otiluke|4|evocation|wizard
arcane-eye|Olho Arcano|4|divination|wizard
phantasmal-killer|Assassino Fantasmagórico|4|illusion|wizard
polymorph|Metamorfose|4|transmutation|bard,druid,sorcerer,wizard
staggering-smite|Golpe Atordoante|4|evocation|paladin
stone-shape|Moldar Rocha|4|transmutation|cleric,druid,wizard
stoneskin|Pele Rochosa|4|abjuration|druid,ranger,sorcerer,wizard
wall-of-fire|Muralha de Fogo|4|evocation|druid,sorcerer,wizard
animate-objects|Animar Objetos|5|transmutation|bard,sorcerer,wizard
antilife-shell|Carapaça Antivida|5|abjuration|druid
awaken|Despertar|5|transmutation|bard,druid
banishing-smite|Golpe Banidor|5|abjuration|paladin
bigbys-hand|Mão de Bigby|5|evocation|wizard
circle-of-power|Círculo de Poder|5|abjuration|paladin
cloudkill|Nuvem Mortal|5|conjuration|sorcerer,wizard
commune|Comungar|5|divination|cleric|ritual
commune-with-nature|Comungar com a Natureza|5|divination|druid,ranger|ritual
cone-of-cold|Cone de Frio|5|evocation|sorcerer,wizard
conjure-elemental|Conjurar Elemental|5|conjuration|druid,wizard
conjure-volley|Conjurar Saraivada|5|conjuration|ranger
contact-other-plane|Contatar Outro Plano|5|divination|warlock,wizard|ritual
contagion|Contágio|5|necromancy|cleric,druid
creation|Criação|5|illusion|sorcerer,wizard
destructive-wave|Onda Destrutiva|5|evocation|paladin
dispel-evil-and-good|Dissipar o Bem e o Mal|5|abjuration|cleric,paladin
dominate-person|Dominar Pessoa|5|enchantment|bard,sorcerer,wizard
dream|Sonho|5|illusion|bard,warlock,wizard
flame-strike|Golpe Flamejante|5|evocation|cleric
geas|Geas|5|enchantment|bard,cleric,druid,paladin,wizard
greater-restoration|Restauração Maior|5|abjuration|bard,cleric,druid
hallow|Consagrar|5|evocation|cleric
hold-monster|Imobilizar Monstro|5|enchantment|bard,sorcerer,warlock,wizard
insect-plague|Praga de Insetos|5|conjuration|cleric,druid,sorcerer
legend-lore|Lendas e Histórias|5|divination|bard,cleric,wizard
mass-cure-wounds|Curar Ferimentos em Massa|5|evocation|bard,cleric,druid
mislead|Iludir|5|illusion|bard,wizard
modify-memory|Modificar Memória|5|enchantment|bard,wizard
passwall|Passagem|5|transmutation|wizard
planar-binding|Amarra Planar|5|abjuration|bard,cleric,druid,wizard
raise-dead|Reviver os Mortos|5|necromancy|bard,cleric,paladin
rarys-telepathic-bond|Elo Telepático de Rary|5|divination|wizard|ritual
reincarnate|Reencarnar|5|transmutation|druid
scrying|Escrutínio|5|divination|bard,cleric,druid,warlock,wizard
seeming|Aparência|5|illusion|bard,sorcerer,wizard
swift-quiver|Aljava Veloz|5|transmutation|ranger
telekinesis|Telecinese|5|transmutation|sorcerer,wizard
teleportation-circle|Círculo de Teletransporte|5|conjuration|bard,sorcerer,wizard
tree-stride|Passo Arbóreo|5|conjuration|druid,ranger
wall-of-force|Muralha de Força|5|evocation|wizard
wall-of-stone|Muralha de Pedra|5|evocation|druid,sorcerer,wizard
arcane-gate|Portal Arcano|6|conjuration|sorcerer,warlock,wizard
blade-barrier|Barreira de Lâminas|6|evocation|cleric
chain-lightning|Relâmpago em Cadeia|6|evocation|sorcerer,wizard
circle-of-death|Círculo da Morte|6|necromancy|sorcerer,warlock,wizard
conjure-fey|Conjurar Fada|6|conjuration|druid,warlock
contingency|Contingência|6|evocation|wizard
create-undead|Criar Mortos-Vivos|6|necromancy|cleric,warlock,wizard
disintegrate|Desintegrar|6|transmutation|sorcerer,wizard
drawmijs-instant-summons|Convocação Instantânea de Drawmij|6|conjuration|wizard|ritual
eyebite|Olhar Penetrante|6|necromancy|bard,sorcerer,warlock,wizard
find-the-path|Encontrar o Caminho|6|divination|bard,cleric,druid
flesh-to-stone|Carne para Pedra|6|transmutation|warlock,wizard
forbiddance|Interdição|6|abjuration|cleric|ritual
globe-of-invulnerability|Globo de Invulnerabilidade|6|abjuration|sorcerer,wizard
guards-and-wards|Guardas e Proteções|6|abjuration|bard,wizard
heal|Curar|6|evocation|cleric,druid
heroes-feast|Banquete dos Heróis|6|conjuration|cleric,druid
magic-jar|Jarra Mágica|6|necromancy|wizard
mass-suggestion|Sugestão em Massa|6|enchantment|bard,sorcerer,warlock,wizard
move-earth|Mover Terra|6|transmutation|druid,sorcerer,wizard
otilukes-freezing-sphere|Esfera Congelante de Otiluke|6|evocation|wizard
ottos-irresistible-dance|Dança Irresistível de Otto|6|enchantment|bard,wizard
planar-ally|Aliado Planar|6|conjuration|cleric
programmed-illusion|Ilusão Programada|6|illusion|bard,wizard
sunbeam|Raio Solar|6|evocation|druid,sorcerer,wizard
transport-via-plants|Transporte via Plantas|6|conjuration|druid
true-seeing|Visão da Verdade|6|divination|bard,cleric,sorcerer,warlock,wizard
wall-of-ice|Muralha de Gelo|6|evocation|wizard
wall-of-thorns|Muralha de Espinhos|6|conjuration|druid
wind-walk|Caminhar no Vento|6|transmutation|druid
word-of-recall|Palavra de Recordação|6|conjuration|cleric
conjure-celestial|Conjurar Celestial|7|conjuration|cleric
delayed-blast-fireball|Bola de Fogo de Explosão Tardia|7|evocation|sorcerer,wizard
divine-word|Palavra Divina|7|evocation|cleric
etherealness|Etéreo|7|transmutation|bard,cleric,sorcerer,warlock,wizard
finger-of-death|Dedo da Morte|7|necromancy|sorcerer,warlock,wizard
fire-storm|Tempestade de Fogo|7|evocation|cleric,druid,sorcerer
forcecage|Prisão de Força|7|evocation|bard,warlock,wizard
mirage-arcane|Miragem Arcana|7|illusion|bard,druid,wizard
mordenkainens-magnificent-mansion|Mansão Magnífica de Mordenkainen|7|conjuration|bard,wizard
mordenkainens-sword|Espada de Mordenkainen|7|evocation|bard,wizard
plane-shift|Viagem Planar|7|conjuration|cleric,druid,sorcerer,warlock,wizard
prismatic-spray|Spray Prismático|7|evocation|sorcerer,wizard
project-image|Projetar Imagem|7|illusion|bard,wizard
regenerate|Regenerar|7|transmutation|bard,cleric,druid
resurrection|Ressurreição|7|necromancy|bard,cleric
reverse-gravity|Inverter Gravidade|7|transmutation|druid,sorcerer,wizard
sequester|Isolar|7|transmutation|wizard
simulacrum|Simulacro|7|illusion|wizard
symbol|Símbolo|7|abjuration|bard,cleric,wizard
teleport|Teletransporte|7|conjuration|bard,sorcerer,wizard
animal-shapes|Formas Animais|8|transmutation|druid
antimagic-field|Campo Antimagia|8|abjuration|cleric,wizard
antipathy-sympathy|Antipatia/Simpatia|8|enchantment|druid,wizard
clone|Clone|8|necromancy|wizard
control-weather|Controlar o Clima|8|transmutation|cleric,druid,wizard
demiplane|Semiplano|8|conjuration|warlock,wizard
dominate-monster|Dominar Monstro|8|enchantment|bard,sorcerer,warlock,wizard
earthquake|Terremoto|8|evocation|cleric,druid,sorcerer
feeblemind|Debilitar Intelecto|8|enchantment|bard,druid,warlock,wizard
glibness|Lábia|8|transmutation|bard,warlock
holy-aura|Aura Sagrada|8|abjuration|cleric
incendiary-cloud|Nuvem Incendiária|8|conjuration|sorcerer,wizard
maze|Labirinto|8|conjuration|wizard
mind-blank|Mente em Branco|8|abjuration|bard,wizard
power-word-stun|Palavra de Poder Atordoar|8|enchantment|bard,sorcerer,warlock,wizard
sunburst|Explosão Solar|8|evocation|druid,sorcerer,wizard
telepathy|Telepatia|8|evocation|wizard
tsunami|Tsunami|8|conjuration|druid
astral-projection|Projeção Astral|9|necromancy|cleric,warlock,wizard
foresight|Previsão|9|divination|bard,druid,warlock,wizard
gate|Portal|9|conjuration|cleric,sorcerer,wizard
imprisonment|Aprisionamento|9|abjuration|warlock,wizard
mass-heal|Cura em Massa|9|evocation|cleric
meteor-swarm|Enxame de Meteoros|9|evocation|sorcerer,wizard
power-word-heal|Palavra de Poder Curar|9|evocation|bard
power-word-kill|Palavra de Poder Matar|9|enchantment|bard,sorcerer,warlock,wizard
prismatic-wall|Muralha Prismática|9|abjuration|wizard
shapechange|Alterar Forma|9|transmutation|druid,wizard
storm-of-vengeance|Tempestade da Vingança|9|conjuration|druid
time-stop|Parar o Tempo|9|transmutation|sorcerer,wizard
true-polymorph|Metamorfose Verdadeira|9|transmutation|bard,warlock,wizard
true-resurrection|Ressurreição Verdadeira|9|necromancy|cleric,druid
weird|Horror|9|illusion|wizard
wish|Desejo|9|conjuration|sorcerer,wizard
`);

export const SPELL_SCHOOLS: Record<SpellSchool, string> = {
    abjuration: "Abjuração",
    conjuration: "Conjuração",
    divination: "Adivinhação",
    enchantment: "Encantamento",
    evocation: "Evocação",
    illusion: "Ilusão",
    necromancy: "Necromancia",
    transmutation: "Transmutação",
};

export function getSpell(spellId: string): Spell | undefined {
    return DND_SPELLS.find((spell) => spell.id === spellId);
}

export function getSpellsByClass(classId: SpellcasterClassId): Spell[] {
    return DND_SPELLS.filter((spell) => spell.classes.includes(classId));
}
