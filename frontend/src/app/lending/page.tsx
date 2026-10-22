'use client'
import { useState, useEffect } from 'react'
import { CreditCard, Calculator, AlertTriangle, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react'
import { stackApi } from '@/lib/api'
import { formatCurrency, formatPercent, getStatusBadgeClass, getRiskColor } from '@/lib/utils'

export default function LendingPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [repayments, setRepayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Simulation Form State
  const [businessName, setBusinessName] = useState('GreenLeaf Organics')
  const [requestedAmount, setRequestedAmount] = useState(15000)
  const [monthlyRevenue, setMonthlyRevenue] = useState(48000)
  const [repaymentPct, setRepaymentPct] = useState(0.10)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [assessing, setAssessing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [loanRes, repRes] = await Promise.all([
        stackApi.getLoans(),
        stackApi.getRepayments(),
      ])
      setLoans(loanRes.data.loans || [])
      setRepayments(repRes.data.repayments || [])
    } catch (err) {
      console.error('Failed to load lending data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault()
    setAssessing(true)
    try {
      const res = await stackApi.assessLending({
        business_name: businessName,
        requested_amount: requestedAmount,
        monthly_revenue: monthlyRevenue,
        repayment_percentage: repaymentPct,
      })
      setAssessmentResult(res.data)
    } catch (err) {
      console.error('Assessment failed:', err)
    } finally {
      setAssessing(false)
    }
  }

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Lending & Revenue-Based Repayments</h1>
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
              SK 7 Agent
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            Evaluate revenue-linked financing, automated receipt sweeps, and portfolio risk distribution
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Top Grid: Live Loan Portfolio & Simulation Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Loans */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Active Loan Exposure</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-left">
                    <th className="pb-2">Borrower</th>
                    <th className="pb-2">Principal</th>
                    <th className="pb-2">Outstanding</th>
                    <th className="pb-2">Revenue Share</th>
                    <th className="pb-2">Risk Level</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {loans.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-medium text-slate-200">{l.business_name}</td>
                      <td className="py-3 text-slate-400">{formatCurrency(l.principal)}</td>
                      <td className="py-3 text-white font-semibold">{formatCurrency(l.outstanding_balance)}</td>
                      <td className="py-3 text-cyan-400 font-medium">{formatPercent(l.repayment_percentage)}</td>
                      <td className="py-3">
                        <span className={`capitalize font-semibold ${getRiskColor(l.risk_level)}`}>
                          {l.risk_level}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={getStatusBadgeClass(l.status)}>{l.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Repayment History Ledger */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Repayment Performance & Sweeps</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-left">
                    <th className="pb-2">Period</th>
                    <th className="pb-2">Verified Receipts</th>
                    <th className="pb-2">Amount Due</th>
                    <th className="pb-2">Amount Paid</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {repayments.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 text-slate-300">{r.period_start} to {r.period_end}</td>
                      <td className="py-2.5 text-slate-400">{formatCurrency(r.revenue_received)}</td>
                      <td className="py-2.5 text-slate-300 font-medium">{formatCurrency(r.amount_due)}</td>
                      <td className="py-2.5 text-white font-bold">{formatCurrency(r.amount_paid)}</td>
                      <td className="py-2.5">
                        <span className={getStatusBadgeClass(r.status)}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: SK 7 Funding Assessment Tool */}
        <div className="bg-[#1e293b] border border-cyan-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">SK 7 Advance Assessment</h2>
          </div>
          <p className="text-xs text-slate-400">
            Simulate a prospective lending advance. The engine tests against the $50,000 reserve and outstanding treasury commitments.
          </p>

          <form onSubmit={handleAssess} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Borrower Business</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Requested Advance Amount ($)</label>
              <input
                type="number"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                min="100"
                step="100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Monthly Verified Revenue ($)</label>
              <input
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                min="0"
                step="500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Revenue Repayment Share (%)</label>
              <select
                value={repaymentPct}
                onChange={(e) => setRepaymentPct(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value={0.08}>8% of revenue</option>
                <option value={0.10}>10% of revenue</option>
                <option value={0.12}>12% of revenue</option>
                <option value={0.15}>15% of revenue</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={assessing}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-lg shadow-emerald-600/20"
            >
              {assessing ? 'Evaluating Safety Engine...' : 'Run Safety Assessment'}
            </button>
          </form>

          {/* Assessment Output */}
          {assessmentResult && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Evaluation Result:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  assessmentResult.is_approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {assessmentResult.action}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved Advance:</span>
                  <span className="text-cyan-400 font-bold">{formatCurrency(parseFloat(assessmentResult.approved_amount || 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className={`capitalize font-bold ${getRiskColor(assessmentResult.risk_level)}`}>
                    {assessmentResult.risk_level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Repayment Time:</span>
                  <span className="text-slate-200">{assessmentResult.calculations?.estimated_months_to_repay} months</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 italic bg-cyan-950/40 p-2.5 rounded border border-cyan-800/30">
                "{assessmentResult.recommendation}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
