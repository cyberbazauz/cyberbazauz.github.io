import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Check, Copy, ExternalLink, Search } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import type { Project, ProjectCategory } from '../data/projects'
import { cx } from '../lib/utils'
import { SectionLabel, LineReveal, Reveal } from '../components/Primitives'
import { ProjectVisualRenderer } from '../components/visuals/ProjectVisualRenderer'
import { sound } from '../lib/audio'
import { useLocalizedContent } from '../i18n/content'
import { useI18n } from '../i18n/provider'

function GithubIcon({ size = 14, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

interface ProjectRowProps {
  project: Project
  reversed: boolean
  onOpen: (project: Project) => void
}

function ProjectRow({ project, reversed, onOpen }: ProjectRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const figureY = useTransform(scrollYProgress, [0, 1], [46, -46])
  const figureScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96])

  return (
    <article
      ref={ref}
      className={cx('project-row', reversed && 'project-row--rev')}
      data-project={project.id}
    >
      <span className="project-index" aria-hidden="true">
        {project.index}
      </span>

      <div className="project-info">
        <div className="p-meta">
          <span className="mono">
            <b>{project.meta.year}</b> — {project.meta.type}
          </span>
          <span className="mono">{project.meta.role}</span>
        </div>

        <LineReveal text={project.title} className="p-title" />

        <Reveal delay={0.08}>
          <p className="p-sub">{project.subtitle}</p>
        </Reveal>

        <div className="p-tags" aria-label={t('projects.tagsAria')}>
          {project.tags.map((tag) => (
            <span className="p-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <Reveal delay={0.14}>
          <p className="p-desc lede">{project.description}</p>
        </Reveal>

        <div className="p-actions">
          <button
            type="button"
            className="bracket-link"
            data-cursor="view"
            onPointerEnter={() => sound.playHover()}
            onClick={() => {
              sound.playModalOpen()
              onOpen(project)
            }}
            aria-label={t('projects.openCaseAria').replace('{title}', project.title)}
          >
            {t('projects.openCase')}
          </button>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="bracket-link"
              data-cursor="open"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <GithubIcon size={13} />
              <span>GITHUB</span>
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>

      <motion.div className="p-thumb" style={{ y: figureY, scale: figureScale }}>
        <Reveal y={30}>
          <div className="p-thumb-frame">
            <span className="mono p-thumb-tag">
              FIG. {project.index} — {project.title}
            </span>
            <div style={{ padding: '48px 16px 16px' }}>
              <ProjectVisualRenderer visual={project.visual} project={project} />
            </div>
          </div>
        </Reveal>
      </motion.div>
    </article>
  )
}

interface RepoCardProps {
  project: Project
  onOpen: (project: Project) => void
}

function RepoCard({ project, onOpen }: RepoCardProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const copyClone = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!project.github) return
    const cmd = `git clone ${project.github}.git`
    navigator.clipboard.writeText(cmd).then(() => {
      sound.playConfirm()
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="repo-card"
    >
      <div>
        <div className="repo-card-head">
          <span className="repo-card-index mono">#{project.index}</span>
          <span className="repo-card-cat mono">{project.category}</span>
        </div>

        <h3 className="repo-card-title">{project.title}</h3>
        <p className="repo-card-sub">{project.subtitle}</p>
        <p className="repo-card-desc">{project.description}</p>

        <div className="repo-card-tags">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="repo-card-tag mono">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        {project.case.stats && project.case.stats.length > 0 && (
          <div className="repo-card-stats">
            {project.case.stats.slice(0, 3).map((stat) => (
              <div key={stat.label}>
                <div className="repo-card-stat-val">{stat.value}</div>
                <div className="repo-card-stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="repo-card-actions">
          <button
            type="button"
            className="bracket-link"
            onPointerEnter={() => sound.playHover()}
            onClick={() => {
              sound.playModalOpen()
              onOpen(project)
            }}
            style={{ fontSize: 11, padding: '4px 8px' }}
          >
            {t('projects.openCase')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {project.github && (
              <button
                type="button"
                onClick={copyClone}
                className="mono"
                title="Copy git clone"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied ? '#4ade80' : 'var(--muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  padding: '3px 6px',
                  borderRadius: 3,
                  transition: 'color 0.2s',
                }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                <span>{copied ? 'COPIED' : 'CLONE'}</span>
              </button>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="mono"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  color: '#38bdf8',
                  textDecoration: 'none',
                }}
              >
                <GithubIcon size={13} />
                <span>SOURCE</span>
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface WorkProps {
  onOpen: (project: Project) => void
}

export function Work({ onOpen }: WorkProps) {
  const { projects } = useLocalizedContent()
  const { t } = useI18n()
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: { key: ProjectCategory; label: string }[] = useMemo(
    () => [
      { key: 'all', label: 'ALL REPOSITORIES' },
      { key: 'ai-cv', label: 'AI & VISION' },
      { key: 'security', label: 'CYBERSECURITY' },
      { key: 'autonomous', label: 'AUTONOMOUS & 3D' },
      { key: 'web', label: 'PLATFORMS & WEB' },
    ],
    [],
  )

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory
      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchesCategory

      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        p.case.technology.some((tech) => tech.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
  }, [projects, activeCategory, searchQuery])

  // Top featured projects for showcase rows when in default view
  const featuredProjects = useMemo(() => {
    return projects.filter((p) => p.featured)
  }, [projects])

  return (
    <section id="work" className="section" aria-label={t('projects.aria')}>
      <SectionLabel index="01" title={t('projects.sectionTitle')} />

      {/* Catalog Filter & Search Toolbar */}
      <div className="catalog-toolbar">
        <div className="catalog-search-wrap">
          <Search size={16} className="catalog-search-icon" />
          <input
            type="text"
            className="catalog-search-input"
            placeholder="Search all 19 repositories by title, technology (PyTorch, Three.js, YOLO, FastAPI...), or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="catalog-filters">
          {categories.map((cat) => {
            const count =
              cat.key === 'all'
                ? projects.length
                : projects.filter((p) => p.category === cat.key).length
            const isActive = activeCategory === cat.key

            return (
              <button
                key={cat.key}
                type="button"
                className={cx('catalog-filter-btn', isActive && 'is-active')}
                onPointerEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick()
                  setActiveCategory(cat.key)
                }}
              >
                <span>{cat.label}</span>
                <span className="catalog-filter-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* If no search and category is 'all', show featured flagship rows first */}
      {activeCategory === 'all' && !searchQuery.trim() && (
        <div style={{ marginBottom: 60 }}>
          {featuredProjects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              reversed={i % 2 === 1}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}

      {/* Full Repository Matrix Grid */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {activeCategory === 'all' && !searchQuery.trim()
              ? 'COMPLETE REPOSITORY ARCHIVE // ALL 19 OPEN-SOURCE PROJECTS'
              : `MATCHING REPOSITORIES (${filteredProjects.length})`}
          </span>
          <span className="mono" style={{ fontSize: 11, color: '#00f0ff' }}>
            GITHUB.COM/CYBERBAZAUZ
          </span>
        </div>

        <div className="repo-matrix">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <RepoCard key={project.id} project={project} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="hair" style={{ marginTop: 60 }} />
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <a className="mono line-link" href="#experiments" style={{ color: 'var(--fg)' }}>
          {t('projects.next')}
          <ArrowUpRight size={12} strokeWidth={1.5} style={{ display: 'inline', verticalAlign: '-1px' }} />
        </a>
      </div>
    </section>
  )
}