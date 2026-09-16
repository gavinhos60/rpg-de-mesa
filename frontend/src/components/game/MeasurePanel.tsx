import { useState } from "react";

export type MeasureShape = "line" | "square" | "circle" | "cone" | "beam";
export type MeasureSnap = "none" | "center" | "corner";
export type MeasureFade = "instant" | "stay";

export type MeasureSettings = {
  shape: MeasureShape;
  snap: MeasureSnap;
  fade: MeasureFade;
  broadcast: boolean;
  color: string;
};

export const MEASURE_COLORS = [
  "#3DDCFF",
  "#E85D4C",
  "#F0C24B",
  "#5CDB7F",
  "#B07CFF",
  "#FF8A3D",
  "#FFFFFF",
] as const;

export const DEFAULT_MEASURE_SETTINGS: MeasureSettings = {
  shape: "line",
  snap: "none",
  fade: "stay",
  broadcast: true,
  color: MEASURE_COLORS[0],
};

const SHAPES: Array<{ id: MeasureShape; label: string }> = [
  { id: "line", label: "Linha" },
  { id: "square", label: "Quadrado" },
  { id: "circle", label: "Círculo" },
  { id: "cone", label: "Cone" },
  { id: "beam", label: "Feixe" },
];

const SNAPS: Array<{ id: MeasureSnap; label: string }> = [
  { id: "none", label: "Sem ajuste" },
  { id: "center", label: "Centro" },
  { id: "corner", label: "Canto" },
];

const PURPLE = "#7B4F8A";
const PANEL_BG = "#141416";
const FIELD_BG = "#1C1C1F";

function ShapeIcon({ shape }: { shape: MeasureShape }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (shape) {
    case "line":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <line x1="3" y1="13" x2="13" y2="3" {...common} />
          <circle cx="3" cy="13" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="13" cy="3" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "square":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <rect x="3.5" y="3.5" width="9" height="9" {...common} />
        </svg>
      );
    case "circle":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="8" r="5" {...common} />
        </svg>
      );
    case "cone":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <path d="M8 13 L3 4 L13 4 Z" {...common} />
        </svg>
      );
    case "beam":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <rect x="2.5" y="6.5" width="11" height="3" rx="0.5" {...common} />
        </svg>
      );
  }
}

function SnapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3 5 V3 H5 M11 3 H13 V5 M13 11 V13 H11 M5 13 H3 V11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}

interface MeasurePanelProps {
  settings: MeasureSettings;
  onChange: (next: MeasureSettings) => void;
  metersPerSquare: number;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function MeasurePanel({
  settings,
  onChange,
  metersPerSquare,
  collapsed = false,
  onToggleCollapsed,
}: MeasurePanelProps) {
  const [shapeOpen, setShapeOpen] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);

  const shapeMeta = SHAPES.find((item) => item.id === settings.shape) ?? SHAPES[0];
  const snapMeta = SNAPS.find((item) => item.id === settings.snap) ?? SNAPS[0];
  const cellLabel = `${Math.round(metersPerSquare * 10) / 10} m`.replace(
    /\.0$/,
    ""
  );

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-white shadow-lg"
        style={{
          backgroundColor: PANEL_BG,
          borderColor: PURPLE,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
        title="Abrir painel Medir"
      >
        <ShapeIcon shape={settings.shape} />
        <span>Medir</span>
      </button>
    );
  }

