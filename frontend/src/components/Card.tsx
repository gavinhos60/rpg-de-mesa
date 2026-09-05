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
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        shadow-sm
        ${hover ? "transition hover:border-slate-700 hover:bg-slate-800/80" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}