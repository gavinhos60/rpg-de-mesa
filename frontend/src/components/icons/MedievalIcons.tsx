export function EmblemIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
            <path
                d="M24 4 L40 10 V22 C40 32 33 40 24 44 C15 40 8 32 8 22 V10 Z"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path d="M24 12 V36 M15 20 H33" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export function WaxSealIcon({
    className,
    label,
    color = "#7A2530",
}: {
    className?: string;
    label: string | number;
    color?: string;
}) {
    return (
        <div className={className}>
            <svg viewBox="0 0 44 44" className="w-full h-full">
                <circle cx="22" cy="22" r="20" fill={color} stroke="#5C1D26" strokeWidth="1.5" />
                <circle cx="22" cy="22" r="15" fill="none" stroke="#C9A461" strokeWidth="1" opacity="0.6" />
                <text
                    x="22"
                    y="28"
                    textAnchor="middle"
                    fontFamily="Cinzel, serif"
                    fontSize="14"
                    fill="#EBDFC4"
                >
                    {label}
                </text>
            </svg>
        </div>
    );
}

export function BrokenSealIcon({ className, color = "#6B4423" }: { className?: string; color?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
            <path d="M32 6 L32 58" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="22" cy="30" r="16" fill="none" stroke={color} strokeWidth="1.5" />
            <circle cx="45" cy="30" r="13" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
            <path d="M12 30 L32 30" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

export function QuillIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
            <path
                d="M20 4 C13 6 6 12 4 20 M20 4 C18 9 15 13 11 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function ScrollIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 48" className={className} fill="none">
            <rect x="10" y="6" width="44" height="36" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="6" r="4" opacity="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="42" r="4" opacity="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="54" cy="6" r="4" opacity="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="54" cy="42" r="4" opacity="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
            <path d="M18 16 H46 M18 24 H46 M18 32 H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function KeyIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M22 22 L40 40 M32 32 L38 26 M36 36 L42 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function RibbonButton({
    className = "",
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`relative text-[#EBDFC4] px-6 py-2.5 cursor-pointer  hover:bg-[#5C1D26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#7A2530] ${className}`}
            style={{
                backgroundColor: "#7A2530",
                fontFamily: "'Cinzel', serif",
                clipPath:
                    "polygon(0% 0%, 100% 0%, 100% 70%, 92% 100%, 85% 70%, 15% 70%, 8% 100%, 0% 70%)",
            }}
        >
            <span className="relative -top-1.5">
                {children}
            </span>
        </button>
    );
}
export function CastleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
            <path
                d="M8 44 V22 H14 V16 H18 V22 H22 V12 H26 V22 H30 V16 H34 V22 H40 V44 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path d="M24 44 V30 H20 V44 M24 30 H28 V44" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export function DoorIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 44" className={className} fill="none">
            <path d="M10 40 V6 L28 4 V40" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M10 40 H30" stroke="currentColor" strokeWidth="2" />
            <circle cx="22" cy="22" r="1.6" fill="currentColor" />
            <path d="M32 16 L37 20 L32 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function CompassIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
            <path
                d="M31 17 L26 26 L17 31 L22 22 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <circle cx="24" cy="24" r="1.6" fill="currentColor" />
        </svg>
    );
}

export function CrownIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 32" className={className} fill="none">
            <path
                d="M4 28 L7 10 L16 18 L24 6 L32 18 L41 10 L44 28 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path d="M4 28 H44" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function GroupIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 40" className={className} fill="none">
            <circle cx="18" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M6 36 C6 26 11 21 18 21 C25 21 30 26 30 36" stroke="currentColor" strokeWidth="2" />
            <circle cx="34" cy="15" r="5.5" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <path d="M27 36 C27 28.5 30.5 24.5 34 24.5 C39.5 24.5 43 29 43 36" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        </svg>
    );
}

export function PortraitIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
            <path
                d="M24 6 C15 6 12 14 12 20 C12 24 13 27 15 29 L10 42 H38 L33 29 C35 27 36 24 36 20 C36 14 33 6 24 6 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path d="M17 20 C17 17 19 15 24 15 C29 15 31 17 31 20" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}
const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function romanStep(step: number): string {
    return ROMAN_NUMERALS[step - 1] ?? String(step);
}

export function ShieldIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 44" className={className} fill="none">
            <path
                d="M20 4 L34 10 V21 C34 30 28 37 20 40 C12 37 6 30 6 21 V10 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BoltIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 44" className={className} fill="none">
            <path
                d="M18 2 L6 26 H15 L12 42 L28 16 H18 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BootIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 44 36" className={className} fill="none">
            <path
                d="M12 4 V18 L4 26 C3 30 5 32 9 32 H38 C40 28 38 25 33 24 L24 21 V4 Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path d="M12 12 H24" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export function HeartVineIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 36" className={className} fill="none">
            <path
                d="M20 32 C6 22 3 13 9 8 C13 5 18 6 20 12 C22 6 27 5 31 8 C37 13 34 22 20 32 Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}