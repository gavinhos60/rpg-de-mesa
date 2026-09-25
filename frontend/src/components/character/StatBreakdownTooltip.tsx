import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
    formatBreakdownLine,
    type StatBreakdownLine,
} from "../../utils/statBreakdown";

interface StatBreakdownTooltipProps {
    lines: StatBreakdownLine[];
    children: ReactNode;
    className?: string;
}

type TooltipPlacement = "above" | "below";

function computeTooltipPosition(anchor: HTMLElement): {
    x: number;
    y: number;
    placement: TooltipPlacement;
} {
    const rect = anchor.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement: TooltipPlacement =
        spaceAbove >= 96 || spaceAbove >= spaceBelow ? "above" : "below";
    const y = placement === "above" ? rect.top - 8 : rect.bottom + 8;
    return { x, y, placement };
}

export function StatBreakdownTooltip({
    lines,
    children,
    className = "",
}: StatBreakdownTooltipProps) {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState<{
        x: number;
        y: number;
        placement: TooltipPlacement;
    } | null>(null);

    const refreshPosition = useCallback(() => {
        const anchor = anchorRef.current;
        if (!anchor) return;
        setCoords(computeTooltipPosition(anchor));
    }, []);

    const show = useCallback(() => {
        if (lines.length === 0) return;
        refreshPosition();
        setOpen(true);
    }, [lines.length, refreshPosition]);

    const hide = useCallback(() => {
        setOpen(false);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onScrollOrResize = () => {
            refreshPosition();
        };

        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [open, refreshPosition]);

    if (lines.length === 0) {
        return <>{children}</>;
    }

    const tooltip =
        open && coords
            ? createPortal(
                  <div
                      role="tooltip"
                      className="pointer-events-none w-max max-w-[min(18rem,90vw)] rounded border px-2.5 py-2 text-left shadow-lg"
                      style={{
                          position: "fixed",
                          left: coords.x,
                          top: coords.y,
                          transform:
                              coords.placement === "above"
                                  ? "translate(-50%, -100%)"
                                  : "translate(-50%, 0)",
                          zIndex: 10000,
                          borderColor: "var(--color-border-strong)",
                          backgroundColor: "var(--color-tooltip-bg)",
                          color: "var(--color-tooltip-ink)",
                          boxShadow:
                              "0 0 0 1px var(--color-border-subtle), 0 10px 28px rgba(0, 0, 0, 0.45)",
                      }}
                  >
                      <p
                          className="mb-1.5 text-[10px] uppercase tracking-wide"
                          style={{
                              fontFamily: "'Cinzel', serif",
                              color: "var(--color-tooltip-label)",
                          }}
                      >
                          Composição
                      </p>
                      <ul className="space-y-0.5 text-[11px] leading-snug">
                          {lines.map((line, index) => (
                              <li key={`${line.kind}-${index}`}>
                                  {formatBreakdownLine(line)}
                              </li>
                          ))}
                      </ul>
                  </div>,
                  document.body
              )
            : null;

    return (
        <>
            <div
                ref={anchorRef}
                className={className}
                onMouseEnter={show}
                onMouseLeave={hide}
                onFocus={show}
                onBlur={hide}
            >
                {children}
            </div>
            {tooltip}
        </>
    );
}
