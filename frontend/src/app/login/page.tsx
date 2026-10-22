'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { stackApi } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@stackai.demo')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await stackApi.login(email, password)
      if (res.data?.access_token) {
        localStorage.setItem('access_token', res.data.access_token)
        router.push('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid authentication credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
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
          <h1 className="text-2xl font-bold text-white tracking-wide">STACK AI</h1>
          <p className="text-xs text-slate-400">Treasury • Lending • Risk</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-6 shadow-2xl space-y-4">
          <h2 className="text-sm font-semibold text-white">Sign In to Financial Workspace</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Passkey / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-600/25"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Demo Credentials:</p>
            <p>Admin: <span className="font-mono text-cyan-400">admin@stackai.demo</span> / <span className="font-mono text-cyan-400">admin123</span></p>
            <p>Finance: <span className="font-mono text-cyan-400">finance@stackai.demo</span> / <span className="font-mono text-cyan-400">finance123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
