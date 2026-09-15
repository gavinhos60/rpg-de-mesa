import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ScrollIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";
import {
    deleteCharacter,
    getMyCharacters,
    type SavedCharacter,
} from "../services/character.service";

export function Characters() {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<SavedCharacter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        try {
            setLoading(true);
            setError("");
            const list = await getMyCharacters();
            setCharacters(list);
        } catch (err) {
            console.error(err);
            setError(
                "Não foi possível carregar seus personagens. Faça login e tente novamente."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    async function handleDelete(character: SavedCharacter) {
        const confirmed = window.confirm(
            `Excluir permanentemente "${character.name}"?\n\nEsta ação não pode ser desfeita.`
        );
        if (!confirmed) return;
        try {
            await deleteCharacter(character.id);
            setCharacters((prev) => prev.filter((item) => item.id !== character.id));
        } catch (err) {
            console.error(err);
            alert("Não foi possível excluir o personagem.");
        }
    }

    return (
        <div
            className="min-h-full text-[var(--color-ink)] "
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "var(--color-parchment)",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
                <div className="mb-8 flex items-end justify-between gap-4 flex-wrap border-b border-[var(--color-border-strong)] pb-5">
                    <div>
                        <h1
                            className="text-3xl text-[var(--color-ink)]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Meus personagens
                        </h1>

                        <p className="mt-2 text-[var(--color-ink-muted)]">
                            Crie e gerencie seus personagens de RPG.
                        </p>
                    </div>

                    <RibbonButton onClick={() => navigate("/characters/new")}>
                        Novo personagem
                    </RibbonButton>
                </div>

                {loading && (
                    <p className="text-[var(--color-ink-muted)]">Carregando fichas...</p>
                )}

                {!loading && error && (
                    <div
                        className="border border-[var(--color-crimson)] p-6 text-[var(--color-crimson)]"
                        style={{ backgroundColor: "var(--color-surface)" }}
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && characters.length === 0 && (
                    <div
                        className="border border-[var(--color-border-strong)] p-12 text-center"
                        style={{ backgroundColor: "var(--color-surface)" }}
                    >
                        <ScrollIcon className="w-16 h-12 mx-auto mb-4 text-[var(--color-border-strong)]" />

                        <h2
                            className="text-xl text-[var(--color-ink)]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Nenhum personagem registrado
                        </h2>

                        <p className="mt-2 text-[var(--color-ink-muted)]">
                            Você ainda não escreveu nenhuma página nesta coleção.
                        </p>

                        <RibbonButton
                            className="mt-6"
                            onClick={() => navigate("/characters/new")}
                        >
                            Criar personagem
                        </RibbonButton>
                    </div>
                )}

                {!loading && !error && characters.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
                        {characters.map((character) => (
                            <div
                                key={character.id}
                                className="border border-[var(--color-border-strong)] text-left"
                                style={{ backgroundColor: "var(--color-surface)" }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/characters/${character.id}`)
                                    }
                                    className="w-full p-5 text-left transition-colors hover:border-[var(--color-crimson)] cursor-pointer"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            {character.avatar ? (
                                                <img
                                                    src={character.avatar}
                                                    alt={character.name}
                                                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                                                    style={{
                                                        boxShadow: "0 0 0 2px #C09A5A",
                                                        backgroundColor: "#1A140F",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs text-[var(--color-ink-inverse)]"
                                                    style={{
                                                        backgroundColor: "var(--color-crimson)",
                                                        fontFamily: "'Cinzel', serif",
                                                    }}
                                                >
                                                    {character.name.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <h2
                                                className="truncate text-xl text-[var(--color-ink)]"
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {character.name}
                                            </h2>
                                        </div>
                                        <span
                                            className="shrink-0 px-2 py-1 text-xs text-[var(--color-ink-inverse)]"
                                            style={{
                                                fontFamily: "'Cinzel', serif",
                                                backgroundColor: "var(--color-crimson)",
                                            }}
                                        >
                                            Nv. {character.level}
                                        </span>
                                    </div>

                                    <p className="text-sm text-[var(--color-ink-muted)]">
                                        {character.race}
                                    </p>
                                    <p className="mt-1 text-sm text-[var(--color-ink)]">
                                        {character.className}
                                    </p>

                                    {character.campaign?.name && (
                                        <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
                                            Campanha: {character.campaign.name}
                                        </p>
                                    )}

                                    {!character.sheet && (
                                        <p className="mt-3 text-xs italic text-[var(--color-ink-soft)]">
                                            Ficha resumida (sem detalhes do wizard)
                                        </p>
                                    )}
                                </button>
                                <div
                                    className="flex gap-2 border-t px-5 py-3"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/characters/${character.id}/edit`, {
                                                state: { character },
                                            })
                                        }
                                        className="flex-1 border px-3 py-2 text-sm text-[var(--color-ink-muted)]"
                                        style={{
                                            borderColor: "var(--color-border)",
                                            backgroundColor: "var(--color-parchment)",
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(character)}
                                        className="flex-1 border px-3 py-2 text-sm text-[var(--color-crimson)]"
                                        style={{
                                            borderColor: "var(--color-crimson)",
                                            backgroundColor: "var(--color-parchment-soft)",
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
