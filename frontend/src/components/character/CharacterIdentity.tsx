import type {
    Alignment,
    CharacterBackground,
    CharacterClass,
    CharacterFormData,
    CharacterRace,
    CharacterTalent,
    Skill,
} from "../../types/character";

import { CharacterTalentChoices } from "./CharacterTalentChoices";
import { RibbonButton } from "../icons/MedievalIcons";
import { getEquipmentItem } from "../../data/dnd/equipment";
import {
    getRaceDisplayName,
    getResolvedAbilityScoreChoices,
    getResolvedAbilityScoreIncrease,
    getResolvedRaceTraits,
    getResolvedSpeed,
    getSelectedSubrace,
} from "../../data/dnd/raceResolution";
import { readImageAsDataUrl } from "../../utils/imageUpload";
import { formatMeters } from "../../utils/units";

interface CharacterIdentityProps {
    data: CharacterFormData;
    races: CharacterRace[];
    classes: CharacterClass[];
    backgrounds: CharacterBackground[];
    talents: CharacterTalent[];
    onChange: (data: CharacterFormData) => void;
}

const ALIGNMENTS: { id: Alignment; name: string }[] = [
    { id: "lawful-good", name: "Leal e Bom" },
    { id: "neutral-good", name: "Neutro e Bom" },
    { id: "chaotic-good", name: "Caótico e Bom" },
    { id: "lawful-neutral", name: "Leal e Neutro" },
    { id: "true-neutral", name: "Neutro" },
    { id: "chaotic-neutral", name: "Caótico e Neutro" },
    { id: "lawful-evil", name: "Leal e Mau" },
    { id: "neutral-evil", name: "Neutro e Mau" },
    { id: "chaotic-evil", name: "Caótico e Mau" },
];

