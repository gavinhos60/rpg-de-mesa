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
const card = { backgroundColor: "#DCCBA0", borderColor: "#6B4423" };
const nested = { backgroundColor: "#EBDFC4", borderColor: "#A67C3D" };
const inputClass =
    "w-full border px-4 py-3 text-[#2A1D14] outline-none transition-colors focus:border-[#7A2530]";
const labelClass = "mb-2 block text-sm text-[#5C4A38]";

export function CharacterIdentity({
    data,
    races,
    classes,
    backgrounds,
    talents,
    onChange,
}: CharacterIdentityProps) {
    const selectedRace = races.find((race) => race.id === data.raceId);
    const selectedTalent = talents.find((talent) => talent.id === data.talentId);

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
        if (classes.length === 0) {
            return;
        }

        const firstClass = classes[0];

        onChange({
            ...data,
            classes: [
                ...data.classes,
                { classId: firstClass.id, level: 1, subclassId: "" },
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
            updatedClasses[index] = { ...currentClass, level: Number(value), subclassId: "" };
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
                    <h2 className="text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                        Identidade
                    </h2>

                    <p className="mt-1 text-sm text-[#5C4A38]">
                        Defina as informações básicas do seu personagem.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className={labelClass} style={cinzel}>Nome</label>

                        <input
                            type="text"
                            value={data.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="Nome do personagem"
                            className={inputClass}
                            style={nested}
                        />
                    </div>

                    <div>
                        <label className={labelClass} style={cinzel}>Raça</label>

                        <select
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

                    <div>
                        <label className={labelClass} style={cinzel}>Background</label>

                        <select
                            value={data.backgroundId}
                            onChange={(event) => updateField("backgroundId", event.target.value)}
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
                        <label className={labelClass} style={cinzel}>Alinhamento</label>

                        <select
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

            {selectedRace && (
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                            Detalhes da raça
                        </h2>

                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Características recebidas pela escolha da raça.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {selectedRace.speed !== undefined && (
                            <div className="border p-4" style={card}>
                                <span className="text-sm text-[#5C4A38]">Deslocamento</span>
                                <div className="mt-1 text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {selectedRace.speed} pés
                                </div>
                            </div>
                        )}

                        {selectedRace.languages && selectedRace.languages.length > 0 && (
                            <div className="border p-4" style={card}>
                                <span className="text-sm text-[#5C4A38]">Idiomas</span>
                                <div className="mt-1 text-sm text-[#2A1D14]">
                                    {selectedRace.languages.join(", ")}
                                </div>
                            </div>
                        )}

                        {selectedRace.abilityScoreIncrease &&
                            Object.keys(selectedRace.abilityScoreIncrease).length > 0 && (
                                <div className="border p-4" style={card}>
                                    <span className="text-sm text-[#5C4A38]">Atributos</span>
                                    <div className="mt-1 text-sm text-[#2A1D14]">
                                        {Object.entries(selectedRace.abilityScoreIncrease)
                                            .map(
                                                ([ability, value]) =>
                                                    `${ABILITY_NAMES[ability] ?? ability} +${value}`
                                            )
                                            .join(", ")}
                                    </div>
                                </div>
                            )}
                    </div>

                    {selectedRace.traits && selectedRace.traits.length > 0 && (
                        <div className="mt-5 space-y-3">
                            {selectedRace.traits.map((trait) => (
                                <div key={trait.id} className="border p-4" style={card}>
                                    <h3 className="text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                                        {trait.name}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-[#5C4A38]">
                                        {trait.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {selectedRace?.abilityScoreChoices && (
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                            Escolhas raciais
                        </h2>

                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Escolha os atributos que receberão os bônus da sua raça.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: selectedRace.abilityScoreChoices.count }).map(
                            (_, index) => (
                                <div key={index}>
                                    <label className={labelClass} style={cinzel}>
                                        Escolha {index + 1}
                                    </label>

                                    <select
                                        value={raceChoices["abilityScoreIncrease"]?.[index] ?? ""}
                                        onChange={(event) =>
                                            updateRaceAbilityChoice(index, event.target.value)
                                        }
                                        className={inputClass}
                                        style={nested}
                                    >
                                        <option value="">Selecione</option>

                                        {selectedRace.abilityScoreChoices.abilities.map((ability) => (
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
                        <h2 className="text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                            Classes
                        </h2>

                        <p className="mt-1 text-sm text-[#5C4A38]">
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
                        style={{ borderColor: "#A67C3D", backgroundColor: "#DCCBA0" }}
                    >
                        <p className="text-[#5C4A38]">Nenhuma classe adicionada.</p>
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
                                        <h3 className="text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                                            Classe {index + 1}
                                        </h3>

                                        {data.classes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeClass(index)}
                                                className="text-sm text-[#8B3A2E] hover:text-[#7A2530] transition-colors"
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-3">
                                        <div>
                                            <label className={labelClass} style={cinzel}>Classe</label>

                                            <select
                                                value={characterClass.classId}
                                                onChange={(event) =>
                                                    updateClass(index, "classId", event.target.value)
                                                }
                                                className={inputClass}
                                                style={nested}
                                            >
                                                {classes.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass} style={cinzel}>Nível</label>

                                            <input
                                                type="number"
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
                                            <label className={labelClass} style={cinzel}>Subclasse</label>

                                            <select
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
                    <h2 className="text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                        Talento Inicial
                    </h2>

                    <p className="mt-1 text-sm text-[#5C4A38]">
                        Todo personagem recebe um talento adicional no nível 1.
                    </p>
                </div>

                <select
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
                                <h3 className="text-lg text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {selectedTalent.name}
                                </h3>

                                <p className="mt-1 text-xs text-[#8A7860]">
                                    {selectedTalent.source}
                                </p>
                            </div>

                            <span
                                className="px-3 py-1 text-xs"
                                style={{ ...cinzel, backgroundColor: "#9C7A3C", color: "#EBDFC4" }}
                            >
                                Talento Inicial
                            </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-[#2A1D14]">
                            {selectedTalent.description}
                        </p>

                        <div className="mt-5 border p-4" style={nested}>
                            <span className="text-xs uppercase text-[#8A7860]" style={cinzel}>
                                Pré-requisitos
                            </span>

                            <p className="mt-1 text-sm text-[#2A1D14]">
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