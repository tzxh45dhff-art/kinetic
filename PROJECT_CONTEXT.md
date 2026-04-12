# Kinetic — Project Context

> Last updated: April 12, 2026

---

## What This App Is

**Kinetic** is a financial fear-reduction web app for young Indians aged 18–28 who want to invest but are held back by fear, jargon, distrust, or disengagement. It is **not a brokerage or trading terminal**. It is a psychological on-ramp — a product that walks someone from fear to their first ₹500 invested.

The core insight is that most fintech apps show users the destination (charts, portfolio value, returns). Kinetic is the only app that walks next to the user through the fear first.

**Pitch:**
> "Most fintech apps show you the destination. We built the only app that walks next to you through the fear."

---

## The Problem Being Solved

- Inflation in India averages 6%+. Keeping money in savings means losing purchasing power.
- ₹1,00,000 saved without investing becomes worth ~₹54,000 in real terms after 7 years.
- The average Indian investor waits 7 years too long to start, missing 42% of compounding returns.
- 45,000+ Indians are already breaking this cycle via Kinetic.

---

## User Personas & Fear Types

The app identifies one of four fear archetypes via a quiz:

| Type | Name | Trigger | Color |
|---|---|---|---|
| `loss` | Loss Avoider | Scared of losing money | `#E24B4A` |
| `jargon` | Clarity Seeker | Intimidated by financial terms | `#378ADD` |
| `scam` | Pattern Detector | Skeptical of all financial products | `#EF9F27` |
| `trust` | Independence Guardian | Doesn't trust fund managers or apps | `#1D9E75` |

---

## User Flow (Current Implementation)

```
Landing Page
    │
    ├── "Login" → Returning User Dashboard (Jais's portfolio)
    │
    └── "Get Started" / "Break the Fear" → Fear Profiler Quiz
                                                │
                                        Reveal Fear Type
                                                │
                                    New User Onboarding Dashboard
```

### 1. Landing Page
Sections (in order):
- **Navbar**: KINETIC logo, links → The Problem, Your Fear Type, Community; Login (→ returning user dash); Get Started (→ quiz)
- **Hero**: Headline "Your money is *shrinking*. You just can't see it." — CTAs: "Break the Fear" and "View Your Risk →" (both go to quiz). Image placeholder at `/src/assets/hero.jpg`
- **The Invisible Cost of Hesitation**: 3 stat cards (₹1L→−₹54K, 12.4%→3× growth, 7 years→42% missed)
- **What Kind of Investor Are You?**: 4 investor type cards (Hesitator, Panicker, Observer, Avoider) + "Take the Fear Type Quiz →"
- **45,000+ Indians Breaking the Cycle**: Social proof counter + 2 testimonials
- **You Don't Need a Terminal. You Need a Path.**: Email capture form + "Claim Your Journey" CTA
- **Footer**: Navigation, copyright

### 2. Fear Profiler Quiz (5 Questions)
- Full-screen, one question at a time
- Slides left/right directionally (forward → right, back → left, 350ms easeInOut)
- Progress bar: animated pill indicators at top
- Answer cards: staggered entrance, lime border + glow on selection, spring-animated checkmark
- Scoring: tallies `loss`, `jargon`, `scam`, `trust` scores across all 5 answers; highest score wins
- `metaphorStyle` also captured from Q2 for AI persona adaptation
- Final question auto-advances after 700ms
- Reveal screen: fear type name punches in (scale 0.8→1.05→1), colored glass card, message, Continue button at 1.4s

**State saved:** `fearType`, `metaphorStyle`, `isNewUser = true`

### 3a. New User Onboarding Dashboard
Rendered when `isNewUser === true` (came via quiz)

Sections:
- **Welcome + Fear Type Badge** (colored to match their fear type)
- **Journey Tracker**: 4-step journey (step 1 already complete: "Understand Your Fear")
- **Tailored Lessons**: 3 specific 5-min lessons written for their fear type
- **SIP Calculator**: Interactive sliders for monthly amount + years → shows Invested / Returns / Total Value breakdown with animated bar
- **AI Mentor Card** (lime inverse card): personalized message based on fear type — "As a [FearType], your biggest edge is..."
- **Quick Actions**: "Start Your First SIP" + "Explore Markets"

### 3b. Returning User Dashboard (Jais)
Rendered when `isNewUser === false` (came via Login)

