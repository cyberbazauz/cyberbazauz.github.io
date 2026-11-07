import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  r: number
  a: number
  vx: number
  vy: number
  phase: number
  twinkle: number
  glow: boolean
}

function mulberry32(seed: number) {
  return function random() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Lightweight 2D imitation of the target's offscreen-controlled particle
 * field: sparse, slow, slightly right/low, never distracting from the copy.
 */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let dpr = 1
    let particles: Particle[] = []
    let frame = 0
    let visible = true
    let last = 0

    const create = () => {
      const area = Math.max(width * height, 1)
      const count = Math.round(Math.min(150, Math.max(54, area / 12500)))
      const random = mulberry32(7161)
      particles = Array.from({ length: count }, () => {
        /* bias the field slightly right of centre and below the middle */
        const bx = Math.pow(random(), 0.82)
        const by = Math.pow(random(), 0.9)
        return {
          x: width * (0.18 + bx * 0.72),
          y: height * (0.2 + by * 0.7),
          r: 0.5 + Math.pow(random(), 2) * 2.1,
          a: 0.12 + random() * 0.72,
          vx: (random() - 0.5) * 0.045,
          vy: -0.018 - random() * 0.055,
          phase: random() * Math.PI * 2,
          twinkle: 0.0006 + random() * 0.0018,
          glow: random() > 0.82,
        }
      })
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)
      dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      create()
      if (reduced) draw(0)
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      const halo = ctx.createRadialGradient(
        width * 0.58,
        height * 0.54,
        0,
        width * 0.58,
        height * 0.54,
        Math.max(width, height) * 0.58,
      )
      halo.addColorStop(0, 'rgba(255,255,255,0.055)')
      halo.addColorStop(0.45, 'rgba(255,255,255,0.018)')
      halo.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, width, height)

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx
          p.y += p.vy
          if (p.y < -8) {
            p.y = height + 8
            p.x = width * (0.18 + Math.random() * 0.72)
          }
          if (p.x < -8) p.x = width + 8
          if (p.x > width + 8) p.x = -8
        }

        const pulse = reduced ? 1 : 0.74 + Math.sin(time * p.twinkle + p.phase) * 0.26
        const alpha = Math.min(0.92, p.a * pulse)
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
        if (p.glow) {
          ctx.shadowBlur = 9
          ctx.shadowColor = 'rgba(255,255,255,0.5)'
        } else {
          ctx.shadowBlur = 0
        }
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    const loop = (time: number) => {
      if (!visible) {
        frame = 0
        return
      }
      if (!reduced && time - last > 24) {
        last = time
        draw(time)
      }
      frame = window.requestAnimationFrame(loop)
    }

    resize()
    draw(0)
    if (!reduced) frame = window.requestAnimationFrame(loop)

    const onResize = () => {
      resize()
      draw(performance.now())
    }
    window.addEventListener('resize', onResize)

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
        if (visible && !reduced && !frame) frame = window.requestAnimationFrame(loop)
      },
      { threshold: 0.01 },
    )
    observer.observe(canvas)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={ref} className="hero__canvas" aria-hidden="true" />
}
