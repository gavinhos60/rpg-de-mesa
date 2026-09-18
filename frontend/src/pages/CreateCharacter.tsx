import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

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
import {
    createCharacterFromForm,
    getCharacterById,
    updateCharacterFromForm,
    type SavedCharacter,
} from "../services/character.service";

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
    avatar: null,
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
        customItems: [],
        removedItems: [],
    },
    wallet: { pl: 0, po: 0, pp: 0 },
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
    xp: 0,
    asiSelections: {},
    featureChoices: {},
};

function parseSheetPayload(raw: unknown): CharacterFormData | null {
    if (!raw) return null;
    if (typeof raw === "string") {
        try {
            return parseSheetPayload(JSON.parse(raw));
        } catch {
            return null;
        }
    }
    if (typeof raw !== "object") return null;
    return raw as CharacterFormData;
}

function mergeSheet(
    sheet: CharacterFormData | null | undefined,
    avatar?: string | null,
    fallbackName?: string
): CharacterFormData {
    if (!sheet) {
        return {
            ...initialData,
            name: fallbackName?.trim() || "",
            avatar: avatar ?? null,
        };
    }

    return {
        ...initialData,
        ...sheet,
        name: sheet.name?.trim() || fallbackName?.trim() || "",
        avatar: sheet.avatar ?? avatar ?? null,
        raceChoices: sheet.raceChoices ?? {},
        talentChoices: sheet.talentChoices ?? {},
        backgroundChoices: {
            skills: sheet.backgroundChoices?.skills ?? [],
            tools: sheet.backgroundChoices?.tools ?? [],
            languages: sheet.backgroundChoices?.languages ?? [],
        },
        abilities: { ...initialData.abilities, ...(sheet.abilities ?? {}) },
        skills: { ...initialData.skills, ...(sheet.skills ?? {}) },
        skillProficiencies: {
            class: sheet.skillProficiencies?.class ?? [],
            race: sheet.skillProficiencies?.race ?? [],
            background: sheet.skillProficiencies?.background ?? [],
            talent: sheet.skillProficiencies?.talent ?? [],
        },
        equipment: {
            classId: sheet.equipment?.classId ?? "",
            choiceSelections: sheet.equipment?.choiceSelections ?? {},
            manualItems: sheet.equipment?.manualItems ?? [],
            customItems: sheet.equipment?.customItems ?? [],
            removedItems: sheet.equipment?.removedItems ?? [],
        },
        wallet: sheet.wallet
            ? {
                  pl: Math.max(0, Math.floor(Number(sheet.wallet.pl) || 0)),
                  po: Math.max(0, Math.floor(Number(sheet.wallet.po) || 0)),
                  pp: Math.max(0, Math.floor(Number(sheet.wallet.pp) || 0)),
              }
            : undefined,
        spells: {
            byClass: sheet.spells?.byClass ?? {},
            talent: {
                cantrips: sheet.spells?.talent?.cantrips ?? [],
                spells: sheet.spells?.talent?.spells ?? [],
            },
            byFeat: sheet.spells?.byFeat ?? {},
        },
        loreDetails: {
            appearance: sheet.loreDetails?.appearance ?? "",
            personalityTraits: sheet.loreDetails?.personalityTraits ?? "",
            ideals: sheet.loreDetails?.ideals ?? "",
            bonds: sheet.loreDetails?.bonds ?? "",
            flaws: sheet.loreDetails?.flaws ?? "",
        },
        asiSelections: sheet.asiSelections ?? {},
        featureChoices: sheet.featureChoices ?? {},
        classes: Array.isArray(sheet.classes) ? sheet.classes : [],
    };
}

function sheetFromCharacter(character: SavedCharacter): CharacterFormData {
    return mergeSheet(
        parseSheetPayload(character.sheet),
        character.avatar,
        character.name
    );
}

export function CreateCharacter() {
    const { id: editIdParam } = useParams();
    const editId =
        editIdParam && /^\d+$/.test(editIdParam) ? Number(editIdParam) : null;

    return <CreateCharacterForm key={editId ?? "new"} editId={editId} />;
}

