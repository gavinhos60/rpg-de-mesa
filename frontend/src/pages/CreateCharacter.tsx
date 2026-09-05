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

import {
    QuillIcon,
    RibbonButton,
    romanStep,
} from "../components/icons/MedievalIcons";

const STEP_TITLES = [
    "Identidade",
    "Atributos",
    "Perícias",
    "Combate",
    "Equipamentos",
    "Magias",
    "Lore",
];

const backgrounds: CharacterBackground[] = [
    { id: "acolyte", name: "Acólito" },
    { id: "criminal", name: "Criminoso" },
    { id: "folk-hero", name: "Herói do Povo" },
    { id: "noble", name: "Nobre" },
    { id: "sage", name: "Sábio" },
    { id: "soldier", name: "Soldado" },
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
        acrobatics: { proficient: false, expertise: false },
        "animal-handling": { proficient: false, expertise: false },
        arcana: { proficient: false, expertise: false },
        athletics: { proficient: false, expertise: false },
        deception: { proficient: false, expertise: false },
        history: { proficient: false, expertise: false },
        insight: { proficient: false, expertise: false },
        intimidation: { proficient: false, expertise: false },
        investigation: { proficient: false, expertise: false },
        medicine: { proficient: false, expertise: false },
        nature: { proficient: false, expertise: false },
        perception: { proficient: false, expertise: false },
        performance: { proficient: false, expertise: false },
        persuasion: { proficient: false, expertise: false },
        religion: { proficient: false, expertise: false },
        "sleight-of-hand": { proficient: false, expertise: false },
        stealth: { proficient: false, expertise: false },
        survival: { proficient: false, expertise: false },
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
            setCurrentStep((previous) => previous + 1);
        }
    }

    function handlePrevious() {
        if (currentStep > 1) {
            setCurrentStep((previous) => previous - 1);
        }
    }

    function handleSave() {
        console.log("Personagem:", data);

        navigate("/characters");
    }

    return (
        <div
            className="min-h-[calc(100vh-4rem)] text-[#2A1D14]"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "#EBDFC4",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Cabeçalho */}
                <div className="mb-8 border-b border-[#6B4423] pb-6">
                    <button
                        type="button"
                        onClick={() => navigate("/characters")}
                        className="mb-5 text-sm text-[#5C4A38] hover:text-[#2A1D14] transition-colors"
                    >
                        ← Voltar para personagens
                    </button>

                    <h1
                        className="text-3xl text-[#2A1D14]"
                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                        Criar personagem
                    </h1>

                    <p className="mt-2 text-[#5C4A38]">
                        Monte sua ficha seguindo as regras de D&D 5e.
                    </p>
                </div>

                {/* Indicador das etapas */}
                <CharacterCreationSteps
                    currentStep={currentStep}
                    onChangeStep={setCurrentStep}
                />

                {/* Conteúdo da etapa atual — página do manuscrito */}
                <div
                    className="border border-[#6B4423] p-6 md:p-8 mt-6"
                    style={{ backgroundColor: "#DCCBA0" }}
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#A67C3D]/50">
                        <span
                            className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#6B4423] text-sm text-[#6B4423]"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {romanStep(currentStep)}
                        </span>
                        <h2
                            className="text-xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            {STEP_TITLES[currentStep - 1]}
                        </h2>
                    </div>

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

                    {currentStep === 2 && (
                        <CharacterAbilities
                            data={data}
                            onChange={setData}
                        />
                    )}

                    {currentStep === 3 && (
                        <CharacterSkills
                            data={data}
                            races={DND_RACES}
                            onChange={setData}
                        />
                    )}

                    {currentStep === 4 && (
                        <CharacterCombat
                            data={data}
                        />
                    )}

                    {(currentStep === 5 || currentStep === 6 || currentStep === 7) && (
                        <div className="py-16 text-center">
                            <QuillIcon className="w-8 h-8 mx-auto mb-4 text-[#6B4423]" />

                            <p className="text-[#5C4A38] italic">
                                Este capítulo ainda não foi escrito.
                            </p>
                        </div>
                    )}

                    {/* Navegação */}
                    <div className="mt-8 flex items-center justify-between border-t border-[#6B4423] pt-6">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="text-sm text-[#5C4A38] hover:text-[#2A1D14] transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            ← Anterior
                        </button>

                        {currentStep < 7 ? (
                            <RibbonButton type="button" onClick={handleNext}>
                                Próximo
                            </RibbonButton>
                        ) : (
                            <RibbonButton
                                type="button"
                                onClick={handleSave}
                                style={{ backgroundColor: "#5C4A1E" }}
                            >
                                Criar personagem
                            </RibbonButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}