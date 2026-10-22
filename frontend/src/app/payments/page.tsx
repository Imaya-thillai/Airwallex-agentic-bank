'use client'
import { useState, useEffect } from 'react'
import { ArrowLeftRight, CheckCircle2, Clock, AlertCircle, RefreshCw, KeyRound, Filter } from 'lucide-react'
import { stackApi } from '@/lib/api'
import { formatCurrency, getStatusBadgeClass } from '@/lib/utils'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await stackApi.getPayments(1, statusFilter || undefined)
      setPayments(res.data.payments || [])
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [statusFilter])

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Payment Execution & Ledger</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Idempotent disbursement pipeline, Airwallex integration adapter, and uncertainty reconciliation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Ledger
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-medium">Filter by Status:</span>
          {['', 'completed', 'pending', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st === '' ? 'All Transactions' : st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
        <span className="text-slate-500 font-medium">Showing {payments.length} of {total} records</span>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-left">
                <th className="pb-3">Transaction Details</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Idempotency Key</th>
                <th className="pb-3">Executed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="py-3">
                    <p className="font-semibold text-slate-200">{p.payee_name || 'N/A'}</p>
                    <p className="text-[10px] text-slate-500">{p.description || 'Disbursement'}</p>
                  </td>
                  <td className="py-3 capitalize text-slate-400">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      p.transaction_type === 'debit' ? 'bg-red-500/10 text-red-400' :
                      p.transaction_type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' :
                      p.transaction_type === 'advance' ? 'bg-cyan-500/10 text-cyan-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {p.transaction_type}
                    </span>
                  </td>
                  <td className="py-3 text-white font-bold">{formatCurrency(p.amount)}</td>
                  <td className="py-3">
                    <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <KeyRound className="w-3 h-3 text-slate-600" />
                    {p.idempotency_key}
                  </td>
                  <td className="py-3 text-slate-400">
                    {p.executed_at ? new Date(p.executed_at).toLocaleString() : 'Pending Execution'}
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
