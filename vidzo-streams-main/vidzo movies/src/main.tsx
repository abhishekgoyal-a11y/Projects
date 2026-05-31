import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const savedTheme = localStorage.getItem('vidzo-theme')
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
document.documentElement.dataset.theme =
  savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : prefersLight ? 'light' : 'dark'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
