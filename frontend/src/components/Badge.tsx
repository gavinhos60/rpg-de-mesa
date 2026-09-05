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
        danger: "border-[#7A2530] text-[#7A2530]",
        info: "border-transparent text-[#EBDFC4]",
        neutral: "border-[#6B4423] text-[#5C4A38]",
    };

    const infoBg = variant === "info" ? { backgroundColor: "#7A2530" } : undefined;

    return (
        <span
            className={`inline-flex items-center px-3 py-1 border text-xs ${variants[variant]}`}
            style={{ fontFamily: "'Cinzel', serif", ...infoBg }}
        >
            {children}
        </span>
    );
}