import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { DND_CLASSES } from "../data/dnd/classes";
import { DND_RACES } from "../data/dnd/races";
import { DND_TALENTS } from "../data/dnd/talents";
import { DND_BACKGROUNDS } from "../data/dnd/backgrounds";

import { CharacterCombat } from "../components/character/CharacterCombat";
import { CharacterCreationSteps } from "../components/character/CharacterCreationSteps";
import { CharacterIdentity } from "../components/character/CharacterIdentity";
import { CharacterAbilities } from "../components/character/CharacterAbilities";
import { CharacterSkills } from "../components/character/CharacterSkills";
import { CharacterEquipment } from "../components/character/CharacterEquipment";
import { CharacterSpells } from "../components/character/CharacterSpells";
import { CharacterLore } from "../components/character/CharacterLore";
import { CharacterSheetReview } from "../components/character/CharacterSheetReview";

import type { CharacterFormData } from "../types/character";
import {
    canEnterStep,
    getStepIssues,
} from "../data/dnd/characterCreation";
import { createCharacterFromForm } from "../services/character.service";

import {
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
    "Ficha",
];

const initialData: CharacterFormData = {
    name: "",

    raceId: "",
    subraceId: "",

    raceChoices: {},

    classes: [],

    talentId: "",

    talentChoices: {},

    backgroundId: "",
    backgroundChoices: {
        skills: [],
        tools: [],
        languages: [],
    },

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

    equipment: {
        classId: "",
        choiceSelections: {},
        manualItems: [],
    },

    spells: {
        byClass: {},
        talent: {
            cantrips: [],
            spells: [],
        },
        byFeat: {},
    },

    lore: "",
    quests: "",
    loreDetails: {
        appearance: "",
        personalityTraits: "",
        ideals: "",
        bonds: "",
        flaws: "",
    },
    hitPoints: null,
    asiSelections: {},
    featureChoices: {},
};

export function CreateCharacter() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const campaignIdParam = searchParams.get("campaignId");
    const campaignId = campaignIdParam ? Number(campaignIdParam) : null;

    const [currentStep, setCurrentStep] =
        useState(1);

    const [data, setData] =
        useState<CharacterFormData>(initialData);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const stepIssues = getStepIssues(currentStep, data);
    const canProceed = stepIssues.length === 0;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

    function handleNext() {
        if (currentStep < 8 && canProceed) {
            setCurrentStep((previous) => previous + 1);
        }
    }

    function handleChangeStep(step: number) {
        if (step === currentStep || canEnterStep(step, data)) {
            setCurrentStep(step);
        }
    }

    function handlePrevious() {
        if (currentStep > 1) {
            setCurrentStep((previous) => previous - 1);
        }
    }

    async function handleSave() {
        if (saving) return;

        try {
            setSaving(true);
            setSaveError("");
            const character = await createCharacterFromForm(data, {
                campaignId:
                    campaignId != null && !Number.isNaN(campaignId)
                        ? campaignId
                        : null,
            });
            navigate(`/characters/${character.id}`);
        } catch (error) {
            console.error(error);
            setSaveError(
                "Não foi possível salvar o personagem. Verifique se você está logado e tente novamente."
            );
        } finally {
            setSaving(false);
        }
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
                    onChangeStep={handleChangeStep}
                    canEnterStep={(step) => canEnterStep(step, data)}
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
                            backgrounds={DND_BACKGROUNDS}
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
                            onChange={setData}
                        />
                    )}

                    {currentStep === 5 && (
                        <CharacterEquipment
                            data={data}
                            onChange={setData}
                        />
                    )}

                    {currentStep === 6 && (
                        <CharacterSpells
                            data={data}
                            onChange={setData}
                        />
                    )}

                    {currentStep === 7 && (
                        <CharacterLore
                            data={data}
                            onChange={setData}
                        />
                    )}

                    {currentStep === 8 && (
                        <CharacterSheetReview
                            data={data}
                            backgrounds={DND_BACKGROUNDS}
                        />
                    )}

                    {/* Navegação */}
                    <div className="mt-8 border-t border-[#6B4423] pt-6">
                        {!canProceed && (
                            <ul className="mb-4 space-y-1 text-sm text-[#7A2530]">
                                {stepIssues.map((issue) => (
                                    <li key={issue}>• {issue}</li>
                                ))}
                            </ul>
                        )}

                        {saveError && (
                            <p className="mb-4 text-sm text-[#7A2530]">{saveError}</p>
                        )}

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 1 || saving}
                                className="text-sm text-[#5C4A38] hover:text-[#2A1D14] transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                ← Anterior
                            </button>

                            {currentStep < 8 ? (
                                <RibbonButton
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canProceed}
                                >
                                    Próximo
                                </RibbonButton>
                            ) : (
                                <RibbonButton
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{ backgroundColor: "#5C4A1E" }}
                                >
                                    {saving ? "Salvando..." : "Criar personagem"}
                                </RibbonButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}