'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles, ArrowRight, ShieldCheck, Play, Pause, RotateCcw,
  Bot, Wallet, CreditCard, Lock, Cpu, Database, CheckCircle2,
  TrendingUp, Activity, Layers, ExternalLink, Github, Zap
} from 'lucide-react'

const SIMULATION_STEPS = [
  {
    step: 1,
    title: 'Incoming Revenue & Account Synchronization',
    agent: 'SK 1 Treasury Controller',
    badge: 'Real-Time Ingestion',
    color: 'from-cyan-500 to-blue-600',
    description:
      'GreenLeaf Organics deposits $48,000 in verified customer receipts. Total ledger balance climbs to $142,380 across operating, lending, and reserve accounts.',
    stats: { totalCash: '$142,380.00', reserve: '$50,000.00', available: '$57,380.00' },
  },
  {
    step: 2,
    title: 'Upcoming Critical Obligation Detection',
    agent: 'SK 1 Treasury Controller',
    badge: 'Obligation Prioritization',
    color: 'from-amber-500 to-red-500',
    description:
      'The treasury agent identifies an upcoming critical monthly payroll obligation of $45,000 due in 3 days, plus $8,200 in cloud infrastructure invoices.',
    stats: { payroll: '$45,000.00', supplierInvoices: '$8,200.00', priorityStatus: 'CRITICAL (Protected)' },
  },
  {
    step: 3,
    title: 'Borrower Funding Request Evaluation',
    agent: 'SK 7 Portfolio Lending Agent',
    badge: 'Revenue-Based Credit',
    color: 'from-emerald-500 to-teal-500',
    description:
      'GreenLeaf Organics requests a $15,000 working capital advance against a 10% future revenue-based repayment agreement.',
    stats: { requestedAdvance: '$15,000.00', borrowerRevenue: '$48,000/mo', proposedSweep: '10.0%' },
  },
  {
    step: 4,
    title: 'Deterministic Safety Engine Conflict Resolution',
    agent: 'Financial Safety Enclave',
    badge: 'Mathematical Invariant',
    color: 'from-purple-500 to-pink-500',
    description:
      'The safety engine detects that approving $15,000 alongside pending obligations ($78,900) would breach the $50,000 minimum reserve. It auto-revises the advance to $7,480.',
    stats: { originalRequest: '$15,000.00', revisedSafeMax: '$7,480.00', postActionReserve: '$50,000.00 (Safe)' },
  },
  {
    step: 5,
    title: 'Canonical Approval & Airwallex Sandbox Execution',
    agent: 'Airwallex Adapter',
    badge: 'Idempotent Disbursement',
    color: 'from-blue-600 to-cyan-400',
    description:
      'Authorized operator verifies the SHA-256 canonical payload hash. The advance is idempotently disbursed via the Airwallex sandbox adapter without risking duplicate retry execution.',
    stats: { status: 'DISBURSED (200 OK)', idempotencyKey: 'ADV-GREENLEAF-001', executionTime: '<12ms' },
  },
]

export default function PortfolioShowcasePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % SIMULATION_STEPS.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isPlaying])

  const stepData = SIMULATION_STEPS[currentStep]

  return (
    <div className="min-h-screen bg-[#060a16] text-white -m-4 lg:-m-6 selection:bg-cyan-500 selection:text-black">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section (TIFIN-Style) */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Multi-Agent Fintech Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
          Artificial Intelligence for Modern Treasury & Portfolio Lending
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          STACK AI coordinates specialized autonomous agents over a shared financial state. Powered by a deterministic
          safety engine that mathematically guarantees protected liquidity reserves while automating corporate disbursements.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Open Operational Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/Imaya-thillai/Airwallex-agentic-bank"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-cyan-400">$142,380</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Live Cash Managed</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-emerald-400">$50,000</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Protected Reserve</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-purple-400">&lt; 15 ms</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Safety Engine Check</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm">
            <p className="text-2xl md:text-3xl font-extrabold text-amber-400">0.00%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Reserve Breach Rate</p>
          </div>
        </div>
      </section>

      {/* Interactive Video Flow Simulator (The Moving Flow of Video) */}
      <section className="px-6 py-12 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">The Flow of Autonomous Coordination</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Experience the step-by-step lifecycle as incoming revenue, priority obligations, and prospective lending requests
            interact with the shared safety engine.
          </p>
        </div>

        {/* Interactive "Video Player" Console */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1e] border border-cyan-500/30 p-6 md:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Player Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                STACK_AI_ENGINE_EXECUTION_FLOW.MP4
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setCurrentStep(0)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Restart flow"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Step Progress Indicator */}
          <div className="grid grid-cols-5 gap-1.5 py-4">
            {SIMULATION_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setCurrentStep(idx)}
                className="group text-left space-y-1.5"
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400'
                      : idx < currentStep
                      ? 'bg-slate-600'
                      : 'bg-slate-800'
                  }`}
                />
                <p
                  className={`text-[10px] truncate transition-colors ${
                    idx === currentStep ? 'text-cyan-300 font-semibold' : 'text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  Step {s.step}: {s.agent}
                </p>
              </button>
            ))}
          </div>

          {/* Active Flow Screen Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
            {/* Visual Node Representation */}
            <div className="md:col-span-5 relative flex items-center justify-center p-6 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative text-center space-y-3 z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${stepData.color} flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20 animate-pulse`}>
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">{stepData.agent}</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
                  {stepData.badge}
                </span>
              </div>
            </div>

            {/* Step Description & Live Telemetry */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider">
                  PHASE 0{stepData.step} / 05
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{stepData.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mt-2">{stepData.description}</p>
              </div>

              {/* Live Step Stats Box */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
                {Object.entries(stepData.stats).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-slate-500 text-[10px] capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-cyan-300 font-semibold text-xs mt-0.5 truncate">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Product Pillars (TIFIN Products Style) */}
      <section className="px-6 py-16 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Platform Capabilities</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Architected specifically for the Airwallex Agentic Bank Hackathon (SK 1 + SK 7).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0a0f1e] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">SK 1 Treasury Controller</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous multi-account cash monitoring, payroll priority classification, and predictive liquidity forecasting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0a0f1e] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">SK 7 Portfolio Lending</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Revenue-linked repayment agreements, verified receipt percentage sweeps, and commercial borrower underwriting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0a0f1e] border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Deterministic Safety Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exact Python Decimal mathematical guardrail enforcing the protected $50,000 cash reserve across both agents.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11192e] to-[#0a0f1e] border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Kaggle & LinuxONE Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-throughput columnar streaming of 280,000+ financial records with strict namespace isolation from live ledgers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-slate-800 py-12 px-6 text-center text-xs text-slate-500 space-y-4">
        <p>Built for the Airwallex Agentic Bank Hackathon · STACK AI</p>
        <div className="flex justify-center gap-6 text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
          <Link href="/treasury" className="hover:text-cyan-400 transition-colors">Treasury</Link>
          <Link href="/lending" className="hover:text-cyan-400 transition-colors">Lending</Link>
          <Link href="/security" className="hover:text-cyan-400 transition-colors">Security</Link>
          <a href="https://github.com/Imaya-thillai/Airwallex-agentic-bank" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            GitHub Repo
          </a>
        </div>
      </footer>
    </div>
  )
}
