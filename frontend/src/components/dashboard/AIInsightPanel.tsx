'use client'
import Link from 'next/link'
import { Bot, AlertTriangle, TrendingUp, CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Alert {
  level: string
  message: string
}

interface Recommendation {
  id: string
  agent_type: string
  title: string
  summary: string
  recommended_action: string
  requires_approval: boolean
}

interface AIInsightPanelProps {
  alerts: Alert[]
  recommendations: Recommendation[]
}

export function AIInsightPanel({ alerts, recommendations }: AIInsightPanelProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#1a2744] border border-cyan-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-cyan-400 font-semibold text-sm">STACK AI</h3>
            <p className="text-slate-500 text-[10px]">Dual-agent insights</p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        {/* Alerts */}
        {alerts.map((alert, i) => (
          <div key={i} className={`flex items-start gap-2 p-2 rounded-lg mb-2 ${
            alert.level === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
            alert.level === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
            'bg-cyan-500/10 border border-cyan-500/20'
          }`}>
            <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${
              alert.level === 'critical' ? 'text-red-400' :
              alert.level === 'warning' ? 'text-amber-400' : 'text-cyan-400'
            }`} />
            <p className="text-xs text-slate-300">{alert.message}</p>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-slate-300">All systems nominal</p>
          </div>
        )}
      </div>

      {/* Revenue alerts */}
      <div className="bg-[#1e293b] border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h4 className="text-slate-200 text-xs font-semibold">Revenue Delay Alert</h4>
        </div>
        <div className="space-y-2">
          <div className="p-2 bg-amber-500/5 rounded-lg border border-amber-500/10">
            <p className="text-xs text-slate-300 font-medium">GreenLeaf Organics</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Oct revenue: $32,000 vs $48,000 expected</p>
            <p className="text-[10px] text-amber-400">Repayment: $3,200 (partial)</p>
          </div>
          <div className="p-2 bg-red-500/5 rounded-lg border border-red-500/10">
            <p className="text-xs text-slate-300 font-medium">TechFlow Solutions</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Oct revenue: $0 — payment failed</p>
            <p className="text-[10px] text-red-400">Repayment: $0 (missed)</p>
          </div>
        </div>
      </div>

      {/* Lending opportunity */}
      <div className="bg-[#1e293b] border border-cyan-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h4 className="text-slate-200 text-xs font-semibold">Lending Opportunity</h4>
        </div>
        <div className="p-2 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
          <p className="text-xs text-slate-300 font-medium">GreenLeaf Organics</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Requested: $15,000 advance</p>
          <p className="text-[10px] text-cyan-400">SK7 max approved: $7,480</p>
          <span className="inline-block mt-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
            Pending Approval
          </span>
        </div>
      </div>

      {/* Recent actions */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
        <h4 className="text-slate-200 text-xs font-semibold mb-3">Recent Actions</h4>
        <div className="space-y-2">
          {[
            { action: 'SK1 analyzed 8 obligations', time: '2m ago', color: 'text-cyan-400' },
            { action: 'SK7 assessed GreenLeaf request', time: '5m ago', color: 'text-emerald-400' },
            { action: 'Safety engine: reserve check passed', time: '5m ago', color: 'text-slate-400' },
            { action: 'TechFlow repayment flagged', time: '1h ago', color: 'text-amber-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <Zap className={`w-3 h-3 mt-0.5 flex-shrink-0 ${item.color}`} />
              <div>
                <p className="text-[11px] text-slate-300">{item.action}</p>
                <p className="text-[10px] text-slate-600">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/assistant"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
      >
        <Bot className="w-4 h-4" />
        Ask STACK anything
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
