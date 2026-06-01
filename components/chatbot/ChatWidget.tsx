'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  ChevronDown,
  Bot,
  User,
  Phone,
  Mail,
  UserIcon,
} from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  message: string
  createdAt?: string
}

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  message:
    "Hi, I'm the A-Z Truck Sales assistant.\n\nI can help you find available trucks, answer vehicle questions, and help you contact our sales team.",
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isCollectingLead, setIsCollectingLead] = useState(false)
  const [leadStep, setLeadStep] = useState(0)
  const [leadData, setLeadData] = useState({ name: '', phone: '', email: '' })

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      const stored = sessionStorage.getItem('chatSessionId')
      if (stored) setSessionId(stored)
    }
  }, [isOpen])

  useEffect(() => {
    if (sessionId) {
      sessionStorage.setItem('chatSessionId', sessionId)
    }
  }, [sessionId])

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const handleSend = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setInput('')
    setError(null)
    addMessage({ role: 'user', message: trimmed })
    setIsLoading(true)

    try {
      const res = await fetch('/api/chatbot/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setIsLoading(false)
        return
      }

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId)
      }

      addMessage({ role: 'assistant', message: data.response })

      if (data.leadCaptured) {
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            message:
              "Thank you! I've noted your details and someone from our sales team will contact you soon.",
          })
        }, 500)
      }
    } catch {
      setError('Could not connect. Please try again.')
    }

    setIsLoading(false)
  }, [input, isLoading, sessionId, addMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const startLeadCollection = useCallback(() => {
    setLeadData({ name: '', phone: '', email: '' })
    setLeadStep(1)
    setIsCollectingLead(true)
    addMessage({
      role: 'assistant',
      message:
        "I'd be happy to connect you with our sales team. What's your name?",
    })
  }, [addMessage])

  const handleLeadResponse = useCallback(
    async (value: string) => {
      if (leadStep === 1) {
        setLeadData((prev) => ({ ...prev, name: value }))
        setLeadStep(2)
        addMessage({
          role: 'assistant',
          message: `Thanks, ${value}! What's the best phone number to reach you?`,
        })
      } else if (leadStep === 2) {
        setLeadData((prev) => ({ ...prev, phone: value }))
        setLeadStep(3)
        addMessage({
          role: 'assistant',
          message:
            "Great! What's your email address? (optional - you can say 'skip')",
        })
      } else if (leadStep === 3) {
        const email = value.toLowerCase() === 'skip' ? '' : value
        const fullLeadData = { ...leadData, email }
        setLeadData(fullLeadData)
        setLeadStep(0)
        setIsCollectingLead(false)

        try {
          await fetch('/api/chatbot/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: fullLeadData.name,
              phone: fullLeadData.phone,
              email: fullLeadData.email || null,
            }),
          })

          addMessage({
            role: 'assistant',
            message:
              'Thank you! A member of our sales team will contact you shortly. Is there anything else I can help you with?',
          })
        } catch {
          addMessage({
            role: 'assistant',
            message:
              "I've saved your request. Someone will reach out to you soon.",
          })
        }
      }
    },
    [leadStep, leadData, addMessage],
  )

  const handleLeadInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const input = (e.target as HTMLInputElement).value.trim()
        if (input) {
          handleLeadResponse(input)
          ;(e.target as HTMLInputElement).value = ''
        }
      }
    },
    [handleLeadResponse],
  )

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5b800] text-black shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 ${isOpen ? 'max-sm:hidden' : ''}`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-150 w-95 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:h-dvh max-sm:w-screen max-sm:rounded-none max-sm:border-0">
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-2xl bg-[#0f1117] px-5 py-4 text-white max-sm:rounded-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5b800]">
              <Bot size={18} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">A-Z Truck Sales</p>
              <p className="text-[11px] text-gray-400">Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user' ? 'bg-[#0f1117]' : 'bg-[#f5b800]'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-black" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#0f1117] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.message.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-1' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="flex max-w-[85%] gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5b800]">
                    <Bot size={14} className="text-black" />
                  </div>
                  <div className="rounded-2xl bg-gray-100 px-4 py-3">
                    <Loader2 size={16} className="animate-spin text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Lead Collection Quick Actions */}
          {!isCollectingLead && !isLoading && (
            <div className="px-4 pb-2">
              <button
                onClick={startLeadCollection}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-2.5 text-sm text-gray-600 transition-colors hover:border-[#f5b800] hover:text-[#f5b800]"
              >
                <Phone size={14} />
                Contact Sales Team
              </button>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 px-4 py-3 max-sm:pb-safe">
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-1.5 focus-within:border-[#f5b800] focus-within:ring-1 focus-within:ring-[#f5b800]">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  if (!isCollectingLead) setInput(e.target.value)
                }}
                onKeyDown={
                  isCollectingLead ? handleLeadInputKeyDown : handleKeyDown
                }
                placeholder={
                  isCollectingLead
                    ? leadStep === 1
                      ? 'Enter your name...'
                      : leadStep === 2
                        ? 'Enter your phone number...'
                        : 'Enter your email (or type "skip")...'
                    : 'Type your message...'
                }
                className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                maxLength={500}
                disabled={isLoading}
              />
              <button
                onClick={
                  isCollectingLead
                    ? () => {
                        const val = input.trim()
                        if (val) {
                          handleLeadResponse(val)
                          setInput('')
                        }
                      }
                    : handleSend
                }
                disabled={
                  isLoading ||
                  (isCollectingLead ? !input.trim() : !input.trim())
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5b800] text-black transition-colors hover:bg-[#e0a700] disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
