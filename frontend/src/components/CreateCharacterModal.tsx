import { useState } from "react";
import { createCharacter } from "../services/campaign.service";
import { BrokenSealIcon, RibbonButton } from "./icons/MedievalIcons";

interface CreateCharacterModalProps {
    campaignId: number;
    playerId: number;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateCharacterModal({
    campaignId,
    playerId,
    onClose,
    onCreated,
}: CreateCharacterModalProps) {
    const [name, setName] = useState("");
    const [className, setClassName] = useState("");
    const [race, setRace] = useState("");
    const [level, setLevel] = useState(1);
    const [avatar, setAvatar] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fieldClasses =
        "w-full border px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-crimson)] transition-colors";
    const fieldStyle = { backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" };
    const labelClasses = "block text-sm text-[var(--color-ink-muted)] mb-2";
    const labelStyle = { fontFamily: "'Cinzel', serif" };

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Informe o nome do personagem.");
            return;
        }

        if (!className.trim()) {
            setError("Informe a classe.");
            return;
        }

        if (!race.trim()) {
            setError("Informe a raça.");
            return;
        }

        if (level < 1) {
            setError("O nível deve ser maior que zero.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await createCharacter({
                name: name.trim(),
                className: className.trim(),
                race: race.trim(),
                level,
                avatar: avatar.trim() || undefined,
                playerId,
                campaignId,
            });

            onCreated();
            onClose();
        } catch (error) {
            console.error(error);

            setError("Não foi possível criar o personagem.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-overlay)] px-4">
            <div
                className="w-full max-w-lg border-2 p-6"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-wood)" }}
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2
                            className="text-xl text-[var(--color-ink)]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Novo personagem
                        </h2>

                        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
                            Registre um novo aventureiro nesta campanha.
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="character-name" className={labelClasses} style={labelStyle}>
                            Nome
                        </label>

                        <input
                            id="character-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Ex.: Arannis"
                            autoFocus
                            className={fieldClasses}
                            style={fieldStyle}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="character-class" className={labelClasses} style={labelStyle}>
                                Classe
                            </label>

                            <input
                                id="character-class"
                                value={className}
                                onChange={(event) => setClassName(event.target.value)}
                                placeholder="Ex.: Guerreiro"
                                className={fieldClasses}
                                style={fieldStyle}
                            />
                        </div>

                        <div>
                            <label htmlFor="character-race" className={labelClasses} style={labelStyle}>
                                Raça
                            </label>

                            <input
                                id="character-race"
                                value={race}
                                onChange={(event) => setRace(event.target.value)}
                                placeholder="Ex.: Humano"
                                className={fieldClasses}
                                style={fieldStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="character-level" className={labelClasses} style={labelStyle}>
                            Nível
                        </label>

                        <input
                            id="character-level"
                            type="number"
                            min={1}
                            value={level}
                            onChange={(event) => setLevel(Number(event.target.value))}
                            className={fieldClasses}
                            style={fieldStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="character-avatar" className={labelClasses} style={labelStyle}>
                            URL do avatar
                        </label>

                        <input
                            id="character-avatar"
                            type="url"
                            value={avatar}
                            onChange={(event) => setAvatar(event.target.value)}
                            placeholder="https://..."
                            className={fieldClasses}
                            style={fieldStyle}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 border px-4 py-3 text-sm"
                            style={{ backgroundColor: "var(--color-parchment-soft)", borderColor: "var(--color-crimson)", color: "var(--color-crimson-deep)" }}
                        >
                            <BrokenSealIcon className="w-7 h-7 shrink-0" color="var(--color-crimson)" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end items-center gap-5 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                        >
                            Cancelar
                        </button>

                        <RibbonButton type="submit" disabled={loading}>
                            {loading ? "Criando..." : "Criar personagem"}
                        </RibbonButton>
                    </div>
                </form>
            </div>
        </div>
    );
}