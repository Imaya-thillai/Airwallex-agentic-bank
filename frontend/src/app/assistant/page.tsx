'use client'
import { useState } from 'react'
import { Bot, Send, User, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import { stackApi } from '@/lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  summary?: string
  calculations?: Record<string, string>
  requires_approval?: boolean
}

const SUGGESTIONS = [
  'Can we approve a $15,000 advance for GreenLeaf?',
  'Which payments are most urgent this week?',
  'What happens if revenue falls by 30%?',
  'Why was this lending request reduced?',
  'Show businesses with delayed repayments.',
  'Which proposed action would breach the reserve?',
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am STACK AI, your multi-agent financial intelligence assistant. I coordinate the SK 1 Adaptive Treasury Controller and SK 7 Portfolio Lending Agent through our shared deterministic safety engine. How can I assist your team today?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await stackApi.chat(text, history)
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.data.content,
        summary: res.data.summary,
        calculations: res.data.calculations,
        requires_approval: res.data.requires_approval,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the intelligence agents. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto h-[calc(100vh-6.5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            STACK AI Financial Assistant
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Coordinated reasoning across SK 1 Treasury Controller and SK 7 Portfolio Lending Agent
          </p>
        </div>
        <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-medium">
          Deterministic Engine Guardrails Active
        </span>
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="flex-shrink-0 text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {s}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed space-y-3 ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-white ml-12'
                  : 'bg-[#1e293b] border border-slate-700/60 text-slate-200 mr-12'
              }`}
            >
              {m.summary && (
                <div className="font-semibold text-cyan-300 pb-1 border-b border-slate-700/50">
                  {m.summary}
                </div>
              )}

              <p className="whitespace-pre-line">{m.content}</p>

              {m.calculations && Object.keys(m.calculations).length > 0 && (
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(m.calculations).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400 capitalize">{k.replace(/_/g, ' ')}:</span>
                      <span className="text-cyan-300 font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {m.requires_approval && (
                <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Two-party step-up authorization required before ledger execution.</span>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-800 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask STACK anything about treasury liquidity, lending requests, or reserve constraints..."
          className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-600/20"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
