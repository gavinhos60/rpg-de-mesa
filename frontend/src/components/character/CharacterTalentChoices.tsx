import type {
    CharacterFormData,
    CharacterTalent,
    Skill,
} from "../../types/character";

import { ABILITIES } from "../../data/dnd/abilities";
import { DND_SKILLS } from "../../data/dnd/skills";
import { DND_CLASSES } from "../../data/dnd/classes";

interface CharacterTalentChoicesProps {
    talent: CharacterTalent;
    data: CharacterFormData;
    onChange: (choiceId: string, values: string[]) => void;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;

export function CharacterTalentChoices({
    talent,
    data,
    onChange,
}: CharacterTalentChoicesProps) {
    if (!talent.choices || talent.choices.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 space-y-6">
            <div>
                <h3 className="text-lg text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                    Escolhas do talento
                </h3>

                <p className="mt-1 text-sm text-[#5C4A38]">
                    Algumas opções do talento precisam ser escolhidas.
                </p>
            </div>

            {talent.choices.map((choice) => (
                <TalentChoice
                    key={choice.id}
                    choice={choice}
                    data={data}
                    selectedValues={data.talentChoices?.[choice.id] ?? []}
                    onChange={onChange}
                />
            ))}
        </div>
    );
}

interface TalentChoiceProps {
    choice: NonNullable<CharacterTalent["choices"]>[number];
    data: CharacterFormData;
    selectedValues: string[];
    onChange: (choiceId: string, values: string[]) => void;
}

function TalentChoice({
    choice,
    data,
    selectedValues,
    onChange,
}: TalentChoiceProps) {
    function toggleValue(value: string) {
        const alreadySelected = selectedValues.includes(value);

        if (alreadySelected) {
            onChange(
                choice.id,
                selectedValues.filter((item) => item !== value)
            );

            return;
        }

        if (selectedValues.length >= choice.count) {
            return;
        }

        onChange(choice.id, [...selectedValues, value]);
    }

    const options = getChoiceOptions(
        choice.type,
        choice.options,
        data,
        choice.excludeProficient
    );

    const complete = selectedValues.length === choice.count;

    return (
        <section className="border p-5" style={{ backgroundColor: "#EBDFC4", borderColor: "#6B4423" }}>
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h4 className="text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                        {choice.name}
                    </h4>

                    <p className="mt-1 text-sm text-[#5C4A38]">
                        {choice.description}
                    </p>
                </div>

                <div
                    className="shrink-0 px-3 py-1 text-sm"
                    style={{
                        ...cinzel,
                        backgroundColor: complete ? "#3F5B34" : "#7A2530",
                        color: "#EBDFC4",
                    }}
                >
                    {selectedValues.length}/{choice.count}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {options.map((option) => {
                    const selected = selectedValues.includes(option.id);

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleValue(option.id)}
                            className="border p-4 text-left transition-colors"
                            style={{
                                backgroundColor: selected ? "#DCCBA0" : "#F3EAD4",
                                borderColor: selected ? "#7A2530" : "#A67C3D",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-5 w-5 items-center justify-center border text-xs"
                                    style={{
                                        borderColor: selected ? "#5C1D26" : "#A67C3D",
                                        backgroundColor: selected ? "#7A2530" : "transparent",
                                        color: "#EBDFC4",
                                    }}
                                >
                                    {selected && "✓"}
                                </div>

                                <span className="text-[#2A1D14]">{option.name}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedValues.length < choice.count && (
                <p className="mt-4 text-sm text-[#9C7A3C]">
                    Escolha mais {choice.count - selectedValues.length} opção
                    {choice.count - selectedValues.length !== 1 ? "ões" : ""}.
                </p>
            )}
        </section>
    );
}

interface ChoiceOption {
    id: string;
    name: string;
}

function getChoiceOptions(
    type: string,
    explicitOptions: string[] | undefined,
    data: CharacterFormData,
    excludeProficient?: boolean
): ChoiceOption[] {
    switch (type) {
        case "ability":
            return getAbilityOptions(explicitOptions);
        case "skill":
            return getSkillOptions(explicitOptions, data, excludeProficient);
        case "class":
            return getClassOptions(explicitOptions);
        case "language":
            return getLanguageOptions(explicitOptions);
        case "tool":
            return getToolOptions(explicitOptions);
        case "custom":
            return getCustomOptions(explicitOptions);
        default:
            return [];
    }
}

function getAbilityOptions(explicitOptions?: string[]): ChoiceOption[] {
    const allowed = explicitOptions ?? ABILITIES.map((ability) => ability.id);

    return ABILITIES.filter((ability) => allowed.includes(ability.id)).map(
        (ability) => ({ id: ability.id, name: ability.name })
    );
}

function getSkillOptions(
    explicitOptions: string[] | undefined,
    data: CharacterFormData,
    excludeProficient?: boolean
): ChoiceOption[] {
    const currentProficiencies = new Set<Skill>([
        ...(data.skillProficiencies?.class ?? []),
        ...(data.skillProficiencies?.race ?? []),
        ...(data.skillProficiencies?.background ?? []),
    ]);

    let skills = DND_SKILLS;

    if (explicitOptions) {
        skills = skills.filter((skill) => explicitOptions.includes(skill.id));
    }

    if (excludeProficient) {
        skills = skills.filter((skill) => !currentProficiencies.has(skill.id));
    }

    return skills.map((skill) => ({ id: skill.id, name: skill.name }));
}

function getClassOptions(explicitOptions?: string[]): ChoiceOption[] {
    let classes = DND_CLASSES;

    if (explicitOptions) {
        classes = classes.filter((characterClass) =>
            explicitOptions.includes(characterClass.id)
        );
    }

    return classes.map((characterClass) => ({
        id: characterClass.id,
        name: characterClass.name,
    }));
}

function getLanguageOptions(explicitOptions?: string[]): ChoiceOption[] {
    const languages =
        explicitOptions ?? [
            "common", "dwarvish", "elvish", "giant", "gnomish", "goblin",
            "halfling", "orc", "abyssal", "celestial", "draconic", "infernal",
            "primordial", "sylvan", "undercommon",
        ];

    const names: Record<string, string> = {
        common: "Comum", dwarvish: "Anão", elvish: "Élfico", giant: "Gigante",
        gnomish: "Gnômico", goblin: "Goblin", halfling: "Halfling", orc: "Orc",
        abyssal: "Abissal", celestial: "Celestial", draconic: "Dracônico",
        infernal: "Infernal", primordial: "Primordial", sylvan: "Silvestre",
        undercommon: "Subcomum",
    };

    return languages.map((language) => ({
        id: language,
        name: names[language] ?? language,
    }));
}

function getToolOptions(explicitOptions?: string[]): ChoiceOption[] {
    const tools =
        explicitOptions ?? [
            "alchemists-supplies", "brewers-supplies", "calligraphers-supplies",
            "carpenters-tools", "cartographers-tools", "cobblers-tools",
            "cooks-utensils", "glassblowers-tools", "jewelers-tools",
            "leatherworkers-tools", "masons-tools", "painters-supplies",
            "potters-tools", "smiths-tools", "tinkers-tools", "weavers-tools",
            "woodcarvers-tools", "disguise-kit", "forgery-kit", "herbalism-kit",
            "navigator-tools", "poisoners-kit", "thieves-tools", "gaming-set",
            "musical-instrument",
        ];

    const names: Record<string, string> = {
        "alchemists-supplies": "Suprimentos de Alquimista",
        "brewers-supplies": "Suprimentos de Cervejeiro",
        "calligraphers-supplies": "Suprimentos de Calígrafo",
        "carpenters-tools": "Ferramentas de Carpinteiro",
        "cartographers-tools": "Ferramentas de Cartógrafo",
        "cobblers-tools": "Ferramentas de Sapateiro",
        "cooks-utensils": "Utensílios de Cozinheiro",
        "glassblowers-tools": "Ferramentas de Soprador de Vidro",
        "jewelers-tools": "Ferramentas de Joalheiro",
        "leatherworkers-tools": "Ferramentas de Coureiro",
        "masons-tools": "Ferramentas de Pedreiro",
        "painters-supplies": "Suprimentos de Pintor",
        "potters-tools": "Ferramentas de Oleiro",
        "smiths-tools": "Ferramentas de Ferreiro",
        "tinkers-tools": "Ferramentas de Funileiro",
        "weavers-tools": "Ferramentas de Tecelão",
        "woodcarvers-tools": "Ferramentas de Entalhador",
        "disguise-kit": "Kit de Disfarce",
        "forgery-kit": "Kit de Falsificação",
        "herbalism-kit": "Kit de Herbalismo",
        "navigator-tools": "Ferramentas de Navegador",
        "poisoners-kit": "Kit de Envenenador",
        "thieves-tools": "Ferramentas de Ladrão",
        "gaming-set": "Conjunto de Jogos",
        "musical-instrument": "Instrumento Musical",
    };

    return tools.map((tool) => ({ id: tool, name: names[tool] ?? tool }));
}

function getCustomOptions(explicitOptions?: string[]): ChoiceOption[] {
    return (explicitOptions ?? []).map((option) => ({
        id: option,
        name: formatCustomOption(option),
    }));
}

function formatCustomOption(value: string): string {
    const names: Record<string, string> = {
        acid: "Ácido", cold: "Frio", fire: "Fogo", lightning: "Elétrico", thunder: "Trovão",
    };

    return (
        names[value] ??
        value.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    );
}