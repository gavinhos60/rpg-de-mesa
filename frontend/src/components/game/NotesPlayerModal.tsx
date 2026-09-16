import { createPortal } from "react-dom";
import type { PlayerNote } from "../../types/notes";

interface NotesPlayerModalProps {
  notes: PlayerNote[];
  busy?: boolean;
  onClose: () => void;
  onEdit?: (note: PlayerNote) => void;
  onDelete?: (note: PlayerNote) => void;
}

export function NotesPlayerModal({
  notes,
  busy,
  onClose,
  onEdit,
  onDelete,
}: NotesPlayerModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-overlay)" }}
      role="dialog"
      aria-modal
      aria-label="Minhas anotações"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[min(90vh,44rem)] w-full max-w-2xl flex-col overflow-hidden border-2"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-wood)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header
          className="flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4"
          style={{
            borderColor: "var(--color-border)",
            background:
              "linear-gradient(180deg, var(--color-parchment-soft) 0%, var(--color-surface) 100%)",
          }}
        >
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Campanha
            </p>
            <h2
              className="text-xl text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Minhas anotações ({notes.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-xl leading-none text-[var(--color-border-strong)] hover:text-[var(--color-crimson)]"
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
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
                    <div className="flex shrink-0 gap-1">
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
                  <p className="max-h-48 overflow-y-auto break-words whitespace-pre-wrap text-sm text-[var(--color-ink-muted)]">
                    {note.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
