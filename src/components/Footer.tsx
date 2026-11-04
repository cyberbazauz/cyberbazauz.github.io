import { PROFILE } from '../data/profile'
import { prefersReducedMotion } from '../hooks/useMediaQuery'
import { useI18n } from '../i18n/provider'

export function Footer() {
  const { t } = useI18n()

  const goTop = () =>
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })

  return (
    <footer className="footer">
      <span className="footer-note">
        © {PROFILE.year} <b>{PROFILE.mark}</b> — {t('footer.note')}
      </span>
      <div className="footer-links">
        <a href={PROFILE.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={PROFILE.telegram} target="_blank" rel="noreferrer">
          Telegram
        </a>
        <button type="button" className="line-link" onClick={goTop} aria-label={t('app.backToTop')}>
          {t('footer.top')}
        </button>
      </div>
    </footer>
  )
}