const ABILITY_NAMES: Record<string, string> = {
    strength: "Força",
    dexterity: "Destreza",
    constitution: "Constituição",
    intelligence: "Inteligência",
    wisdom: "Sabedoria",
    charisma: "Carisma",
};

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };
const nested = { backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" };
const inputClass =
    "w-full border px-4 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-crimson)]";
const labelClass = "mb-2 block text-sm text-[var(--color-ink-muted)]";
const LANGUAGES = [
    "Comum", "Anão", "Élfico", "Gigante", "Gnômico", "Goblin", "Halfling",
    "Orc", "Abissal", "Celestial", "Dracônico", "Dialeto Subterrâneo",
    "Infernal", "Primordial", "Silvestre",
];

export function CharacterIdentity({
    data,
    races,
    classes,
    backgrounds,
    talents,
    onChange,
}: CharacterIdentityProps) {
    const selectedRace = races.find((race) => race.id === data.raceId);
    const selectedSubrace = getSelectedSubrace(data);
    const resolvedRaceTraits = getResolvedRaceTraits(data);
    const resolvedAbilityIncrease = getResolvedAbilityScoreIncrease(data);
    const resolvedAbilityChoices = getResolvedAbilityScoreChoices(data);
    const selectedTalent = talents.find((talent) => talent.id === data.talentId);
    const selectedBackground = backgrounds.find(
        (background) => background.id === data.backgroundId
    );

    const raceChoices = data.raceChoices ?? {};

    function updateField<K extends keyof CharacterFormData>(
        field: K,
        value: CharacterFormData[K]
    ) {
        onChange({ ...data, [field]: value });
    }

    function updateRace(raceId: string) {
        onChange({
            ...data,
            raceId,
            subraceId: "",
            raceChoices: {},
            skillProficiencies: {
                class: data.skillProficiencies?.class ?? [],
                race: [],
                background: data.skillProficiencies?.background ?? [],
                talent: data.skillProficiencies?.talent ?? [],
            },
        });
    }

    function updateSubrace(subraceId: string) {
        onChange({
            ...data,
            subraceId,
            raceChoices: {},
            skillProficiencies: {
                class: data.skillProficiencies?.class ?? [],
                race: [],
                background: data.skillProficiencies?.background ?? [],
                talent: data.skillProficiencies?.talent ?? [],
            },
        });
    }

    function updateRaceAbilityChoice(index: number, ability: string) {
        const choices = [...(raceChoices["abilityScoreIncrease"] ?? [])];
        choices[index] = ability;

        onChange({
            ...data,
            raceChoices: { ...raceChoices, abilityScoreIncrease: choices },
        });
    }

    function updateTalent(talentId: string) {
        onChange({
            ...data,
            talentId,
            talentChoices: {},
            skillProficiencies: {
                class: data.skillProficiencies?.class ?? [],
                race: data.skillProficiencies?.race ?? [],
                background: data.skillProficiencies?.background ?? [],
                talent: [],
            },
        });
    }

    function updateBackground(backgroundId: string) {
        const background = backgrounds.find((item) => item.id === backgroundId);

        onChange({
            ...data,
            backgroundId,
            backgroundChoices: {
                skills: [],
                tools: [],
                languages: [],
            },
            skillProficiencies: {
                class: data.skillProficiencies?.class ?? [],
                race: data.skillProficiencies?.race ?? [],
                background: background?.skillProficiencies ?? [],
                talent: data.skillProficiencies?.talent ?? [],
            },
        });
    }

    function updateBackgroundChoice(
        type: "tools" | "languages",
        index: number,
        value: string
    ) {
        const values = [...data.backgroundChoices[type]];
        values[index] = value;
        onChange({
            ...data,
            backgroundChoices: {
                ...data.backgroundChoices,
                [type]: values,
            },
        });
    }

    function handleTalentChoice(choiceId: string, values: string[]) {
        const currentTalentChoices = data.talentChoices ?? {};

        const selectedTalent = talents.find(
            (talent) => talent.id === data.talentId
        );

        const selectedChoice = selectedTalent?.choices?.find(
            (choice) => choice.id === choiceId
        );

        const updatedTalentChoices = {
            ...currentTalentChoices,
            [choiceId]: values,
        };

        let talentSkillProficiencies =
            data.skillProficiencies?.talent ?? [];

        if (selectedChoice?.type === "skill") {
            talentSkillProficiencies = values as Skill[];
        }

        onChange({
            ...data,
            talentChoices: updatedTalentChoices,
            skillProficiencies: {
                class: data.skillProficiencies?.class ?? [],
                race: data.skillProficiencies?.race ?? [],
                background: data.skillProficiencies?.background ?? [],
                talent: talentSkillProficiencies,
            },
        });
    }

    function addClass() {
        const availableClass = classes.find(
            (characterClass) =>
                !data.classes.some(
                    (selection) => selection.classId === characterClass.id
                )
        );

        if (!availableClass) {
            return;
        }

        onChange({
            ...data,
            classes: [
                ...data.classes,
                { classId: availableClass.id, level: 1, subclassId: "" },
            ],
        });
    }

    function updateClass(
        index: number,
        field: "classId" | "level" | "subclassId",
        value: string | number
    ) {
        const updatedClasses = [...data.classes];
        const currentClass = updatedClasses[index];

        if (!currentClass) {
            return;
        }

        if (field === "classId") {
            updatedClasses[index] = { ...currentClass, classId: String(value), subclassId: "" };
        } else if (field === "level") {
            const otherLevels = updatedClasses.reduce(
                (total, selection, classIndex) =>
                    classIndex === index ? total : total + selection.level,
                0
            );
            const level = Math.min(
                Math.max(1, Number(value)),
                Math.max(1, 20 - otherLevels)
            );
            const selectedClass = getClass(currentClass.classId);
            const selectedSubclass = selectedClass?.subclasses.find(
                (subclass) => subclass.id === currentClass.subclassId
            );

            updatedClasses[index] = {
                ...currentClass,
                level,
                subclassId:
                    selectedSubclass && level >= selectedSubclass.level
                        ? currentClass.subclassId
                        : "",
            };
        } else {
            updatedClasses[index] = { ...currentClass, subclassId: String(value) };
        }

        onChange({ ...data, classes: updatedClasses });
    }

    function removeClass(index: number) {
        onChange({
            ...data,
            classes: data.classes.filter((_, classIndex) => classIndex !== index),
        });
    }

    function getClass(classId: string) {
        return classes.find((characterClass) => characterClass.id === classId);
    }

    function formatPrerequisites(talent: CharacterTalent) {
        const prerequisites = talent.prerequisites;

        if (!prerequisites) {
            return "Nenhum";
        }

        const requirements: string[] = [];

        if (prerequisites.abilities) {
            Object.entries(prerequisites.abilities).forEach(([ability, value]) => {
                requirements.push(`${ABILITY_NAMES[ability] ?? ability} ${value}+`);
            });
        }

        if (prerequisites.race?.length) {
            requirements.push(`Raça: ${prerequisites.race.join(", ")}`);
        }

        if (prerequisites.class?.length) {
            requirements.push(`Classe: ${prerequisites.class.join(", ")}`);
        }

        if (prerequisites.proficiency?.length) {
            requirements.push(`Proficiência: ${prerequisites.proficiency.join(", ")}`);
        }

        return requirements.length > 0 ? requirements.join(" • ") : "Nenhum";
    }

    return (
        <div className="space-y-10">
            <section>
                <div className="mb-5">
                    <h2 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Identidade
                    </h2>

                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                        Defina as informações básicas do seu personagem.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className={labelClass} style={cinzel}>Nome *</label>

                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Nome do personagem"
                            className={inputClass}
                            style={nested}
                        />
                    </div>

                    <div>
                        <label className={labelClass} style={cinzel}>Foto do personagem</label>
                        <div className="flex items-center gap-3">
                            {data.avatar ? (
                                <img
                                    src={data.avatar}
                                    alt={data.name || "Avatar"}
                                    className="h-16 w-16 rounded-full object-cover"
                                    style={{
                                        backgroundColor: "#1A140F",
                                        boxShadow: "0 0 0 2px #C09A5A, 0 0 0 4px #6B4423",
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full text-sm text-[var(--color-ink-inverse)]"
                                    style={{
                                        backgroundColor: "var(--color-crimson)",
                                        boxShadow: "0 0 0 2px #C09A5A, 0 0 0 4px #6B4423",
                                        fontFamily: "'Cinzel', serif",
                                    }}
                                >
                                    {(data.name || "?").slice(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0 flex-1 space-y-1">
                                <label
                                    className="inline-block cursor-pointer border px-3 py-2 text-sm text-[var(--color-ink-muted)]"
                                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
                                >
                                    Enviar foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0] ?? null;
                                            event.target.value = "";
                                            if (!file) return;
                                            if (!file.type.startsWith("image/")) {
                                                window.alert("Selecione um arquivo de imagem.");
                                                return;
                                            }
                                            void readImageAsDataUrl(file, 512)
                                                .then((url) => updateField("avatar", url))
                                                .catch(() =>
                                                    window.alert("Não foi possível ler a imagem.")
                                                );
                                        }}
                                    />
                                </label>
                                {data.avatar && (
                                    <button
                                        type="button"
                                        className="ml-2 text-xs text-[var(--color-crimson)] underline"
                                        onClick={() => updateField("avatar", null)}
                                    >
                                        Remover
                                    </button>
                                )}
                                <p className="text-xs text-[var(--color-ink-soft)]">
                                    Usada na lista, na ficha e no token da mesa.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass} style={cinzel}>Raça *</label>

                        <select
                            required
                            value={data.raceId}
                            onChange={(event) => updateRace(event.target.value)}
                            className={inputClass}
                            style={nested}
                        >
                            <option value="">Selecione uma raça</option>

                            {races.map((race) => (
                                <option key={race.id} value={race.id}>
                                    {race.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedRace?.subraces && selectedRace.subraces.length > 0 && (
                        <div>
                            <label className={labelClass} style={cinzel}>Subraça *</label>

                            <select
                                required
                                value={data.subraceId}
                                onChange={(event) => updateSubrace(event.target.value)}
                                className={inputClass}
                                style={nested}
                            >
                                <option value="">Selecione uma subraça</option>

                                {selectedRace.subraces.map((subrace) => (
                                    <option key={subrace.id} value={subrace.id}>
                                        {subrace.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className={labelClass} style={cinzel}>Background *</label>

                        <select
                            required
                            value={data.backgroundId}
                            onChange={(event) => updateBackground(event.target.value)}
                            className={inputClass}
                            style={nested}
                        >
                            <option value="">Selecione um background</option>

                            {backgrounds.map((background) => (
                                <option key={background.id} value={background.id}>
                                    {background.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass} style={cinzel}>Alinhamento *</label>

                        <select
                            required
                            value={data.alignment}
                            onChange={(event) =>
                                updateField("alignment", event.target.value as Alignment)
                            }
                            className={inputClass}
                            style={nested}
                        >
                            <option value="">Selecione um alinhamento</option>

                            {ALIGNMENTS.map((alignment) => (
                                <option key={alignment.id} value={alignment.id}>
                                    {alignment.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {selectedBackground && (
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Antecedente: {selectedBackground.name}
                        </h2>
                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Proficiências, recursos e equipamento adquiridos antes
                            do início da aventura.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border p-4" style={card}>
                            <span className="text-sm text-[var(--color-ink-muted)]">Perícias</span>
                            <p className="mt-1 text-[var(--color-ink)]">
                                {selectedBackground.skillProficiencies
                                    .map((skill) => {
                                        const names: Record<string, string> = {
                                            insight: "Intuição",
                                            religion: "Religião",
                                            deception: "Enganação",
                                            "sleight-of-hand": "Prestidigitação",
                                            stealth: "Furtividade",
                                            acrobatics: "Acrobacia",
                                            performance: "Atuação",
                                            "animal-handling": "Adestrar Animais",
                                            survival: "Sobrevivência",
                                            persuasion: "Persuasão",
                                            medicine: "Medicina",
                                            history: "História",
                                            athletics: "Atletismo",
                                            arcana: "Arcanismo",
                                            perception: "Percepção",
                                            intimidation: "Intimidação",
                                        };
                                        return names[skill] ?? skill;
                                    })
                                    .join(", ")}
                            </p>
                        </div>
                        <div className="border p-4" style={card}>
                            <span className="text-sm text-[var(--color-ink-muted)]">Moedas iniciais</span>
                            <p className="mt-1 text-xl text-[var(--color-ink)]" style={cinzel}>
                                {selectedBackground.startingGoldGp} PO
                            </p>
                        </div>
                        <div className="border p-4" style={card}>
                            <span className="text-sm text-[var(--color-ink-muted)]">Característica</span>
                            <p className="mt-1 text-[var(--color-ink)]" style={cinzel}>
                                {selectedBackground.feature.name}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                                {selectedBackground.feature.description}
                            </p>
                        </div>
                    </div>

                    {(selectedBackground.toolProficiencies?.length ?? 0) > 0 && (
                        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
                            <span className="text-[var(--color-ink)]" style={cinzel}>Ferramentas:</span>{" "}
                            {selectedBackground.toolProficiencies
                                ?.map((id) => getEquipmentItem(id)?.name ?? formatChoiceName(id))
                                .join(", ")}
                        </p>
                    )}

                    {selectedBackground.toolChoice && (
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            {Array.from({ length: selectedBackground.toolChoice.count }).map((_, index) => (
                                <label key={index}>
                                    <span className={labelClass} style={cinzel}>
                                        Ferramenta ou conjunto {index + 1} *
                                    </span>
                                    <select
                                        required
                                        value={data.backgroundChoices.tools[index] ?? ""}
                                        onChange={(event) =>
                                            updateBackgroundChoice("tools", index, event.target.value)
                                        }
                                        className={inputClass}
                                        style={nested}
                                    >
                                        <option value="">Selecione</option>
                                        {selectedBackground.toolChoice?.options.map((option) => (
                                            <option
                                                key={option}
                                                value={option}
                                                disabled={data.backgroundChoices.tools.some(
                                                    (selected, selectedIndex) =>
                                                        selected === option && selectedIndex !== index
                                                )}
                                            >
                                                {getEquipmentItem(option)?.name ?? formatChoiceName(option)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ))}
                        </div>
                    )}

                    {(selectedBackground.languageChoices ?? 0) > 0 && (
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            {Array.from({ length: selectedBackground.languageChoices ?? 0 }).map((_, index) => (
                                <label key={index}>
                                    <span className={labelClass} style={cinzel}>
                                        Idioma adicional {index + 1} *
                                    </span>
                                    <select
                                        required
                                        value={data.backgroundChoices.languages[index] ?? ""}
                                        onChange={(event) =>
                                            updateBackgroundChoice("languages", index, event.target.value)
                                        }
                                        className={inputClass}
                                        style={nested}
                                    >
                                        <option value="">Selecione</option>
                                        {LANGUAGES.map((language) => (
                                            <option
                                                key={language}
                                                value={language}
                                                disabled={
                                                    selectedRace?.languages?.includes(language) ||
                                                    data.backgroundChoices.languages.some(
                                                        (selected, selectedIndex) =>
                                                            selected === language && selectedIndex !== index
                                                    )
                                                }
                                            >
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {selectedRace && (
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Detalhes da raça
                        </h2>

                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Características recebidas pela escolha da raça
                            {selectedSubrace ? ` e da ${selectedSubrace.name}` : ""}.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border p-4" style={card}>
                            <span className="text-sm text-[var(--color-ink-muted)]">Origem</span>
                            <div className="mt-1 text-sm text-[var(--color-ink)]">
                                {getRaceDisplayName(data) || selectedRace.name}
                            </div>
                            {selectedSubrace?.description && (
                                <p className="mt-2 text-xs leading-5 text-[var(--color-ink-muted)]">
                                    {selectedSubrace.description}
                                </p>
                            )}
                        </div>

                        {(selectedSubrace?.speed ?? selectedRace.speed) !== undefined && (
                            <div className="border p-4" style={card}>
                                <span className="text-sm text-[var(--color-ink-muted)]">Deslocamento</span>
                                <div className="mt-1 text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {formatMeters(getResolvedSpeed(data, selectedRace.speed ?? 30))}
                                </div>
                            </div>
                        )}

                        {selectedRace.languages && selectedRace.languages.length > 0 && (
                            <div className="border p-4" style={card}>
                                <span className="text-sm text-[var(--color-ink-muted)]">Idiomas</span>
                                <div className="mt-1 text-sm text-[var(--color-ink)]">
                                    {selectedRace.languages.join(", ")}
                                </div>
                            </div>
                        )}

                        {Object.keys(resolvedAbilityIncrease).length > 0 && (
                            <div className="border p-4" style={card}>
                                <span className="text-sm text-[var(--color-ink-muted)]">Atributos</span>
                                <div className="mt-1 text-sm text-[var(--color-ink)]">
                                    {Object.entries(resolvedAbilityIncrease)
                                        .map(([ability, value]) => {
                                            const signed =
                                                value >= 0 ? `+${value}` : `${value}`;
                                            return `${ABILITY_NAMES[ability] ?? ability} ${signed}`;
                                        })
                                        .join(", ")}
                                </div>
                            </div>
                        )}
                    </div>

                    {resolvedRaceTraits.length > 0 && (
                        <div className="mt-5 space-y-3">
                            {resolvedRaceTraits.map((trait) => (
                                <div key={trait.id} className="border p-4" style={card}>
                                    <h3 className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                        {trait.name}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-[var(--color-ink-muted)]">
                                        {trait.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {resolvedAbilityChoices && (
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Escolhas raciais
                        </h2>

                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Escolha os atributos que receberão os bônus da sua raça.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: resolvedAbilityChoices.count }).map(
                            (_, index) => (
                                <div key={index}>
                                    <label className={labelClass} style={cinzel}>
                                        Escolha {index + 1} *
                                    </label>

                                    <select
                                        required
                                        value={raceChoices["abilityScoreIncrease"]?.[index] ?? ""}
                                        onChange={(event) =>
                                            updateRaceAbilityChoice(index, event.target.value)
                                        }
                                        className={inputClass}
                                        style={nested}
                                    >
                                        <option value="">Selecione</option>

                                        {resolvedAbilityChoices.abilities.map((ability) => (
                                            <option key={ability} value={ability}>
                                                {ABILITY_NAMES[ability]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )
                        )}
                    </div>
                </section>
            )}

            <section>
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Classes
                        </h2>

                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Escolha uma ou mais classes para o personagem.
                        </p>
                    </div>

                    <RibbonButton type="button" onClick={addClass}>
                        Adicionar classe
                    </RibbonButton>
                </div>

                {data.classes.length === 0 ? (
                    <div
                        className="border border-dashed p-8 text-center"
                        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
                    >
                        <p className="text-[var(--color-ink-muted)]">Nenhuma classe adicionada.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {data.classes.map((characterClass, index) => {
                            const selectedClass = getClass(characterClass.classId);

                            const availableSubclasses =
                                selectedClass?.subclasses.filter(
                                    (subclass) => characterClass.level >= subclass.level
                                ) ?? [];

                            return (
                                <div
                                    key={`${characterClass.classId}-${index}`}
                                    className="border p-5"
                                    style={card}
                                >
                                    <div className="mb-5 flex items-center justify-between">
                                        <h3 className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                            Classe {index + 1}
                                        </h3>

                                        {data.classes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeClass(index)}
                                                className="text-sm text-[var(--color-danger)] hover:text-[var(--color-crimson)] transition-colors"
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-3">
                                        <div>
                                            <label className={labelClass} style={cinzel}>Classe *</label>

                                            <select
                                                required
                                                value={characterClass.classId}
                                                onChange={(event) =>
                                                    updateClass(index, "classId", event.target.value)
                                                }
                                                className={inputClass}
                                                style={nested}
                                            >
                                                {classes.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                        disabled={data.classes.some(
                                                            (selection, selectionIndex) =>
                                                                selectionIndex !== index &&
                                                                selection.classId === item.id
                                                        )}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass} style={cinzel}>Nível *</label>

                                            <input
                                                type="number"
                                                required
                                                min={1}
                                                max={20}
                                                value={characterClass.level}
                                                onChange={(event) =>
                                                    updateClass(index, "level", event.target.value)
                                                }
                                                className={inputClass}
                                                style={nested}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass} style={cinzel}>
                                                Subclasse{availableSubclasses.length > 0 ? " *" : ""}
                                            </label>

                                            <select
                                                required={availableSubclasses.length > 0}
                                                value={characterClass.subclassId}
                                                onChange={(event) =>
                                                    updateClass(index, "subclassId", event.target.value)
                                                }
                                                className={inputClass}
                                                style={nested}
                                            >
                                                <option value="">Selecione</option>

                                                {availableSubclasses.map((subclass) => (
                                                    <option key={subclass.id} value={subclass.id}>
                                                        {subclass.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section>
                <div className="mb-5">
                    <h2 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Talento Inicial
                    </h2>

                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                        Todo personagem recebe um talento adicional no nível 1.
                    </p>
                </div>

                <select
                    required
                    value={data.talentId}
                    onChange={(event) => updateTalent(event.target.value)}
                    className={inputClass}
                    style={nested}
                >
                    <option value="">Selecione um talento</option>

                    {talents.map((talent) => (
                        <option key={talent.id} value={talent.id}>
                            {talent.name}
                        </option>
                    ))}
                </select>

                {selectedTalent && (
                    <div className="mt-5 border p-5" style={card}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {selectedTalent.name}
                                </h3>

                                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                                    {selectedTalent.source}
                                </p>
                            </div>

                            <span
                                className="px-3 py-1 text-xs"
                                style={{ ...cinzel, backgroundColor: "#9C7A3C", color: "var(--color-ink-inverse)" }}
                            >
                                Talento Inicial
                            </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-[var(--color-ink)]">
                            {selectedTalent.description}
                        </p>

                        <div className="mt-5 border p-4" style={nested}>
                            <span className="text-xs uppercase text-[var(--color-ink-soft)]" style={cinzel}>
                                Pré-requisitos
                            </span>

                            <p className="mt-1 text-sm text-[var(--color-ink)]">
                                {formatPrerequisites(selectedTalent)}
                            </p>
                        </div>

                        <CharacterTalentChoices
                            talent={selectedTalent}
                            data={data}
                            onChange={handleTalentChoice}
                        />
                    </div>
                )}
            </section>
        </div>
    );
}

function formatChoiceName(value: string): string {
    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}