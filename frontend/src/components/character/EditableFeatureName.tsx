import { useEffect, useState } from "react";

const cinzel = { fontFamily: "'Cinzel', serif" } as const;

interface EditableFeatureNameProps {
  displayName: string;
  defaultName: string;
  editable?: boolean;
  onSave: (customLabel: string) => void;
  className?: string;
}

export function EditableFeatureName({
  displayName,
  defaultName,
  editable = false,
  onSave,
  className = "",
}: EditableFeatureNameProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayName);

  useEffect(() => {
    if (!editing) setDraft(displayName);
  }, [displayName, editing]);

  if (!editable) {
    return (
      <p className={`text-[var(--color-ink)] ${className}`} style={{ ...cinzel, fontWeight: 600 }}>
        {displayName}
      </p>
    );
  }

  if (editing) {
    return (
      <div
        className={`flex flex-wrap items-center gap-2 ${className}`}
        data-feature-edit
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-[12rem] flex-1 border px-2 py-1 text-sm"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
          autoFocus
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === "Enter") {
              event.preventDefault();
              onSave(draft);
              setEditing(false);
            }
            if (event.key === "Escape") {
              setDraft(displayName);
              setEditing(false);
            }
          }}
        />
        <button
          type="button"
          className="text-xs text-[var(--color-crimson)]"
          onClick={(event) => {
            event.stopPropagation();
            onSave(draft);
            setEditing(false);
          }}
        >
          Salvar
        </button>
        <button
          type="button"
          className="text-xs text-[var(--color-ink-muted)]"
          onClick={(event) => {
            event.stopPropagation();
            setDraft(displayName);
            setEditing(false);
          }}
        >
          Cancelar
        </button>
      </div>
    );
  }

  const hasCustom = displayName.trim() !== defaultName.trim();

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      data-feature-edit
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
        {displayName}
      </p>
      {hasCustom ? (
        <span className="text-[10px] text-[var(--color-ink-soft)]" title="Nome original">
          ({defaultName})
        </span>
      ) : null}
      <button
        type="button"
        className="text-[10px] uppercase tracking-wide text-[var(--color-crimson)]"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setEditing(true);
        }}
      >
        Renomear
      </button>
      {hasCustom ? (
        <button
          type="button"
          className="text-[10px] text-[var(--color-ink-muted)]"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSave(defaultName);
          }}
        >
          Restaurar
        </button>
      ) : null}
    </div>
  );
}
