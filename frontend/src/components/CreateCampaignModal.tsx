import { useState } from "react";
import { createCampaign } from "../services/campaign.service";
import { BrokenSealIcon, RibbonButton } from "./icons/MedievalIcons";

interface CreateCampaignModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export function CreateCampaignModal({
    onClose,
    onCreated,
}: CreateCampaignModalProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Informe o nome da campanha.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await createCampaign(name.trim());

            onCreated();
            onClose();
        } catch (error) {
            console.error(error);
            setError("Não foi possível criar a campanha.");
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
                            Nova campanha
                        </h2>

                        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
                            Dê o primeiro traço nesta aventura.
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

                <form onSubmit={handleSubmit}>
                    <label
                        htmlFor="campaign-name"
                        className="block text-sm text-[var(--color-ink-muted)] mb-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Nome da campanha
                    </label>

                    <input
                        id="campaign-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Ex.: As Minas de Phandelver"
                        autoFocus
                        className="w-full border px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-crimson)] transition-colors"
                        style={{ backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" }}
                    />

                    {error && (
                        <div className="flex items-center gap-3 mt-3 border px-4 py-3 text-sm"
                            style={{ backgroundColor: "var(--color-parchment-soft)", borderColor: "var(--color-crimson)", color: "var(--color-crimson-deep)" }}
                        >
                            <BrokenSealIcon className="w-7 h-7 shrink-0" color="var(--color-crimson)" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end items-center gap-5 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                        >
                            Cancelar
                        </button>

                        <RibbonButton type="submit" disabled={loading}>
                            {loading ? "Criando..." : "Criar campanha"}
                        </RibbonButton>
                    </div>
                </form>
            </div>
        </div>
    );
}