import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { useAppStore } from './store/useAppStore'
import MarketingLanding from './components/marketing/MarketingLanding'
import AppFlow from './App'
import PersonalizedDashboard from './components/personalized/PersonalizedDashboard'
import LoginModal from './components/auth/LoginModal'

// /start — boot the view-based App in quiz mode
function StartRoute() {
  const setView = useAppStore(s => s.setView)
  useEffect(() => { setView('quiz') }, [setView])
  return <AppFlow />
}

// /dashboard — personalized dashboard, guard if no fearType
function DashboardRoute() {
  const fearType = useAppStore(s => s.fearType)
  if (!fearType) return <Navigate to="/start" replace />
  return <PersonalizedDashboard />
}

// /sandbox — jump to dashboard with sandbox section
function SandboxRoute() {
  const fearType = useAppStore(s => s.fearType)
  const setDashboardSection = useAppStore(s => s.setDashboardSection)
  useEffect(() => { setDashboardSection('sandbox') }, [setDashboardSection])
  if (!fearType) return <Navigate to="/start" replace />
  return <PersonalizedDashboard />
}

export default function RouterApp() {
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  // Global login modal event listener
  useEffect(() => {
    const handler = () => setLoginOpen(true)
    window.addEventListener('kinetic:open-login', handler)
    return () => window.removeEventListener('kinetic:open-login', handler)
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<MarketingLanding />} />
        <Route path="/start" element={<StartRoute />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/sandbox" element={<SandboxRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
