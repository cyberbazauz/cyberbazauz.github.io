import { ArrowUpRight } from 'lucide-react'
import { useLocalizedContent } from '../i18n/content'
import { useSiteCopy } from './content'

export function JourneySection() {
  const copy = useSiteCopy()
  const { timeline } = useLocalizedContent()

  return (
    <section id="journey" className="section section--muted section--journey">
      <div className="container-x">
        <div className="journey__grid">
          <div className="journey__aside reveal">
            <span className="pill-label">{copy.journey.label}</span>
            <h2 className="section-heading">
              {copy.journey.heading} <span>{copy.journey.em}</span>
            </h2>
            <p className="section-sub">{copy.journey.sub}</p>
            <a href="#contact" className="btn-soft journey__cta">
              {copy.ui.talk}
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </a>
          </div>

          <ol className="journey__list">
            {timeline.map((entry, index) => {
              const current = index === timeline.length - 1
              return (
                <li
                  key={`${entry.year}-${entry.title}`}
                  className={`journey__item reveal${current ? ' is-current' : ''}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <span className="journey__year">{entry.year}</span>
                  <div className="journey__body">
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                  <span className="journey__marker" aria-hidden="true">
                    <i />
                  </span>
                  <span className="journey__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
