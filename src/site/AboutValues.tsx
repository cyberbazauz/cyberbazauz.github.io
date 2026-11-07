import { Layers, Shield, Target, Zap } from 'lucide-react'
import { useSiteCopy } from './content'

const ICONS = [Zap, Layers, Target, Shield] as const

export function AboutValues() {
  const copy = useSiteCopy()

  return (
    <section id="about" className="section section--about">
      <div className="container-x">
        <div className="about__center">
          <div className="about__head reveal">
            <span className="pill-label">{copy.about.label}</span>
            <h2 className="section-heading about__heading">
              {copy.about.heading} <span>{copy.about.em}</span>
            </h2>
          </div>
          <p className="section-sub about__sub reveal" style={{ animationDelay: '0.1s' }}>
            {copy.about.sub}
          </p>
        </div>

        <div className="about__grid">
          {copy.about.values.map((value, index) => {
            const Icon = ICONS[index] ?? Zap
            return (
              <article
                key={value.title}
                className="about__value reveal"
                style={{ animationDelay: `${index * 0.09}s` }}
              >
                <span className="icon-circle">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
