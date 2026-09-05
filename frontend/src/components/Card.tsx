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
                border border-[#6B4423]
                ${hover ? "transition-colors hover:border-[#A67C3D]" : ""}
                ${className}
            `}
            style={{ backgroundColor: "#DCCBA0" }}
        >
            {children}
        </div>
    );
}