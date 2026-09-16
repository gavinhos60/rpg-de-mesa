/**
 * Grade hexagonal flat-top (estilo VTT).
 * `gridSize` = largura flat-to-flat do hexágono (px), alinhada ao gridSize do board.
 */

export type Axial = { q: number; r: number };

/** Metros por hexágono (10 km). */
export const DEFAULT_HEX_METERS = 10_000;

export function hexMetrics(gridSize: number) {
  const width = Math.max(8, gridSize);
  const size = width / 2; // center → vertex
  const height = Math.sqrt(3) * size;
  const horiz = width * 0.75;
  const vert = height;
  return { width, height, size, horiz, vert };
}

export function axialToPixel(q: number, r: number, gridSize: number) {
  const { size } = hexMetrics(gridSize);
  return {
    x: size * (3 / 2) * q,
    y: size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r),
  };
}

export function pixelToAxial(x: number, y: number, gridSize: number): Axial {
  const { size } = hexMetrics(gridSize);
  const q = ((2 / 3) * x) / size;
  const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / size;
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

/** Vértices de um hex flat-top centrado em (cx, cy). */
export function hexPolygonPoints(
  cx: number,
  cy: number,
  gridSize: number
): string {
  const { size } = hexMetrics(gridSize);
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
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
  const { horiz, vert, size } = hexMetrics(gridSize);
  const result: Array<{ q: number; r: number; x: number; y: number }> = [];
  const qMax = Math.ceil(width / horiz) + 2;
  const rMax = Math.ceil(height / vert) + 2;
  for (let q = -2; q <= qMax; q++) {
    for (let r = -2; r <= rMax; r++) {
      const { x, y } = axialToPixel(q, r, gridSize);
      if (
        x >= -size &&
        y >= -size &&
        x <= width + size &&
        y <= height + size
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
