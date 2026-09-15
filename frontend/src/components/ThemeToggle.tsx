import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs transition-colors ${className}`}
      style={{
        fontFamily: "'Cinzel', serif",
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-parchment)",
        color: "var(--color-ink)",
      }}
    >
      <span
        aria-hidden
        className="inline-block h-3.5 w-3.5 rounded-full border"
        style={{
          borderColor: "var(--color-ink)",
          background: isDark
            ? "radial-gradient(circle at 30% 30%, var(--color-parchment) 40%, var(--color-ink) 42%)"
            : "radial-gradient(circle at 70% 30%, transparent 45%, var(--color-ink) 46%)",
        }}
      />
      <span>{isDark ? "Claro" : "Escuro"}</span>
    </button>
  );
}
