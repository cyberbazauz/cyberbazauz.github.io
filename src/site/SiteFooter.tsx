import { ArrowUpRight, CircleArrowUp } from 'lucide-react'
import { PROFILE } from '../data/profile'
import { useSiteCopy } from './content'

export function SiteFooter() {
  const copy = useSiteCopy()
  const year = new Date().getFullYear()

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  return (
    <footer className="site-footer">
      <div className="footer__wordmark" aria-hidden="true">
        <span>{copy.brand.name}</span>
      </div>

      <div className="footer__content footer__inner">
        <div className="footer__top">
          <div className="footer__brand reveal">
            <a href="#hero" className="brand brand--footer" aria-label={copy.brand.name}>
              <span className="brand__mark" aria-hidden="true">
                {copy.brand.mark}
              </span>
              <span className="brand__name">{copy.brand.name}</span>
            </a>
            <p className="footer__blurb">{copy.footer.blurb}</p>
            <a href="#contact" className="btn-primary footer__cta">
              {copy.footer.cta}
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </a>
          </div>

          <div className="footer__cols">
            <div className="footer__col reveal" style={{ animationDelay: '0.08s' }}>
              <p className="footer__label">{copy.footer.sections}</p>
              <ul>
                <li>
                  <a href="#about">{copy.nav.about}</a>
                </li>
                <li>
                  <a href="#projects">{copy.nav.projects}</a>
                </li>
                <li>
                  <a href="#impact">{copy.nav.impact}</a>
                </li>
                <li>
                  <a href="#contact">{copy.nav.contact}</a>
                </li>
              </ul>
            </div>

            <div className="footer__col reveal" style={{ animationDelay: '0.16s' }}>
              <p className="footer__label">{copy.footer.more}</p>
              <ul>
                <li>
                  <a href={PROFILE.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={PROFILE.telegram} target="_blank" rel="noreferrer">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${PROFILE.email}`}>{copy.contact.emailLabel}</a>
                </li>
              </ul>
            </div>

            <div className="footer__col reveal" style={{ animationDelay: '0.24s' }}>
              <p className="footer__label">{copy.footer.contacts}</p>
              <ul>
                <li>
                  <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                </li>
                <li>
                  <span className="footer__status">
                    <i aria-hidden="true" />
                    {copy.contact.availabilityValue}
                  </span>
                </li>
                <li>
                  <span>
                    {PROFILE.location} · {PROFILE.timezone}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {copy.brand.name}. {copy.footer.rights}
          </p>
          <p className="footer__note">{copy.footer.note}</p>
          <button type="button" className="footer__top-button" onClick={backToTop}>
            {copy.ui.backToTop}
            <CircleArrowUp size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </footer>
  )
}
