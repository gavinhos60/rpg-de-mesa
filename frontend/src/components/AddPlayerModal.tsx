import { useState } from "react";

import { addPlayerByEmail } from "../services/campaign.service";
import { BrokenSealIcon, RibbonButton } from "./icons/MedievalIcons";

interface AddPlayerModalProps {
    campaignId: number;
    onClose: () => void;
    onAdded: () => void;
}

export function AddPlayerModal({
    campaignId,
    onClose,
    onAdded,
}: AddPlayerModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!email.trim()) {
            setError("Informe o email do jogador.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await addPlayerByEmail(
                campaignId,
                email.trim()
            );

            onAdded();
            onClose();
        } catch (error: any) {
            console.error(error);

            if (error?.response?.status === 404) {
                setError("Usuário não encontrado.");
            } else if (error?.response?.status === 409) {
                setError("Este usuário já faz parte da campanha.");
            } else {
                setError("Não foi possível adicionar o jogador.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div
                className="w-full max-w-md border-2 p-6"
                style={{ backgroundColor: "#DCCBA0", borderColor: "#4A2F18" }}
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2
                            className="text-xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Adicionar jogador
                        </h2>

                        <p className="text-sm text-[#5C4A38] mt-1">
                            Informe o email de um usuário cadastrado.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#6B4423] hover:text-[#7A2530] text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="player-email"
                            className="block text-sm text-[#5C4A38] mb-2"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Email do jogador
                        </label>

                        <input
                            id="player-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="jogador@email.com"
                            autoFocus
                            required
                            className="w-full border px-4 py-3 text-[#2A1D14] outline-none focus:border-[#7A2530] transition-colors"
                            style={{ backgroundColor: "#EBDFC4", borderColor: "#A67C3D" }}
                        />
                    </div>

                    {error && (
                        <div
                            className="flex items-center gap-3 border px-4 py-3 text-sm"
                            style={{ backgroundColor: "#E8D4C4", borderColor: "#7A2530", color: "#5C1D26" }}
                        >
                            <BrokenSealIcon className="w-7 h-7 shrink-0" color="#7A2530" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end items-center gap-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[#5C4A38] hover:text-[#2A1D14] transition-colors"
                        >
                            Cancelar
                        </button>

                        <RibbonButton type="submit" disabled={loading}>
                            {loading ? "Adicionando..." : "Adicionar jogador"}
                        </RibbonButton>
                    </div>
                </form>
            </div>
        </div>
    );
}