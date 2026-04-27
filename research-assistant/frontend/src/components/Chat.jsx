import { useState, useRef, useEffect } from 'react'
import Message from './Message'
import InputBox from './InputBox'
import { sendQuery } from '../api'

function LoadingIndicator() {
  return (
    <div className="flex gap-3 justify-start message-enter">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
        AI
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-2">Researching</span>
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
      <div className="text-5xl">🔬</div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">AI Research Assistant</h2>
        <p className="text-gray-400 text-sm max-w-md">
          Ask any question. I'll search my knowledge base first, then the web if needed —
          and remember everything for next time.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-2">
        {[
          "What is quantum computing?",
          "Latest developments in AI safety",
          "How does CRISPR gene editing work?",
          "Explain the difference between RAG and fine-tuning",
        ].map((suggestion) => (
          <button
            key={suggestion}
            className="text-left text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 text-gray-300 transition-colors"
            onClick={() => {
              const event = new CustomEvent('suggestion-click', { detail: suggestion })
              window.dispatchEvent(event)
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    function onSuggestion(e) {
      setInput(e.detail)
    }
    window.addEventListener('suggestion-click', onSuggestion)
    return () => window.removeEventListener('suggestion-click', onSuggestion)
  }, [])

  async function handleSubmit() {
    const question = input.trim()
    if (!question || isLoading) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setIsLoading(true)

    try {
      const data = await sendQuery(question)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer, sources: data.sources },
      ])
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Unknown error'
      setError(`Error: ${msg}`)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${msg}`,
          sources: [],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, i) => (
              <Message key={i} message={msg} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-800 px-4 py-4 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <InputBox
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <p className="text-center text-xs text-gray-600 mt-2">
            Answers may include information from the web. Always verify critical information.
          </p>
        </div>
      </div>
    </div>
  )
}
