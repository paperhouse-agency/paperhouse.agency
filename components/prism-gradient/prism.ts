/**
 * Prism gradient renderer (Canvas 2D).
 *
 * Extracted from the generated "Citron" gradient export and reduced to the
 * PRISM2 code path only. The canvas is split into mirrored vertical bars that
 * slide outward from the center; each bar is a vertical OKLab gradient sampled
 * from the palette along a crest-shaped curve.
 */

export type PrismShape = 'crest' | 'valley' | 'tide' | 'slant' | 'lens'
export type PrismMotion = 'expand' | 'gather' | 'breathe'

export interface PrismOptions {
  /** Bars per half (3–16) */
  count?: number
  shape?: PrismShape
  /** 0 = up, 1 = right, 2 = down, 3 = left */
  direction?: 0 | 1 | 2 | 3
  motion?: PrismMotion
  /** Flip the palette */
  reverse?: boolean
  /** Width of the crest, 40–180 */
  size?: number
  /** Crest height, 0–100 */
  height?: number
  /** Horizontal crest focus, 0–100 */
  focus?: number
  /** Vertical offset, 0–100 */
  position?: number
  /** Gradient softness inside each bar, 0–100 */
  blend?: number
  /** Per-bar jitter, 0–100 */
  facets?: number
}

type RGB = [number, number, number]

const SAMPLES = 96
const LUT_SIZE = 256

const DEFAULTS: Required<PrismOptions> = {
  count: 11,
  shape: 'crest',
  direction: 0,
  motion: 'expand',
  reverse: false,
  size: 100,
  height: 60,
  focus: 50,
  position: 50,
  blend: 65,
  facets: 35,
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

const smoothstep = (v: number) => {
  const t = clamp(v, 0, 1)
  return t * t * (3 - 2 * t)
}

function resolveOptions(options: PrismOptions): Required<PrismOptions> {
  const o = { ...DEFAULTS, ...options }
  return {
    ...o,
    count: clamp(Math.round(o.count), 3, 16),
    size: clamp(o.size, 40, 180),
    height: clamp(o.height, 0, 100),
    focus: clamp(o.focus, 0, 100),
    position: clamp(o.position, 0, 100),
    blend: clamp(o.blend, 0, 100),
    facets: clamp(o.facets, 0, 100),
  }
}

// ---------------------------------------------------------------------------
// Color (sRGB <-> OKLab)
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): RGB {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToOklab(rgb: RGB): RGB {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function oklabToRgb([L, a, b]: RGB): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => {
    const c =
      v <= 0.0031308 ? v * 12.92 : 1.055 * Math.max(0, v) ** (1 / 2.4) - 0.055
    return clamp(Math.round(c * 255), 0, 255)
  }) as RGB
}

/** Samples the palette at t (0–1). Stops sit at the center of equal segments. */
function samplePalette(labs: RGB[], t: number): RGB {
  const n = labs.length
  const pos = t * n - 0.5
  if (pos <= 0) return oklabToRgb(labs[0])
  if (pos >= n - 1) return oklabToRgb(labs[n - 1])
  const i = Math.floor(pos)
  const f = pos - i
  const a = labs[i]
  const b = labs[i + 1]
  return oklabToRgb([
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ])
}

