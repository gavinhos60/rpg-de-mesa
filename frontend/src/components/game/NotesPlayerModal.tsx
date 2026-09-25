import type { PlayerNote } from "../../types/notes";
import { floatingPopupStackOffset } from "../../hooks/useFloatingPopupStack";
import { FloatingPopupWindow } from "./FloatingPopupWindow";

interface NotesPlayerModalProps {
  notes: PlayerNote[];
  busy?: boolean;
  onClose: () => void;
  onEdit?: (note: PlayerNote) => void;
  onDelete?: (note: PlayerNote) => void;
  onExpand?: (note: PlayerNote) => void;
  /** Título da janela (ex.: anotações do jogador vs. do mestre). */
  title?: string;
  zIndex?: number;
  stackIndex?: number;
  onActivate?: () => void;
}

export function NotesPlayerModal({
  notes,
  busy,
  onClose,
  onEdit,
  onDelete,
  onExpand,
  title,
  zIndex = 85,
  stackIndex = 0,
  onActivate,
}: NotesPlayerModalProps) {
  const windowTitle = title ?? `Minhas anotações (${notes.length})`;

  return (
    <FloatingPopupWindow
      subtitle="Campanha"
      title={windowTitle}
      ariaLabel="Anotações"
      onClose={onClose}
      zIndex={zIndex}
      initialOffset={floatingPopupStackOffset(stackIndex)}
      onActivate={onActivate}
    >
      <div className="p-4">
        {notes.length === 0 ? (
          <p className="text-sm italic text-[var(--color-ink-soft)]">
            Nenhuma anotação ainda.
          </p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="border p-3"
                style={{
                  borderColor: "var(--color-border)",
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
                      {note.title.trim() || "Sem título"}
                    </p>
                    <p className="text-[10px] text-[var(--color-ink-soft)]">
                      {new Date(note.updatedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    {onExpand ? (
                      <button
                        type="button"
                        onClick={() => onExpand(note)}
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
                        onClick={() => onEdit(note)}
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
                        onClick={() => onDelete(note)}
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
                {note.imageUrl ? (
                  <img
                    src={note.imageUrl}
                    alt=""
                    className="mb-2 max-h-40 w-full rounded border object-contain"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-parchment-soft)",
                    }}
                  />
                ) : null}
                <p className="max-h-48 overflow-y-auto break-words whitespace-pre-wrap text-sm text-[var(--color-ink-muted)] [overflow-wrap:anywhere]">
                  {note.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FloatingPopupWindow>
  );
}