Sections:
- **WelcomeHeader**: "Hello, Jais" + greeting + Pro Tip (all from API)
- **MetricsGrid**: 4 metric cards — Current Value, Total Returns, XIRR, Day's P&L (from API)
- **PerformanceChart**: Professional TradingView Lightweight Charts v5 — Area series, period selectors (1W/1M/3M/6M/1Y/ALL), crosshair tooltip, data from backend
- **FeatureModules**: Sandbox Simulation, AI Intelligence Summary (lime inverse card), Time Harvest Machine
- **LowerWidgets**: Capital Efficiency banner + Hot Ticker (RELIANCE) + Dividend Alert (TCS) — from API

---

## Technical Architecture

### Frontend
- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion v12 (AnimatePresence, motion, spring, whileInView)
- **Scroll**: Lenis (smooth scroll, lerp 0.08)
- **Charts**: TradingView Lightweight Charts v5 (AreaSeries, CrosshairMode.Magnet)
- **State**: Zustand v5
- **Icons**: Lucide React
- **Runtime**: Bun

**Dev server:** `cd frontend && bun run dev` → `http://localhost:5173`

### Backend
- **Framework**: FastAPI (Python 3.9)
- **Server**: Uvicorn with `--reload`
- **Data**: JSON file at `backend/data/portfolio.json`
- **CORS**: Configured for `localhost:5173` and `localhost:3000`

**Dev server:** `cd backend && python3 -m uvicorn main:app --reload --port 3000`

### API Endpoints (all at `localhost:3000`)

| Endpoint | Returns |
|---|---|
| `GET /api/user` | `{ name, greeting, tip }` — Jais's profile |
| `GET /api/portfolio/summary` | 4 metric cards (Current Value, Returns, XIRR, Day P&L) |
| `GET /api/portfolio/chart?period=1Y` | Time-series chart data filtered by period |
| `GET /api/portfolio/holdings` | Hot Ticker (RELIANCE) + Dividend Alert (TCS) |
| `GET /api/health` | `{ status: "ok" }` |

---

## Zustand Store Shape

```ts
// View
view: 'landing' | 'quiz' | 'dashboard'
setView: (view) => void

// User mode
isNewUser: boolean         // true = came via quiz, false = returning user (Login)
setIsNewUser: (v) => void

// Quiz results
fearType: 'loss' | 'jargon' | 'scam' | 'trust' | null
metaphorStyle: 'gamer' | 'student' | 'professional' | 'generic' | null
setFearProfile: (fearType, metaphorStyle) => void

// Portfolio data (returning user only)
user: UserData | null
metrics: MetricItem[] | null
holdings: HoldingsData | null
loading: boolean
error: string | null
fetchDashboardData: () => Promise<void>
```

When `setView('dashboard')` is called:
- If `isNewUser === false` and no user yet → `fetchDashboardData()` auto-fires
- If `isNewUser === true` → OnboardingDashboard renders instead (no API call needed)

---

## Portfolio Data (Jais — backend/data/portfolio.json)

**Current value:** ₹1,84,20,500  
**Total returns:** +₹42,20,500 (29.72% overall)  
**XIRR:** 24.8%  
**Day's P&L:** +₹12,400 (+0.8%)

**Holdings:** RELIANCE (150 units, hot), TCS (80 units, dividend), INFY (200 units), HDFCBANK (120 units), TATAMOTORS (300 units)

Chart data: Weekly data from Jan 2023 to Dec 2023, 51 data points

---

## File Structure

```
finvasia/
├── PROJECT_CONTEXT.MD          ← this file
├── backend/
│   ├── main.py                 ← FastAPI server
│   ├── requirements.txt        ← fastapi, uvicorn
│   ├── BACKEND.md              ← original backend spec
│   └── data/
│       └── portfolio.json      ← Jais's portfolio data
└── frontend/
    ├── DESIGN.md               ← design system spec
    ├── FRONTEND.md             ← frontend spec
    ├── index.html              ← Google Fonts (Manrope, Inter)
    ├── src/
    │   ├── App.tsx             ← view router (landing/quiz/dashboard)
    │   ├── main.tsx
    │   ├── index.css           ← Tailwind + design tokens
    │   ├── lib/
    │   │   └── api.ts          ← typed API client (fetchUser, fetchPortfolioSummary, etc.)
    │   ├── store/
    │   │   └── useAppStore.ts  ← Zustand store
    │   └── components/
    │       ├── landing/
    │       │   ├── Hero.tsx            ← "Your money is shrinking"
    │       │   ├── Partners.tsx        ← Invisible Cost of Hesitation stats
    │       │   ├── Features.tsx        ← Investor type cards + quiz CTA
    │       │   ├── Insights.tsx        ← 45,000+ social proof + testimonials
    │       │   ├── FinalCTA.tsx        ← Email capture CTA
    │       │   └── FearProfiler.tsx    ← 5-question quiz + reveal screen
    │       ├── layout/
    │       │   ├── LandingNavbar.tsx   ← Landing nav (Login → dash, Get Started → quiz)
    │       │   ├── DashboardNavbar.tsx ← Dashboard nav (sticky, active underline)
    │       │   └── Footer.tsx
    │       └── dashboard/
    │           ├── DashboardMain.tsx       ← Routes to Onboarding or Full dashboard
    │           ├── OnboardingDashboard.tsx ← New user experience (post-quiz)
    │           ├── WelcomeHeader.tsx       ← "Hello, Jais" + tip
    │           ├── MetricsGrid.tsx         ← 4 metric cards from API
    │           ├── PerformanceChart.tsx    ← TradingView chart from API
    │           ├── FeatureModules.tsx      ← Sandbox / AI Summary / Time Harvest
    │           └── LowerWidgets.tsx        ← Capital Efficiency + Hot Ticker + Dividend
```

