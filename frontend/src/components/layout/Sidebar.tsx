'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Wallet, CreditCard, ArrowLeftRight,
  Building2, BarChart3, Bot, Settings, Shield, HelpCircle,
  X, PanelLeftClose, PanelLeftOpen, Sparkles
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'TIFIN Showcase', icon: Sparkles, href: '/portfolio' },
  { label: 'Cash & Treasury', icon: Wallet, href: '/treasury' },
  { label: 'Lending & Repayments', icon: CreditCard, href: '/lending' },
  { label: 'Payments', icon: ArrowLeftRight, href: '/payments' },
  { label: 'Clients / Businesses', icon: Building2, href: '/businesses' },
  { label: 'Analytics & Risk', icon: BarChart3, href: '/analytics' },
  { label: 'AI Assistant', icon: Bot, href: '/assistant' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Security & Approvals', icon: Shield, href: '/security', badge: '2' },
  { label: 'Help & Docs', icon: HelpCircle, href: '/help' },
]

interface SidebarProps {
  onClose?: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`h-full bg-gradient-sidebar flex flex-col border-r border-slate-700/50 bg-[#0a0f1e] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Logo */}
      <div className={`flex items-center border-b border-slate-700/50 h-16 px-4 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
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
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-white font-bold text-sm tracking-wide">STACK AI</h1>
              <p className="text-slate-400 text-[10px] tracking-wider truncate">Treasury • Lending • Risk</p>
            </div>
          )}
        </Link>

        {/* Collapse toggle button on desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors ml-1"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {/* Close on mobile */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, href, badge }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              title={isCollapsed ? label : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isCollapsed
                  ? 'justify-center p-3'
                  : 'gap-3 px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1">{label}</span>
              )}

              {badge && (
                isCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
                ) : (
                  <span className="ml-auto bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )
              )}

              {/* Floating tooltip when in collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#1e293b] text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  {label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className={`p-3 border-t border-slate-700/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AA
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0f1e]" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-xs font-medium truncate">Alex Admin</p>
              <p className="text-slate-500 text-[10px] truncate">admin@stackai.demo</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
