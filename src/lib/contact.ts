import { PROFILE } from '../data/profile'

const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim()

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export type ContactOutcome = 'sent' | 'mailto' | 'error'

/**
 * The form is hosted on GitHub Pages, which cannot run a backend. When a
 * Web3Forms access key is present the message is delivered through their
 * serverless endpoint straight to PROFILE.email. Without a key (local dev)
 * we keep the old behaviour and open the visitor's mail client instead.
 */
export const contactServiceReady = Boolean(ACCESS_KEY)

export function openMailClient({ name, email, message }: ContactPayload) {
  const subject = encodeURIComponent(`Portfolio — ${name}`)
  const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`)
  window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
}

export async function submitContact(payload: ContactPayload): Promise<ContactOutcome> {
  if (!ACCESS_KEY) {
    openMailClient(payload)
    return 'mailto'
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Portfolio — ${payload.name}`,
        from_name: 'Portfolio contact form',
        name: payload.name,
        email: payload.email,
        message: payload.message,
      }),
    })

    const data = (await response.json().catch(() => null)) as { success?: boolean } | null
    if (!response.ok || !data?.success) return 'error'
    return 'sent'
  } catch {
    return 'error'
  }
}
