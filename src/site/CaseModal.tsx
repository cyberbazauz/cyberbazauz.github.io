import { useEffect, useRef } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import type { LocalizedProject } from '../i18n/content'
import { useSiteCopy } from './content'

interface CaseModalProps {
  project: LocalizedProject | null
  onClose: () => void
}

export function CaseModal({ project, onClose }: CaseModalProps) {
  const copy = useSiteCopy()
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!project) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  if (!project) return null

  const wordmark = project.title.split(/[\s-]/)[0]?.toUpperCase() ?? project.title

  return (
    <div
      className="case-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
      onClick={onClose}
    >
      <div className="case-modal__panel" onClick={(event) => event.stopPropagation()}>
        <div className="case-modal__hero">
          <div className="case-modal__fx" aria-hidden="true">
            <div className="hero-beams" />
            <span className="case-modal__wordmark">{wordmark}</span>
            <div className="hero-grain" />
          </div>

          <button
            type="button"
            className="case-modal__close"
            aria-label={copy.modal.close}
            onClick={onClose}
            ref={closeRef}
          >
            <X size={18} strokeWidth={1.7} />
          </button>

          <div className="case-modal__hero-copy">
            <div className="case-modal__meta">
              <span className="status-pill">
                <i aria-hidden="true" />
                {copy.projects.status}
              </span>
              <span>
                {copy.modal.label} · {copy.categories[project.category]}
              </span>
            </div>
            <h2 id="case-modal-title">{project.title}</h2>
            <p>{project.subtitle}</p>
            <div className="case-modal__tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="case-modal__body">
          <div className="case-modal__stats">
            {project.case.stats.map((stat) => (
              <div key={`${stat.label}-${stat.value}`}>
                <span>{stat.value}</span>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>

          <div className="case-modal__sections">
            <article>
              <h3>{copy.modal.overview}</h3>
              <p>{project.case.overview}</p>
            </article>
            <article>
              <h3>{copy.modal.challenge}</h3>
              <p>{project.case.challenge}</p>
            </article>
            <article>
              <h3>{copy.modal.solution}</h3>
              <p>{project.case.solution}</p>
            </article>
            <article>
              <h3>{copy.modal.result}</h3>
              <p>{project.case.result}</p>
            </article>
          </div>

          <div className="case-modal__tech">
            <h3>{copy.modal.stack}</h3>
            <div>
              {project.case.technology.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>

          {project.github || project.demo ? (
            <div className="case-modal__links">
              <h3>{copy.modal.links}</h3>
              <div>
                {project.github ? (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    {copy.modal.github}
                    <ArrowUpRight size={14} strokeWidth={1.8} />
                  </a>
                ) : null}
                {project.demo ? (
                  <a href={project.demo} target="_blank" rel="noreferrer">
                    {copy.modal.demo}
                    <ArrowUpRight size={14} strokeWidth={1.8} />
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
