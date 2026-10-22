'use client'
import { useState, useEffect } from 'react'
import { Wallet, ShieldAlert, ArrowUpRight, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react'
import { stackApi } from '@/lib/api'
import { formatCurrency, formatPercent, getPriorityBadgeClass, getStatusBadgeClass } from '@/lib/utils'

export default function TreasuryPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [obligations, setObligations] = useState<any[]>([])
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [accRes, oblRes] = await Promise.all([
        stackApi.getAccounts(),
        stackApi.getObligations(),
      ])
      setAccounts(accRes.data.accounts || [])
      setSummary(accRes.data.summary || {})
      setObligations(oblRes.data.obligations || [])
    } catch (err) {
      console.error('Failed to load treasury data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const runAnalysis = async () => {
    setAnalyzing(true)
    try {
      const res = await stackApi.analyzeTreasury({ include_obligations: true })
      setAnalysisResult(res.data)
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Cash & Treasury Management</h1>
            <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-medium">
              SK 1 Controller
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            Monitor multi-account balances, reserve protection, and deterministic payment prioritization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors shadow-lg shadow-cyan-600/20"
          >
            <Play className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Analyzing State...' : 'Run SK 1 Treasury Analysis'}
          </button>
        </div>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{acc.name}</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                {acc.account_number}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-3">{formatCurrency(acc.balance)}</p>
            <div className="space-y-1.5 border-t border-slate-800 pt-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Reserved Amount:</span>
                <span className="text-amber-400 font-medium">{formatCurrency(acc.reserved_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Net Available:</span>
                <span className="text-emerald-400 font-medium">{formatCurrency(acc.available)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reserve Safety Invariant Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-4">
        <ShieldAlert className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-cyan-300">Deterministic Safety Invariant: Protected Minimum Reserve ($50,000.00)</p>
          <p className="text-slate-400 leading-relaxed">
            The Financial Safety Engine guarantees that no combination of operational payments and portfolio lending advances
            can breach the $50,000 minimum liquidity reserve. Any payment or advance exceeding available headroom is automatically
            quarantined, revised, or flagged for mandatory two-party authorization.
          </p>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="bg-[#1e293b] border border-cyan-500/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              SK 1 Controller Analysis Results
            </h2>
            <span className="text-xs text-slate-400">
              Evaluated {analysisResult.recommendations?.length || 0} obligations
            </span>
          </div>

          <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            {analysisResult.summary}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-left">
                  <th className="pb-2">Payee</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2">Recommended Action</th>
                  <th className="pb-2">Deterministic Explanation</th>
                  <th className="pb-2">Approval Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {analysisResult.recommendations?.map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-medium text-slate-200">{r.payee}</td>
                    <td className="py-2.5 text-white font-medium">{formatCurrency(parseFloat(r.amount))}</td>
                    <td className="py-2.5">
                      <span className={getPriorityBadgeClass(r.priority)}>{r.priority}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.action === 'PAY' ? 'bg-emerald-500/20 text-emerald-400' :
                        r.action === 'ESCALATE' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {r.action}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 max-w-xs">{r.explanation}</td>
                    <td className="py-2.5">
                      {r.requires_approval ? (
                        <span className="text-amber-400 font-semibold">Yes ({r.required_approvals?.join(', ') || 'Authorized'})</span>
                      ) : (
                        <span className="text-slate-500">Autonomous</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Obligations Ledger */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">All Active Payment Obligations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-left">
                <th className="pb-2">Payee & Purpose</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Due Date</th>
                <th className="pb-2">Priority</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {obligations.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/30">
                  <td className="py-3">
                    <p className="font-medium text-slate-200">{o.payee}</p>
                    <p className="text-[10px] text-slate-500">{o.description}</p>
                  </td>
                  <td className="py-3 text-slate-400 capitalize">{o.category}</td>
                  <td className="py-3 text-white font-semibold">{formatCurrency(o.amount)}</td>
                  <td className="py-3 text-slate-300">{o.due_date}</td>
                  <td className="py-3">
                    <span className={getPriorityBadgeClass(o.priority)}>{o.priority}</span>
                  </td>
                  <td className="py-3">
                    <span className={getStatusBadgeClass(o.status)}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