  return (
    <div
      className="w-[300px] rounded-lg border px-3 py-2.5 text-white shadow-2xl"
      style={{
        backgroundColor: PANEL_BG,
        borderColor: "#2A2A30",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold tracking-wide">Medir</h3>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex h-7 w-7 items-center justify-center rounded text-sm font-bold"
          style={{ backgroundColor: PURPLE }}
          title="Recolher"
        >
          «
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="relative">
          <p className="mb-1 text-[11px] text-white/80">Forma</p>
          <button
            type="button"
            onClick={() => {
              setShapeOpen((open) => !open);
              setSnapOpen(false);
            }}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[13px]"
            style={{ backgroundColor: PURPLE }}
          >
            <ShapeIcon shape={settings.shape} />
            <span className="flex-1">{shapeMeta.label}</span>
            <span className="opacity-80">▾</span>
          </button>
          {shapeOpen ? (
            <div
              className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-md border shadow-xl"
              style={{ backgroundColor: FIELD_BG, borderColor: PURPLE }}
            >
              {SHAPES.map((item) => {
                const active = item.id === settings.shape;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange({ ...settings, shape: item.id });
                      setShapeOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[13px]"
                    style={{
                      backgroundColor: active ? PURPLE : "transparent",
                    }}
                  >
                    <ShapeIcon shape={item.id} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <p className="mb-1 text-[11px] text-white/80">Ajuste na grelha</p>
          <button
            type="button"
            onClick={() => {
              setSnapOpen((open) => !open);
              setShapeOpen(false);
            }}
            className="flex w-full items-center gap-1.5 rounded-md border px-2 py-1.5 text-left text-[13px]"
            style={{
              backgroundColor: FIELD_BG,
              borderColor: PURPLE,
            }}
          >
            <SnapIcon />
            <span className="flex-1 truncate">{snapMeta.label}</span>
            <span className="opacity-80">▾</span>
          </button>
          {snapOpen ? (
            <div
              className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-md border shadow-xl"
              style={{ backgroundColor: FIELD_BG, borderColor: PURPLE }}
            >
              {SNAPS.map((item) => {
                const active = item.id === settings.snap;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange({ ...settings, snap: item.id });
                      setSnapOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[13px]"
                    style={{
                      backgroundColor: active ? PURPLE : "transparent",
                    }}
                  >
                    <SnapIcon />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mb-3 border-t border-white/10 pt-3">
        <p className="mb-2 text-[12px] font-semibold">Cor da marcação</p>
        <div className="flex flex-wrap gap-2">
          {MEASURE_COLORS.map((color) => {
            const active = settings.color === color;
            return (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => onChange({ ...settings, color })}
                className="h-7 w-7 rounded-full border-2"
                style={{
                  backgroundColor: color,
                  borderColor: active ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                  boxShadow: active ? `0 0 0 2px ${PURPLE}` : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mb-3 border-t border-white/10 pt-3">
        <p className="mb-2 text-[12px] font-semibold">Atraso de Desvanecer</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...settings, fade: "instant" })}
            className="rounded-md px-2 py-2 text-[11px] font-semibold tracking-wide"
            style={{
              backgroundColor:
                settings.fade === "instant" ? "#2A2A30" : "transparent",
              border:
                settings.fade === "instant"
                  ? "1px solid #3A3A42"
                  : "1px solid #3A3A42",
              opacity: settings.fade === "instant" ? 1 : 0.75,
            }}
          >
            INSTANTÂNEA
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...settings, fade: "stay" })}
            className="rounded-md px-2 py-2 text-[11px] font-semibold tracking-wide"
            style={{
              backgroundColor:
                settings.fade === "stay" ? "#2A2A30" : "transparent",
              border: "1px solid #3A3A42",
              opacity: settings.fade === "stay" ? 1 : 0.75,
            }}
          >
            PERMANECER
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[13px]">Transmitir para outros</span>
        <button
          type="button"
          role="switch"
          aria-checked={settings.broadcast}
          onClick={() =>
            onChange({ ...settings, broadcast: !settings.broadcast })
          }
          className="relative h-6 w-11 rounded-full transition-colors"
          style={{
            backgroundColor: settings.broadcast ? PURPLE : "#3A3A42",
          }}
        >
          <span
            className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
            style={{
              left: settings.broadcast ? "22px" : "2px",
            }}
          />
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/55">
        <span className="inline-flex items-center gap-1">
          Compatível com D&D 5E/4E
          <span
            className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[9px]"
            style={{ borderColor: "rgba(255,255,255,0.35)" }}
            title="Distância em quadrados no estilo D&D (diagonal = 1)."
          >
            ?
          </span>
        </span>
        <span>1 Cell = {cellLabel}</span>
      </div>
    </div>
  );
}
