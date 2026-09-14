import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { CharacterSheetReview } from "../components/character/CharacterSheetReview";
import { DND_BACKGROUNDS } from "../data/dnd/backgrounds";
import {
    getCharacterById,
    type SavedCharacter,
} from "../services/character.service";
import type { CharacterFormData } from "../types/character";

export function CharacterSheet() {
    const { id } = useParams();
    const [character, setCharacter] = useState<SavedCharacter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                <Link
                    to="/characters"
                    className="mb-5 inline-block text-sm text-[#5C4A38] hover:text-[#2A1D14] transition-colors"
                >
                    ← Voltar para personagens
                </Link>

                {loading && (
                    <p className="mt-6 text-[#5C4A38]">Abrindo o manuscrito...</p>
                )}

                {!loading && error && (
                    <div
                        className="mt-6 border border-[#7A2530] p-6 text-[#7A2530]"
                        style={{ backgroundColor: "#DCCBA0" }}
                    >
                        {error}
                    </div>
                )}

                {!loading && character && !sheet && (
                    <div
                        className="mt-6 border border-[#6B4423] p-6"
                        style={{ backgroundColor: "#DCCBA0" }}
                    >
                        <h1
                            className="text-3xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            {character.name}
                        </h1>
                        <p className="mt-2 text-[#5C4A38]">
                            {character.race} · {character.className} · Nível{" "}
                            {character.level}
                        </p>
                        <p className="mt-4 text-sm italic text-[#8A7860]">
                            Este personagem foi criado pelo formulário rápido da
                            campanha e ainda não possui ficha completa.
                        </p>
                    </div>
                )}

                {!loading && character && sheet && (
                    <div
                        className="mt-6 border border-[#6B4423] p-6 md:p-8"
                        style={{ backgroundColor: "#DCCBA0" }}
                    >
                        <CharacterSheetReview
                            data={sheet}
                            backgrounds={DND_BACKGROUNDS}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
