'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

interface MosqueChatWidgetProps {
  jummahTime: string
  sundaySchoolStart: string
  sundaySchoolEnd: string
  tuition: string
  sisMohaContact: string
  facebookUrl: string
  additionalInfo: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Uses XMLHttpRequest to bypass Makeswift's draft-mode fetch patching
function postChat(body: Record<string, unknown>): Promise<{ reply?: string; error?: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/chat')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText))
      } catch {
        reject(new Error('Invalid response'))
      }
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(JSON.stringify(body))
  })
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

const URL_SPLIT = /(https?:\/\/[^\s),]+)/g
const URL_TEST = /^https?:\/\//

function linkify(line: string) {
  const parts = line.split(URL_SPLIT)
  return parts.map((part, j) =>
    URL_TEST.test(part) ? (
      <a
        key={j}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline break-all"
        style={{ color: 'inherit' }}
      >
        {part}
      </a>
    ) : (
      part
    )
  )
}

function formatContent(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {linkify(line)}
      {i < lines.length - 1 && <br />}
    </span>
  ))
}

export function MosqueChatWidget({
  jummahTime,
  sundaySchoolStart,
  sundaySchoolEnd,
  tuition,
  sisMohaContact,
  facebookUrl,
  additionalInfo,
}: MosqueChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const data = await postChat({
        messages: updatedMessages,
        config: {
          jummahTime,
          sundaySchoolStart,
          sundaySchoolEnd,
          tuition,
          sisMohaContact,
          facebookUrl,
          additionalInfo,
        },
      })

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant' as const, content: data.reply! }])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again later.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end sm:bottom-5 sm:right-5">
      {open && (
        <div className="mb-3 flex flex-col overflow-hidden bg-white shadow-2xl border border-gray-200 rounded-2xl w-[calc(100vw-2rem)] max-w-[380px] h-[60vh] max-h-[28rem] sm:h-[520px] sm:max-h-none">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4"
            style={{ background: '#C7B299' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-white text-lg"
                style={{ background: '#008CAC' }}
              >
                🕌
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Dalton Islamic Center</h3>
                <p className="text-xs text-white/80">Ask us anything</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50 sm:px-4 sm:py-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-4xl mb-3">🕌</div>
                <p className="text-sm font-medium text-gray-700">Assalamu Alaikum!</p>
                <p className="text-xs text-gray-500 mt-1">
                  Welcome to Dalton Islamic Center. Ask me about prayer times, Sunday school,
                  events, or anything else!
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words overflow-hidden ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                  }`}
                  style={msg.role === 'user' ? { background: '#C7B299' } : undefined}
                >
                  {formatContent(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:pb-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-base sm:text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#C7B299] focus:ring-1 focus:ring-[#C7B299] transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
              style={{ background: '#C7B299' }}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: '#C7B299' }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  )
}

export default MosqueChatWidget
