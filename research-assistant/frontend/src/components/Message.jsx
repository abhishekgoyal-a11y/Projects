import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function BotIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
      AI
    </div>
  )
}

function UserIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
      You
    </div>
  )
}

function Sources({ sources }) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-3 pt-3 border-t border-gray-700">
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Sources</p>
      <ul className="space-y-1">
        {sources.map((url, i) => (
          <li key={i}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline break-all transition-colors"
            >
              {i + 1}. {url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Message({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 message-enter ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <BotIcon />}

      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {message.sources && <Sources sources={message.sources} />}
          </div>
        )}
      </div>

      {isUser && <UserIcon />}
    </div>
  )
}
