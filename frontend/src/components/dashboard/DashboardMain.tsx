import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

import WelcomeHeader from './WelcomeHeader'
import MetricsGrid from './MetricsGrid'
import PerformanceChart from './PerformanceChart'
import FeatureModules from './FeatureModules'
import LowerWidgets from './LowerWidgets'
import OnboardingDashboard from './OnboardingDashboard'

export default function DashboardMain() {
  const isNewUser = useAppStore(s => s.isNewUser)

  // New user → onboarding dashboard
  if (isNewUser) {
    return <OnboardingDashboard />
  }

  // Returning user (Jais) → full portfolio dashboard
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 pb-24 space-y-6"
    >
      <WelcomeHeader />
      <MetricsGrid />
      <PerformanceChart />
      <FeatureModules />
      <LowerWidgets />
    </motion.main>
  )
}
