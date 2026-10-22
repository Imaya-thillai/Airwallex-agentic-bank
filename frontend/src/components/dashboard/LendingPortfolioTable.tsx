'use client'
import { formatCurrency, formatPercent, getStatusBadgeClass, getRiskColor } from '@/lib/utils'

interface Loan {
  id: string
  business_name: string
  business_type: string
  risk_level: string
  principal: number
  outstanding_balance: number
  repayment_percentage: number
  status: string
  loan_type: string
  monthly_repayment_estimate: number
}

export function LendingPortfolioTable({ loans, loading }: { loans: Loan[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4 animate-pulse">
        <div className="h-4 w-40 bg-slate-700 rounded mb-4" />
        {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-700/50 rounded mb-2" />)}
      </div>
    )
  }

  const totalOutstanding = loans.reduce((s, l) => s + l.outstanding_balance, 0)

  return (
    <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-200 font-semibold text-sm">Lending Portfolio</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Outstanding: <span className="text-white font-medium">{formatCurrency(totalOutstanding)}</span>
          </p>
        </div>
        <span className="text-xs text-slate-500">{loans.length} active loans</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-slate-500 font-medium text-left pb-2">Business</th>
              <th className="text-slate-500 font-medium text-right pb-2">Outstanding</th>
              <th className="text-slate-500 font-medium text-right pb-2 pl-3">Monthly Est.</th>
              <th className="text-slate-500 font-medium text-left pb-2 pl-3">Risk</th>
              <th className="text-slate-500 font-medium text-left pb-2 pl-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const recoveryPct = ((loan.principal - loan.outstanding_balance) / loan.principal * 100).toFixed(0)
              return (
                <tr key={loan.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 pr-2">
                    <p className="text-slate-200 font-medium">{loan.business_name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-slate-500 text-[10px]">{loan.business_type}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500 text-[10px]">{formatPercent(loan.repayment_percentage)} rev</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <p className="text-white font-medium">{formatCurrency(loan.outstanding_balance)}</p>
                    <p className="text-slate-500 text-[10px]">{recoveryPct}% recovered</p>
                  </td>
                  <td className="py-2.5 pl-3 text-right text-slate-400">
                    {formatCurrency(loan.monthly_repayment_estimate)}
                  </td>
                  <td className="py-2.5 pl-3">
                    <span className={`font-medium capitalize ${getRiskColor(loan.risk_level)}`}>
                      {loan.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 pl-3">
                    <span className={getStatusBadgeClass(loan.status)}>{loan.status}</span>
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
