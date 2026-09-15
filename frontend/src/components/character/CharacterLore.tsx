import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { CharacterFormData } from "../../types/character";
import { DND_CLASSES } from "../../data/dnd/classes";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import { getInitialHitPoints } from "../../data/dnd/combat";

interface CharacterLoreProps {
    data: CharacterFormData;
    onChange: Dispatch<SetStateAction<CharacterFormData>>;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };

export function CharacterLore({ data, onChange }: CharacterLoreProps) {
    const primaryClass = data.classes[0]
        ? DND_CLASSES.find((item) => item.id === data.classes[0].classId)
        : undefined;
    const constitution = getFinalAbilities(data).constitution;
    const suggestedHitPoints = primaryClass
        ? getInitialHitPoints(primaryClass, constitution)
        : 0;

    useEffect(() => {
        if (data.hitPoints !== null || suggestedHitPoints <= 0) {
            return;
        }

        onChange((previous) => {
            if (previous.hitPoints !== null) {
                return previous;
            }

            return { ...previous, hitPoints: suggestedHitPoints };
        });
    }, [data.hitPoints, onChange, suggestedHitPoints]);

    const hitPoints = data.hitPoints ?? suggestedHitPoints;

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    História do personagem
                </h2>
                <p className="mt-2 text-[var(--color-ink-muted)]">
                    Defina os pontos de vida e registre a origem, os feitos e os
                    segredos do herói.
                </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <label className="border p-4" style={card}>
                    <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                        Pontos de vida *
                    </span>
                    <input
                        type="number"
                        required
                        min={1}
                        value={hitPoints || ""}
                        onChange={(event) => {
                            const value = Number(event.target.value);
                            onChange((previous) => ({
                                ...previous,
                                hitPoints: Number.isNaN(value) ? previous.hitPoints : Math.max(1, value),
                            }));
                        }}
                        className="w-full border bg-[var(--color-parchment)] px-4 py-3 text-2xl text-[var(--color-ink)] outline-none"
                        style={{ ...cinzel, borderColor: "var(--color-border-strong)" }}
                    />
                    <span className="mt-2 block text-xs text-[var(--color-ink-soft)]">
                        {primaryClass
                            ? `Sugestão do 1º nível: ${suggestedHitPoints} (1d${primaryClass.hitDie} + CON)`
                            : "Selecione uma classe para ver a sugestão inicial."}
                    </span>
                </label>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
                <LoreField
                    label="Aparência"
                    required
                    placeholder="Idade, altura, olhos, cabelos, marcas e vestimentas..."
                    value={data.loreDetails.appearance}
                    onChange={(value) =>
                        onChange((previous) => ({
                            ...previous,
                            loreDetails: { ...previous.loreDetails, appearance: value },
                        }))
                    }
                />
                <LoreField
                    label="Traços de personalidade"
                    required
                    placeholder="Como age, fala e reage diante do mundo..."
                    value={data.loreDetails.personalityTraits}
                    onChange={(value) =>
                        onChange((previous) => ({
                            ...previous,
                            loreDetails: { ...previous.loreDetails, personalityTraits: value },
                        }))
                    }
                />
                <LoreField
                    label="Ideais"
                    required
                    placeholder="Princípios, crenças e objetivos..."
                    value={data.loreDetails.ideals}
                    onChange={(value) =>
                        onChange((previous) => ({
                            ...previous,
                            loreDetails: { ...previous.loreDetails, ideals: value },
                        }))
                    }
                />
                <LoreField
                    label="Vínculos"
                    required
                    placeholder="Pessoas, lugares ou juramentos importantes..."
                    value={data.loreDetails.bonds}
                    onChange={(value) =>
                        onChange((previous) => ({
                            ...previous,
                            loreDetails: { ...previous.loreDetails, bonds: value },
                        }))
                    }
                />
                <LoreField
                    label="Fraquezas"
                    required
                    placeholder="Medos, vícios, conflitos e pontos fracos..."
                    value={data.loreDetails.flaws}
                    onChange={(value) =>
                        onChange((previous) => ({
                            ...previous,
                            loreDetails: { ...previous.loreDetails, flaws: value },
                        }))
                    }
                />
            </div>

            <label className="block">
                <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                    Lore *
                </span>
                <textarea
                    required
                    value={data.lore}
                    onChange={(event) =>
                        onChange((previous) => ({
                            ...previous,
                            lore: event.target.value,
                        }))
                    }
                    rows={12}
                    placeholder="Onde nasceu, o que o move, quem perdeu e o que ainda procura..."
                    className="w-full resize-y border bg-[var(--color-parchment)] px-4 py-3 leading-7 text-[var(--color-ink)] outline-none"
                    style={{ borderColor: "var(--color-border-strong)" }}
                />
            </label>

            <label className="mt-8 block">
                <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                    Missões *
                </span>
                <textarea
                    required
                    value={data.quests}
                    onChange={(event) =>
                        onChange((previous) => ({
                            ...previous,
                            quests: event.target.value,
                        }))
                    }
                    rows={8}
                    placeholder="Juramentos em aberto, contratos aceitos, dívidas a cobrar e objetivos da campanha..."
                    className="w-full resize-y border bg-[var(--color-parchment)] px-4 py-3 leading-7 text-[var(--color-ink)] outline-none"
                    style={{ borderColor: "var(--color-border-strong)" }}
                />
                <span className="mt-2 block text-xs text-[var(--color-ink-soft)]">
                    Uma missão por linha deixa a ficha final mais organizada.
                </span>
            </label>
        </div>
    );
}

function LoreField({
    label,
    placeholder,
    value,
    onChange,
    required = false,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                {label}{required ? " *" : ""}
            </span>
            <textarea
                required={required}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={4}
                placeholder={placeholder}
                className="w-full resize-y border bg-[var(--color-parchment)] px-4 py-3 leading-6 text-[var(--color-ink)] outline-none"
                style={{ borderColor: "var(--color-border-strong)" }}
            />
        </label>
    );
}
