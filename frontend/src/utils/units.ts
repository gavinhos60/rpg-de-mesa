/** Converte pés (fonte de verdade dos dados) para exibição em metros. */
export function formatMeters(feet: number): string {
    const meters = feet * 0.3;
    const rounded = Number.isInteger(meters) ? String(meters) : meters.toFixed(1);
    return `${rounded.replace(".", ",")} m`;
}
