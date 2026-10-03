import { useEffect, useState } from "react";

interface EditableFeatureDescriptionProps {
  displayText: string;
  defaultText: string;
  editable?: boolean;
  onSave: (customText: string) => void;
  className?: string;
}

export function EditableFeatureDescription({
  displayText,
  defaultText,
  editable = false,
  onSave,
  className = "",
}: EditableFeatureDescriptionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayText);

  useEffect(() => {
    if (!editing) setDraft(displayText);
  }, [displayText, editing]);

  if (!editable) {
    return (
      <p
        className={`mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)] ${className}`}
      >
        {displayText}
      </p>
    );
  }

  if (editing) {
    return (
      <div
        className={`mt-1 space-y-1 ${className}`}
        data-feature-edit
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={4}
          className="w-full border px-2 py-1 text-sm leading-relaxed"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
          autoFocus
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === "Escape") {
              setDraft(displayText);
              setEditing(false);
            }
          }}
        />
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            className="text-[var(--color-crimson)]"
            onClick={(event) => {
              event.stopPropagation();
              onSave(draft);
              setEditing(false);
            }}
          >
            Salvar descrição
          </button>
          <button
            type="button"
            className="text-[var(--color-ink-muted)]"
            onClick={(event) => {
              event.stopPropagation();
              setDraft(displayText);
              setEditing(false);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-1 ${className}`}>
      <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {displayText}
      </p>
      <button
        type="button"
        className="mt-0.5 text-[10px] uppercase tracking-wide text-[var(--color-crimson)]"
        onClick={(event) => {
          event.stopPropagation();
          setDraft(displayText || defaultText);
          setEditing(true);
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        Editar descrição
      </button>
    </div>
  );
}
