import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DND_CLASSES } from "../data/dnd/classes";
import { DND_RACES } from "../data/dnd/races";
import { DND_TALENTS } from "../data/dnd/talents";

import { CharacterCombat } from "../components/character/CharacterCombat";
import { CharacterCreationSteps } from "../components/character/CharacterCreationSteps";
import { CharacterIdentity } from "../components/character/CharacterIdentity";
import { CharacterAbilities } from "../components/character/CharacterAbilities";
import { CharacterSkills } from "../components/character/CharacterSkills";

import type {
    CharacterBackground,
    CharacterFormData,
} from "../types/character";

const backgrounds: CharacterBackground[] = [
    {
        id: "acolyte",
        name: "Acólito",
    },
    {
        id: "criminal",
        name: "Criminoso",
    },
    {
        id: "folk-hero",
        name: "Herói do Povo",
    },
    {
        id: "noble",
        name: "Nobre",
    },
    {
        id: "sage",
        name: "Sábio",
    },
    {
        id: "soldier",
        name: "Soldado",
    },
];

const initialData: CharacterFormData = {
    name: "",

    raceId: "",

    raceChoices: {},

    classes: [],

    talentId: "",

    talentChoices: {},

    backgroundId: "",

    alignment: "",

    abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    },

    skills: {
        acrobatics: {
            proficient: false,
            expertise: false,
        },

        "animal-handling": {
            proficient: false,
            expertise: false,
        },

        arcana: {
            proficient: false,
            expertise: false,
        },

        athletics: {
            proficient: false,
            expertise: false,
        },

        deception: {
            proficient: false,
            expertise: false,
        },

        history: {
            proficient: false,
            expertise: false,
        },

        insight: {
            proficient: false,
            expertise: false,
        },

        intimidation: {
            proficient: false,
            expertise: false,
        },

        investigation: {
            proficient: false,
            expertise: false,
        },

        medicine: {
            proficient: false,
            expertise: false,
        },

        nature: {
            proficient: false,
            expertise: false,
        },

        perception: {
            proficient: false,
            expertise: false,
        },

        performance: {
            proficient: false,
            expertise: false,
        },

        persuasion: {
            proficient: false,
            expertise: false,
        },

        religion: {
            proficient: false,
            expertise: false,
        },

        "sleight-of-hand": {
            proficient: false,
            expertise: false,
        },

        stealth: {
            proficient: false,
            expertise: false,
        },

        survival: {
            proficient: false,
            expertise: false,
        },
    },

    skillProficiencies: {
        class: [],
        race: [],
        background: [],
        talent: [],
    },
};

export function CreateCharacter() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] =
        useState(1);

    const [data, setData] =
        useState<CharacterFormData>(initialData);

    function handleNext() {
        if (currentStep < 7) {
            setCurrentStep(
                (previous) => previous + 1
            );
        }
    }

    function handlePrevious() {
        if (currentStep > 1) {
            setCurrentStep(
                (previous) => previous - 1
            );
        }
    }

    function handleSave() {
        console.log(
            "Personagem:",
            data
        );

        navigate("/characters");
    }

    return (
        <div className="mx-auto max-w-6xl">
            {/* =========================================
                CABEÇALHO
            ========================================= */}

            <div className="mb-8">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/characters")
                    }
                    className="mb-5 text-sm text-slate-400 transition hover:text-white"
                >
                    ← Voltar para personagens
                </button>

                <h1 className="text-3xl font-bold text-white">
                    Criar personagem
                </h1>

                <p className="mt-2 text-slate-400">
                    Monte sua ficha de personagem
                    seguindo as regras de D&D 5e.
                </p>
            </div>

            {/* =========================================
                INDICADOR DAS ETAPAS
            ========================================= */}

            <CharacterCreationSteps
                currentStep={currentStep}
                onChangeStep={setCurrentStep}
            />

            {/* =========================================
                CONTEÚDO DA ETAPA ATUAL
            ========================================= */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">

                {/* =========================================
                    ETAPA 1 — IDENTIDADE
                ========================================= */}

                {currentStep === 1 && (
                    <CharacterIdentity
                        data={data}
                        races={DND_RACES}
                        classes={DND_CLASSES}
                        backgrounds={backgrounds}
                        talents={DND_TALENTS}
                        onChange={setData}
                    />
                )}

                {/* =========================================
                    ETAPA 2 — ATRIBUTOS
                ========================================= */}

                {currentStep === 2 && (
                    <CharacterAbilities
                        data={data}
                        onChange={setData}
                    />
                )}

                {/* =========================================
                    ETAPA 3 — PERÍCIAS
                ========================================= */}

                {currentStep === 3 && (
                    <CharacterSkills
                        data={data}
                        races={DND_RACES}
                        onChange={setData}
                    />
                )}

                {/* =========================================
                    ETAPA 4 — COMBATE
                ========================================= */}

                {currentStep === 4 && (
                    <CharacterCombat
                        data={data}
                    />
                )}

                {/* =========================================
                    ETAPA 5 — EQUIPAMENTOS
                ========================================= */}

                {currentStep === 5 && (
                    <div className="py-20 text-center">
                        <h2 className="text-2xl font-bold text-white">
                            Equipamentos
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Vamos implementar esta etapa
                            em seguida.
                        </p>
                    </div>
                )}

                {/* =========================================
                    ETAPA 6 — MAGIAS
                ========================================= */}

                {currentStep === 6 && (
                    <div className="py-20 text-center">
                        <h2 className="text-2xl font-bold text-white">
                            Magias
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Vamos implementar esta etapa
                            em seguida.
                        </p>
                    </div>
                )}

                {/* =========================================
                    ETAPA 7 — LORE
                ========================================= */}

                {currentStep === 7 && (
                    <div className="py-20 text-center">
                        <h2 className="text-2xl font-bold text-white">
                            Lore
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Vamos implementar esta etapa
                            em seguida.
                        </p>
                    </div>
                )}

                {/* =========================================
                    NAVEGAÇÃO
                ========================================= */}

                <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={
                            currentStep === 1
                        }
                        className="rounded-lg px-5 py-2.5 text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        ← Anterior
                    </button>

                    {currentStep < 7 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                        >
                            Próximo →
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSave}
                            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700"
                        >
                            Criar personagem
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}