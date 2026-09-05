import { romanStep } from "../icons/MedievalIcons";

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
        <div className="overflow-x-auto">
            <div className="flex min-w-max items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const active = stepNumber === currentStep;
                    const completed = stepNumber < currentStep;

                    return (
                        <div key={step} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => onChangeStep(stepNumber)}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className="flex h-9 w-9 items-center justify-center border text-sm transition-colors"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        backgroundColor: active ? "#7A2530" : "transparent",
                                        borderColor: active
                                            ? "#5C1D26"
                                            : completed
                                              ? "#A67C3D"
                                              : "#6B4423",
                                        color: active
                                            ? "#EBDFC4"
                                            : completed
                                              ? "#6B4423"
                                              : "#8A7860",
                                    }}
                                >
                                    {romanStep(stepNumber)}
                                </div>

                                <span
                                    className="text-sm"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        color: active ? "#2A1D14" : "#8A7860",
                                    }}
                                >
                                    {step}
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <div
                                    className="mx-4 h-px w-8"
                                    style={{ backgroundColor: "#A67C3D" }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}