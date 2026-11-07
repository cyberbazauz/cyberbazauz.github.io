import { useEffect, useRef, useState } from 'react'
import { useSiteCopy } from './content'

export function ImpactSection() {
  const copy = useSiteCopy()

  return (
    <section id="impact" className="section section--impact">
      <div className="container-x">
        <div className="section-split">
          <div className="section-split__left reveal">
            <span className="pill-label">{copy.impact.label}</span>
            <h2 className="section-heading">
              {copy.impact.heading} <span>{copy.impact.em}</span>
            </h2>
          </div>
          <div className="section-split__right reveal" style={{ animationDelay: '0.12s' }}>
            <p className="section-sub">{copy.impact.sub}</p>
          </div>
        </div>

        <div className="impact__grid">
          {copy.impact.stats.map((stat, index) => (
            <article
              key={stat.label}
              className="impact__card card reveal reveal-fade"
              style={{ animationDelay: `${index * 0.09}s` }}
            >
              <div className="impact__value">
                <Counter
                  prefix={stat.prefix}
                  value={stat.value}
                  decimals={stat.decimals}
                />
                <span className="impact__suffix">{stat.suffix}</span>
              </div>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Counter({
  value,
  decimals,
  prefix,
}: {
  value: number
  decimals: number
  prefix: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setDisplay(value)
      return
    }

    let frame = 0
    let start = 0
    const duration = 1500

    const tick = (time: number) => {
      if (!start) start = time
      const progress = Math.min(1, (time - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return
        started.current = true
        frame = window.requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref} className="impact__number">
      {prefix}
      {display.toFixed(decimals)}
    </span>
  )
}
