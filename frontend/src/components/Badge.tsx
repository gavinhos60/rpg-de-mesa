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
    success: "bg-emerald-950/60 text-emerald-400 border-emerald-900",
    warning: "bg-amber-950/60 text-amber-400 border-amber-900",
    danger: "bg-red-950/60 text-red-400 border-red-900",
    info: "bg-indigo-950/60 text-indigo-400 border-indigo-900",
    neutral: "bg-slate-800 text-slate-400 border-slate-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-1
        rounded-full
        border
        text-xs
        font-medium
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}