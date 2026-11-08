import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { useLocalizedContent, type LocalizedProject } from '../i18n/content'
import { useSiteCopy } from './content'
import { ProjectArt } from './ProjectArt'

interface UpdatesStripProps {
  onOpen: (project: LocalizedProject) => void
}

interface RailItem {
  project: LocalizedProject
  tag: string
  date: string
}

export function UpdatesStrip({ onOpen }: UpdatesStripProps) {
  const copy = useSiteCopy()
  const { projects } = useLocalizedContent()
  const railRef = useRef<HTMLDivElement | null>(null)
  const suppressClick = useRef(false)
  const playingRef = useRef(true)
  const [playing, setPlaying] = useState(
    () =>
      typeof window === 'undefined' ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  const curated: RailItem[] = copy.updates.items
    .map((item) => {
      const project = projects.find((entry) => entry.id === item.projectId)
      return project ? { project, tag: item.tag, date: item.date } : null
    })
    .filter((item): item is RailItem => item !== null)

  const featuredIds = new Set(curated.map((item) => item.project.id))
  const extras: RailItem[] = projects
    .filter((project) => !featuredIds.has(project.id))
    .slice(0, 4)
    .map((project) => ({
      project,
      tag: copy.categories[project.category],
      date: project.meta.year,
    }))

  const items = [...curated, ...extras]
  const loop = [...items, ...items]

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const track = rail.querySelector<HTMLElement>('.updates__track')
    let dragging = false
    let startX = 0
    let startScroll = 0
    let moved = 0
    let raf = 0
    let last = performance.now()
    let offset = rail.scrollLeft

    const tick = (now: number) => {
      const dt = Math.min(now - last, 80)
      last = now

      if (track) {
        const half = track.scrollWidth / 2
        if (playingRef.current && !dragging && half > 0) {
          offset += dt * 0.024
          if (offset >= half) offset -= half
          rail.scrollLeft = offset
        } else if (!dragging) {
          offset = rail.scrollLeft
        }
      }

      raf = requestAnimationFrame(tick)
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      dragging = true
      moved = 0
      startX = event.clientX
      startScroll = rail.scrollLeft
      offset = startScroll
      rail.classList.add('is-dragging')
      // Capture only after the pointer actually moves (see onMove). Capturing on
      // pointerdown retargets the pointerup to the rail, which makes the browser
      // dispatch `click` on the rail instead of the card button — so cards never open.
    }

    const onMove = (event: PointerEvent) => {
      if (!dragging) return
      const dx = event.clientX - startX
      moved = Math.max(moved, Math.abs(dx))
      if (moved > 8 && !rail.hasPointerCapture(event.pointerId)) {
        rail.setPointerCapture(event.pointerId)
      }
      offset = startScroll - dx
      rail.scrollLeft = offset
    }

    const onUp = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      suppressClick.current = event.type !== 'pointercancel' && moved > 8
      rail.classList.remove('is-dragging')
      if (rail.hasPointerCapture(event.pointerId)) {
        rail.releasePointerCapture(event.pointerId)
      }
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick.current) return
      suppressClick.current = false
      event.preventDefault()
      event.stopPropagation()
    }

    rail.addEventListener('pointerdown', onDown)
    rail.addEventListener('pointermove', onMove)
    rail.addEventListener('pointerup', onUp)
    rail.addEventListener('pointercancel', onUp)
    rail.addEventListener('click', onClickCapture, true)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      rail.removeEventListener('pointerdown', onDown)
      rail.removeEventListener('pointermove', onMove)
      rail.removeEventListener('pointerup', onUp)
      rail.removeEventListener('pointercancel', onUp)
      rail.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  return (
    <section
      id="updates"
      className="section section--updates"
      aria-label={copy.updates.label}
    >
      <div className="updates__rail" ref={railRef} tabIndex={0}>
        <div className="updates__track">
          {loop.map(({ project, tag, date }, index) => {
            const duplicate = index >= items.length
            return (
              <button
                key={`${project.id}-${index}`}
                type="button"
                className="updates__card"
                tabIndex={duplicate ? -1 : undefined}
                aria-hidden={duplicate || undefined}
                onClick={() => onOpen(project)}
              >
                <span className="updates__art">
                  <ProjectArt project={project} className="updates__art-inner" />
                  <span className="pill-label updates__tag">{tag}</span>
                </span>

                <span className="updates__body">
                  <span className="updates__date">{date}</span>
                  <span className="updates__title">{project.title}</span>
                  <span className="updates__cta">
                    {copy.projects.readCase}
                    <ArrowRight size={16} strokeWidth={2} />
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="updates__controls">
        <button
          type="button"
          className="updates__toggle"
          aria-label={playing ? copy.ui.pause : copy.ui.play}
          aria-pressed={!playing}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? (
            <Pause size={16} strokeWidth={2} />
          ) : (
            <Play size={16} strokeWidth={2} />
          )}
        </button>
      </div>
    </section>
  )
}
