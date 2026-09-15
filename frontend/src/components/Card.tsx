import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({
    children,
    className = "",
    hover = false,
}: CardProps) {
    return (
        <div
            className={`
                border border-[var(--color-border-strong)] 
                ${hover ? "transition-colors hover:border-[var(--color-border)]" : ""}
                ${className}
            `}
            style={{ backgroundColor: "var(--color-surface)" }}
        >
            {children}
        </div>
    );
}