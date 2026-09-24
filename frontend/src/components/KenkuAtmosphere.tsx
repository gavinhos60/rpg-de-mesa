import { useEffect, useRef, useState } from "react";

const HERO_SWAP_MS = 320;

const DEFAULT_ART = "/art/kenku-void-hero.png";

/** Fundos da tela inicial (login / home). */
export const HERO_ART_SLIDES = [
  "/art/kenku-void-hero.png",
  "/art/birijhin.jpg",
  "/art/ursolinda.png",
] as const;

function artSlideLabel(src: string, index: number): string {
  if (src.includes("kenku-void-hero")) return "Corvo";
  if (src.includes("birijhin")) return "Birijhin";
  if (src.includes("ursolinda")) return "Ursolinda";
  return `Fundo ${index + 1}`;
}

/**
 * Fundo full-bleed com arte kenku (void + corvo).
 * Use em login/home — camadas de fundo são pointer-events-none; seletor de arte não.
 */
export function KenkuAtmosphere({
  density = "normal",
  showArt = true,
  artFocus = "center",
  artSlides,
  slideIntervalMs = 9000,
}: {
  density?: "normal" | "light";
  /** Mostra a ilustração full-bleed (void negro + corvo). */
  showArt?: boolean;
  /** Onde o corvo fica no enquadramento (texto do outro lado). */
  artFocus?: "left" | "center" | "right";
  /** Várias imagens: miniaturas no canto inferior trocam o fundo. */
  artSlides?: string[];
  /** Troca automática do fundo (ms). Só com 2+ imagens. */
  slideIntervalMs?: number;
}) {
  const slides =
    artSlides && artSlides.length > 0 ? artSlides : [DEFAULT_ART];
  const [slideIndex, setSlideIndex] = useState(0);
  const showPicker = showArt && slides.length > 1;
  const activeSrc = slides[slideIndex] ?? DEFAULT_ART;
  const [underSrc, setUnderSrc] = useState<string | null>(null);
  const prevActiveRef = useRef(activeSrc);

  useEffect(() => {
    if (prevActiveRef.current === activeSrc) return;
    setUnderSrc(prevActiveRef.current);
    prevActiveRef.current = activeSrc;
    const t = window.setTimeout(() => setUnderSrc(null), HERO_SWAP_MS);
    return () => window.clearTimeout(t);
  }, [activeSrc]);

  useEffect(() => {
    for (const src of slides) {
      const img = new Image();
      img.src = src;
    }
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1 || slideIntervalMs <= 0) return;

    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, slideIntervalMs);

    return () => window.clearInterval(id);
  }, [slides.length, slideIntervalMs]);

  const position =
    artFocus === "left"
      ? "28% 42%"
      : artFocus === "right"
        ? "72% 42%"
        : "center 40%";

  const veil =
    density === "light" ? "rgba(0, 0, 0, 0.55)" : null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        {showArt ? (
          <>
            <div className="absolute inset-0">
              {underSrc ? (
                <img
                  src={underSrc}
                  alt=""
                  decoding="sync"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: position }}
                />
              ) : null}
              <img
                key={activeSrc}
                src={activeSrc}
                alt=""
                decoding="sync"
                fetchPriority="high"
                className="kenku-hero-fade-in absolute inset-0 z-[1] h-full w-full object-cover"
                style={{ objectPosition: position }}
              />
            </div>
            {veil ? (
              <div className="absolute inset-0" style={{ background: veil }} />
            ) : null}
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

      {showPicker ? (
        <div
          className="absolute bottom-4 left-4 z-20 flex gap-2 sm:bottom-5 sm:left-5"
          role="group"
          aria-label="Escolher imagem de fundo"
        >
          {slides.map((src, i) => {
            const active = i === slideIndex;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setSlideIndex(i)}
                aria-label={artSlideLabel(src, i)}
                aria-pressed={active}
                title={artSlideLabel(src, i)}
                className="h-11 w-11 shrink-0 overflow-hidden border-2 shadow-[0_4px_16px_rgba(0,0,0,0.45)] transition-[opacity,transform,border-color] hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-crimson)] sm:h-12 sm:w-12"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderColor: active
                    ? "var(--color-crimson)"
                    : "color-mix(in srgb, var(--color-border-wood) 70%, transparent)",
                  opacity: active ? 1 : 0.72,
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
