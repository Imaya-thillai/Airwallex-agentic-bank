'use client'
import { useState, useEffect } from 'react'
import { Building2, TrendingUp, AlertTriangle, ShieldCheck, Mail, DollarSign, RefreshCw } from 'lucide-react'
import { stackApi } from '@/lib/api'
import { formatCurrency, getRiskColor } from '@/lib/utils'

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBusinesses = async () => {
    setLoading(true)
    try {
      const res = await stackApi.getBusinesses()
      setBusinesses(res.data.businesses || [])
    } catch (err) {
      console.error('Failed to load businesses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Client Portfolio & Borrowers</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Verified financial profiles, monthly revenue tracking, and credit risk distribution
          </p>
        </div>
        <button
          onClick={fetchBusinesses}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {businesses.map((b) => (
          <div key={b.id} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 shadow-lg space-y-4 hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{b.name}</h3>
                <p className="text-xs text-slate-400">{b.business_type}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                b.risk_level === 'low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                b.risk_level === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {b.risk_level} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-3 rounded-lg border border-slate-700/40 text-xs">
              <div>
                <span className="text-slate-500">Monthly Revenue:</span>
                <p className="text-white font-semibold mt-0.5">{formatCurrency(b.monthly_revenue)}</p>
              </div>
              <div>
                <span className="text-slate-500">Credit Score:</span>
                <p className="text-cyan-400 font-semibold mt-0.5">{b.credit_score || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-500">Active Loans:</span>
                <p className="text-slate-200 font-semibold mt-0.5">{b.active_loans}</p>
              </div>
              <div>
                <span className="text-slate-500">Total Outstanding:</span>
                <p className="text-amber-400 font-semibold mt-0.5">{formatCurrency(b.total_outstanding)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {b.contact_email}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                Synthetic
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
