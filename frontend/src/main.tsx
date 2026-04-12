import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import RouterApp from './RouterApp.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <RouterApp />
  </BrowserRouter>,
)
