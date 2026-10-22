'use client'
import { useState } from 'react'
import { Settings, Sliders, Shield, Database, Bell, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [minReserve, setMinReserve] = useState('50,000.00')
  const [llmProvider, setLlmProvider] = useState('Deterministic Demo Engine')
  const [airwallexEnv, setAirwallexEnv] = useState('API Sandbox (api-demo.airwallex.com)')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          System Configuration & Parameters
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Manage financial safety engine policies, external sandbox adapters, and agent operational constraints
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 space-y-5 text-xs shadow-lg">
        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Configuration policy updated successfully.
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">Financial Engine Rules</h2>
          
          <div>
            <label className="block text-slate-300 font-medium mb-1">Protected Minimum Cash Reserve ($)</label>
            <input
              type="text"
              value={minReserve}
              onChange={(e) => setMinReserve(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Absolute minimum threshold required by the Financial Safety Engine before any advance or payment is approved.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Agent Intelligence Provider</label>
            <input
              type="text"
              value={llmProvider}
              disabled
              className="w-full bg-slate-800/60 border border-slate-800 rounded-lg p-2.5 text-slate-400"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Deterministic Python orchestration active. Configure OPENAI_API_KEY to enable frontier LLM reasoning.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Banking Adapter Environment</label>
            <input
              type="text"
              value={airwallexEnv}
              disabled
              className="w-full bg-slate-800/60 border border-slate-800 rounded-lg p-2.5 text-slate-400"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Airwallex sandbox integration active with local high-fidelity simulator adapter fallback.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
        >
          Save Configuration
        </button>
      </form>
    </div>
  )
}
