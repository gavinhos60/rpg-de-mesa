/** Retrato do monstro ou token SVG gerado (iniciais + cor do tipo). */
export function monsterPortraitUrl(monster: {
  name: string;
  imageUrl?: string;
  tokenUrl?: string;
  color?: string;
}): string {
  const url = (monster.tokenUrl || monster.imageUrl || "").trim();
  if (url) return url;

  const initials =
    String(monster.name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  const fill = monster.color || "#4A2F18";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><circle cx="64" cy="64" r="60" fill="${fill}" stroke="#EBDFC4" stroke-width="4"/><text x="64" y="74" text-anchor="middle" font-family="Georgia,serif" font-size="42" font-weight="700" fill="#F3E6C4">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
