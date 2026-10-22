'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign, Lock, TrendingUp, CreditCard, Calendar,
  Wallet, RefreshCw
} from 'lucide-react'
import { stackApi } from '@/lib/api'
import { KPICard } from '@/components/dashboard/KPICard'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { PortfolioHealthChart } from '@/components/dashboard/PortfolioHealthChart'
import { ObligationsTable } from '@/components/dashboard/ObligationsTable'
import { LendingPortfolioTable } from '@/components/dashboard/LendingPortfolioTable'
import { AIInsightPanel } from '@/components/dashboard/AIInsightPanel'
import { RecommendationCard } from '@/components/dashboard/RecommendationCard'

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [cashflow, setCashflow] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loans, setLoans] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dashRes, cfRes, portRes, loansRes] = await Promise.all([
        stackApi.getDashboard(),
        stackApi.getCashflow('12m'),
        stackApi.getPortfolioHealth(),
        stackApi.getLoans(),
      ])
      setDashboard(dashRes.data)
      setCashflow(cfRes.data)
      setPortfolio(portRes.data)
      setLoans(loansRes.data)
      setLastUpdated(new Date())
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const kpis = dashboard?.kpis
  const obligations = dashboard?.obligations || []
  const recommendations = dashboard?.recommendations || []
  const alerts = dashboard?.alerts || []

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Financial Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {lastUpdated ? (
              <>Last updated {lastUpdated.toLocaleTimeString()} ·{' '}
              <span className="text-amber-400">Synthetic Demo Data</span></>
            ) : 'Loading…'}
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <span>⚠</span>
          {error} — Backend may be starting up. Check that the API is running on port 8000.
          <button onClick={fetchAll} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* Layout: main content + right panel */}
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard
              title="Total Cash Balance"
              value={kpis?.total_cash ?? 0}
              icon={<DollarSign className="w-5 h-5" />}
              accentColor="#06b6d4"
              change="+$12,380 vs last month"
              changeType="up"
              loading={loading}
            />
            <KPICard
              title="Reserved Amount"
              value={kpis?.reserved_amount ?? 0}
              icon={<Lock className="w-5 h-5" />}
              accentColor="#f59e0b"
              subtitle="Across all accounts"
              loading={loading}
            />
            <KPICard
              title="Available for Lending"
              value={kpis?.available_for_lending ?? 0}
              icon={<Wallet className="w-5 h-5" />}
              accentColor="#10b981"
              change="After reserve & commitments"
              changeType="neutral"
              loading={loading}
            />
            <KPICard
              title="Outstanding Loans"
              value={kpis?.outstanding_loans ?? 0}
              icon={<CreditCard className="w-5 h-5" />}
              accentColor="#8b5cf6"
              change="3 active loans"
              changeType="neutral"
              loading={loading}
            />
            <KPICard
              title="Expected Repayments"
              value={kpis?.expected_repayments_30d ?? 0}
              icon={<Calendar className="w-5 h-5" />}
              accentColor="#f59e0b"
              subtitle="Next 30 days"
              loading={loading}
            />
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <CashFlowChart data={cashflow?.data || []} loading={loading} />
            </div>
            <div>
              <PortfolioHealthChart data={portfolio} loading={loading} />
            </div>
          </div>

          {/* Row 3: Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ObligationsTable obligations={obligations} loading={loading} />
            <LendingPortfolioTable loans={loans?.loans || []} loading={loading} />
          </div>

          {/* Row 4: Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-slate-300 font-semibold text-sm">AI Recommendations</h2>
              {recommendations.map((rec: any) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="hidden xl:block w-72 flex-shrink-0">
          <AIInsightPanel alerts={alerts} recommendations={recommendations} />
        </div>
      </div>
    </div>
  )
}
