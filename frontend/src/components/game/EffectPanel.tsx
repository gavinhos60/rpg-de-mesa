import {
  FX_ELEMENTS,
  FX_KINDS,
  type EffectSettings,
  type FxPingElement,
  type FxPingKind,
} from "./effectPing";

const PURPLE = "#7B4F8A";
const PANEL_BG = "#141416";
const FIELD_BG = "#1C1C1F";

interface EffectPanelProps {
  settings: EffectSettings;
  onChange: (next: EffectSettings) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

function KindIcon({ kind }: { kind: FxPingKind }) {
  const c = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "breathe":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="8" r="2" {...c} />
          <circle cx="8" cy="8" r="4.5" {...c} opacity="0.7" />
          <circle cx="8" cy="8" r="6.5" {...c} opacity="0.4" />
        </svg>
      );
    case "beam":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <line x1="2" y1="12" x2="14" y2="4" {...c} strokeWidth="2.2" />
        </svg>
      );
    case "rocket":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <path d="M4 12 L10 3 L12 5 L6 13 Z" {...c} />
          <circle cx="11.5" cy="3.5" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "burn":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <path d="M8 13 C5 13 4 10.5 5 8 C6 9 7 8.5 7 7 C7 5 8 3 9.5 3 C9 5 11 6 11 8.5 C12 10.5 11 13 8 13 Z" {...c} />
        </svg>
      );
    case "glow":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="8" r="2.5" fill="currentColor" stroke="none" />
          <path d="M8 1.5 V3.5 M8 12.5 V14.5 M1.5 8 H3.5 M12.5 8 H14.5 M3.2 3.2 L4.5 4.5 M11.5 11.5 L12.8 12.8 M12.8 3.2 L11.5 4.5 M4.5 11.5 L3.2 12.8" {...c} />
        </svg>
      );
  }
}

export function EffectPanel({
  settings,
  onChange,
  collapsed = false,
  onToggleCollapsed,
}: EffectPanelProps) {
  const activeColor =
    FX_ELEMENTS.find((item) => item.id === settings.element)?.color ?? "#B388FF";

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-white shadow-lg"
        style={{
          borderColor: PURPLE,
          backgroundColor: PANEL_BG,
          fontFamily: "'Cinzel', serif",
        }}
        title="Expandir efeitos"
      >
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ backgroundColor: activeColor }}
        />
        Efeitos
      </button>
    );
  }

  return (
    <div
      className="w-[300px] rounded-lg border px-3 py-2.5 text-white shadow-2xl"
      style={{
        borderColor: PURPLE,
        backgroundColor: PANEL_BG,
        fontFamily: "'Cinzel', serif",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs tracking-wide text-white/80">Efeitos</p>
        {onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="text-[10px] text-white/50 hover:text-white"
          >
            Recolher
          </button>
        ) : null}
      </div>

      <p className="mb-1.5 text-[10px] uppercase tracking-wide text-white/45">
        Tipo
      </p>
      <div className="mb-3 grid grid-cols-5 gap-1">
        {FX_KINDS.map((kind) => {
          const active = settings.kind === kind.id;
          return (
            <button
              key={kind.id}
              type="button"
              title={kind.label}
              onClick={() => onChange({ ...settings, kind: kind.id })}
              className="flex flex-col items-center gap-0.5 rounded-md border px-1 py-1.5 text-[9px]"
              style={{
                borderColor: active ? PURPLE : "transparent",
                backgroundColor: active ? FIELD_BG : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
              }}
            >
              <KindIcon kind={kind.id} />
              <span className="truncate">{kind.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-1.5 text-[10px] uppercase tracking-wide text-white/45">
        Elemento
      </p>
      <div className="mb-3 grid grid-cols-4 gap-1">
        {FX_ELEMENTS.map((element) => {
          const active = settings.element === element.id;
          return (
            <button
              key={element.id}
              type="button"
              title={element.label}
              onClick={() =>
                onChange({ ...settings, element: element.id as FxPingElement })
              }
              className="flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-left text-[10px]"
              style={{
                borderColor: active ? element.color : "rgba(255,255,255,0.12)",
                backgroundColor: active ? FIELD_BG : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
              }}
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: element.color }}
              />
              <span className="truncate">{element.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-1.5 text-[10px] uppercase tracking-wide text-white/45">
        Duração
      </p>
      <div className="mb-2 grid grid-cols-2 gap-1">
        {(
          [
            ["instant", "Instantânea"],
            ["stay", "Permanecer"],
          ] as const
        ).map(([id, label]) => {
          const active = settings.fade === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ ...settings, fade: id })}
              className="rounded-md px-2 py-2 text-[11px] font-semibold tracking-wide"
              style={{
                backgroundColor: active ? PURPLE : FIELD_BG,
                color: active ? "#fff" : "rgba(255,255,255,0.65)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-[11px] text-white/70">
        <input
          type="checkbox"
          checked={settings.broadcast}
          onChange={(event) =>
            onChange({ ...settings, broadcast: event.target.checked })
          }
          className="accent-[#7B4F8A]"
        />
        Transmitir para outros
      </label>

      <p className="mt-2 text-[10px] leading-snug text-white/40">
        {fxKindNeedsDragHint(settings.kind)}
        {" · "}
        Shift = forçar permanecer
      </p>
    </div>
  );
}

function fxKindNeedsDragHint(kind: FxPingKind): string {
  if (kind === "beam" || kind === "rocket") {
    return "Arraste do início ao fim";
  }
  if (kind === "breathe") {
    return "Clique e arraste para definir o alcance";
  }
  return "Clique no mapa (ou arraste)";
}
