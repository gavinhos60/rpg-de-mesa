import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const fieldStyle = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border-wood)",
} as const;

type FloatingPopupSize = "list" | "document";

interface FloatingPopupWindowProps {
  title: string;
  subtitle?: string;
  ariaLabel?: string;
  onClose: () => void;
  children: ReactNode;
  zIndex?: number;
  size?: FloatingPopupSize;
  /** Desloca a posição inicial (útil com várias janelas abertas). */
  initialOffset?: { x: number; y: number };
  /** Traz a janela para frente ao interagir com o cabeçalho. */
  onActivate?: () => void;
}

function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  const pad = 8;
  const maxX = Math.max(pad, window.innerWidth - width - pad);
  const maxY = Math.max(pad, window.innerHeight - height - pad);
  return {
    x: Math.min(Math.max(pad, x), maxX),
    y: Math.min(Math.max(pad, y), maxY),
  };
}

function defaultPos(
  size: FloatingPopupSize,
  offset: { x: number; y: number }
): { x: number; y: number } {
  const panelWidth =
    size === "document"
      ? Math.min(768, window.innerWidth - 32)
      : Math.min(672, window.innerWidth - 32);
  return {
    x:
      Math.max(16, (window.innerWidth - panelWidth) / 2) + offset.x,
    y: Math.max(16, window.innerHeight * 0.1) + offset.y,
  };
}

export function FloatingPopupWindow({
  title,
  subtitle,
  ariaLabel,
  onClose,
  children,
  zIndex = 85,
  size = "list",
  initialOffset = { x: 0, y: 0 },
  onActivate,
}: FloatingPopupWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>(() =>
    defaultPos(size, initialOffset)
  );
  const [dragging, setDragging] = useState(false);

  const syncClamp = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos((prev) => clampPosition(prev.x, prev.y, width, height));
  }, []);

  useLayoutEffect(() => {
    syncClamp();
  }, [minimized, syncClamp]);

  useEffect(() => {
    const onResize = () => syncClamp();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncClamp]);

  function onHeaderPointerDown(event: React.PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    onActivate?.();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onHeaderPointerMove(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const el = panelRef.current;
    const width = el?.offsetWidth ?? 320;
    const height = el?.offsetHeight ?? 200;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    setPos(
      clampPosition(drag.origX + dx, drag.origY + dy, width, height)
    );
  }

  function endDrag(event: React.PointerEvent<HTMLElement>) {
    if (!dragRef.current) return;
    if (dragRef.current.pointerId === event.pointerId) {
      dragRef.current = null;
      setDragging(false);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
  }

  function toggleMinimized() {
    setMinimized((value) => !value);
  }

  const chromeBtn =
    "flex h-7 w-7 shrink-0 items-center justify-center border text-sm leading-none text-[var(--color-ink-muted)] hover:border-[var(--color-crimson)] hover:text-[var(--color-crimson)]";
  const chromeBtnStyle = {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-parchment-soft)",
  } as const;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
      aria-hidden={false}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={false}
        aria-label={ariaLabel ?? title}
        className="pointer-events-auto flex flex-col overflow-hidden border-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
        style={{
          ...fieldStyle,
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: minimized
            ? Math.min(320, window.innerWidth - 24)
            : size === "document"
              ? "min(48rem, calc(100vw - 2rem))"
              : "min(42rem, calc(100vw - 2rem))",
          maxHeight: minimized
            ? undefined
            : size === "document"
              ? "min(94vh, 46rem)"
              : "min(90vh, 44rem)",
          minHeight: minimized ? undefined : size === "document" ? "min(50vh, 24rem)" : undefined,
        }}
      >
        <header
          className="flex shrink-0 items-center gap-2 border-b px-3 py-2.5 sm:px-4"
          style={{
            borderColor: "var(--color-border)",
            background:
              "linear-gradient(180deg, var(--color-parchment-soft) 0%, var(--color-surface) 100%)",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
          onPointerDown={onHeaderPointerDown}
          onPointerMove={onHeaderPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={() => setMinimized((value) => !value)}
        >
          <div className="min-w-0 flex-1 select-none">
            {subtitle && !minimized ? (
              <p
                className="truncate text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {subtitle}
              </p>
            ) : null}
            <h2
              className="truncate text-base text-[var(--color-ink)] sm:text-lg"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className={chromeBtn}
              style={chromeBtnStyle}
              aria-label={minimized ? "Restaurar" : "Minimizar"}
              title={minimized ? "Restaurar" : "Minimizar"}
              onClick={toggleMinimized}
            >
              {minimized ? "□" : "−"}
            </button>
            <button
              type="button"
              className={chromeBtn}
              style={chromeBtnStyle}
              aria-label="Fechar"
              title="Fechar"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </header>
        {!minimized ? (
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
