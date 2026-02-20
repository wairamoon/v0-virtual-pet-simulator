"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  ts: number
}

export interface PetMemory {
  key: string
  value: string
  ts: number
}

interface StatChange {
  id: number
  text: string
  color: string
}

const CHAT_KEY = "pixsim-chat"
const MEMORY_KEY = "pixsim-memories"
const MAX_MESSAGES = 20
const MAX_MEMORIES = 10

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CHAT_KEY)
    return raw ? (JSON.parse(raw) as ChatMessage[]) : []
  } catch { return [] }
}

function saveMessages(msgs: ChatMessage[]) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES)))
}

function loadMemories(): PetMemory[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    return raw ? (JSON.parse(raw) as PetMemory[]) : []
  } catch { return [] }
}

function saveMemories(mems: PetMemory[]) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(mems.slice(-MAX_MEMORIES)))
}

interface Props {
  petName: string
  petIdentity: string
  petPower: string
  stats: { emotional: number; vital: number; hunger: number }
  onStatChange: (stat: "emotional" | "vital" | "hunger", delta: number) => void
}

export function PixSimChat({ petName, petIdentity, petPower, stats, onStatChange }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [memories, setMemories] = useState<PetMemory[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [statChanges, setStatChanges] = useState<StatChange[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const changeIdRef = useRef(0)

  useEffect(() => {
    setMessages(loadMessages())
    setMemories(loadMemories())
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  // Count consecutive user messages (for energy penalty)
  function countConsecutiveUserMsgs(msgs: ChatMessage[]): number {
    let count = 0
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") count++
      else break
    }
    return count
  }

  // Show floating stat change
  function showStatChange(text: string, color: string) {
    const id = ++changeIdRef.current
    setStatChanges((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setStatChanges((prev) => prev.filter((c) => c.id !== id))
    }, 2000)
  }

  // Apply stat changes per message
  function applyMessageStats(msgs: ChatMessage[]) {
    // Happiness +5
    onStatChange("emotional", 5)
    showStatChange("+5 Felicidad", "#e0457b")

    // Energy -3
    onStatChange("vital", -3)
    showStatChange("-3 Energía", "#4a9eff")

    // Extra -5 energy if 5+ consecutive user messages
    const consecutive = countConsecutiveUserMsgs(msgs)
    if (consecutive >= 5) {
      onStatChange("vital", -5)
      setTimeout(() => showStatChange("-5 Energía (cansancio)", "#ff5722"), 400)
    }
  }

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: "user", content: text, ts: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    saveMessages(updated)
    setInput("")
    setLoading(true)

    // Apply stats
    applyMessageStats(updated)

    // Artificial delay then show typing
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 500))
    setTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          petName,
          petIdentity,
          petPower,
          stats,
          memories,
          history: updated.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()

      setTyping(false)

      const botMsg: ChatMessage = {
        role: "assistant",
        content: data.reply || "... *parpadea confundido* ...",
        ts: Date.now(),
      }
      const withReply = [...updated, botMsg]
      setMessages(withReply)
      saveMessages(withReply)

      // Process new memories from API
      if (data.newMemories && Array.isArray(data.newMemories) && data.newMemories.length > 0) {
        const newMems = [...memories]
        for (const mem of data.newMemories) {
          const existing = newMems.findIndex((m) => m.key === mem.key)
          if (existing >= 0) {
            newMems[existing] = { ...mem, ts: Date.now() }
          } else {
            newMems.push({ ...mem, ts: Date.now() })
          }
        }
        const trimmed = newMems.slice(-MAX_MEMORIES)
        setMemories(trimmed)
        saveMemories(trimmed)
      }
    } catch {
      setTyping(false)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, messages, petName, petIdentity, petPower, stats, memories])

  return (
    <div className="relative mt-5">
      {/* Floating stat changes */}
      <div className="pointer-events-none absolute -top-2 left-0 right-0 z-30 flex flex-col items-center gap-1">
        {statChanges.map((sc) => (
          <div
            key={sc.id}
            className="animate-fade-in text-[10px] font-bold tracking-wider"
            style={{
              color: sc.color,
              animation: "statFloat 2s ease-out forwards",
            }}
          >
            {sc.text}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes statFloat {
          0% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; transform: translateY(-20px); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
      `}</style>

      {/* Section title */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "rgba(0,80,200,0.1)" }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/50">
          Conversa con tu PixSim
        </span>
        <div className="h-px flex-1" style={{ background: "rgba(0,80,200,0.1)" }} />
      </div>

      {/* Memory indicator */}
      {memories.length > 0 && (
        <div className="mb-2 flex justify-end">
          <span
            className="rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(156, 124, 244, 0.1)",
              color: "rgba(156, 124, 244, 0.7)",
              border: "1px solid rgba(156, 124, 244, 0.2)",
            }}
          >
            🧠 {memories.length} memoria{memories.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Chat area */}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(230,242,255,0.4))",
          border: "1px solid rgba(200,220,255,0.4)",
        }}
      >
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex flex-col gap-2.5 overflow-y-auto p-3"
          style={{ height: "220px" }}
        >
          {messages.length === 0 && !typing && (
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
                <p className="text-[11px] leading-relaxed text-primary/80">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
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
                <p className="mt-0.5 text-[9px] italic tracking-wider text-primary/30">
                  Escribiendo...
                </p>
                <div className="mt-1 flex gap-1">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/30" style={{ animationDelay: "0ms" }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/30" style={{ animationDelay: "150ms" }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/30" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 p-3" style={{ borderTop: "1px solid rgba(200,220,255,0.3)" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }}
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
              background: loading ? "rgba(150,180,210,0.5)" : "linear-gradient(180deg, #4a9eff, #0066ff)",
              boxShadow: loading ? "none" : "0 2px 8px rgba(0,100,255,0.25)",
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
