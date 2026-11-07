import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLocalizedContent } from '../i18n/content'
import { useSiteCopy } from './content'

export function StackStrip() {
  const copy = useSiteCopy()
  const { stack } = useLocalizedContent()
  const trackRef = useRef<HTMLDivElement | null>(null)
  const pausedRef = useRef(false)
  const dragRef = useRef(false)
  const dragState = useRef({ startX: 0, startScroll: 0 })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let frame = 0
    let last = performance.now()
    let offset = track.scrollLeft

    const loop = (time: number) => {
      const delta = Math.min(48, time - last)
      last = time
      if (!pausedRef.current && !dragRef.current) {
        const half = track.scrollWidth / 2
        if (half > 0) {
          /* Keep our own fractional offset: browsers drop sub-pixel
             scrollLeft writes, so storing the remainder keeps the rail
             drifting smoothly instead of standing still. */
          const actual = track.scrollLeft
          if (Math.abs(actual - offset) > 1.5) offset = actual
          offset += delta * 0.022
          if (offset >= half) offset -= half
          track.scrollLeft = offset
        }
      } else {
        offset = track.scrollLeft
      }
      frame = window.requestAnimationFrame(loop)
    }

    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const scrollByCard = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * 340, behavior: 'smooth' })
  }

  const items = [...stack, ...stack]

  return (
    <section id="stack" className="section section--stack">
      <div className="container-x">
        <div className="section-split stack__head">
          <div className="section-split__left reveal">
            <span className="pill-label">{copy.stack.label}</span>
            <h2 className="section-heading">
              {copy.stack.heading} <span>{copy.stack.em}</span>
            </h2>
          </div>
          <div className="section-split__right reveal" style={{ animationDelay: '0.12s' }}>
            <p className="section-sub">{copy.stack.sub}</p>
            <div className="stack__controls">
              <button
                type="button"
                className="round-control"
                aria-label={copy.ui.previous}
                onClick={() => scrollByCard(-1)}
              >
                <ArrowLeft size={16} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                className="round-control"
                aria-label={copy.ui.next}
                onClick={() => scrollByCard(1)}
              >
                <ArrowRight size={16} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="stack__viewport"
        onPointerEnter={() => {
          pausedRef.current = true
        }}
        onPointerLeave={() => {
          pausedRef.current = false
        }}
      >
        <div
          className="stack__track"
          ref={trackRef}
          onPointerDown={(event) => {
            const track = trackRef.current
            if (!track) return
            dragRef.current = true
            dragState.current = { startX: event.clientX, startScroll: track.scrollLeft }
            track.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (!dragRef.current) return
            const track = trackRef.current
            if (!track) return
            track.scrollLeft =
              dragState.current.startScroll - (event.clientX - dragState.current.startX)
          }}
          onPointerUp={(event) => {
            dragRef.current = false
            const track = trackRef.current
            if (track?.hasPointerCapture(event.pointerId)) {
              track.releasePointerCapture(event.pointerId)
            }
          }}
          onPointerCancel={() => {
            dragRef.current = false
          }}
          onWheel={(event) => {
            /* vertical wheel over the rail becomes horizontal movement */
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
              const track = trackRef.current
              if (!track) return
              const half = track.scrollWidth / 2
              if (half <= 0) return
              const before = track.scrollLeft
              track.scrollLeft += event.deltaY
              if (track.scrollLeft >= half) track.scrollLeft -= half
              if (before !== track.scrollLeft) event.preventDefault()
            }
          }}
        >
          {items.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="stack__card"
            >
              <div className="stack__card-top">
                <span className="stack__index">
                  {String((index % stack.length) + 1).padStart(2, '0')}
                </span>
                <span className="stack__ring">R{item.ring}</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span className="stack__card-line" aria-hidden="true">
                <i />
              </span>
            </article>
          ))}
        </div>
      </div>

      <div className="container-x">
        <p className="stack__note">{copy.stack.note}</p>
      </div>
    </section>
  )
}
