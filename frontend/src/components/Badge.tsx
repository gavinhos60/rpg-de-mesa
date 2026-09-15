import type { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

export function Badge({
    children,
    variant = "neutral",
}: BadgeProps) {
    const variants = {
        success: "border-[#4A6B3D] text-[#4A6B3D]",
        warning: "border-[#9C7A3C] text-[#9C7A3C]",
        danger: "border-[var(--color-crimson)] text-[var(--color-crimson)]",
        info: "border-transparent text-[var(--color-ink-inverse)]",
        neutral: "border-[var(--color-border-strong)] text-[var(--color-ink-muted)]",
    };

    const infoBg = variant === "info" ? { backgroundColor: "var(--color-crimson)" } : undefined;

    return (
        <span
            className={`inline-flex items-center px-3 py-1 border text-xs ${variants[variant]}`}
            style={{ fontFamily: "'Cinzel', serif", ...infoBg }}
        >
            {children}
        </span>
    );
}