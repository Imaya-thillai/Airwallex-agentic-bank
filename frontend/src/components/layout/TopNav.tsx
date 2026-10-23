'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, Menu, ChevronDown, LogOut, User, Settings, Github, Sparkles } from 'lucide-react'

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
    <header className="h-16 bg-[#0f172a] border-b border-slate-700/50 flex items-center px-4 gap-4 flex-shrink-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
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
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all cursor-pointer"
            onClick={() => {
              window.location.href = '/assistant'
            }}
            readOnly
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* TIFIN Style Showcase Link */}
        <Link
          href="/portfolio"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 text-xs font-semibold transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>TIFIN Showcase</span>
        </Link>

        {/* Live System status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">Live Demo</span>
        </div>

        {/* GitHub Repository Link Button (near notifications) */}
        <a
          href="https://github.com/Imaya-thillai/Airwallex-agentic-bank"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700/40"
          title="View Source on GitHub: Imaya-thillai/Airwallex-agentic-bank"
        >
          <Github className="w-4 h-4 text-slate-300" />
        </a>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700/40"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0f172a]" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-slate-700/80 rounded-xl shadow-2xl z-50 p-2">
              <p className="text-xs font-semibold text-slate-400 px-2 py-1">Real-Time Risk Alerts</p>
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
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              AA
            </div>
            <span className="hidden sm:block text-xs font-medium text-slate-300">Admin</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-slate-700/80 rounded-xl shadow-2xl z-50 p-1">
              <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700/50 rounded-lg">
                <Settings className="w-3.5 h-3.5" /> Settings
              </Link>
              <Link href="/security" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700/50 rounded-lg">
                <User className="w-3.5 h-3.5" /> Security & Approvals
              </Link>
              <hr className="border-slate-700/50 my-1" />
              <button
                onClick={() => {
                  localStorage.removeItem('access_token')
                  window.location.href = '/login'
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-slate-700/50 rounded-lg w-full"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
