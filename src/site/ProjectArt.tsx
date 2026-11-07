import { useId } from 'react'
import type { Project, VisualKey } from '../data/projects'
import { cx } from '../lib/utils'

interface ProjectArtProps {
  project: Pick<Project, 'visual' | 'category' | 'title'>
  className?: string
}

const DARK: readonly VisualKey[] = [
  'sputnik',
  'passiveagent',
  'shieldx',
  'firedetect',
  'cyber',
  'smarttraffic',
]

/**
 * Hand-built abstract previews for the case cards. Lightweight inline SVG so
 * every card gets a distinct identity without shipping screenshots.
 */
export function ProjectArt({ project, className }: ProjectArtProps) {
  const raw = useId()
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '')
  const dark = DARK.includes(project.visual)

  return (
    <div
      className={cx(
        'project-art',
        dark ? 'project-art--dark' : 'project-art--light',
        `project-art--${project.visual}`,
        className,
      )}
      aria-hidden="true"
    >
      {renderArt(project.visual, project.category, uid)}
      <span className="project-art__grain" />
    </div>
  )
}

function renderArt(visual: VisualKey, category: string, uid: string) {
  switch (visual) {
    case 'sputnik':
      return <Orbital uid={uid} />
    case 'passiveagent':
    case 'shieldx':
      return <ThreatMap uid={uid} />
    case 'examguard':
    case 'wiutcv':
      return <FaceScan uid={uid} />
    case 'medvision':
      return <MedScan uid={uid} />
    case 'firedetect':
      return <Thermal uid={uid} />
    case 'antifake':
      return <Adversarial />
    case 'yotoqhonam':
    case 'hizmattop':
      return <Dashboard />
    default:
      return category === 'security' ? <ThreatMap uid={uid} /> : <GridField uid={uid} />
  }
}

function ArtFrame({ label, right }: { label: string; right: string }) {
  return (
    <>
      <span className="project-art__label">{label}</span>
      <span className="project-art__right">{right}</span>
    </>
  )
}

function Orbital({ uid }: { uid: string }) {
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`${uid}-glow`} cx="52%" cy="54%" r="52%">
            <stop offset="0" stopColor="#8ea2ff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#8ea2ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="190" fill="#0b0d14" />
        <circle cx="208" cy="101" r="86" fill={`url(#${uid}-glow)`} />
        {[
          [214, 98, 118, 52, -16],
          [214, 98, 86, 34, 22],
          [214, 98, 58, 22, -38],
        ].map(([cx, cy, rx, ry, rotate], index) => (
          <ellipse
            key={index}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            fill="none"
            stroke="rgba(255,255,255,.19)"
            strokeWidth="0.8"
            strokeDasharray={index === 0 ? '3 5' : undefined}
          />
        ))}
        <circle cx="214" cy="98" r="15" fill="#171b28" stroke="rgba(255,255,255,.28)" />
        <circle cx="214" cy="98" r="7" fill="#c7d2ff" opacity=".85" />
        <circle cx="302" cy="58" r="3.6" fill="#fff" />
        <circle cx="139" cy="128" r="2.6" fill="#aebdff" />
        <circle cx="288" cy="139" r="2" fill="#fff" opacity=".7" />
        {[
          [54, 44],
          [342, 33],
          [367, 131],
          [86, 160],
          [176, 27],
          [251, 168],
        ].map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="1.3" fill="rgba(255,255,255,.55)" />
        ))}
      </svg>
      <ArtFrame label="ORBITAL / DIGITAL TWIN" right="LEO · 540 KM" />
    </>
  )
}

