export interface Profile {
  name: string
  fullName?: string
  mark: string
  roles: readonly string[]
  headline: readonly [string, string]
  manifesto: string
  location: string
  timezone: string
  disciplines: readonly string[]
  availability: readonly string[]
  email: string
  github: string
  telegram: string
  linkedin: string
  year: number
}

/**
 * Real profile & contact data for Islombek Muqimov.
 */
export const PROFILE: Profile = {
  name: 'ISLOMBEK',
  fullName: 'Islombek Muqimov',
  mark: 'I/M',
  roles: ['AI ENGINEER', 'SOFTWARE', 'CYBERSECURITY'],
  headline: ['BUILDING WHAT SEEMED IMPOSSIBLE.', 'AI MAKES IT REAL.'],
  manifesto:
    'Building what once seemed impossible. Turning cutting-edge artificial intelligence, robust architectures, and clean engineering into products that actually work.',
  location: 'Uzbekistan',
  timezone: 'UTC+5',
  disciplines: ['AI & Machine Learning', 'Software Engineering', 'Cybersecurity'],
  availability: ['AI Engineering', 'Full-time / Projects', 'Research'],
  email: 'm.islombek24@gmail.com',
  github: 'https://github.com/cyberbazauz',
  telegram: 'https://t.me/cyber_islam',
  linkedin: 'https://linkedin.com/in/cyber-islam',
  year: 2026,
}