'use client'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface PortfolioHealthChartProps {
  data: {
    segments: Array<{ name: string; value: number; color: string; percentage: number }>
    total_outstanding: number
    collection_rate: number
  } | null
  loading?: boolean
}

const CustomLabel = ({ cx, cy, total }: { cx: number; cy: number; total: number }) => (
  <g>
    <text x={cx} y={cy - 8} textAnchor="middle" fill="#f1f5f9" fontSize={18} fontWeight="bold">
      {formatCurrency(total)}
    </text>
    <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748b" fontSize={11}>
      Total Portfolio
    </text>
  </g>
)

export function PortfolioHealthChart({ data, loading }: PortfolioHealthChartProps) {
  if (loading || !data) {
    return (
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 h-72 animate-pulse">
        <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
        <div className="h-full bg-slate-700/30 rounded" />
      </div>
    )
  }

  const segments = data.segments.filter(s => s.value > 0)

  return (
    <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 h-full">
      <div className="mb-3">
        <h3 className="text-slate-200 font-semibold text-sm">Portfolio Health</h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Collection rate: <span className="text-emerald-400 font-medium">{data.collection_rate}%</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={segments}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {segments.map((entry, index) => (
              <Cell key={index} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), '']}
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {segments.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <div className="min-w-0">
              <p className="text-xs text-slate-400 truncate">{s.name}</p>
              <p className="text-xs text-white font-medium">{formatCurrency(s.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
