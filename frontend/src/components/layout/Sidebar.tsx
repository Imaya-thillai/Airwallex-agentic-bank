'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Wallet, CreditCard, ArrowLeftRight,
  Building2, BarChart3, Bot, Settings, Shield, HelpCircle, X
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Cash & Treasury', icon: Wallet, href: '/treasury' },
  { label: 'Lending & Repayments', icon: CreditCard, href: '/lending' },
  { label: 'Payments', icon: ArrowLeftRight, href: '/payments' },
  { label: 'Clients / Businesses', icon: Building2, href: '/businesses' },
  { label: 'Analytics & Risk', icon: BarChart3, href: '/analytics' },
  { label: 'AI Assistant', icon: Bot, href: '/assistant' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Security & Approvals', icon: Shield, href: '/security' },
  { label: 'Help', icon: HelpCircle, href: '/help' },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="h-full w-64 bg-gradient-sidebar flex flex-col border-r border-slate-700/50 bg-[#0a0f1e]">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="2" />
              <circle cx="4" cy="6" r="1.5" />
              <circle cx="20" cy="6" r="1.5" />
              <circle cx="4" cy="18" r="1.5" />
              <circle cx="20" cy="18" r="1.5" />
              <line x1="12" y1="10" x2="5.5" y2="6.5" strokeWidth="1.5" />
              <line x1="12" y1="10" x2="18.5" y2="6.5" strokeWidth="1.5" />
              <line x1="12" y1="14" x2="5.5" y2="17.5" strokeWidth="1.5" />
              <line x1="12" y1="14" x2="18.5" y2="17.5" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">STACK AI</h1>
            <p className="text-slate-400 text-[10px] tracking-wider">Treasury • Lending • Risk</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {label}
              {label === 'Security & Approvals' && (
                <span className="ml-auto bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            AA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-xs font-medium truncate">Alex Admin</p>
            <p className="text-slate-500 text-[10px] truncate">admin@stackai.demo</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Online" />
        </div>
      </div>
    </aside>
  )
}