/** Mixes two hex colors in OKLab. `amount` 0 = `from`, 1 = `to`. Returns hex. */
export function mixColors(from: string, to: string, amount: number): string {
  const a = rgbToOklab(hexToRgb(from))
  const b = rgbToOklab(hexToRgb(to))
  const rgb = oklabToRgb([
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ])
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export interface PrismPalette {
  lut: RGB[]
  base: RGB
}

/** Pre-computes the palette lookup table. Build once per `stops`, not per frame. */
export function createPalette(stops: string[], reverse = false): PrismPalette {
  const labs = stops.map((hex) => rgbToOklab(hexToRgb(hex)))
  const lut = Array.from({ length: LUT_SIZE }, (_, i) =>
    samplePalette(labs, i / (LUT_SIZE - 1))
  )
  return { lut, base: reverse ? lut[LUT_SIZE - 1] : lut[0] }
}

function sampleLut(lut: RGB[], t: number): string {
  const pos = clamp(t, 0, 1) * (lut.length - 1)
  const i = Math.floor(pos)
  const a = lut[i]
  const b = lut[Math.min(i + 1, lut.length - 1)]
  const f = pos - i
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

/** Vertical edge height (0–1) for a bar at normalized crest offset u. */
function shapeCurve(shape: PrismShape, u: number) {
  const crest = 0.5 - 0.5 * Math.cos(Math.min(1, Math.abs(u)) * Math.PI)
  if (shape === 'valley') return 1 - crest
  if (shape === 'slant') return smoothstep(0.5 + u * 0.5)
  if (shape === 'tide') {
    return (
      0.5 +
      0.34 * Math.sin(u * Math.PI * 1.3 + 0.6) +
      0.14 * Math.sin(u * Math.PI * 2.1 - 0.8)
    )
  }
  return crest
}

/** Canvas transform mapping the unit square to the canvas for each direction. */
function directionTransform(
  w: number,
  h: number,
  direction: number
): [number, number, number, number, number, number] {
  if (direction === 1) return [0, h, -w, 0, w, 0]
  if (direction === 2) return [-w, 0, 0, -h, w, h]
  if (direction === 3) return [0, -h, w, 0, 0, h]
  return [w, 0, 0, h, 0, 0]
}

/**
 * Draws one frame.
 * @param time Animation clock in seconds (the "Citron" preset starts at ~29.7).
 */
export function drawPrism(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: PrismPalette,
  options: PrismOptions,
  time: number
) {
  const o = resolveOptions(options)
  const { lut } = palette

  ctx.fillStyle = `rgb(${palette.base.join(',')})`
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.transform(...directionTransform(width, height, o.direction))
  // Overlap bars by one device pixel to hide seams
  const seam = 1 / (o.direction % 2 ? height : width)

  const offset =
    o.motion === 'breathe'
      ? 9.96
      : time * 0.48 * (o.motion === 'gather' ? -1 : 1)
  const first = Math.floor(-offset)
  const last = Math.ceil(o.count - offset)
  const wobble =
    (o.motion === 'breathe' ? 0.045 : 0.015) * Math.sin(time * 0.32)
  const shift = (o.position - 50) * 0.009
  const softness = 0.22 + o.blend * 0.008
  const floor = o.shape === 'lens' ? 0.16 : 0.02

  for (const side of [-1, 1]) {
    for (let bar = first; bar < last; bar++) {
      const lo = Math.max(0, (bar + offset) / o.count)
      const hi = Math.min(1, (bar + 1 + offset) / o.count)
      if (hi <= lo) continue

      const start = side < 0 ? (1 - hi) / 2 : (1 + lo) / 2
      const end = side < 0 ? (1 - lo) / 2 : (1 + hi) / 2
      const center = (start + end) / 2

      const u = ((center - o.focus / 100) * 2) / (o.size / 100)
      const curve = shapeCurve(o.shape, u)
      const edge =
        0.28 +
        curve * (o.height * 0.006) +
        (o.shape === 'lens' ? 0 : shift) +
        wobble
      const jitter =
        (0.025 * Math.sin(bar * 1.8) +
          0.012 * Math.sin(bar * 0.73 + time * 0.24)) *
        (o.facets / 35)

      const gradient = ctx.createLinearGradient(0, 0, 0, 1)
      for (let i = 0; i < SAMPLES; i++) {
        const r = i / (SAMPLES - 1)
        const k = o.shape === 'lens' ? Math.abs(r - 0.5 - shift) * 2 : r
        const t = clamp(
          floor +
            (0.98 - floor) * smoothstep((k - edge + 0.22) / softness) +
            jitter,
          0,
          1
        )
        gradient.addColorStop(r, sampleLut(lut, o.reverse ? 1 - t : t))
      }
      ctx.fillStyle = gradient
      ctx.fillRect(start, 0, end - start + seam, 1)
    }
  }
  ctx.restore()
}

// ---------------------------------------------------------------------------
// Grain
// ---------------------------------------------------------------------------

export const GRAIN_TILE_SIZE = 256
let grainDataUrl: string | null = null

/** Returns a cached 256×256 monochrome noise tile as a data URL. */
export function getGrainDataUrl() {
  if (grainDataUrl) return grainDataUrl
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = GRAIN_TILE_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const image = ctx.createImageData(GRAIN_TILE_SIZE, GRAIN_TILE_SIZE)
  const { data } = image
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.round(((Math.random() + Math.random()) / 2) * 255)
    data[i] = data[i + 1] = data[i + 2] = v
    data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  grainDataUrl = canvas.toDataURL()
  return grainDataUrl
}
