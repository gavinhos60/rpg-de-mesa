import type { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "ghost";
    disabled?: boolean;
    className?: string;
}

export function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    className = "",
}: ButtonProps) {
    if (variant === "primary") {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`relative cursor-pointer text-[var(--color-ink-inverse)] px-5 py-2.5 text-sm hover:bg-[var(--color-crimson-deep)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-crimson)] ${className}`}
                style={{
                    backgroundColor: "var(--color-crimson)",
                    fontFamily: "'Cinzel', serif",
                    clipPath:
                        "polygon(0% 0%, 100% 0%, 100% 70%, 92% 100%, 85% 70%, 15% 70%, 8% 100%, 0% 70%)",
                }}
            >
                {children}
            </button>
        );
    }

    if (variant === "danger") {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`border px-5 cursor-pointer py-2.5 text-sm text-[var(--color-crimson)] hover:bg-[var(--color-crimson)] hover:text-[var(--color-ink-inverse)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                style={{ borderColor: "var(--color-crimson)", fontFamily: "'Cinzel', serif" }}
            >
                {children}
            </button>
        );
    }

    if (variant === "secondary") {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`border px-5 py-2.5 cursor-pointer text-sm text-[var(--color-ink)] hover:border-[var(--color-crimson)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                style={{ borderColor: "var(--color-border-strong)", backgroundColor: "var(--color-parchment)", fontFamily: "'Cinzel', serif" }}
            >
                {children}
            </button>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`text-sm text-[var(--color-ink-muted)] cursor-pointer hover:text-[var(--color-ink)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            style={{ fontFamily: "'Cinzel', serif" }}
        >
            {children}
        </button>
    );
}