function ThreatMap({ uid }: { uid: string }) {
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#10b981" stopOpacity=".22" />
            <stop offset="1" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="190" fill="#0c0d0f" />
        <path
          d="M0 0h400v190H0z"
          fill="none"
          stroke="rgba(255,255,255,.05)"
          strokeWidth="1"
        />
        {Array.from({ length: 9 }, (_, index) => (
          <line
            key={`v${index}`}
            x1={index * 50}
            y1="0"
            x2={index * 50}
            y2="190"
            stroke="rgba(255,255,255,.045)"
          />
        ))}
        {Array.from({ length: 5 }, (_, index) => (
          <line
            key={`h${index}`}
            x1="0"
            y1={index * 48}
            x2="400"
            y2={index * 48}
            stroke="rgba(255,255,255,.045)"
          />
        ))}
        <path
          d="M197 34 249 52v42c0 30-21 47-52 58-31-11-52-28-52-58V52l52-18Z"
          fill={`url(#${uid}-fade)`}
          stroke="rgba(16,185,129,.7)"
          strokeWidth="1.2"
        />
        <path
          d="m181 93 11 11 26-28"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="197" cy="96" r="46" fill="none" stroke="rgba(16,185,129,.18)">
          <animate attributeName="r" values="38;58;38" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".5;0;.5" dur="5s" repeatCount="indefinite" />
        </circle>
        {[
          [66, 54],
          [323, 71],
          [296, 142],
          [81, 137],
        ].map(([x, y], index) => (
          <g key={index}>
            <circle cx={x} cy={y} r="2.5" fill="#10b981" />
            <circle cx={x} cy={y} r="8" fill="none" stroke="rgba(16,185,129,.3)" />
          </g>
        ))}
      </svg>
      <ArtFrame label="THREAT / ANALYSIS" right="LIVE · 24/7" />
    </>
  )
}

function FaceScan({ uid }: { uid: string }) {
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="190" fill="#f7f8fb" />
        <g stroke="rgba(17,24,39,.06)" strokeWidth="1">
          {Array.from({ length: 8 }, (_, index) => (
            <line key={index} x1={index * 55} y1="0" x2={index * 55} y2="190" />
          ))}
        </g>
        {[
          [146, 56, 1, 1],
          [254, 56, -1, 1],
          [146, 134, 1, -1],
          [254, 134, -1, -1],
        ].map(([x, y, sx, sy], index) => (
          <path
            key={index}
            d={`M${x} ${y + sy * 14}V${y}h${sx * 14}`}
            fill="none"
            stroke="#111827"
            strokeWidth="1.4"
          />
        ))}
        <g fill="none" stroke="rgba(17,24,39,.5)" strokeWidth="1.1">
          <path d="M182 146c-9-13-13-27-13-43 0-24 14-39 31-39s31 15 31 39c0 16-4 30-13 43" />
          <path d="M186 92c4-4 9-6 14-6s10 2 14 6" />
          <path d="M189 111h.5M211 111h.5" strokeWidth="3" strokeLinecap="round" />
          <path d="M200 112v17l-6 6h12" />
          <path d="M192 143c5 3 11 3 16 0" />
        </g>
        <path
          d={`M130 114h140`}
          stroke={`url(#${uid}-scan)`}
          strokeWidth="28"
          opacity=".32"
        />
        <defs>
          <linearGradient id={`${uid}-scan`} x1="0" x2="1">
            <stop offset="0" stopColor="#10b981" stopOpacity="0" />
            <stop offset=".5" stopColor="#10b981" />
            <stop offset="1" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="#111827" fontFamily="monospace" fontSize="7" opacity=".55">
          <text x="24" y="26">IDENTITY / VERIFIED</text>
          <text x="300" y="176">98.7%</text>
        </g>
      </svg>
      <ArtFrame label="VISION / IDENTITY" right="REAL-TIME" />
    </>
  )
}

