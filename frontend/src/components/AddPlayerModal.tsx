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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-overlay)] px-4">
            <div
                className="w-full max-w-md border-2 p-6"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-wood)" }}
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2
                            className="text-xl text-[var(--color-ink)]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Adicionar jogador
                        </h2>

                        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
                            Informe o email de um usuário cadastrado.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--color-border-strong)] hover:text-[var(--color-crimson)] text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="player-email"
                            className="block text-sm text-[var(--color-ink-muted)] mb-2"
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
                            className="w-full border px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-crimson)] transition-colors"
                            style={{ backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" }}
                        />
                    </div>

                    {error && (
                        <div
                            className="flex items-center gap-3 border px-4 py-3 text-sm"
                            style={{ backgroundColor: "var(--color-parchment-soft)", borderColor: "var(--color-crimson)", color: "var(--color-crimson-deep)" }}
                        >
                            <BrokenSealIcon className="w-7 h-7 shrink-0" color="var(--color-crimson)" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end items-center gap-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
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