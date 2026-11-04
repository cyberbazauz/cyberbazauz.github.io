import { PROFILE } from '../data/profile'
import { Reveal, SectionLabel } from '../components/Primitives'
import { useI18n } from '../i18n/provider'

export function About() {
  const { t, messages } = useI18n()

  const facts = [
    { k: t('about.factName'), v: PROFILE.name.toLowerCase() },
    { k: t('about.factRole'), v: PROFILE.roles.join(' / ') },
    { k: t('about.factFocus'), v: messages.about.disciplines.join(' / ') },
    { k: t('about.factLocation'), v: t('app.location') },
    { k: t('about.factTimezone'), v: PROFILE.timezone },
    { k: t('about.factStatus'), v: t('app.statusOpen') },
  ]

  return (
    <section id="about" className="section" aria-label={t('about.aria')}>
      <SectionLabel index="03" title={t('nav.about')} />

      <div className="about-grid">
        <div>
          <dl className="about-facts">
            {facts.map((fact) => (
              <div className="about-fact" key={fact.k}>
                <dt>{fact.k}</dt>
                <dd>{fact.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <Reveal>
            <p className="about-manifesto">
              {t('about.manifestoPre')}
              <em>{t('about.manifestoEm1')}</em>
              {t('about.manifestoMid')}
              <em>{t('about.manifestoEm2')}</em>
              {t('about.manifestoPost')}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="about-disciplines">
              {messages.about.disciplines.map((discipline, i) => (
                <div className="about-discipline" key={discipline}>
                  <span className="d-num">0{i + 1}</span>
                  <span className="d-name">{discipline}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="identity" aria-label={t('about.identityAria')}>
              <div className="identity-grid">
                <div className="identity-mark">
                  {PROFILE.mark.split('/')[0]}<i>/</i>{PROFILE.mark.split('/')[1] || 'M'}
                </div>
                <div className="identity-fields">
                  <div className="identity-field">
                    <span className="k">{t('about.identitySystem')}</span>
                    <span className="v">{t('about.identitySystemValue')}</span>
                  </div>
                  <div className="identity-field">
                    <span className="k">{t('about.identityState')}</span>
                    <span className="v" style={{ color: 'var(--success)' }}>
                      {t('about.identityStateValue')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}