'use client'
import { formatCurrency, formatDateShort, getPriorityBadgeClass, getStatusBadgeClass, daysUntil } from '@/lib/utils'

interface Obligation {
  id: string
  payee: string
  amount: number
  currency: string
  priority: string
  category: string
  due_date: string
  status: string
  description?: string
}

interface ObligationsTableProps {
  obligations: Obligation[]
  loading?: boolean
}

export function ObligationsTable({ obligations, loading }: ObligationsTableProps) {
  if (loading) {
    return (
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 animate-pulse">
        <div className="h-4 w-40 bg-slate-700 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-700/50 rounded mb-2" />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-200 font-semibold text-sm">Upcoming Obligations</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Total pending: <span className="text-amber-400 font-medium">
              {formatCurrency(obligations.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.amount, 0))}
            </span>
          </p>
        </div>
        <span className="text-xs text-slate-500">{obligations.length} items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-slate-500 font-medium text-left pb-2">Payee</th>
              <th className="text-slate-500 font-medium text-right pb-2">Amount</th>
              <th className="text-slate-500 font-medium text-left pb-2 pl-3">Priority</th>
              <th className="text-slate-500 font-medium text-left pb-2 pl-3">Due</th>
              <th className="text-slate-500 font-medium text-left pb-2 pl-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {obligations.map((obl) => {
              const days = daysUntil(obl.due_date)
              const isUrgent = days <= 3 && obl.status === 'pending'
              return (
                <tr key={obl.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${isUrgent ? 'bg-red-500/5' : ''}`}>
                  <td className="py-2.5 pr-2">
                    <p className="text-slate-200 font-medium truncate max-w-[160px]">{obl.payee}</p>
                    <p className="text-slate-500 text-[10px] capitalize">{obl.category}</p>
                  </td>
                  <td className="py-2.5 text-right font-medium text-white whitespace-nowrap">
                    {formatCurrency(obl.amount)}
                  </td>
                  <td className="py-2.5 pl-3">
                    <span className={getPriorityBadgeClass(obl.priority)}>{obl.priority}</span>
                  </td>
                  <td className="py-2.5 pl-3 whitespace-nowrap">
                    <span className={`text-xs ${isUrgent ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
                      {formatDateShort(obl.due_date)}
                      {days >= 0 && <span className="text-[10px] block text-slate-500">{days === 0 ? 'Today' : `${days}d`}</span>}
                    </span>
                  </td>
                  <td className="py-2.5 pl-3">
                    <span className={getStatusBadgeClass(obl.status)}>{obl.status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
