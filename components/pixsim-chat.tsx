"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  ts: number
}

const STORAGE_KEY = "pixsim-chat"
const MAX_MESSAGES = 20

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ChatMessage[]
  } catch {
    return []
  }
}

function saveMessages(msgs: ChatMessage[]) {
  const trimmed = msgs.slice(-MAX_MESSAGES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

interface Props {
  petName: string
  petIdentity: string
  petPower: string
}

export function PixSimChat({ petName, petIdentity, petPower }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMessages(loadMessages())
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: "user", content: text, ts: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    saveMessages(updated)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          petName,
          petIdentity,
          petPower,
          history: updated.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()
      const botMsg: ChatMessage = {
        role: "assistant",
        content: data.reply || "... *parpadea confundido* ...",
        ts: Date.now(),
      }
      const withReply = [...updated, botMsg]
      setMessages(withReply)
      saveMessages(withReply)
    } catch {
      const errMsg: ChatMessage = {
        role: "assistant",
        content: `*${petName} te mira con curiosidad pero no puede responder ahora* 🌀`,
        ts: Date.now(),
      }
      const withErr = [...updated, errMsg]
      setMessages(withErr)
      saveMessages(withErr)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, messages, petName, petIdentity, petPower])

  return (
    <div className="mt-5">
      {/* Section title */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "rgba(0,80,200,0.1)" }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/50">
          Conversa con tu PixSim
        </span>
        <div className="h-px flex-1" style={{ background: "rgba(0,80,200,0.1)" }} />
      </div>

      {/* Chat area */}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(230,242,255,0.4))",
          border: "1px solid rgba(200,220,255,0.4)",
        }}
      >
        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex flex-col gap-2.5 overflow-y-auto p-3"
          style={{ height: "220px" }}
        >
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-[10px] tracking-wider text-primary/30">
                Escribe algo para hablar con {petName} ✨
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] rounded-xl px-3 py-2"
                style={
                  msg.role === "user"
                    ? {
                        background: "linear-gradient(135deg, rgba(74, 158, 255, 0.15), rgba(0, 100, 255, 0.1))",
                        border: "1px solid rgba(74, 158, 255, 0.2)",
                      }
                    : {
                        background: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(240,248,255,0.5))",
                        border: "1px solid rgba(200,220,255,0.4)",
                      }
                }
              >
                {msg.role === "assistant" && (
                  <span className="mb-0.5 block text-[8px] font-semibold uppercase tracking-widest text-primary/40">
                    {petName}
                  </span>
                )}
                <p className="text-[11px] leading-relaxed text-primary/80">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="rounded-xl px-3 py-2"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(240,248,255,0.5))",
                  border: "1px solid rgba(200,220,255,0.4)",
                }}
              >
                <span className="text-[8px] font-semibold uppercase tracking-widest text-primary/40">
                  {petName}
                </span>
                <div className="mt-1 flex gap-1">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/30" style={{ animationDelay: "0ms" }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/30" style={{ animationDelay: "150ms" }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/30" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          className="flex gap-2 p-3"
          style={{ borderTop: "1px solid rgba(200,220,255,0.3)" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage()
            }}
            placeholder={`Escribe a ${petName}...`}
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] text-primary outline-none transition-all disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(200,220,255,0.5)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,100,255,0.3)"
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,100,255,0.06)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(200,220,255,0.5)"
              e.currentTarget.style.boxShadow = "none"
            }}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all disabled:opacity-40"
            style={{
              background: loading
                ? "rgba(150,180,210,0.5)"
                : "linear-gradient(180deg, #4a9eff, #0066ff)",
              boxShadow: loading
                ? "none"
                : "0 2px 8px rgba(0,100,255,0.25)",
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
