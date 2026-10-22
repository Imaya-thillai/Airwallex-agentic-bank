'use client'
import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface CashFlowChartProps {
  data: Array<{
    month: string
    inflow: number
    outflow: number
    net: number
    type: 'historical' | 'forecast'
  }>
  loading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-lg p-3 shadow-xl text-xs">
        <p className="text-slate-300 font-semibold mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400 capitalize">{p.name}:</span>
            <span className="text-white font-medium">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function CashFlowChart({ data, loading }: CashFlowChartProps) {
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('12m')

  const filtered = data.slice(period === '3m' ? -6 : period === '6m' ? -9 : 0)

  if (loading) {
    return (
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 h-72 animate-pulse">
        <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
        <div className="h-full bg-slate-700/30 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-200 font-semibold text-sm">Cash Flow Overview</h3>
          <p className="text-slate-500 text-xs mt-0.5">Historical & Projected</p>
        </div>
        <div className="flex gap-1">
          {(['3m', '6m', '12m'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={filtered} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="inflow"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#inflowGrad)"
            name="Inflow"
          />
          <Area
            type="monotone"
            dataKey="outflow"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#outflowGrad)"
            name="Outflow"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-slate-600 text-[10px] mt-2">
        ⓘ Historical data is synthetic for demonstration. Dashed lines indicate projected values.
      </p>
    </div>
  )
}
