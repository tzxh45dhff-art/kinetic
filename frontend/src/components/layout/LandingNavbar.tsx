import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import LoginModal from '../auth/LoginModal'

const NAV_LINKS = [
  { label: 'The Problem', href: '#problem' },
  { label: 'Your Fear Type', href: '#fear-types' },
  { label: 'Community', href: '#community' },
]

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const setView = useAppStore(state => state.setView)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for login-open event from other components (e.g., Hero)
  useEffect(() => {
    const handler = () => setLoginOpen(true)
    window.addEventListener('kinetic:open-login', handler)
    return () => window.removeEventListener('kinetic:open-login', handler)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-[#00161b]/80 backdrop-blur-xl border-b border-white/[0.06] py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-[var(--color-primary-fixed)] flex items-center justify-center">
              <div className="w-1.5 h-3.5 bg-[#00161b] skew-x-[15deg]" />
            </div>
            <span className="font-display font-semibold text-lg tracking-widest text-white">KINETIC</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="font-sans text-sm text-white/55 hover:text-white transition-colors duration-200">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setLoginOpen(true)}
              className="font-sans text-sm text-white/55 hover:text-white transition-colors duration-200"
            >
              Login
            </button>
            <button onClick={() => setView('quiz')} className="bg-[var(--color-primary-fixed)] hover:bg-[#b4e882] text-[#0a1a00] font-sans font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 box-glow active:scale-[0.97]">Get Started</button>
          </div>
        </div>
      </motion.nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
