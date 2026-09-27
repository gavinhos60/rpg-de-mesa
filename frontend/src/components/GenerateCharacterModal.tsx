import { useState } from "react";
import { DND_CLASSES } from "../data/dnd/classes";
import { createCharacterFromForm } from "../services/character.service";
import { generateRandomCharacter } from "../utils/generateRandomCharacter";
import { BrokenSealIcon, RibbonButton } from "./icons/MedievalIcons";

interface GenerateCharacterModalProps {
    onClose: () => void;
    onCreated: (characterId: number) => void;
}

export function GenerateCharacterModal({
    onClose,
    onCreated,
}: GenerateCharacterModalProps) {
    const [classId, setClassId] = useState(DND_CLASSES[0]?.id ?? "fighter");
    const [level, setLevel] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fieldClasses =
        "w-full border px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-crimson)] transition-colors";
    const fieldStyle = {
        backgroundColor: "var(--color-parchment)",
        borderColor: "var(--color-border)",
    };
    const labelClasses = "block text-sm text-[var(--color-ink-muted)] mb-2";
    const labelStyle = { fontFamily: "'Cinzel', serif" };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setLoading(true);
            setError("");
            const sheet = generateRandomCharacter(classId, level);
            const saved = await createCharacterFromForm(sheet);
            onCreated(saved.id);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Não foi possível gerar o personagem.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-overlay)] px-4">
            <div
                className="w-full max-w-md border-2 p-6"
                style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border-wood)",
                }}
            >
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2
                            className="text-xl text-[var(--color-ink)]"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                fontWeight: 600,
                            }}
                        >
                            Gerar personagem
                        </h2>
                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Nome, atributos, talento, magias e demais escolhas
                            são sorteados automaticamente.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl leading-none text-[var(--color-border-strong)] hover:text-[var(--color-crimson)]"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="gen-class"
                            className={labelClasses}
                            style={labelStyle}
                        >
                            Classe
                        </label>
                        <select
                            id="gen-class"
                            value={classId}
                            onChange={(event) => setClassId(event.target.value)}
                            className={fieldClasses}
                            style={fieldStyle}
                        >
                            {DND_CLASSES.map((characterClass) => (
                                <option
                                    key={characterClass.id}
                                    value={characterClass.id}
                                >
                                    {characterClass.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="gen-level"
                            className={labelClasses}
                            style={labelStyle}
                        >
                            Nível
                        </label>
                        <input
                            id="gen-level"
                            type="number"
                            min={1}
                            max={20}
                            value={level}
                            onChange={(event) =>
                                setLevel(
                                    Math.min(
                                        20,
                                        Math.max(
                                            1,
                                            Math.floor(
                                                Number(event.target.value) || 1
                                            )
                                        )
                                    )
                                )
                            }
                            className={fieldClasses}
                            style={fieldStyle}
                        />
                    </div>

                    {error ? (
                        <div
                            className="flex items-center gap-3 border px-4 py-3 text-sm"
                            style={{
                                backgroundColor: "var(--color-parchment-soft)",
                                borderColor: "var(--color-crimson)",
                                color: "var(--color-crimson-deep)",
                            }}
                        >
                            <BrokenSealIcon
                                className="h-7 w-7 shrink-0"
                                color="var(--color-crimson)"
                            />
                            {error}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-end gap-5 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
                        >
                            Cancelar
                        </button>
                        <RibbonButton type="submit" disabled={loading}>
                            {loading ? "Gerando..." : "Gerar e salvar"}
                        </RibbonButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
