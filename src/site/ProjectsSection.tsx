import { useState } from 'react'
import { ArrowUpRight, LayoutGrid, Table2 } from 'lucide-react'
import { useLocalizedContent, type LocalizedProject } from '../i18n/content'
import { useSiteCopy } from './content'
import { ProjectArt } from './ProjectArt'
import { cx } from '../lib/utils'

interface ProjectsSectionProps {
  onOpen: (project: LocalizedProject) => void
}

type View = 'cards' | 'table'

export function ProjectsSection({ onOpen }: ProjectsSectionProps) {
  const copy = useSiteCopy()
  const { projects } = useLocalizedContent()
  const [view, setView] = useState<View>('cards')

  const ordered = [...projects].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  )
  const banner = ordered[0]
  const cards = ordered.slice(1, 7)

  return (
    <section id="projects" className="section section--projects">
      <div className="container-x">
        <div className="projects__head">
          <div className="projects__intro reveal">
            <span className="pill-label">{copy.projects.label}</span>
            <h2 className="section-heading">
              {copy.projects.heading} <span>{copy.projects.em}</span>
            </h2>
          </div>
          <div className="projects__aside reveal" style={{ animationDelay: '0.12s' }}>
            <p className="section-sub">{copy.projects.sub}</p>
          </div>
        </div>

        <div className="projects__controls reveal">
          <div className="segmented" role="group" aria-label={copy.projects.label}>
            <button
              type="button"
              className={cx('segmented__option', view === 'cards' && 'is-active')}
              aria-pressed={view === 'cards'}
              onClick={() => setView('cards')}
            >
              <LayoutGrid size={14} strokeWidth={1.8} />
              {copy.projects.cards}
            </button>
            <button
              type="button"
              className={cx('segmented__option', view === 'table' && 'is-active')}
              aria-pressed={view === 'table'}
              onClick={() => setView('table')}
            >
              <Table2 size={14} strokeWidth={1.8} />
              {copy.projects.table}
            </button>
          </div>
        </div>

        {view === 'cards' ? (
          <div className="projects__grid">
            {cards.slice(0, 3).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={onOpen}
              />
            ))}
            <ProjectFeature project={banner} onOpen={onOpen} />
            {cards.slice(3).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index + 3}
                onOpen={onOpen}
              />
            ))}
          </div>
        ) : (
          <div className="projects__table-wrap reveal">
            <table className="projects-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{copy.projects.columns.project}</th>
                  <th scope="col">{copy.projects.columns.year}</th>
                  <th scope="col">{copy.projects.columns.field}</th>
                  <th scope="col">{copy.projects.columns.stack}</th>
                  <th scope="col">{copy.projects.columns.status}</th>
                  <th scope="col">
                    <span className="sr-only">{copy.projects.columns.open}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={project.id}
                    tabIndex={0}
                    onClick={() => onOpen(project)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onOpen(project)
                      }
                    }}
                  >
                    <td className="projects-table__index">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <span className="projects-table__title">{project.title}</span>
                      <span className="projects-table__sub">{project.subtitle}</span>
                    </td>
                    <td className="projects-table__mono">{project.meta.year}</td>
                    <td className="projects-table__field">
                      {copy.categories[project.category]}
                    </td>
                    <td>
                      <span className="projects-table__tags">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill">
                        <i aria-hidden="true" />
                        {copy.projects.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="projects-table__open"
                        aria-label={`${copy.projects.columns.open}: ${project.title}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          onOpen(project)
                        }}
                      >
                        <ArrowUpRight size={15} strokeWidth={1.7} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

const shortTag = (tag: string) => {
  const words = tag.split(' ')
  return tag.length > 16 && words.length > 2 ? words.slice(0, 2).join(' ') : tag
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: LocalizedProject
  index: number
  onOpen: (project: LocalizedProject) => void
}) {
  const copy = useSiteCopy()
  const stats = project.case.stats.slice(0, 3)

  return (
    <button
      type="button"
      className="project-card reveal reveal-fade"
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
      onClick={() => onOpen(project)}
    >
      <span className="project-card__art-wrap">
        <ProjectArt project={project} className="project-card__art" />
      </span>

      <span className="project-card__body">
        <span className="project-card__meta">
          <span className="status-pill">
            <i aria-hidden="true" />
            {copy.projects.status}
          </span>
          <span className="project-card__field">{copy.categories[project.category]}</span>
        </span>

        <span className="project-card__title">{project.title}</span>
        <span className="project-card__desc">{project.description}</span>

        <span className="project-card__stats">
          {stats.map((stat) => (
            <span className="project-card__stat" key={`${stat.label}-${stat.value}`}>
              <span className="project-card__stat-value">{stat.value}</span>
              <small className="project-card__stat-label">{stat.label}</small>
            </span>
          ))}
        </span>

        <span className="project-card__footer">
          <span className="project-card__tags">
            {project.case.technology.slice(0, 4).map((tag) => (
              <span key={tag}>{shortTag(tag)}</span>
            ))}
          </span>
          <span className="project-card__cta">
            {copy.projects.readCase}
            <ArrowUpRight size={15} strokeWidth={1.8} />
          </span>
        </span>
      </span>
    </button>
  )
}

function ProjectFeature({
  project,
  onOpen,
}: {
  project: LocalizedProject
  onOpen: (project: LocalizedProject) => void
}) {
  const copy = useSiteCopy()
  const stats = project.case.stats.slice(0, 3)

  return (
    <button
      type="button"
      className="project-featured reveal reveal-fade"
      onClick={() => onOpen(project)}
    >
      <span className="project-featured__bg" aria-hidden="true">
        <span className="hero-beams" />
        <span className="project-featured__wordmark">{project.title.split('-')[0]}</span>
        <span className="hero-grain" />
      </span>

      <span className="project-featured__inner">
        <span className="project-featured__copy">
          <span className="project-featured__meta">
            <span className="status-pill">
              <i aria-hidden="true" />
              {copy.projects.status}
            </span>
            <span className="project-featured__field">
              {copy.categories[project.category]}
            </span>
          </span>
          <span className="project-featured__title">{project.title}</span>
          <span className="project-featured__desc">{project.description}</span>
        </span>

        <span className="project-featured__side">
          <span className="project-featured__stats">
            {stats.map((stat) => (
              <span className="project-featured__stat" key={`${stat.label}-${stat.value}`}>
                <span className="project-featured__stat-value">{stat.value}</span>
                <small className="project-featured__stat-label">{stat.label}</small>
              </span>
            ))}
          </span>

          <span className="project-featured__footer">
            <span className="project-featured__tags">
              {project.case.technology.slice(0, 6).map((tag) => (
                <span key={tag}>{shortTag(tag)}</span>
              ))}
            </span>
            <span className="project-featured__cta">
              {copy.projects.readCase}
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}
