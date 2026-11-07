import { useState } from 'react'
import { useSiteCopy } from './content'
import { cx } from '../lib/utils'

export function FaqSection() {
  const copy = useSiteCopy()
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section section--faq">
      <div className="container-x">
        <div className="faq__grid">
          <div className="faq__aside reveal">
            <span className="pill-label">{copy.faq.label}</span>
            <h2 className="section-heading">
              {copy.faq.heading} <span>{copy.faq.em}</span>
            </h2>
            <p className="section-sub">{copy.faq.sub}</p>
            <a href="#contact" className="btn-soft faq__cta">
              {copy.faq.cta}
            </a>
          </div>

          <div className="faq__list reveal" style={{ animationDelay: '0.12s' }}>
            {copy.faq.items.map((item, index) => {
              const expanded = open === index
              return (
                <div key={item.q} className={cx('faq__item', expanded && 'is-open')}>
                  <h3 className="faq__question">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-trigger-${index}`}
                      className="faq__trigger"
                      onClick={() => setOpen(expanded ? -1 : index)}
                    >
                      <span>{item.q}</span>
                      <span className="faq__plus" aria-hidden="true">
                        +
                      </span>
                    </button>
                  </h3>
                  <div
                    className={cx('faq__panel', expanded && 'is-open')}
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                  >
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
