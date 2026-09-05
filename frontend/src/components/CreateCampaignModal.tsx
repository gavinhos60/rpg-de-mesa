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
                            Nova campanha
                        </h2>

                        <p className="text-sm text-[#5C4A38] mt-1">
                            Dê o primeiro traço nesta aventura.
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

                <form onSubmit={handleSubmit}>
                    <label
                        htmlFor="campaign-name"
                        className="block text-sm text-[#5C4A38] mb-2"
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
                        className="w-full border px-4 py-3 text-[#2A1D14] outline-none focus:border-[#7A2530] transition-colors"
                        style={{ backgroundColor: "#EBDFC4", borderColor: "#A67C3D" }}
                    />

                    {error && (
                        <div className="flex items-center gap-3 mt-3 border px-4 py-3 text-sm"
                            style={{ backgroundColor: "#E8D4C4", borderColor: "#7A2530", color: "#5C1D26" }}
                        >
                            <BrokenSealIcon className="w-7 h-7 shrink-0" color="#7A2530" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end items-center gap-5 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[#5C4A38] hover:text-[#2A1D14] transition-colors"
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