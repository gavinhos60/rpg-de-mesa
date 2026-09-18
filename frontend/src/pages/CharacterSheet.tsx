import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CharacterSheetReview } from "../components/character/CharacterSheetReview";
import { RibbonButton } from "../components/icons/MedievalIcons";
import { DND_BACKGROUNDS } from "../data/dnd/backgrounds";
import {
    getCharacterById,
    updateCharacterFromForm,
    type SavedCharacter,
} from "../services/character.service";
import type { CharacterFormData } from "../types/character";
import { ensureResourcesSynced } from "../utils/characterResources";

export function CharacterSheet() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState<SavedCharacter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [xpBusy, setXpBusy] = useState(false);

    useEffect(() => {
        let active = true;

        async function load() {
            if (!id) {
                setError("Personagem inválido.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                const result = await getCharacterById(Number(id));
                if (active) setCharacter(result);
            } catch (err) {
                console.error(err);
                if (active) {
                    setError(
                        "Não foi possível carregar esta ficha. Ela pode não existir ou não pertencer a você."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        load();
        return () => {
            active = false;
        };
    }, [id]);

    const sheet = character?.sheet as CharacterFormData | null | undefined;
    const reviewData: CharacterFormData | null = sheet
        ? { ...sheet, avatar: sheet.avatar ?? character?.avatar ?? null }
        : null;

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
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        to="/characters"
                        className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                    >
                        ← Voltar para personagens
                    </Link>
                    {character && (
                        <RibbonButton
                            type="button"
                            onClick={() =>
                                navigate(`/characters/${character.id}/edit`, {
                                    state: { character },
                                })
                            }
                        >
                            Editar ficha
                        </RibbonButton>
                    )}
                </div>

                {loading && (
                    <p className="mt-6 text-[var(--color-ink-muted)]">Abrindo o manuscrito...</p>
                )}

                {!loading && error && (
                    <div
                        className="mt-6 border border-[var(--color-crimson)] p-6 text-[var(--color-crimson)]"
                        style={{ backgroundColor: "var(--color-surface)" }}
                    >
                        {error}
                    </div>
                )}

                {!loading && character && !reviewData && (
                    <div
                        className="mt-6 border border-[var(--color-border-strong)] p-6"
                        style={{ backgroundColor: "var(--color-surface)" }}
                    >
                        <div className="flex items-center gap-4">
                            {character.avatar ? (
                                <img
                                    src={character.avatar}
                                    alt={character.name}
                                    className="h-16 w-16 rounded-full object-cover"
                                    style={{ boxShadow: "0 0 0 2px var(--color-border)" }}
                                />
                            ) : null}
                            <div>
                                <h1
                                    className="text-3xl text-[var(--color-ink)]"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontWeight: 600,
                                    }}
                                >
                                    {character.name}
                                </h1>
                                <p className="mt-2 text-[var(--color-ink-muted)]">
                                    {character.race} · {character.className} · Nível{" "}
                                    {character.level}
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm italic text-[var(--color-ink-soft)]">
                            Este personagem ainda não possui ficha completa. Use{" "}
                            <strong>Editar ficha</strong> para completar.
                        </p>
                    </div>
                )}

                {!loading && character && reviewData && (
                    <div
                        className="mt-6 border border-[var(--color-border-strong)] p-6 md:p-8"
                        style={{ backgroundColor: "var(--color-surface)" }}
                    >
                        <CharacterSheetReview
                            data={reviewData}
                            backgrounds={DND_BACKGROUNDS}
                            xpManage={{
                                busy: xpBusy,
                                onUpdateXp: async (xp) => {
                                    if (!character || !reviewData) return;
                                    setXpBusy(true);
                                    try {
                                        const saved = await updateCharacterFromForm(
                                            character.id,
                                            { ...reviewData, xp }
                                        );
                                        setCharacter(saved);
                                    } finally {
                                        setXpBusy(false);
                                    }
                                },
                                onLevelUp: async (updated) => {
                                    if (!character) return;
                                    setXpBusy(true);
                                    try {
                                        const saved = await updateCharacterFromForm(
                                            character.id,
                                            ensureResourcesSynced(updated)
                                        );
                                        setCharacter(saved);
                                    } finally {
                                        setXpBusy(false);
                                    }
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
