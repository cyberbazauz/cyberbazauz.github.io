import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, ExternalLink, GitBranch, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { ProjectVisualRenderer } from './visuals/ProjectVisualRenderer'
import { sound } from '../lib/audio'
import { useI18n } from '../i18n/provider'

function GithubIcon({ size = 14, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const EASE = [0.22, 1, 0.36, 1] as const

interface ProjectOverlayProps {
  project: Project | null
  onClose: () => void
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!project) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  const copyCloneCommand = () => {
    if (!project?.github) return
    const cmd = `git clone ${project.github}.git`
    navigator.clipboard.writeText(cmd).then(() => {
      sound.playConfirm()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="case-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t('projects.openCaseAria').replace('{title}', project.title)}
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="case-bar">
            <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#00f0ff' }}>●</span>
              {t('projects.caseLabel')} {project.index} — {project.meta.type}
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ textTransform: 'uppercase', fontSize: 10, opacity: 0.7 }}>
                {project.category}
              </span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className="case-close"
              onClick={() => {
                sound.playClick()
                onClose()
              }}
            >
              {t('app.close')}
              <X size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="case-inner">
            <header className="case-head">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <span className="mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {project.meta.year} / {project.meta.role}
                </span>
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
                      padding: '4px 10px',
                      borderRadius: 100,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#38bdf8',
                      textDecoration: 'none',
                    }}
                  >
                    <GithubIcon size={12} />
                    <span>cyberbazauz/{project.id}</span>
                    <ExternalLink size={10} style={{ opacity: 0.7 }} />
                  </a>
                )}
              </div>

              <motion.h3
                className="case-title"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              >
                {project.title}
              </motion.h3>

              <p className="case-sub">{project.subtitle}</p>

              <div className="p-tags" style={{ marginTop: 18 }}>
                {project.tags.map((tag) => (
                  <span className="p-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Visual Interactive Mockup */}
            <div className="case-visual">
              <ProjectVisualRenderer visual={project.visual} project={project} />
            </div>

            {/* Stats Metrics Grid */}
            <div className="case-stats">
              {project.case.stats.map((stat) => (
                <div className="case-stat" key={stat.label}>
                  <div className="case-stat__value">{stat.value}</div>
                  <div className="case-stat__label mono">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Structured 4-Block Breakdown */}
            <div className="case-grid">
              <div className="case-block">
                <h4>{t('projects.fieldOverview')}</h4>
                <p>{project.case.overview}</p>
              </div>
              <div className="case-block">
                <h4>{t('projects.fieldChallenge')}</h4>
                <p>{project.case.challenge}</p>
              </div>
              <div className="case-block">
                <h4>{t('projects.fieldSolution')}</h4>
                <p>{project.case.solution}</p>
              </div>
              <div className="case-block">
                <h4>{t('projects.fieldResult')}</h4>
                <p>{project.case.result}</p>
              </div>
            </div>

            {/* Technology Stack Tags */}
            <ul className="case-tech" aria-label={t('projects.technologyAria')}>
              {project.case.technology.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>

            {/* Git Clone Box & External Action Links */}
            <div
              style={{
                marginTop: 28,
                padding: '16px 20px',
                borderRadius: 8,
                background: 'rgba(10, 12, 18, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {project.github && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12 }} className="mono">
                    <GitBranch size={13} style={{ color: '#00f0ff' }} />
                    <span>git clone {project.github}.git</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyCloneCommand}
                    className="bracket-link"
                    style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {copied ? <Check size={12} style={{ color: '#4ade80' }} /> : <Copy size={12} />}
                    <span>{copied ? 'COPIED' : 'COPY CLONE CMD'}</span>
                  </button>
                </div>
              )}

              <div className="case-links" style={{ marginTop: 0 }}>
                {project.github && (
                  <a
                    className="bracket-link"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="open"
                    style={{ background: 'rgba(0, 240, 255, 0.08)', borderColor: 'rgba(0, 240, 255, 0.35)' }}
                  >
                    <GithubIcon size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                    {t('projects.sourceCode')}
                    <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" style={{ display: 'inline', marginLeft: 4 }} />
                  </a>
                )}
                {project.demo && (
                  <a
                    className="bracket-link"
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="open"
                    style={{ background: 'rgba(253, 230, 138, 0.1)', borderColor: 'rgba(253, 230, 138, 0.4)' }}
                  >
                    {t('projects.liveDemo')}
                    <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" style={{ display: 'inline', marginLeft: 4 }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}