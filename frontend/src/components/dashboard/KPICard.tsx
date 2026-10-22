'use client'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  accentColor?: string
  subtitle?: string
  loading?: boolean
}

export function KPICard({
  title, value, change, changeType = 'neutral',
  icon, accentColor = '#06b6d4', subtitle, loading
}: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 animate-pulse">
        <div className="h-4 w-24 bg-slate-700 rounded mb-3" />
        <div className="h-8 w-32 bg-slate-700 rounded mb-2" />
        <div className="h-3 w-20 bg-slate-700 rounded" />
      </div>
    )
  }

  const ChangeIcon = changeType === 'up' ? TrendingUp : changeType === 'down' ? TrendingDown : Minus
  const changeColor = changeType === 'up' ? 'text-emerald-400' : changeType === 'down' ? 'text-red-400' : 'text-slate-400'

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#273046] border border-slate-700/50 rounded-xl p-4 shadow-lg hover:border-slate-600/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(value)}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>
      {change && (
        <div className={`flex items-center gap-1 mt-3 text-xs ${changeColor}`}>
          <ChangeIcon className="w-3 h-3" />
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}
