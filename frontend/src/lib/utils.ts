export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyFull(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getPriorityBadgeClass(priority: string): string {
  const map: Record<string, string> = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  }
  return map[priority] ?? 'badge-low'
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    active: 'badge-active',
    completed: 'badge-completed',
    complete: 'badge-completed',
    pending: 'badge-pending',
    failed: 'badge-failed',
    missed: 'badge-missed',
    partial: 'badge-pending',
    overdue: 'badge-critical',
  }
  return map[status] ?? 'badge-pending'
}

export function getRiskColor(risk: string): string {
  const map: Record<string, string> = {
    low: 'text-emerald-400',
    medium: 'text-amber-400',
    high: 'text-red-400',
  }
  return map[risk] ?? 'text-slate-400'
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}
