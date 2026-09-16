import { useAuth } from "../contexts/AuthContext";
import { CrowIcon, WaxSealIcon } from "./icons/MedievalIcons";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
    onMenuClick?: () => void;
    /** Show hamburger even on large screens (game room). */
    forceMenuButton?: boolean;
    compact?: boolean;
}

export function Header({
    onMenuClick,
    forceMenuButton = false,
    compact = false,
}: HeaderProps) {
    const { user } = useAuth();

    return (
        <header
            className={`sticky top-0 z-30 flex items-center justify-between gap-3 border-b-2 px-3 sm:px-6 lg:px-8 ${
                compact ? "h-12" : "h-14 sm:h-16"
            }`}
            style={{
                backgroundColor: "var(--color-shell)",
                borderColor: "var(--color-border)",
            }}
        >
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                {onMenuClick ? (
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className={`inline-flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1 border ${
                            forceMenuButton ? "" : "lg:hidden"
                        }`}
                        style={{
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-parchment)",
                        }}
                        aria-label="Abrir menu"
                    >
                        <span
                            className="block h-0.5 w-4"
                            style={{ backgroundColor: "var(--color-ink)" }}
                        />
                        <span
                            className="block h-0.5 w-4"
                            style={{ backgroundColor: "var(--color-ink)" }}
                        />
                        <span
                            className="block h-0.5 w-4"
                            style={{ backgroundColor: "var(--color-ink)" }}
                        />
                    </button>
                ) : null}
                <ThemeToggle className="shrink-0" />
            </div>

            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                <CrowIcon
                    className={`hidden shrink-0 text-[var(--color-crow-soft)] opacity-70 sm:block ${
                        compact ? "h-5 w-5" : "h-6 w-6"
                    }`}
                />
                <div className="min-w-0 text-right">
                    <p
                        className="max-w-[7rem] truncate text-sm text-[var(--color-ink-inverse)] sm:max-w-[14rem]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {user?.name}
                    </p>

                    {!compact ? (
                        <p className="hidden max-w-[14rem] truncate text-xs text-[var(--color-ink-soft)] md:block">
                            {user?.email}
                        </p>
                    ) : null}
                </div>

                <WaxSealIcon
                    className={`shrink-0 ${compact ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10"}`}
                    label={user?.name?.charAt(0).toUpperCase() ?? "?"}
                />
            </div>
        </header>
    );
}
