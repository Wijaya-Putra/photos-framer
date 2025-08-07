// /lib/canvasUtils.ts
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  ratio = window.devicePixelRatio || 1
): CanvasRenderingContext2D {
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  return ctx
}
