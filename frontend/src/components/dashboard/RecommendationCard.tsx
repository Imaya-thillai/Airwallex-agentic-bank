'use client'
import { useState } from 'react'
import { CheckCircle, XCircle, Info, Bot } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { stackApi } from '@/lib/api'

interface Recommendation {
  id: string
  agent_type: string
  title: string
  summary: string
  calculations: Record<string, string>
  recommended_action: string
  requires_approval: boolean
  status: string
}

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState<boolean | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleApprove = async () => {
    setApproving(true)
    try {
      // Create approval request
      const res = await stackApi.createApproval({
        action_type: `${rec.agent_type}_recommendation`,
        action_payload: { recommendation_id: rec.id, action: rec.recommended_action, calculations: rec.calculations },
      })
      const approvalId = res.data.id
      await stackApi.approveRequest(approvalId, 'Approved from dashboard')
      setApproved(true)
    } catch (err) {
      console.error(err)
      setApproved(false)
    } finally {
      setApproving(false)
    }
  }

  if (approved === true) {
    return (
      <div className="bg-[#1e293b] border border-emerald-500/30 rounded-xl p-5 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-emerald-400 font-semibold text-sm">Recommendation Approved</p>
          <p className="text-slate-400 text-xs mt-0.5">Approval recorded. Transaction pending execution.</p>
        </div>
      </div>
    )
  }

  const calcs = rec.calculations || {}

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#1a2744] border border-slate-700/50 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                {rec.agent_type === 'lending' ? 'SK7' : rec.agent_type === 'treasury' ? 'SK1' : 'COMBINED'}
              </span>
              <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                Pending Approval
              </span>
            </div>
            <h3 className="text-slate-200 font-semibold text-sm mt-1">{rec.title}</h3>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-slate-400 text-xs leading-relaxed mb-4">{rec.summary}</p>

      {/* Financial metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {calcs.total_cash && (
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Total Cash</p>
            <p className="text-white font-bold text-sm mt-1">{formatCurrency(parseFloat(calcs.total_cash))}</p>
          </div>
        )}
        {calcs.minimum_reserve && (
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Min Reserve</p>
            <p className="text-amber-400 font-bold text-sm mt-1">{formatCurrency(parseFloat(calcs.minimum_reserve))}</p>
          </div>
        )}
        {(calcs.approved_amount || calcs.proposed_advance) && (
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Approved Advance</p>
            <p className="text-cyan-400 font-bold text-sm mt-1">
              {formatCurrency(parseFloat(calcs.approved_amount || calcs.proposed_advance || '0'))}
            </p>
          </div>
        )}
        {calcs.post_advance_reserve_buffer && (
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Post-Action Reserve</p>
            <p className={`font-bold text-sm mt-1 ${
              parseFloat(calcs.post_advance_reserve_buffer) > 10000 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {formatCurrency(parseFloat(calcs.post_advance_reserve_buffer))}
            </p>
          </div>
        )}
      </div>

      {/* Recommended action */}
      <div className="bg-slate-800/30 rounded-lg p-3 mb-4 border-l-2 border-cyan-500">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Recommended Action</p>
        <p className="text-slate-200 text-xs">{rec.recommended_action}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-200 transition-colors"
        >
          <Info className="w-3 h-3" />
          {showDetails ? 'Hide' : 'View'} Details
        </button>
        <button
          onClick={handleApprove}
          disabled={approving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          <CheckCircle className="w-3 h-3" />
          {approving ? 'Approving…' : 'Approve Recommendation'}
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors ml-auto"
        >
          <XCircle className="w-3 h-3" />
          Reject
        </button>
      </div>

      {/* Details panel */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Full Calculations</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(calcs).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs py-1 border-b border-slate-800/50">
                <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-slate-300 font-medium">{isNaN(parseFloat(val)) ? val : formatCurrency(parseFloat(val))}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
