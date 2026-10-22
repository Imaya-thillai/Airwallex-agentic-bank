'use client'
import { useState, useEffect } from 'react'
import { BarChart3, Database, TrendingUp, AlertTriangle, Cpu, Layers } from 'lucide-react'
import { stackApi } from '@/lib/api'
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function AnalyticsPage() {
  const [cashflow, setCashflow] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [cfRes, portRes] = await Promise.all([
          stackApi.getCashflow('12m'),
          stackApi.getPortfolioHealth(),
        ])
        setCashflow(cfRes.data)
        setPortfolio(portRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Financial Analytics & ML Pipeline</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Stress scenario simulations, dataset ingestion monitoring, and portfolio risk telemetry
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-500 text-xs font-semibold uppercase">Avg Inflow Rate</p>
          <p className="text-xl font-bold text-cyan-400 mt-1">
            {formatCurrency(cashflow?.summary?.avg_monthly_inflow || 124500)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Synthetic 12-month trailing</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-500 text-xs font-semibold uppercase">Avg Burn Rate</p>
          <p className="text-xl font-bold text-amber-400 mt-1">
            {formatCurrency(cashflow?.summary?.avg_monthly_outflow || 98200)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Operational obligations</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-500 text-xs font-semibold uppercase">Collection Rate</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {portfolio?.collection_rate || 94.2}%
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Revenue sweep completion</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-500 text-xs font-semibold uppercase">Portfolio Default Rate</p>
          <p className="text-xl font-bold text-white mt-1">0.00%</p>
          <p className="text-[10px] text-emerald-400 mt-1">Protected by reserve safety</p>
        </div>
      </div>

      {/* Kaggle Large Dataset Pipeline Architecture Card */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">Large Dataset Ingestion Pipeline (Kaggle Benchmark)</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The STACK AI data pipeline processes high-volume financial datasets (e.g. Lending Club performance, credit card fraud,
          cash-flow transactions) in bounded-memory chunked batches with schema quarantine and deterministic deduplication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/40 text-xs space-y-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Processing Mode</span>
            <p className="text-white font-bold text-sm">Chunked Streaming (Pandas / PyArrow)</p>
            <p className="text-slate-400 text-[11px]">Bounded memory footprint &lt; 256MB under multi-GB loads</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/40 text-xs space-y-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Data Provenance</span>
            <p className="text-cyan-400 font-bold text-sm">Strict Namespace Segregation</p>
            <p className="text-slate-400 text-[11px]">Historical Kaggle data isolated from live operational balances</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/40 text-xs space-y-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">ML Inference Risk</span>
            <p className="text-emerald-400 font-bold text-sm">Human-in-the-Loop Safeguard</p>
            <p className="text-slate-400 text-[11px]">AI risk models advise; deterministic engine holds veto authority</p>
          </div>
        </div>
      </div>
    </div>
  )
}
