import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { LANGS, type Language } from '../i18n'
import { useI18n } from '../i18n/provider'
import { useSiteCopy, type SiteCopy } from './content'
import { Flag } from './Flag'
import { cx } from '../lib/utils'

type NavKey = keyof SiteCopy['nav']

const NAV: readonly { key: NavKey; href: string }[] = [
  { key: 'about', href: '#about' },
  { key: 'projects', href: '#projects' },
  { key: 'impact', href: '#impact' },
  { key: 'stack', href: '#stack' },
  { key: 'journey', href: '#journey' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: '#contact' },
]

export function SiteHeader() {
  const copy = useSiteCopy()
  const { lang, setLang } = useI18n()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement | null>(null)
  const scrolledRef = useRef(false)

  /* Header flips to the light palette as soon as its bottom edge leaves the
     dark hero — the same moment the target switches its chrome. */
  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const hero = document.getElementById('hero')
      if (!hero) return
      const headerEdge = window.innerWidth >= 768 ? 89 : 75
      const heroBottom = hero.offsetTop + hero.offsetHeight
      const light = window.scrollY + headerEdge > heroBottom
      if (light !== scrolledRef.current) {
        scrolledRef.current = light
        setTheme(light ? 'light' : 'dark')
      }
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen && !langOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setLangOpen(false)
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (langOpen && langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen, langOpen])

  const chooseLang = useCallback(
    (next: Language) => {
      setLang(next)
      setLangOpen(false)
      setMenuOpen(false)
    },
    [setLang],
  )

  const headerTheme = menuOpen ? 'light' : theme

  return (
    <header
      className={cx('site-header', menuOpen && 'site-header--open')}
      data-theme={headerTheme}
    >
      <a className="skip-link" href="#main">
        {copy.ui.skip}
      </a>

      <div className="site-header__inner">
        <a className="brand" href="#hero" aria-label={copy.brand.name}>
          <span className="brand__mark" aria-hidden="true">
            <BrandGlyph />
          </span>
          <span className="brand__name">{copy.brand.name}</span>
        </a>

        <nav className="site-nav" aria-label={copy.ui.menu}>
          {NAV.map((item) => (
            <a key={item.key} href={item.href} className="site-nav__link">
              {copy.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <div className="lang" ref={langRef}>
            <button
              type="button"
              className="lang__button"
              aria-expanded={langOpen}
              aria-haspopup="menu"
              aria-label={copy.ui.language}
              onClick={() => setLangOpen((value) => !value)}
            >
              <Flag code={lang} />
              <span className="lang__code">{lang.toUpperCase()}</span>
              <ChevronDown
                size={13}
                strokeWidth={2}
                className={cx('lang__chevron', langOpen && 'is-open')}
              />
            </button>

            <div
              className={cx('lang__menu', langOpen && 'is-open')}
              role="menu"
              aria-hidden={!langOpen}
            >
              {LANGS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={lang === item.code}
                  className={cx('lang__option', lang === item.code && 'is-current')}
                  onClick={() => chooseLang(item.code)}
                  tabIndex={langOpen ? 0 : -1}
                >
                  <Flag code={item.code} />
                  <span>{item.full}</span>
                  {lang === item.code ? (
                    <svg viewBox="0 0 16 16" className="lang__check" aria-hidden="true">
                      <path
                        d="m3.5 8.4 3 3 6-6.6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <a className="site-header__cta" href="#contact">
            {copy.ui.talk}
          </a>

          <button
            type="button"
            className="site-header__burger"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? copy.ui.close : copy.ui.menu}
            onClick={() => {
              setMenuOpen((value) => !value)
              setLangOpen(false)
            }}
          >
            {menuOpen ? <X size={19} strokeWidth={1.8} /> : <Menu size={19} strokeWidth={1.8} />}
          </button>
        </div>

        <div className={cx('mobile-sheet', menuOpen && 'is-open')} aria-hidden={!menuOpen}>
          <p className="mobile-sheet__label">{copy.ui.menu}</p>
          <nav className="mobile-sheet__nav" aria-label={copy.ui.menu}>
            {NAV.map((item, index) => (
              <a
                key={item.key}
                href={item.href}
                className="mobile-sheet__link"
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span>{copy.nav[item.key]}</span>
                <span className="mobile-sheet__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </a>
            ))}
          </nav>

          <div className="mobile-sheet__footer">
            <p className="mobile-sheet__label">{copy.ui.language}</p>
            <div className="mobile-sheet__langs">
              {LANGS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={cx('mobile-sheet__lang', lang === item.code && 'is-current')}
                  onClick={() => chooseLang(item.code)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <Flag code={item.code} />
                  {item.label}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              className="btn-primary mobile-sheet__cta"
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {copy.ui.talk}
              <ArrowGlyph />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M4 12 12 4M6 4h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BrandGlyph() {
  return (
    <svg viewBox="0 0 64 64" width="18" height="18" aria-hidden="true">
      <g transform="translate(-1.25 4.5)">
        <rect x="9.5" y="20" width="6" height="24" fill="currentColor" />
        <path
          d="M21 44V20L32 34.5L43 20V44"
          fill="none"
          stroke="currentColor"
          strokeWidth="6.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <circle cx="52.5" cy="15.5" r="4.5" fill="#10b981" />
      </g>
    </svg>
  )
}
