import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useSiteCopy } from './content'
import { HeroCanvas } from './HeroCanvas'
import { HeroScene } from './HeroScene'
import { cx } from '../lib/utils'

const CENTERS = [0, 0.3, 0.55, 0.75, 1] as const
const HALF_WINDOWS = [0.24, 0.18, 0.18, 0.18, 0.2] as const

export function Hero() {
  const copy = useSiteCopy()
  const heroRef = useRef<HTMLElement | null>(null)
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])
  const cueRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(0)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    let frame = 0

    const metrics = () => {
      const viewport = window.innerHeight
      const range = Math.max(hero.offsetHeight - viewport - 400, 1)
      const top = hero.getBoundingClientRect().top
      return { range, top }
    }

    const update = () => {
      frame = 0
      const { range, top } = metrics()
      const progress = Math.max(0, Math.min(1, -top / range))
      progressRef.current = progress

      let best = 0
      let bestOpacity = -1

      slideRefs.current.forEach((element, index) => {
        if (!element) return
        const distance = Math.abs(progress - CENTERS[index])
        const raw = Math.max(0, 1 - distance / HALF_WINDOWS[index])
        const opacity = raw * raw * (3 - 2 * raw)
        const offset = index * 56 - 224 * progress

        element.style.opacity = opacity.toFixed(3)
        element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
        element.style.filter = opacity > 0.995 ? 'none' : `blur(${((1 - opacity) * 5).toFixed(2)}px)`
        element.style.visibility = opacity > 0.004 ? 'visible' : 'hidden'
        element.style.pointerEvents =
          opacity > 0.62 && window.innerWidth >= 1024 ? 'auto' : 'none'
        element.style.zIndex = String(Math.round(100 - distance * 100))

        if (opacity > bestOpacity) {
          bestOpacity = opacity
          best = index
        }
      })

      if (best !== activeRef.current) {
        activeRef.current = best
        setActive(best)
      }

      if (cueRef.current) {
        cueRef.current.style.opacity = String(Math.max(0, 1 - progress * 9))
      }
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const goToSlide = (index: number) => {
    const hero = heroRef.current
    if (!hero) return
    const viewport = window.innerHeight
    const range = Math.max(hero.offsetHeight - viewport - 400, 1)
    const target = hero.offsetTop + CENTERS[index] * range
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero__sticky">
        <div className="hero-beams" aria-hidden="true" />
        <div className="hero-marquee" aria-hidden="true">
          <div className="hero-marquee-track">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index}>{copy.hero.marquee}</span>
            ))}
          </div>
        </div>
        <HeroCanvas />
        <HeroScene progressRef={progressRef} />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />

        <div className="hero__inner">
          <div className="hero__stack">
            {copy.hero.slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                className={cx('hero__slide', index % 2 === 1 && 'hero__slide--right')}
              >
                <span className="hero__eyebrow">
                  <i aria-hidden="true" />
                  {copy.hero.eyebrow}
                </span>
                {index === 0 ? (
                  <h1 className="hero-heading">{slide.title}</h1>
                ) : (
                  <p className="hero-heading">{slide.title}</p>
                )}
                <p className="hero__body">{slide.body}</p>

                {index === 0 ? (
                  <div className="hero__actions">
                    <a className="btn-white" href="#projects">
                      {copy.hero.primary}
                      <ArrowUpRight size={16} strokeWidth={1.8} />
                    </a>
                    <a className="btn-ghost" href="#contact">
                      {copy.hero.secondary}
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="hero__dots" role="tablist" aria-label={copy.ui.scroll}>
          {copy.hero.slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={`${index + 1} / ${copy.hero.slides.length}`}
              className={cx('hero__dot', active === index && 'is-active')}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <div className="hero__cue" ref={cueRef} aria-hidden="true">
          <span className="hero__cue-line">
            <i />
          </span>
          <span className="hero__cue-label">{copy.ui.scroll}</span>
        </div>

        <div className="hero__counter" aria-hidden="true">
          <span>{String(active + 1).padStart(2, '0')}</span>
          <i />
          <span>{String(copy.hero.slides.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}
