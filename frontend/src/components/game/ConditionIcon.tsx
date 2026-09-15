import type { CSSProperties, ReactNode } from "react";
import type { ConditionId } from "../../data/dnd/conditions";

interface ConditionIconProps {
  id: ConditionId;
  className?: string;
  style?: CSSProperties;
  title?: string;
  color?: string;
}

/** Ícone SVG distinto por condição D&D 5e. */
export function ConditionIcon({
  id,
  className = "h-4 w-4",
  style,
  title,
  color = "currentColor",
}: ConditionIconProps) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    style,
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": title ? undefined : true,
    role: title ? ("img" as const) : undefined,
  };

  const paths: Record<ConditionId, ReactNode> = {
    blinded: (
      <>
        <circle cx="12" cy="12" r="7" />
        <path d="M5 5 L19 19" />
        <circle cx="12" cy="12" r="2.2" />
      </>
    ),
    charmed: (
      <>
        <path d="M12 20 C8 16 4 12.5 4 9 A4 4 0 0 1 12 8 A4 4 0 0 1 20 9 C20 12.5 16 16 12 20 Z" />
      </>
    ),
    deafened: (
      <>
        <path d="M8 10 C8 7 10 5 12.5 5 C15 5 17 7 17 10 V12" />
        <path d="M17 14 V15 C17 17 15.5 18.5 13.5 18.5" />
        <path d="M5 9 L7 11 M5 15 L7 13" />
        <circle cx="13.5" cy="18.5" r="1.2" fill={color} stroke="none" />
      </>
    ),
    frightened: (
      <>
        <path d="M8 10 C8 7 10 5 12 5 C14 5 16 7 16 10 C16 14 12 15 12 18" />
        <circle cx="12" cy="21" r="1.2" fill={color} stroke="none" />
        <path d="M9.5 10.5 H9.6 M14.5 10.5 H14.6" />
      </>
    ),
    grappled: (
      <>
        <path d="M7 10 H11 V14 H7 Z" />
        <path d="M13 10 H17 V14 H13 Z" />
        <path d="M11 12 H13" />
        <path d="M8 8 V10 M16 8 V10 M8 14 V16 M16 14 V16" />
      </>
    ),
    incapacitated: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M8 12 H16" />
      </>
    ),
    invisible: (
      <>
        <path d="M4 12 C7 7 10 5 12 5 C14 5 17 7 20 12 C17 17 14 19 12 19 C10 19 7 17 4 12 Z" opacity="0.35" />
        <circle cx="12" cy="12" r="2.5" opacity="0.5" />
        <path d="M6 18 L18 6" strokeDasharray="2 2" />
      </>
    ),
    paralyzed: (
      <>
        <rect x="7" y="4" width="10" height="16" rx="2" />
        <path d="M10 9 H14 M10 12 H14 M10 15 H14" />
      </>
    ),
    petrified: (
      <>
        <path d="M7 19 L9 6 H15 L17 19 Z" />
        <path d="M9 11 H15 M9 14 H15" />
        <path d="M6 19 H18" />
      </>
    ),
    poisoned: (
      <>
        <path d="M12 3 C12 3 7 9 7 13 A5 5 0 0 0 17 13 C17 9 12 3 12 3 Z" />
        <path d="M10 14 C11 16 13 16 14 14" />
      </>
    ),
    prone: (
      <>
        <circle cx="8" cy="8" r="2" />
        <path d="M10 9 L14 12 L20 11" />
        <path d="M14 12 L12 18 M14 12 L17 18" />
        <path d="M4 20 H20" />
      </>
    ),
    restrained: (
      <>
        <circle cx="12" cy="12" r="7" />
        <path d="M8 8 L16 16 M16 8 L8 16" />
        <path d="M12 5 V7 M12 17 V19 M5 12 H7 M17 12 H19" />
      </>
    ),
    stunned: (
      <>
        <circle cx="12" cy="13" r="6" />
        <path d="M12 3 L13 6 L16 5 L14 8 L17 9 L13.5 10" />
        <path d="M10 12 H10.2 M14 12 H14.2" />
        <path d="M10 16 Q12 14.5 14 16" />
      </>
    ),
    unconscious: (
      <>
        <circle cx="9" cy="10" r="3" />
        <path d="M12 11 L18 14 L16 18 L11 15" />
        <path d="M6 18 H20" />
        <path d="M15 7 H19 M16 5 H20" opacity="0.7" />
      </>
    ),
    exhaustion: (
      <>
        <path d="M6 18 H18" />
        <path d="M8 18 V10 L12 6 L16 10 V18" />
        <path d="M10 13 H14" />
        <path d="M12 4 V6" />
      </>
    ),
  };

  return (
    <svg {...common}>
      {title ? <title>{title}</title> : null}
      {paths[id]}
    </svg>
  );
}
