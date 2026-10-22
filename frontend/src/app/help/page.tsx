'use client'
import { HelpCircle, BookOpen, ShieldCheck, Terminal, ExternalLink } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Documentation & Platform Guide
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Architecture overview, multi-agent coordination protocol, and Airwallex Hackathon guidelines
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Section 1: Core Architecture */}
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Platform Architecture: Dual-Agent Financial Intelligence
          </h2>
          <p className="text-slate-300 leading-relaxed">
            STACK AI coordinates two primary specialized agents operating over a shared financial state:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>
              <strong className="text-slate-200">SK 1 — Adaptive Treasury Controller:</strong> Evaluates live cash positions,
              categorizes upcoming supplier and payroll obligations, projects cash-flow trends, and flags liquidity crunches.
            </li>
            <li>
              <strong className="text-slate-200">SK 7 — Portfolio Lending Agent:</strong> Evaluates revenue-based repayment performance,
              calculates maximum permissible financing advances, and sets automated percentage-based revenue sweeps.
            </li>
          </ul>
        </div>

        {/* Section 2: Shared Safety Engine */}
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Deterministic Financial Safety Engine
          </h2>
          <p className="text-slate-300 leading-relaxed">
            The fundamental fintech innovation in STACK AI is that agents do not execute directly on ledgers. All proposed actions
            flow through a deterministic Python safety engine implemented using exact <code className="text-cyan-300 font-mono">Decimal</code> arithmetic.
          </p>
          <p className="text-slate-400">
            If treasury obligations ($78,900) and a requested lending advance ($15,000) would together breach the protected
            $50,000 cash reserve, the engine recalculates the maximum safe advance ($7,480) and mandates two-party authorization.
          </p>
        </div>
      </div>
    </div>
  )
}
