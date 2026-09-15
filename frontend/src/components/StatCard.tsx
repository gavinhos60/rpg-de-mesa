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
            className="p-5 border border-[var(--color-border-strong)]"
            style={{ backgroundColor: "var(--color-surface)" }}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-[var(--color-ink-muted)]">{label}</p>

                    <p
                        className="mt-2 text-3xl text-[var(--color-ink)]"
                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{description}</p>
                    )}
                </div>

                <Icon className="w-8 h-8 shrink-0 text-[var(--color-border-strong)]" />
            </div>
        </div>
    );
}