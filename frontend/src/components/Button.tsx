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
                className={`relative text-[#EBDFC4] px-5 py-2.5 text-sm hover:bg-[#5C1D26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7A2530] ${className}`}
                style={{
                    backgroundColor: "#7A2530",
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
                className={`border px-5 py-2.5 text-sm text-[#7A2530] hover:bg-[#7A2530] hover:text-[#EBDFC4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                style={{ borderColor: "#7A2530", fontFamily: "'Cinzel', serif" }}
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
                className={`border px-5 py-2.5 text-sm text-[#2A1D14] hover:border-[#7A2530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                style={{ borderColor: "#6B4423", backgroundColor: "#EBDFC4", fontFamily: "'Cinzel', serif" }}
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
            className={`text-sm text-[#5C4A38] hover:text-[#2A1D14] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            style={{ fontFamily: "'Cinzel', serif" }}
        >
            {children}
        </button>
    );
}