import type { ReactNode } from "react";
import {
    formatBreakdownLine,
    type StatBreakdownLine,
} from "../../utils/statBreakdown";

interface StatBreakdownTooltipProps {
    lines: StatBreakdownLine[];
    children: ReactNode;
    className?: string;
}

export function StatBreakdownTooltip({
    lines,
    children,
    className = "",
}: StatBreakdownTooltipProps) {
    if (lines.length === 0) {
        return <>{children}</>;
    }

    return (
        <div className={`group relative ${className}`}>
            {children}
            <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-[120] mb-2 w-max max-w-[min(18rem,90vw)] -translate-x-1/2 rounded border px-2.5 py-2 text-left opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                style={{
                    borderColor: "var(--color-border-strong)",
                    backgroundColor: "var(--color-surface)",
                }}
            >
                <p
                    className="mb-1.5 text-[10px] uppercase tracking-wide text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    Composição
                </p>
                <ul className="space-y-0.5 text-[11px] leading-snug text-[var(--color-ink)]">
                    {lines.map((line, index) => (
                        <li key={`${line.kind}-${index}`}>
                            {formatBreakdownLine(line)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
