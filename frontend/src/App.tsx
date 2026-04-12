import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/useAppStore'

import MarketingLanding from './components/marketing/MarketingLanding'
import FearProfiler from './components/landing/FearProfiler'
import SignUp from './components/signup/SignUp'
import PersonalizedDashboard from './components/personalized/PersonalizedDashboard'
import LoginModal from './components/auth/LoginModal'

function App() {
  const view = useAppStore(state => state.view)
  const setView = useAppStore(state => state.setView)
  const [loginOpen, setLoginOpen] = useState(false)

  // ── Always start at landing on a fresh page load ────────────────────────────
  useEffect(() => {
    setView('landing')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // empty deps — runs exactly once on mount

  // ── Listen for login modal event from MarketingLanding navbar ──────────────
  useEffect(() => {
    const handler = () => setLoginOpen(true)
    window.addEventListener('kinetic:open-login', handler)
    return () => window.removeEventListener('kinetic:open-login', handler)
  }, [])

  // Lenis smooth scroll — only active on landing page
  useEffect(() => {
    if (view !== 'landing') return
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [view])

  // ── Sync view → browser history ────────────────────────────────────────────
  // Push a history entry each time the view changes so the browser back button
  // navigates between app views rather than reloading the whole page.
  useEffect(() => {
    const currentState = window.history.state?.view
    if (currentState !== view) {
      window.history.pushState({ view }, '', window.location.pathname)
    }
    // Scroll to top when entering a new view (not landing)
    if (view !== 'landing') {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), 50)
    }
  }, [view])

  // ── Handle browser back / forward ──────────────────────────────────────────
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const previousView = e.state?.view
      if (previousView && previousView !== view) {
        setView(previousView)
      } else {
        // No state in history (e.g. very first page load) → go to landing
        setView('landing')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [view, setView])

  return (
    <div className="relative min-h-screen bg-[#00161b] text-[rgba(255,255,255,0.65)]">
      <AnimatePresence mode="wait">

        {/* ── Personalized Dashboard (unified — handles both login and quiz graduates) ── */}
        {(view === 'personalized-dashboard' || view === 'dashboard') ? (
          <motion.div
            key="personalized-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PersonalizedDashboard />
          </motion.div>

        ) : view === 'signup' ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <SignUp onComplete={() => setView('personalized-dashboard')} />
          </motion.div>

        ) : view === 'quiz' ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <FearProfiler />
          </motion.div>

        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <MarketingLanding />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Global login modal — responds to 'kinetic:open-login' event */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}

export default App
