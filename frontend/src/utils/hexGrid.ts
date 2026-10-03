/**
 * Grade hexagonal pointy-top (vértice para cima), estilo VTT.
 * `gridSize` = largura flat-to-flat horizontal (px), igual ao gridSize do board.
 */

export type Axial = { q: number; r: number };

/** Metros por hexágono (10 km). */
export const DEFAULT_HEX_METERS = 10_000;

/** `gridSize` = flat-to-flat (horizontal). `size` = raio (centro → vértice). */
export function hexMetrics(gridSize: number) {
  const width = Math.max(8, gridSize);
  const size = width / Math.sqrt(3);
  const apothem = width / 2;
  const height = 2 * size;
  const horiz = Math.sqrt(3) * size;
  const vert = 1.5 * size;
  return { width, height, size, apothem, horiz, vert };
}

/** Escala visual do token dentro do hex (círculo inscrito). */
export const HEX_TOKEN_INSET_RATIO = 0.88;

/** Largura/altura do quadrado que envolve o token em 1 hex. */
export function hexTokenFootprintPx(gridSpan: number, gridSize: number): number {
  const { width, size } = hexMetrics(gridSize);
  const span = Math.max(1, Math.round(gridSpan));
  if (span <= 1) return width;
  return width + (span - 1) * horizSpacing(size);
}

function horizSpacing(size: number) {
  return Math.sqrt(3) * size;
}

/** Diâmetro do corpo circular do token (inscrito no hex). */
export function hexTokenBodyPx(gridSpan: number, gridSize: number): number {
  return hexTokenFootprintPx(gridSpan, gridSize) * HEX_TOKEN_INSET_RATIO;
}

/** Pointy-top: Red Blob Games axial → pixel. */
export function axialToPixel(q: number, r: number, gridSize: number) {
  const { size } = hexMetrics(gridSize);
  return {
    x: size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r),
    y: size * ((3 / 2) * r),
  };
}

export function pixelToAxial(x: number, y: number, gridSize: number): Axial {
  const { size } = hexMetrics(gridSize);
  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / size;
  const r = ((2 / 3) * y) / size;
  return cubeToAxial(cubeRound(q, -q - r, r));
}

function cubeRound(x: number, y: number, z: number) {
  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);
  const xDiff = Math.abs(rx - x);
  const yDiff = Math.abs(ry - y);
  const zDiff = Math.abs(rz - z);
  if (xDiff > yDiff && xDiff > zDiff) rx = -ry - rz;
  else if (yDiff > zDiff) ry = -rx - rz;
  else rz = -rx - ry;
  return { x: rx, y: ry, z: rz };
}

function cubeToAxial(cube: { x: number; y: number; z: number }): Axial {
  return { q: cube.x, r: cube.z };
}

export function snapToHexCenter(
  x: number,
  y: number,
  gridSize: number
): { x: number; y: number } {
  const axial = pixelToAxial(x, y, gridSize);
  return axialToPixel(axial.q, axial.r, gridSize);
}

/** Distância em hexágonos (cube distance). */
export function distanceHexes(
  from: { x: number; y: number },
  to: { x: number; y: number },
  gridSize: number
): number {
  const a = pixelToAxial(from.x, from.y, gridSize);
  const b = pixelToAxial(to.x, to.y, gridSize);
  return (
    (Math.abs(a.q - b.q) +
      Math.abs(a.q + a.r - b.q - b.r) +
      Math.abs(a.r - b.r)) /
    2
  );
}

/** Vértices pointy-top (vértice para cima) centrados em (cx, cy). */
export function hexPolygonPoints(
  cx: number,
  cy: number,
  gridSize: number
): string {
  const { size } = hexMetrics(gridSize);
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 90);
    const px = cx + size * Math.cos(angle);
    const py = cy + size * Math.sin(angle);
    points.push(`${px},${py}`);
  }
  return points.join(" ");
}

/** Gera centros de hexágonos que cobrem um retângulo mundo. */
export function hexCentersInBounds(
  width: number,
  height: number,
  gridSize: number
): Array<{ q: number; r: number; x: number; y: number }> {
  const { size } = hexMetrics(gridSize);
  const pad = size * 2;
  const corners = [
    pixelToAxial(-pad, -pad, gridSize),
    pixelToAxial(width + pad, -pad, gridSize),
    pixelToAxial(-pad, height + pad, gridSize),
    pixelToAxial(width + pad, height + pad, gridSize),
  ];
  let qMin = corners[0].q;
  let qMax = corners[0].q;
  let rMin = corners[0].r;
  let rMax = corners[0].r;
  for (const c of corners.slice(1)) {
    qMin = Math.min(qMin, c.q);
    qMax = Math.max(qMax, c.q);
    rMin = Math.min(rMin, c.r);
    rMax = Math.max(rMax, c.r);
  }
  qMin -= 2;
  qMax += 2;
  rMin -= 2;
  rMax += 2;

  const result: Array<{ q: number; r: number; x: number; y: number }> = [];
  for (let q = qMin; q <= qMax; q++) {
    for (let r = rMin; r <= rMax; r++) {
      const { x, y } = axialToPixel(q, r, gridSize);
      if (
        x >= -pad &&
        y >= -pad &&
        x <= width + pad &&
        y <= height + pad
      ) {
        result.push({ q, r, x, y });
      }
    }
  }
  return result;
}

/** Top-left do footprint alinhado ao centro do hex mais próximo. */
export function snapTokenToHex(
  topLeftX: number,
  topLeftY: number,
  footprintPx: number,
  gridSize: number
): { x: number; y: number } {
  const cx = topLeftX + footprintPx / 2;
  const cy = topLeftY + footprintPx / 2;
  const center = snapToHexCenter(cx, cy, gridSize);
  return {
    x: center.x - footprintPx / 2,
    y: center.y - footprintPx / 2,
  };
}

export function snapTokenOriginToHex(
  topLeftX: number,
  topLeftY: number,
  gridSpan: number,
  gridSize: number
): { x: number; y: number } {
  const footprint = hexTokenFootprintPx(gridSpan, gridSize);
  return snapTokenToHex(topLeftX, topLeftY, footprint, gridSize);
}

/** Span em hex: ignora `size` legado em px (evita token gigante após mudar grid). */
export function tokenGridSpanForHex(token: {
  gridSpan?: number;
  sizeCategory?: string;
  size?: number;
}): number {
  if (typeof token.gridSpan === "number" && token.gridSpan >= 1) {
    return Math.min(4, Math.round(token.gridSpan));
  }
  if (token.sizeCategory) {
    const map: Record<string, number> = {
      Tiny: 1,
      Small: 1,
      Medium: 1,
      Large: 2,
      Grande: 2,
      Huge: 3,
      Enorme: 3,
      Gargantuan: 4,
      Imenso: 4,
    };
    return map[token.sizeCategory] ?? 1;
  }
  return 1;
}
