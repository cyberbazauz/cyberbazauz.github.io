import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/inter-tight'
import './styles/site.css'
import './styles/site-sections.css'
import App from './App'
import { I18nProvider } from './i18n/provider'

const container = document.getElementById('root')

if (container) {
  createRoot(container).render(
    <StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </StrictMode>,
  )
}
