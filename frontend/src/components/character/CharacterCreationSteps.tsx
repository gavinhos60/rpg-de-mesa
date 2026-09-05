interface CharacterCreationStepsProps {
    currentStep: number;
    onChangeStep: (step: number) => void;
}

const steps = [
    "Identidade",
    "Atributos",
    "Perícias",
    "Combate",
    "Equipamentos",
    "Magias",
    "Lore",
];

export function CharacterCreationSteps({
    currentStep,
    onChangeStep,
}: CharacterCreationStepsProps) {
    return (
        <div className="mb-8 overflow-x-auto">
            <div className="flex min-w-max items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const active =
                        stepNumber === currentStep;

                    const completed =
                        stepNumber < currentStep;

                    return (
                        <div
                            key={step}
                            className="flex items-center"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    onChangeStep(stepNumber)
                                }
                                className="flex items-center gap-2"
                            >
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                                        active
                                            ? "bg-indigo-600 text-white"
                                            : completed
                                              ? "bg-indigo-600/30 text-indigo-300"
                                              : "bg-slate-800 text-slate-500"
                                    }`}
                                >
                                    {stepNumber}
                                </div>

                                <span
                                    className={`text-sm ${
                                        active
                                            ? "text-white"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {step}
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <div className="mx-4 h-px w-8 bg-slate-800" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}