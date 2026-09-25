interface RequiresAttunementFieldProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export function RequiresAttunementField({
    checked,
    onChange,
    className = "",
}: RequiresAttunementFieldProps) {
    return (
        <label
            className={`flex items-center gap-2 text-[11px] text-[var(--color-ink-muted)] ${className}`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            Requer sintonização
        </label>
    );
}
