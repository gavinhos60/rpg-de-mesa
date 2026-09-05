interface StatCardProps {
    label: string;
    value: string | number;
    Icon: React.ComponentType<{ className?: string }>;
    description?: string;
}

export function StatCard({
    label,
    value,
    Icon,
    description,
}: StatCardProps) {
    return (
        <div
            className="p-5 border border-[#6B4423]"
            style={{ backgroundColor: "#DCCBA0" }}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-[#5C4A38]">{label}</p>

                    <p
                        className="mt-2 text-3xl text-[#2A1D14]"
                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-[#8A7860]">{description}</p>
                    )}
                </div>

                <Icon className="w-8 h-8 shrink-0 text-[#6B4423]" />
            </div>
        </div>
    );
}