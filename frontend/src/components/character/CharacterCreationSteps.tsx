import { romanStep } from "../icons/MedievalIcons";

interface CharacterCreationStepsProps {
    currentStep: number;
    onChangeStep: (step: number) => void;
    canEnterStep?: (step: number) => boolean;
}

const steps = [
    "Identidade",
    "Atributos",
    "Perícias",
    "Combate",
    "Equipamentos",
    "Magias",
    "Lore",
    "Ficha",
];

export function CharacterCreationSteps({
    currentStep,
    onChangeStep,
    canEnterStep,
}: CharacterCreationStepsProps) {
    return (
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="flex min-w-max items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const active = stepNumber === currentStep;
                    const completed = stepNumber < currentStep;
                    const locked =
                        stepNumber !== currentStep &&
                        !(canEnterStep?.(stepNumber) ?? true);

                    return (
                        <div key={`${step}-${stepNumber}`} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => onChangeStep(stepNumber)}
                                disabled={locked}
                                title={step}
                                className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <div
                                    className="flex h-8 w-8 items-center justify-center border text-xs transition-colors sm:h-9 sm:w-9 sm:text-sm"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        backgroundColor: active
                                            ? "var(--color-crimson)"
                                            : "transparent",
                                        borderColor: active
                                            ? "var(--color-crimson-deep)"
                                            : completed
                                              ? "var(--color-border)"
                                              : "var(--color-border-strong)",
                                        color: active
                                            ? "var(--color-ink-inverse)"
                                            : completed
                                              ? "var(--color-border-strong)"
                                              : "var(--color-ink-soft)",
                                    }}
                                >
                                    {romanStep(stepNumber)}
                                </div>

                                <span
                                    className="hidden text-sm md:inline"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        color: active
                                            ? "var(--color-ink)"
                                            : "var(--color-ink-soft)",
                                    }}
                                >
                                    {step}
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <div
                                    className="mx-2 h-px w-4 sm:mx-4 sm:w-8"
                                    style={{ backgroundColor: "var(--color-border)" }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <p
                className="mt-2 text-sm text-[var(--color-ink-muted)] md:hidden"
                style={{ fontFamily: "'Cinzel', serif" }}
            >
                {steps[currentStep - 1]}
            </p>
        </div>
    );
}
