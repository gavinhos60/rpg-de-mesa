/**
 * Fundo full-bleed com arte kenku (void + corvo).
 * Use em login/home — pointer-events-none.
 */
export function KenkuAtmosphere({
  density = "normal",
  showArt = true,
  artFocus = "center",
}: {
  density?: "normal" | "light";
  /** Mostra a ilustração full-bleed (void negro + corvo). */
  showArt?: boolean;
  /** Onde o corvo fica no enquadramento (texto do outro lado). */
  artFocus?: "left" | "center" | "right";
}) {
  const position =
    artFocus === "left"
      ? "28% 42%"
      : artFocus === "right"
        ? "72% 42%"
        : "center 40%";

  const veil =
    density === "light"
      ? "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)"
      : artFocus === "left"
        ? "linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.82) 100%)"
        : artFocus === "right"
          ? "linear-gradient(270deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.82) 100%)"
          : "linear-gradient(105deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.78) 100%)";

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {showArt ? (
        <>
          <div
            className="absolute inset-0 kenku-art-breathe"
            style={{
              backgroundImage: "url(/art/kenku-void-hero.png)",
              backgroundSize: "cover",
              backgroundPosition: position,
              backgroundRepeat: "no-repeat",
              filter: "saturate(0.9) contrast(1.08)",
            }}
          />
          <div className="absolute inset-0" style={{ background: veil }} />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 55% 45% at 70% 30%, transparent 0%, rgba(0,0,0,0.55) 75%),
                radial-gradient(ellipse 100% 70% at 50% 100%, rgba(0,0,0,0.85), transparent 50%)
              `,
            }}
          />
          <div className="kenku-embers absolute inset-0" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 10% 0%, color-mix(in srgb, var(--color-crow) 18%, transparent), transparent 55%),
              radial-gradient(ellipse 60% 40% at 90% 100%, color-mix(in srgb, var(--color-crow) 12%, transparent), transparent 50%)
            `,
          }}
        />
      )}
    </div>
  );
}
