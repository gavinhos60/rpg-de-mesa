import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ScrollIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";
import {
    getMyCharacters,
    type SavedCharacter,
} from "../services/character.service";

export function Characters() {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<SavedCharacter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            try {
                setLoading(true);
                setError("");
                const list = await getMyCharacters();
                if (active) setCharacters(list);
            } catch (err) {
                console.error(err);
                if (active) {
                    setError(
                        "Não foi possível carregar seus personagens. Faça login e tente novamente."
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
    }, []);

    return (
        <div
            className="min-h-full text-[#2A1D14] "
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "#EBDFC4",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="max-w-6xl mx-auto px-6  py-10">
                <div className="mb-8 flex items-end justify-between gap-4 flex-wrap border-b border-[#6B4423] pb-5">
                    <div>
                        <h1
                            className="text-3xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Meus personagens
                        </h1>

                        <p className="mt-2 text-[#5C4A38]">
                            Crie e gerencie seus personagens de RPG.
                        </p>
                    </div>

                    <RibbonButton onClick={() => navigate("/characters/new")}>
                        Novo personagem
                    </RibbonButton>
                </div>

                {loading && (
                    <p className="text-[#5C4A38]">Carregando fichas...</p>
                )}

                {!loading && error && (
                    <div
                        className="border border-[#7A2530] p-6 text-[#7A2530]"
                        style={{ backgroundColor: "#DCCBA0" }}
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && characters.length === 0 && (
                    <div
                        className="border border-[#6B4423] p-12 text-center"
                        style={{ backgroundColor: "#DCCBA0" }}
                    >
                        <ScrollIcon className="w-16 h-12 mx-auto mb-4 text-[#6B4423]" />

                        <h2
                            className="text-xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Nenhum personagem registrado
                        </h2>

                        <p className="mt-2 text-[#5C4A38]">
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
                            <button
                                key={character.id}
                                type="button"
                                onClick={() =>
                                    navigate(`/characters/${character.id}`)
                                }
                                className="border border-[#6B4423] p-5 text-left transition-colors hover:border-[#7A2530] cursor-pointer"
                                style={{ backgroundColor: "#DCCBA0" }}
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <h2
                                        className="text-xl text-[#2A1D14]"
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {character.name}
                                    </h2>
                                    <span
                                        className="shrink-0 px-2 py-1 text-xs text-[#EBDFC4]"
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            backgroundColor: "#7A2530",
                                        }}
                                    >
                                        Nv. {character.level}
                                    </span>
                                </div>

                                <p className="text-sm text-[#5C4A38]">
                                    {character.race}
                                </p>
                                <p className="mt-1 text-sm text-[#2A1D14]">
                                    {character.className}
                                </p>

                                {character.campaign?.name && (
                                    <p className="mt-3 text-xs text-[#8A7860]">
                                        Campanha: {character.campaign.name}
                                    </p>
                                )}

                                {!character.sheet && (
                                    <p className="mt-3 text-xs italic text-[#8A7860]">
                                        Ficha resumida (sem detalhes do wizard)
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
