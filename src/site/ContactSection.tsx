import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, Mail, MapPin, Send, Send as Telegram } from 'lucide-react'
import { PROFILE } from '../data/profile'
import { useSiteCopy } from './content'
import { cx } from '../lib/utils'

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

export function ContactSection() {
  const copy = useSiteCopy()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [copied, setCopied] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error')
      return
    }

    setStatus('sending')
    const subject = encodeURIComponent(`Portfolio — ${name.trim()}`)
    const body = encodeURIComponent(
      `${message.trim()}\n\n—\n${name.trim()}\n${email.trim()}`,
    )
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
    const id = window.setTimeout(() => setStatus('sent'), 600)
    timers.current.push(id)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      const id = window.setTimeout(() => setCopied(false), 2200)
      timers.current.push(id)
    } catch {
      window.location.href = `mailto:${PROFILE.email}`
    }
  }

  return (
    <section id="contact" className="section section--contact">
      <div className="container-x">
        <div className="contact__head reveal">
          <span className="pill-label">{copy.contact.label}</span>
          <h2 className="contact__heading">
            {copy.contact.heading} <span>{copy.contact.em}</span>
          </h2>
          <p className="section-sub">{copy.contact.sub}</p>
        </div>

        <div className="contact__card reveal reveal-fade">
          <div className="contact__info-column">
            <div className="contact__info">
              <h3>{copy.contact.infoTitle}</h3>

              <ul className="contact__rows">
                <li className="contact__row">
                  <a href={`mailto:${PROFILE.email}`} className="contact__row-link">
                    <span className="contact__row-icon">
                      <Mail size={18} strokeWidth={1.7} />
                    </span>
                    {PROFILE.email}
                  </a>
                  <button
                    type="button"
                    className="contact__copy"
                    aria-label={copy.ui.emailCopied}
                    onClick={copyEmail}
                  >
                    {copied ? (
                      <Check size={15} strokeWidth={1.8} />
                    ) : (
                      <Copy size={15} strokeWidth={1.7} />
                    )}
                  </button>
                </li>

                <li className="contact__row">
                  <a
                    href={PROFILE.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="contact__row-link"
                  >
                    <span className="contact__row-icon">
                      <Telegram size={18} strokeWidth={1.7} />
                    </span>
                    @cyber_islam
                  </a>
                </li>

                <li className="contact__row">
                  <span className="contact__row-icon">
                    <MapPin size={18} strokeWidth={1.7} />
                  </span>
                  <span className="contact__row-text">
                    {PROFILE.location} · {PROFILE.timezone}
                  </span>
                </li>

                <li className="contact__row">
                  <span className="contact__row-icon contact__row-icon--status">
                    <i aria-hidden="true" />
                  </span>
                  <span className="contact__row-text">
                    {copy.contact.availabilityValue}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <div className="contact__fields">
              <label className="contact__field">
                <span>{copy.contact.form.name}</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder={copy.contact.form.namePlaceholder}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <label className="contact__field">
                <span>{copy.contact.form.email}</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={copy.contact.form.emailPlaceholder}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="contact__field contact__field--wide">
                <span>{copy.contact.form.message}</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder={copy.contact.form.messagePlaceholder}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </label>
            </div>

            <div className="contact__form-footer">
              <p className="contact__note">{copy.contact.form.note}</p>
              <div className="contact__submit-wrap">
                <p
                  className={cx(
                    'contact__status',
                    status === 'error' && 'is-error',
                    status === 'sent' && 'is-success',
                  )}
                  aria-live="polite"
                >
                  {status === 'error'
                    ? copy.contact.form.error
                    : status === 'sent'
                      ? copy.contact.form.sent
                      : ''}
                </p>
                <button type="submit" className="btn-primary contact__submit">
                  {status === 'sending' ? copy.contact.form.sending : copy.contact.form.submit}
                  <Send size={15} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