---

## Design System

**Color Palette:**
- Surface base: `#00161b` (atmospheric dark teal — the global bg)
- Surface card: `#071619` / `#071a1f`
- Primary accent: `#c0f18e` (Electric Lime) — `--color-primary-fixed`
- Primary hover: `#b4e882`
- Dark on-lime text: `#0a1a00`

**Fear type colors (quiz + onboarding only):**
- Loss Avoider: `#E24B4A`
- Clarity Seeker: `#378ADD`
- Pattern Detector: `#EF9F27`
- Independence Guardian: `#1D9E75`

**Typography:**
- Display / headings: Manrope (font-display class)
- Body / UI: Inter (font-sans class)
- Monospace data: font-mono

**Card style:** `bg-[#071a1f] border border-white/[0.06] rounded-3xl`  
**Hover style:** `hover:border-white/10 transition-colors`  
**Primary button:** `bg-[#c0f18e] text-[#0a1a00] rounded-full font-bold`

---

## AI Mentor Persona (for future Claude API integration)

Name: **Arjun**  
Tone: Calm, stoic, wise older brother — not a salesperson  
System prompt:
> "You are Arjun, a calm stoic financial mentor for young Indians aged 18–28. Never use jargon without explaining it. Always give rupee amounts not percentages. Frame worst cases as survivable and temporary. Max 60 words unless asked for more. Adapt metaphors to fear type: loss→survivability, jargon→simple analogies, scam→SEBI/regulation facts, trust→index fund math requires no human trust."

**Fear type routing:**
- `loss` → show rupee worst case first, then median recovery
- `jargon` → wrap every term in tap-to-explain, simpler copy
- `scam` → show SEBI badges, data source citations
- `trust` → lead with historical data, minimize AI personality

---

## Math Constants (Never Change)

| Constant | Value |
|---|---|
| Nifty 50 CAGR | 14% annual |
| Nifty 50 std dev | 18% annual |
| FD rate | 6.8% annual |
| Inflation | 5.8% annual |
| Monte Carlo paths | 600 |
| Monthly mu | `Math.log(1.14) / 12` |
| Monthly sigma | `0.18 / Math.sqrt(12)` |
| Each monthly step | `Math.exp(mu + sigma * boxMuller()) - 1` |

---

## Known Ports

| Service | Port | Command |
|---|---|---|
| Frontend (Vite) | 5173 | `cd frontend && bun run dev` |
| Backend (FastAPI) | 3000 | `cd backend && python3 -m uvicorn main:app --reload --port 3000` |

---

## What's Not Built Yet (Next Steps)

1. **Real auth** — Login/signup currently simulated via `isNewUser` flag in Zustand. No real auth layer exists yet.
2. **FD Erosion screen** — animated bar showing savings losing real value (from original spec)
3. **Monte Carlo Chart** — 600 SIP path simulation fan chart
4. **First ₹500 Time Machine** — COVID crash + recovery simulation
5. **Fear Fingerprint Card** — downloadable shareable glass card
6. **AI Mentor (Arjun) integration** — Claude API calls for personalized text; the `metaphorStyle` + `fearType` from Zustand are ready to pass as context
7. **Real SIP flow** — "Start Your First SIP" button currently has no destination
8. **Mobile responsiveness polish** — layout tested on desktop, needs mobile QA
9. **GitHub push** — repository initialized, SSL issue blocked the final push previously. Repo: `https://github.com/tzxh45dhff-art/kinetic`
10. **Hero image** — placeholder exists in Hero.tsx; add image at `/frontend/src/assets/hero.jpg`