function CreateCharacterForm({ editId }: { editId: number | null }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const campaignIdParam = searchParams.get("campaignId");
    const campaignId = campaignIdParam ? Number(campaignIdParam) : null;
    const isEdit = Boolean(editId);

    const preloaded = (location.state as { character?: SavedCharacter } | null)
        ?.character;
    const hasPreload =
        Boolean(isEdit && editId && preloaded && preloaded.id === editId);

    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<CharacterFormData>(() =>
        hasPreload && preloaded ? sheetFromCharacter(preloaded) : initialData
    );
    const [saving, setSaving] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(isEdit && !hasPreload);
    const [saveError, setSaveError] = useState("");
    const [loadError, setLoadError] = useState("");

    const stepIssues = getStepIssues(currentStep, data);
    const canProceed = stepIssues.length === 0;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

    useEffect(() => {
        if (!editId) return;

        let cancelled = false;

        async function load() {
            try {
                setLoadingEdit(true);
                setLoadError("");
                const character = await getCharacterById(editId!);
                if (cancelled) return;
                setData(sheetFromCharacter(character));
            } catch (error) {
                console.error(error);
                if (!cancelled) {
                    setLoadError(
                        "Não foi possível carregar a ficha para edição."
                    );
                }
            } finally {
                if (!cancelled) setLoadingEdit(false);
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, [editId]);

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
            const character =
                isEdit && editId
                    ? await updateCharacterFromForm(editId, data)
                    : await createCharacterFromForm(data, {
                          campaignId:
                              campaignId != null && !Number.isNaN(campaignId)
                                  ? campaignId
                                  : null,
                      });
            navigate(`/characters/${character.id}`, { replace: true });
        } catch (error) {
            console.error(error);
            setSaveError(
                isEdit
                    ? "Não foi possível atualizar o personagem. Tente novamente."
                    : "Não foi possível salvar o personagem. Verifique se você está logado e tente novamente."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="min-h-[calc(100vh-4rem)] text-[var(--color-ink)]"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "var(--color-parchment)",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
                <div className="mb-8 border-b border-[var(--color-border-strong)] pb-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                isEdit && editId
                                    ? `/characters/${editId}`
                                    : "/characters"
                            )
                        }
                        className="mb-5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                    >
                        ← Voltar
                    </button>

                    <h1
                        className="text-3xl text-[var(--color-ink)]"
                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                        {isEdit ? "Editar personagem" : "Criar personagem"}
                    </h1>

                    <p className="mt-2 text-[var(--color-ink-muted)]">
                        {isEdit
                            ? "Atualize a ficha e a foto do seu personagem."
                            : "Monte sua ficha seguindo as regras de D&D 5e."}
                    </p>
                </div>

                {loadingEdit && (
                    <p className="text-[var(--color-ink-muted)]">Carregando ficha...</p>
                )}

                {!loadingEdit && loadError && (
                    <div
                        className="border border-[var(--color-crimson)] p-6 text-[var(--color-crimson)]"
                        style={{ backgroundColor: "var(--color-surface)" }}
                    >
                        {loadError}
                    </div>
                )}

                {!loadingEdit && !loadError && (
                    <>
                        <CharacterCreationSteps
                            currentStep={currentStep}
                            onChangeStep={handleChangeStep}
                            canEnterStep={(step) => canEnterStep(step, data)}
                        />

                        <div
                            className="mt-6 border border-[var(--color-border-strong)] p-6 md:p-8"
                            style={{ backgroundColor: "var(--color-surface)" }}
                        >
                            <div className="mb-6 flex items-center gap-3 border-b border-[var(--color-border)]/50 pb-4">
                                <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--color-border-strong)] text-sm text-[var(--color-border-strong)]"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    {romanStep(currentStep)}
                                </span>
                                <h2
                                    className="text-xl text-[var(--color-ink)]"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontWeight: 600,
                                    }}
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
                                <CharacterAbilities data={data} onChange={setData} />
                            )}
                            {currentStep === 3 && (
                                <CharacterSkills
                                    data={data}
                                    races={DND_RACES}
                                    onChange={setData}
                                />
                            )}
                            {currentStep === 4 && (
                                <CharacterCombat data={data} onChange={setData} />
                            )}
                            {currentStep === 5 && (
                                <CharacterEquipment data={data} onChange={setData} />
                            )}
                            {currentStep === 6 && (
                                <CharacterSpells data={data} onChange={setData} />
                            )}
                            {currentStep === 7 && (
                                <CharacterLore data={data} onChange={setData} />
                            )}
                            {currentStep === 8 && (
                                <CharacterSheetReview
                                    data={data}
                                    backgrounds={DND_BACKGROUNDS}
                                />
                            )}

                            <div className="mt-8 border-t border-[var(--color-border-strong)] pt-6">
                                {!canProceed && (
                                    <ul className="mb-4 space-y-1 text-sm text-[var(--color-crimson)]">
                                        {stepIssues.map((issue) => (
                                            <li key={issue}>• {issue}</li>
                                        ))}
                                    </ul>
                                )}

                                {saveError && (
                                    <p className="mb-4 text-sm text-[var(--color-crimson)]">
                                        {saveError}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        disabled={currentStep === 1 || saving}
                                        className="text-sm text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-30"
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
                                            {saving
                                                ? "Salvando..."
                                                : isEdit
                                                  ? "Salvar alterações"
                                                  : "Criar personagem"}
                                        </RibbonButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
