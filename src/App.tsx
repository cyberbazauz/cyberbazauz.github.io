import { useCallback, useEffect, useState } from 'react'
import type { LocalizedProject } from './i18n/content'
import { SiteHeader } from './site/SiteHeader'
import { Hero } from './site/Hero'
import { UpdatesStrip } from './site/UpdatesStrip'
import { AboutValues } from './site/AboutValues'
import { ProjectsSection } from './site/ProjectsSection'
import { ImpactSection } from './site/ImpactSection'
import { StackStrip } from './site/StackStrip'
import { JourneySection } from './site/JourneySection'
import { FaqSection } from './site/FaqSection'
import { ContactSection } from './site/ContactSection'
import { SiteFooter } from './site/SiteFooter'
import { CaseModal } from './site/CaseModal'

function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    let frame = 0
    const scan = () => {
      frame = 0
      document
        .querySelectorAll<HTMLElement>('.reveal:not(.is-in)')
        .forEach((element) => observer.observe(element))
    }
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(scan)
    }

    scan()
    const mutations = new MutationObserver(schedule)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.cancelAnimationFrame(frame)
      mutations.disconnect()
      observer.disconnect()
    }
  }, [])
}

export default function App() {
  const [project, setProject] = useState<LocalizedProject | null>(null)
  useRevealObserver()

  const openCase = useCallback((next: LocalizedProject) => setProject(next), [])
  const closeCase = useCallback(() => setProject(null), [])

  return (
    <>
      <SiteHeader />

      <main id="main">
        <Hero />
        <UpdatesStrip onOpen={openCase} />
        <AboutValues />
        <ProjectsSection onOpen={openCase} />
        <ImpactSection />
        <StackStrip />
        <JourneySection />
        <FaqSection />
        <ContactSection />
      </main>

      <SiteFooter />
      <CaseModal project={project} onClose={closeCase} />
    </>
  )
}
