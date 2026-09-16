import { useEffect, useState } from "react";
import type { Papyrus } from "../../types/papiros";

interface PapyrusOverlayProps {
  papyrus: Papyrus;
  isMaster?: boolean;
  onClose?: () => void;
  onUnpublish?: () => void;
}

function fitImageSize(
  naturalW: number,
  naturalH: number,
  maxW: number,
  maxH: number
) {
  if (naturalW <= 0 || naturalH <= 0) {
    return { width: Math.min(420, maxW), height: Math.min(560, maxH) };
  }
  const scale = Math.min(1, maxW / naturalW, maxH / naturalH);
  return {
    width: Math.max(160, Math.round(naturalW * scale)),
    height: Math.max(160, Math.round(naturalH * scale)),
  };
}

export function PapyrusOverlay({
  papyrus,
  isMaster,
  onClose,
  onUnpublish,
}: PapyrusOverlayProps) {
  const hasImage = Boolean(papyrus.imageUrl?.trim());
  const hasBody = Boolean(papyrus.body?.trim());
  const [imageBox, setImageBox] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    setImageBox(null);
  }, [papyrus.imageUrl]);

  useEffect(() => {
    if (!hasImage) return;

    function measure() {
      const maxW = Math.min(window.innerWidth * 0.9, 56 * 16);
      const maxH = Math.min(window.innerHeight * 0.82, 48 * 16);
      // Leave room for parchment margins (~12% each side)
      const contentMaxW = maxW * 0.76;
      const contentMaxH = maxH * 0.76;

      const img = new Image();
      img.onload = () => {
        const fitted = fitImageSize(
          img.naturalWidth,
          img.naturalHeight,
          contentMaxW,
          contentMaxH
        );
        setImageBox({
          width: Math.round(fitted.width / 0.76),
          height: Math.round(fitted.height / 0.76),
        });
      };
      img.src = papyrus.imageUrl!;
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [hasImage, papyrus.imageUrl]);

  const sheetStyle = hasImage
    ? {
        width: imageBox?.width ?? "min(28rem, 90vw)",
        height: imageBox?.height ?? "min(70vh, 36rem)",
        maxWidth: "92vw",
        maxHeight: "90vh",
        filter: "drop-shadow(0 22px 48px rgba(0,0,0,0.75))",
      }
    : {
        width: "100%",
        maxWidth: "min(28rem, 92vw)",
        aspectRatio: "3 / 4",
        maxHeight: "min(94vh, 52rem)",
        filter: "drop-shadow(0 22px 48px rgba(0,0,0,0.75))",
      };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.88)" }}
      role="dialog"
      aria-modal
      aria-label={papyrus.title}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        className="relative overflow-hidden"
        style={sheetStyle}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <img
          src="/art/parchment-papyrus.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          style={{ objectFit: "fill" }}
          draggable={false}
        />

        {hasImage ? (
          <div
            className="absolute inset-0 z-[1] overflow-hidden"
            style={{ clipPath: "inset(6% 7% 7% 7%)" }}
          >
            <img
              src={papyrus.imageUrl!}
              alt={papyrus.title}
              className="h-full w-full object-contain"
              style={{ backgroundColor: "rgba(40, 24, 10, 0.35)" }}
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: "inset 0 0 40px rgba(40, 20, 8, 0.35)" }}
            />
          </div>
        ) : null}

        <div
          className="relative z-10 flex h-full min-h-0 flex-col"
          style={{ padding: "12% 13% 11%" }}
        >
          {hasImage && !hasBody ? (
            <header className="pointer-events-none absolute left-0 right-0 top-[9%] z-20 px-[12%] text-center">
              <h2
                className="text-lg leading-tight sm:text-xl"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  color: "#f8edd8",
                  textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                }}
              >
                {papyrus.title}
              </h2>
            </header>
          ) : (
            <header className="mb-3 shrink-0 text-center">
              <p
                className="mb-1 text-[10px] uppercase tracking-[0.28em]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: hasImage ? "#f5e6c8" : "#6b4423",
                  textShadow: hasImage
                    ? "0 1px 3px rgba(0,0,0,0.75)"
                    : undefined,
                }}
              >
                Papiro
              </p>
              <h2
                className="text-xl leading-tight sm:text-2xl"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  color: hasImage ? "#f8edd8" : "#2a1d14",
                  textShadow: hasImage
                    ? "0 1px 4px rgba(0,0,0,0.8)"
                    : "0 1px 0 rgba(255,240,210,0.35)",
                }}
              >
                {papyrus.title}
              </h2>
              {!hasImage ? (
                <div
                  className="mx-auto mt-2 h-px w-2/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #8a5a28 20%, #8a5a28 80%, transparent)",
                  }}
                />
              ) : null}
            </header>
          )}

          {hasBody && !hasImage ? (
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div
                className="whitespace-pre-wrap text-sm leading-relaxed sm:text-[15px]"
                style={{
                  fontFamily: "Georgia, 'EB Garamond', 'Times New Roman', serif",
                  color: "#2a1d14",
                }}
              >
                {papyrus.body}
              </div>
            </div>
          ) : hasBody && hasImage ? (
            <div
              className="mt-auto min-h-0 max-h-[38%] overflow-y-auto rounded px-2 py-2"
              style={{ backgroundColor: "rgba(20, 12, 6, 0.55)" }}
            >
              <div
                className="whitespace-pre-wrap break-words text-sm leading-relaxed"
                style={{
                  fontFamily: "Georgia, 'EB Garamond', 'Times New Roman', serif",
                  color: "#f5e6c8",
                }}
              >
                {papyrus.body}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1" />
          )}

          <footer className="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-2">
            {isMaster && onUnpublish ? (
              <button
                type="button"
                onClick={onUnpublish}
                className="border px-3 py-1.5 text-xs"
                style={{
                  fontFamily: "'Cinzel', serif",
                  borderColor: "#6b4423",
                  backgroundColor: "rgba(235, 210, 160, 0.85)",
                  color: "#5c3a1a",
                }}
              >
                Recolher
              </button>
            ) : null}
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="border px-3 py-1.5 text-xs"
                style={{
                  fontFamily: "'Cinzel', serif",
                  borderColor: "#7a2530",
                  backgroundColor: "#7a2530",
                  color: "#f5e6c8",
                }}
              >
                Fechar
              </button>
            ) : null}
          </footer>
        </div>
      </div>
    </div>
  );
}
