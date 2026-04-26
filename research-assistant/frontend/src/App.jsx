import { useState, useEffect } from 'react'
import Chat from './components/Chat'
import { checkHealth } from './api'

function StatusBadge({ status }) {
  const color = status === 'online' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
  const label = status === 'online' ? 'Online' : status === 'error' ? 'Offline' : 'Connecting...'
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color} ${status === 'connecting' ? 'animate-pulse' : ''}`} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}

export default function App() {
  const [backendStatus, setBackendStatus] = useState('connecting')

  useEffect(() => {
    async function ping() {
      try {
        await checkHealth()
        setBackendStatus('online')
      } catch {
        setBackendStatus('error')
      }
    }
    ping()
    const interval = setInterval(ping, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔬</span>
          <div>
            <h1 className="text-sm font-semibold text-gray-100">Research Assistant</h1>
            <p className="text-xs text-gray-500">Multi-agent AI with RAG + Web Search</p>
          </div>
        </div>
        <StatusBadge status={backendStatus} />
      </header>

      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
    </div>
  )
}
