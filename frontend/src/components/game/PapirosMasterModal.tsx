import type { Papyrus } from "../../types/papiros";
import { floatingPopupStackOffset } from "../../hooks/useFloatingPopupStack";
import { FloatingPopupWindow } from "./FloatingPopupWindow";

interface PapirosMasterModalProps {
  papyri: Papyrus[];
  busy?: boolean;
  onClose: () => void;
  onExpand?: (papyrus: Papyrus) => void;
  onEdit?: (papyrus: Papyrus) => void;
  onDelete?: (papyrus: Papyrus) => void;
  onTogglePublish?: (papyrus: Papyrus) => void;
  onPreview?: (papyrus: Papyrus) => void;
  zIndex?: number;
  stackIndex?: number;
  onActivate?: () => void;
}

export function PapirosMasterModal({
  papyri,
  busy,
  onClose,
  onExpand,
  onEdit,
  onDelete,
  onTogglePublish,
  onPreview,
  zIndex = 85,
  stackIndex = 0,
  onActivate,
}: PapirosMasterModalProps) {
  return (
    <FloatingPopupWindow
      subtitle="Campanha"
      title={`Pergaminhos (${papyri.length})`}
      ariaLabel="Biblioteca de papiros"
      onClose={onClose}
      zIndex={zIndex}
      initialOffset={floatingPopupStackOffset(stackIndex)}
      onActivate={onActivate}
    >
      <div className="p-4">
        {papyri.length === 0 ? (
          <p className="text-sm italic text-[var(--color-ink-soft)]">
            Nenhum papiro ainda.
          </p>
        ) : (
          <ul className="space-y-3">
            {papyri.map((papyrus) => (
              <li
                key={papyrus.id}
                className="border p-3"
                style={{
                  borderColor: papyrus.published
                    ? "var(--color-crimson)"
                    : "var(--color-border)",
                  backgroundColor: "var(--color-parchment)",
                }}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p
                      className="break-words text-base text-[var(--color-ink)]"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 600,
                      }}
                    >
                      {papyrus.title}
                    </p>
                    <p className="text-[10px] text-[var(--color-ink-soft)]">
                      {papyrus.published ? "Publicado" : "Rascunho"} ·{" "}
                      {new Date(papyrus.updatedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    {onTogglePublish ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onTogglePublish(papyrus)}
                        className="border px-2 py-1 text-[10px]"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          borderColor: "var(--color-crimson)",
                          backgroundColor: papyrus.published
                            ? "var(--color-crimson)"
                            : "var(--color-parchment-soft)",
                          color: papyrus.published
                            ? "var(--color-ink-inverse)"
                            : "var(--color-crimson)",
                        }}
                      >
                        {papyrus.published ? "Recolher" : "Publicar"}
                      </button>
                    ) : null}
                    {onPreview ? (
                      <button
                        type="button"
                        onClick={() => onPreview(papyrus)}
                        className="border px-2 py-1 text-[10px] text-[var(--color-ink)]"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-parchment-soft)",
                        }}
                      >
                        Prévia
                      </button>
                    ) : null}
                    {onExpand ? (
                      <button
                        type="button"
                        onClick={() => onExpand(papyrus)}
                        className="border px-2 py-1 text-[10px] text-[var(--color-ink)]"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-parchment-soft)",
                        }}
                      >
                        Ampliar
                      </button>
                    ) : null}
                    {onEdit ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onEdit(papyrus)}
                        className="border px-2 py-1 text-[10px] text-[var(--color-ink)]"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-parchment-soft)",
                        }}
                      >
                        Editar
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onDelete(papyrus)}
                        className="border px-2 py-1 text-[10px] text-[var(--color-crimson)]"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-parchment-soft)",
                        }}
                      >
                        Excluir
                      </button>
                    ) : null}
                  </div>
                </div>
                {papyrus.imageUrl ? (
                  <img
                    src={papyrus.imageUrl}
                    alt=""
                    className="mb-2 max-h-40 w-full rounded border object-contain"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-parchment-soft)",
                    }}
                  />
                ) : null}
                <p className="max-h-48 overflow-y-auto break-words whitespace-pre-wrap text-sm text-[var(--color-ink-muted)] [overflow-wrap:anywhere]">
                  {papyrus.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FloatingPopupWindow>
  );
}
