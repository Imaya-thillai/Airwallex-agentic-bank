'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'

interface TopNavProps {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { id: 1, type: 'warning', message: 'TechFlow repayment missed — $7,440', time: '5m ago' },
    { id: 2, type: 'info', message: 'GreenLeaf advance pending approval', time: '12m ago' },
  ]

  return (
    <header className="h-14 bg-[#0f172a] border-b border-slate-700/50 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white p-1"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Ask STACK anything..."
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all"
            onFocus={(e) => {
              window.location.href = '/assistant'
            }}
            readOnly
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* System status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span>Live Demo</span>
        </div>

        {/* Data badge */}
        <span className="hidden sm:inline text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
          Synthetic Data
        </span>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-1 w-80 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl z-50 p-2">
              <p className="text-xs font-semibold text-slate-400 px-2 py-1">Notifications</p>
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/40 cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                  <div>
                    <p className="text-xs text-slate-200">{n.message}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              AA
            </div>
            <span className="hidden sm:block text-sm text-slate-300">Admin</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl z-50 p-1">
              <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <Link href="/security" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg">
                <User className="w-4 h-4" /> Security
              </Link>
              <hr className="border-slate-700/50 my-1" />
              <button
                onClick={() => {
                  localStorage.removeItem('access_token')
                  window.location.href = '/login'
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 rounded-lg w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
