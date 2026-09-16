interface ActionLoadingOverlayProps {
  label?: string;
}

/** Overlay leve para ações remotas lentas (ficha, rolagem, etc.). */
export function ActionLoadingOverlay({
  label = "Carregando…",
}: ActionLoadingOverlayProps) {
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(5, 5, 8, 0.45)" }}
      role="status"
      aria-live="polite"
      aria-busy
    >
      <div
        className="flex items-center gap-3 border-2 px-5 py-3 shadow-2xl"
        style={{
          borderColor: "var(--color-border-wood)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--color-crimson)", borderTopColor: "transparent" }}
          aria-hidden
        />
        <p
          className="text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