function MedScan({ uid }: { uid: string }) {
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${uid}-med`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dbeafe" />
            <stop offset="1" stopColor="#f8fafc" />
          </linearGradient>
        </defs>
        <rect width="400" height="190" fill={`url(#${uid}-med)`} />
        <g fill="none" stroke="rgba(30,64,175,.22)" strokeWidth="1">
          <path d="M158 64c0-16 19-26 42-26s42 10 42 26c0 15-7 24-7 42 0 26-11 42-35 42s-35-16-35-42c0-18-7-27-7-42Z" />
          <path d="M176 82c8-6 40-6 48 0M176 82c0 26 4 44 24 44s24-18 24-44" />
          <path d="M200 94v32M168 118c8-8 16-10 32-10M232 118c-8-8-16-10-32-10" />
        </g>
        <g fill="rgba(37,99,235,.5)">
          {Array.from({ length: 22 }, (_, index) => (
            <circle
              key={index}
              cx={160 + ((index * 37) % 82)}
              cy={60 + ((index * 53) % 78)}
              r="1.1"
            />
          ))}
        </g>
        <rect
          x="188"
          y="33"
          width="24"
          height="24"
          rx="4"
          fill="rgba(37,99,235,.08)"
          stroke="rgba(37,99,235,.5)"
          strokeWidth="1"
        />
        <path d="M194 45h12M200 39v12" stroke="#2563eb" strokeWidth="1.2" />
      </svg>
      <ArtFrame label="MEDICAL / EDGE AI" right="INFERENCE · 16 MS" />
    </>
  )
}

function Thermal({ uid }: { uid: string }) {
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`${uid}-heat`} cx="50%" cy="58%" r="55%">
            <stop offset="0" stopColor="#f97316" stopOpacity=".95" />
            <stop offset=".35" stopColor="#ef4444" stopOpacity=".6" />
            <stop offset=".7" stopColor="#7c2d12" stopOpacity=".28" />
            <stop offset="1" stopColor="#0b0c0e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="190" fill="#0a0b0d" />
        <ellipse cx="214" cy="112" rx="112" ry="76" fill={`url(#${uid}-heat)`} />
        <path
          d="M150 128c14-19 24-41 48-45 17-3 28 12 33 26 6 16 19 22 33 31-21 12-45 18-72 17-17-1-30-11-42-29Z"
          fill="rgba(251,146,60,.55)"
          stroke="rgba(254,215,170,.65)"
          strokeWidth="1"
        />
        <g stroke="rgba(255,255,255,.22)" strokeWidth="1">
          <path d="M0 95h400M200 0v190" />
        </g>
        <rect
          x="160"
          y="73"
          width="104"
          height="78"
          fill="none"
          stroke="#f97316"
          strokeWidth="1.2"
          strokeDasharray="5 4"
        />
        <g fill="#fed7aa" fontFamily="monospace" fontSize="7">
          <text x="160" y="67">FIRE · 0.94</text>
          <text x="24" y="176">THERMAL / DRONE FEED</text>
        </g>
      </svg>
      <ArtFrame label="EDGE / DETECTION" right="FRAME · 24 MS" />
    </>
  )
}

function Adversarial() {
  const random = (index: number) => {
    const seed = Math.sin(index * 78.233 + 12.4) * 43758.5453
    return seed - Math.floor(seed)
  }
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="190" fill="#f6f7fa" />
        <g>
          {Array.from({ length: 160 }, (_, index) => {
            const x = 128 + (index % 16) * 9
            const y = 35 + Math.floor(index / 16) * 9
            const value = random(index)
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="8"
                height="8"
                fill={
                  value > 0.72
                    ? 'rgba(17,24,39,.8)'
                    : value > 0.45
                      ? 'rgba(17,24,39,.32)'
                      : 'rgba(17,24,39,.08)'
                }
              />
            )
          })}
        </g>
        <rect
          x="126"
          y="33"
          width="147"
          height="93"
          fill="none"
          stroke="#111827"
          strokeWidth="1"
        />
        <g stroke="#ef4444" strokeWidth="1.2">
          <path d="M285 50h28M285 66h20M285 82h26M285 98h14" />
        </g>
        <g fill="#111827" fontFamily="monospace" fontSize="7" opacity=".6">
          <text x="24" y="30">ADVERSARIAL / PERTURBATION</text>
          <text x="24" y="172">MODEL OUTPUT: UNSTABLE</text>
        </g>
        <circle cx="335" cy="134" r="22" fill="none" stroke="rgba(239,68,68,.4)" />
        <path d="m327 126 16 16m0-16-16 16" stroke="#ef4444" strokeWidth="1.4" />
      </svg>
      <ArtFrame label="RESEARCH / ROBUSTNESS" right="L∞ · 0.03" />
    </>
  )
}

