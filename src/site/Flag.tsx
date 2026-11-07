import type { Language } from '../i18n'

/** Tiny flat flags used by the language switcher. */
export function Flag({ code }: { code: Language }) {
  if (code === 'ru') {
    return (
      <svg className="flag" viewBox="0 0 18 12" aria-hidden="true">
        <rect width="18" height="4" fill="#f4f4f4" />
        <rect y="4" width="18" height="4" fill="#2f5fa8" />
        <rect y="8" width="18" height="4" fill="#d43a3a" />
      </svg>
    )
  }

  if (code === 'en') {
    return (
      <svg className="flag" viewBox="0 0 18 12" aria-hidden="true">
        <rect width="18" height="12" fill="#1d3f8f" />
        <path d="M0 0 18 12M18 0 0 12" stroke="#fff" strokeWidth="2.6" />
        <path d="M0 0 18 12M18 0 0 12" stroke="#d43a3a" strokeWidth="1.1" />
        <path d="M9 0v12M0 6h18" stroke="#fff" strokeWidth="3.2" />
        <path d="M9 0v12M0 6h18" stroke="#d43a3a" strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg className="flag" viewBox="0 0 18 12" aria-hidden="true">
      <rect width="18" height="3.4" fill="#1eb0cf" />
      <rect y="3.4" width="18" height="0.5" fill="#d43a3a" />
      <rect y="3.9" width="18" height="4.2" fill="#f7f7f7" />
      <rect y="8.1" width="18" height="0.5" fill="#d43a3a" />
      <rect y="8.6" width="18" height="3.4" fill="#2aa54a" />
      <circle cx="3" cy="1.7" r="1.05" fill="#f7f7f7" />
      <circle cx="2.7" cy="1.5" r="0.62" fill="#1eb0cf" />
    </svg>
  )
}
