import { useEffect, useState } from "react";

import {
    assignCharacterToCampaign,
    getMyCharacters,
    type SavedCharacter,
} from "../services/character.service";
import { BrokenSealIcon, RibbonButton } from "./icons/MedievalIcons";

interface AddCharacterToCampaignModalProps {
    campaignId: number;
    onClose: () => void;
    onAdded: () => void;
}

export function AddCharacterToCampaignModal({
    campaignId,
    onClose,
    onAdded,
}: AddCharacterToCampaignModalProps) {
    const [characters, setCharacters] = useState<SavedCharacter[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            try {
                setLoading(true);
                setError("");
                const list = await getMyCharacters();
                const available = list.filter(
                    (character) => character.campaignId !== campaignId
                );
                if (active) {
                    setCharacters(available);
                    setSelectedId(available[0]?.id ?? null);
                }
            } catch (err) {
                console.error(err);
                if (active) {
                    setError("Não foi possível carregar suas fichas.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        load();
        return () => {
            active = false;
        };
    }, [campaignId]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedId) {
            setError("Selecione uma ficha para adicionar.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            await assignCharacterToCampaign(selectedId, campaignId);
            onAdded();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            const status =
                err && typeof err === "object" && "response" in err
                    ? (err as { response?: { status?: number; data?: { error?: string } } })
                          .response?.status
                    : undefined;
            const message =
                err && typeof err === "object" && "response" in err
                    ? (err as { response?: { data?: { error?: string } } }).response
                          ?.data?.error
                    : undefined;

            if (status === 409) {
                setError(message || "Esta ficha já está nesta campanha.");
            } else if (status === 403) {
                setError(message || "Você precisa ser membro desta campanha.");
            } else {
                setError("Não foi possível adicionar a ficha.");
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div
                className="w-full max-w-lg border-2 p-6"
                style={{ backgroundColor: "#DCCBA0", borderColor: "#4A2F18" }}
            >
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2
                            className="text-xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Adicionar ficha
                        </h2>
                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Escolha um personagem que você já criou para entrar nesta
                            campanha.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl leading-none text-[#6B4423] hover:text-[#7A2530]"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {loading && (
                        <p className="text-sm italic text-[#5C4A38]">
                            Carregando suas fichas...
                        </p>
                    )}

                    {!loading && characters.length === 0 && (
                        <p className="text-sm text-[#5C4A38]">
                            Você não tem fichas disponíveis. Crie um personagem em
                            “Meus personagens” e volte aqui.
                        </p>
                    )}

                    {!loading && characters.length > 0 && (
                        <div className="max-h-72 space-y-2 overflow-y-auto">
                            {characters.map((character) => {
                                const selected = selectedId === character.id;
                                return (
                                    <button
                                        key={character.id}
                                        type="button"
                                        onClick={() => setSelectedId(character.id)}
                                        className="w-full border p-4 text-left transition-colors"
                                        style={{
                                            borderColor: selected ? "#7A2530" : "#A67C3D",
                                            backgroundColor: selected ? "#EBDFC4" : "#E8D7AD",
                                        }}
                                    >
                                        <p
                                            className="text-[#2A1D14]"
                                            style={{
                                                fontFamily: "'Cinzel', serif",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {character.name}
                                        </p>
                                        <p className="mt-1 text-sm text-[#5C4A38]">
                                            {character.race} · {character.className} · Nv.{" "}
                                            {character.level}
                                        </p>
                                        {character.campaign?.name && (
                                            <p className="mt-1 text-xs text-[#8A7860]">
                                                Atualmente em: {character.campaign.name}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {error && (
                        <div
                            className="flex items-center gap-3 border px-4 py-3 text-sm"
                            style={{
                                backgroundColor: "#E8D4C4",
                                borderColor: "#7A2530",
                                color: "#5C1D26",
                            }}
                        >
                            <BrokenSealIcon className="h-7 w-7 shrink-0" color="#7A2530" />
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[#5C4A38] transition-colors hover:text-[#2A1D14]"
                        >
                            Cancelar
                        </button>

                        <RibbonButton
                            type="submit"
                            disabled={saving || loading || !selectedId}
                        >
                            {saving ? "Adicionando..." : "Adicionar à campanha"}
                        </RibbonButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