function Dashboard() {
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="190" fill="#f7f8fa" />
        <rect x="42" y="24" width="316" height="142" rx="12" fill="#fff" stroke="rgba(17,24,39,.08)" />
        <rect x="54" y="36" width="60" height="6" rx="3" fill="rgba(17,24,39,.5)" />
        <rect x="54" y="48" width="36" height="4" rx="2" fill="rgba(17,24,39,.18)" />
        <g>
          {[34, 58, 41, 72, 52, 84, 63].map((height, index) => (
            <rect
              key={index}
              x={58 + index * 31}
              y={122 - height}
              width="17"
              height={height}
              rx="4"
              fill={index === 5 ? '#111827' : 'rgba(17,24,39,.12)'}
            />
          ))}
        </g>
        <rect x="58" y="132" width="206" height="1" fill="rgba(17,24,39,.1)" />
        <g>
          {[0, 1, 2].map((index) => (
            <g key={index}>
              <rect
                x="282"
                y={72 + index * 26}
                width="62"
                height="18"
                rx="5"
                fill={index === 0 ? 'rgba(16,185,129,.1)' : 'rgba(17,24,39,.05)'}
              />
              <rect
                x="289"
                y={78 + index * 26}
                width="22"
                height="3"
                rx="1.5"
                fill={index === 0 ? '#10b981' : 'rgba(17,24,39,.28)'}
              />
              <rect
                x="316"
                y={78 + index * 26}
                width="20"
                height="3"
                rx="1.5"
                fill="rgba(17,24,39,.14)"
              />
            </g>
          ))}
        </g>
        <circle cx="322" cy="43" r="4" fill="#10b981" />
      </svg>
      <ArtFrame label="PLATFORM / OPERATIONS" right="LIVE DATA" />
    </>
  )
}

function GridField({ uid }: { uid: string }) {
  return (
    <>
      <svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${uid}-grid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fafafa" />
            <stop offset="1" stopColor="#f2f2f5" />
          </linearGradient>
        </defs>
        <rect width="400" height="190" fill={`url(#${uid}-grid)`} />
        {Array.from({ length: 9 }, (_, index) => (
          <line
            key={`v${index}`}
            x1={index * 50}
            y1="0"
            x2={index * 50}
            y2="190"
            stroke="rgba(17,24,39,.05)"
          />
        ))}
        {Array.from({ length: 5 }, (_, index) => (
          <line
            key={`h${index}`}
            x1="0"
            y1={index * 48}
            x2="400"
            y2={index * 48}
            stroke="rgba(17,24,39,.05)"
          />
        ))}
        <circle cx="200" cy="96" r="56" fill="none" stroke="rgba(17,24,39,.2)" />
        <circle cx="200" cy="96" r="34" fill="none" stroke="rgba(17,24,39,.14)" />
        <circle cx="200" cy="96" r="5" fill="#111827" />
        <path
          d="M200 96 264 60M200 96 136 132M200 96 252 146"
          stroke="rgba(17,24,39,.25)"
          strokeWidth="1"
        />
        {[
          [264, 60],
          [136, 132],
          [252, 146],
        ].map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="3.5" fill="#10b981" />
        ))}
        <rect x="24" y="24" width="10" height="10" fill="#111827" />
        <rect x="366" y="156" width="10" height="10" fill="rgba(17,24,39,.16)" />
      </svg>
      <ArtFrame label="SYSTEM / PREVIEW" right="BUILD · 2026" />
    </>
  )
}
