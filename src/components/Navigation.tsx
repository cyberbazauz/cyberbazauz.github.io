import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Globe, Volume2, VolumeX, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PROFILE } from '../data/profile'
import { cx } from '../lib/utils'
import { sound } from '../lib/audio'
import { prefersReducedMotion } from '../hooks/useMediaQuery'
import { LANGS } from '../i18n'
import { useLocalizedContent } from '../i18n/content'
import { useI18n } from '../i18n/provider'

const EASE = [0.22, 1, 0.36, 1] as const

function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event: PointerEvent) => {
      if (popRef.current && !popRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onMenuKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = Array.from(popRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="menuitemradio"]',
    ) ?? [])
    if (items.length === 0) return
    const idx = items.indexOf(document.activeElement as HTMLButtonElement)
    const next = event.key === 'ArrowDown' ? idx + 1 : idx - 1
    const target = items[(next + items.length) % items.length]
    target?.focus()
  }

  const ariaLabel = t('language.aria')

  return (
    <>
      <div
        className="lang-switch lang-switch--inline"
        data-cursor="language"
        role="group"
        aria-label={ariaLabel}
      >
        {LANGS.map((meta) => (
          <button
            key={meta.code}
            type="button"
            className={cx(lang === meta.code && 'is-active')}
            aria-pressed={lang === meta.code}
            aria-label={meta.full}
            onClick={() => {
              sound.playClick()
              setLang(meta.code)
            }}
          >
            {meta.label}
          </button>
        ))}
      </div>

      <div className="lang-switch lang-switch--pop" ref={popRef} onKeyDown={onMenuKey}>
        <button
          type="button"
          className="lang-trigger"
          aria-label={ariaLabel}
          aria-haspopup="true"
          aria-expanded={open}
          data-cursor="language"
          onClick={() => setOpen((value) => !value)}
        >
          <Globe size={11} strokeWidth={1.5} aria-hidden="true" />
          {LANGS.find((meta) => meta.code === lang)?.label}
          <ChevronDown className="chev" size={10} strokeWidth={1.5} aria-hidden="true" />
        </button>
        {open && (
          <div className="lang-menu" role="menu" aria-label={ariaLabel}>
            {LANGS.map((meta) => (
              <button
                key={meta.code}
                type="button"
                role="menuitemradio"
                aria-checked={lang === meta.code}
                className={cx(lang === meta.code && 'is-active')}
                onClick={() => {
                  sound.playClick()
                  setLang(meta.code)
                  setOpen(false)
                }}
              >
                <span>{meta.full}</span>
                <span className="mono">{meta.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function AudioToggle() {
  const [active, setActive] = useState(() => sound.isEnabled())

  const onToggle = () => {
    const next = sound.toggle()
    setActive(next)
  }

  return (
    <button
      type="button"
      className={cx('audio-toggle mono', active && 'is-active')}
      onClick={onToggle}
      title={active ? 'Mute procedural cyber audio' : 'Enable procedural cyber audio'}
      aria-label="Toggle procedural cyber audio"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        borderRadius: 100,
        background: active ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
        border: active ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--line)',
        color: active ? '#00f0ff' : 'var(--muted)',
        fontSize: 10,
        letterSpacing: '0.12em',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {active ? <Volume2 size={12} /> : <VolumeX size={12} style={{ opacity: 0.6 }} />}
      <span>{active ? 'SND: ON' : 'SND: OFF'}</span>
    </button>
  )
}

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { t, messages } = useI18n()
  const { menuItems } = useLocalizedContent()

  const socials = useMemo(
    () => [
      { label: 'GitHub', href: PROFILE.github },
      { label: 'Telegram', href: PROFILE.telegram },
      { label: 'LinkedIn', href: PROFILE.linkedin },
      { label: messages.socials.email, href: `mailto:${PROFILE.email}` },
    ],
    [messages.socials.email],
  )

  const close = useCallback(() => setOpen(false), [])

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }, [])

  const goTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 32)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const firstLink = menuRef.current?.querySelector<HTMLElement>('a, button')
    firstLink?.focus({ preventScroll: true })

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className={cx('header', scrolled && 'is-scrolled', open && 'is-open')}>
        <button
          type="button"
          className="brand"
          aria-label={t('app.backToTop')}
          onClick={() => (open ? close() : goTop())}
        >
          {PROFILE.mark.split('/')[0]}<i>/</i>{PROFILE.mark.split('/')[1] || 'M'}
        </button>

        <span className="header-center" aria-hidden="true">
          {t('app.headerCenter')}
        </span>

        <div className="header-actions">
          <AudioToggle />
          <LanguageSwitch />
          <a
            className="header-email line-link"
            href={`mailto:${PROFILE.email}`}
            tabIndex={open ? -1 : 0}
          >
            {PROFILE.email}
          </a>
          <button
            ref={triggerRef}
            type="button"
            className="header-status"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span className="label-open">{t('app.statusOpen')}</span>
            <span className="label-close">{t('app.close')}</span>
            <span className="dot" aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            ref={menuRef}
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('app.menuAria')}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="menu-top">
              <span className="brand" aria-hidden="true">
                D<i>/</i>P
              </span>
              <button
                type="button"
                className="header-status"
                onClick={() => {
                  close()
                  goTop()
                }}
              >
                {t('app.index')}
                <X size={14} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <nav className="menu-body" aria-label={t('app.sectionsAria')}>
              <ul className="menu-list">
                {menuItems.map((item, i) => (
                  <motion.li
                    key={item.target}
                    className="menu-item"
                    data-index={item.index}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.65, delay: 0.09 * i, ease: EASE }}
                  >
                    <a
                      className="menu-link"
                      href={`#${item.target}`}
                      onPointerEnter={() => sound.playHover()}
                      onClick={(event) => {
                        event.preventDefault()
                        sound.playClick()
                        goTo(item.target)
                        close()
                      }}
                    >
                      <span className="num">{item.index}</span>
                      {item.label}
                      <ArrowUpRight
                        className="arrow"
                        size={24}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="menu-foot">
              <div className="menu-socials">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <span className="mono">
                {t('app.location')} — {PROFILE.timezone}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}