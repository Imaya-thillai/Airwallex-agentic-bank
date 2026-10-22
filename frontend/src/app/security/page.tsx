'use client'
import { useState, useEffect } from 'react'
import { Shield, Lock, KeyRound, CheckCircle, XCircle, AlertTriangle, Fingerprint, FileText, RefreshCw } from 'lucide-react'
import { stackApi } from '@/lib/api'

export default function SecurityPage() {
  const [approvals, setApprovals] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [appRes, audRes] = await Promise.all([
        stackApi.getApprovals(),
        stackApi.getAuditLog(),
      ])
      setApprovals(appRes.data.approvals || [])
      setAuditLogs(audRes.data.events || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id)
    try {
      if (action === 'approve') {
        await stackApi.approveRequest(id, 'Approved via security portal')
      } else {
        await stackApi.rejectRequest(id, 'Rejected via security portal')
      }
      await fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Security & Transaction Approvals
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Role-based authorization, transaction-bound hash verification, and compliance audit trail
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

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
          <Fingerprint className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">MFA & Passkey Authentication</p>
            <p className="text-slate-400">WebAuthn token binding active for all privileged operations.</p>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">Canonical Payload Hashing</p>
            <p className="text-slate-400">SHA-256 state binding prevents approval tamper and replay attacks.</p>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 flex items-start gap-3">
          <FileText className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">Immutable Audit Trail</p>
            <p className="text-slate-400">Every authorization and rejection is timestamped in persistent store.</p>
          </div>
        </div>
      </div>

      {/* Pending Approvals Queue */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            Pending Step-Up Approvals
          </h2>
          <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            {approvals.filter((a) => a.status === 'pending').length} Actions Awaiting Review
          </span>
        </div>

        <div className="space-y-3">
          {approvals.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No pending approval requests at this time.</p>
          ) : (
            approvals.map((a) => (
              <div
                key={a.id}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white uppercase text-[11px]">{a.action_type}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : a.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="text-slate-400">
                    Target: {a.action_payload?.action || JSON.stringify(a.action_payload)}
                  </p>
                  <p className="text-slate-500 font-mono text-[10px]">
                    SHA-256 Hash: {a.canonical_hash?.substring(0, 32)}...
                  </p>
                </div>

                {a.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(a.id, 'approve')}
                      disabled={processingId === a.id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(a.id, 'reject')}
                      disabled={processingId === a.id}
                      className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
