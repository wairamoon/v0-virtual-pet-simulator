"use client"

import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { spendCoins, FEED_COST, loadCoins } from "@/lib/coins"
import { emitCoinChange } from "./user-header"

type FeedState = "idle" | "processing" | "success" | "error"

const feedResponses = [
  "¡Ñam ñam! Gracias 😋",
  "¡Delicioso! Me siento mejor 🍊",
  "¡Mmm qué rico! Energía recargada ✨",
  "¡Gracias por la comidita! 💚",
  "¡Nom nom nom! Eres el/la mejor 🌟",
]

interface Props {
  petName: string
  onFeed: () => void
  hungerValue: number
}

export function FeedButton({ petName, onFeed, hungerValue }: Props) {
  const { authenticated, user, login } = usePrivy()
  const [state, setState] = useState<FeedState>("idle")
  const [message, setMessage] = useState("")
  const [tooltip, setTooltip] = useState("")

  const canAfford = authenticated && user ? loadCoins(user.id).balance >= FEED_COST : false
  const hungerFull = hungerValue >= 100

  async function handleFeed() {
    if (state === "processing") return

    if (!authenticated || !user) {
      setTooltip("Inicia sesión para alimentar")
      setTimeout(() => setTooltip(""), 2500)
      login()
      return
    }

    if (hungerFull) {
      setTooltip("¡Tu PixSim ya está satisfecho!")
      setTimeout(() => setTooltip(""), 2500)
      return
    }

    if (!canAfford) {
      setTooltip("Habla conmigo para ganar 🍊")
      setTimeout(() => setTooltip(""), 2500)
      return
    }

    setState("processing")
    setMessage("⏳ Procesando…")

    // Small delay for feel
    await new Promise((r) => setTimeout(r, 600))

    const success = spendCoins(user.id, FEED_COST)
    if (!success) {
      setState("error")
      setMessage("No tienes suficientes 🍊")
      setTimeout(() => { setState("idle"); setMessage("") }, 2000)
      return
    }

    // Emit coin change for header animation
    emitCoinChange(-FEED_COST)

    // Apply hunger stat
    onFeed()

    // Show success
    const response = feedResponses[Math.floor(Math.random() * feedResponses.length)]
    setState("success")
    setMessage(`✅ ${response}`)

    setTimeout(() => {
      setState("idle")
      setMessage("")
    }, 2500)
  }

  const isDisabled = state === "processing"

  return (
    <div className="relative">
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-lg px-3 py-1 text-[9px] font-semibold tracking-wider animate-fade-in"
          style={{
            background: "rgba(255,87,34,0.1)",
            color: "#ff5722",
            border: "1px solid rgba(255,87,34,0.2)",
          }}
        >
          {tooltip}
        </div>
      )}

      {/* Feed button */}
      <button
        type="button"
        onClick={handleFeed}
        disabled={isDisabled}
        className="group w-full rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
        style={{
          background: isDisabled
            ? "rgba(200,220,240,0.5)"
            : "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,255,240,0.5))",
          border: `1px solid ${hungerFull ? "rgba(200,220,255,0.3)" : "rgba(76,175,80,0.3)"}`,
          boxShadow: isDisabled ? "none" : "0 2px 8px rgba(76,175,80,0.1)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg transition-transform duration-200 group-hover:scale-110">🍎</span>
            <div className="text-left">
              <span className="block text-[11px] font-bold tracking-wider text-primary">
                Alimentar
              </span>
              <span className="block text-[9px] font-semibold tracking-wider text-primary/40">
                {FEED_COST} 🍊 $FRUTA
              </span>
            </div>
          </div>

          {/* Status indicator */}
          <div className="text-right">
            {hungerFull && (
              <span className="text-[9px] font-semibold tracking-wider text-primary/40">
                Satisfecho ✨
              </span>
            )}
            {!authenticated && (
              <span className="text-[9px] font-semibold tracking-wider text-primary/40">
                Requiere login
              </span>
            )}
            {authenticated && !hungerFull && !canAfford && (
              <span className="text-[9px] font-semibold tracking-wider" style={{ color: "#ff5722" }}>
                Sin fondos
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Reaction message from PixSim */}
      {message && (
        <div
          className="mt-2 rounded-lg px-3 py-2 text-center text-[10px] font-semibold tracking-wider animate-fade-in"
          style={{
            background:
              state === "error"
                ? "rgba(255,87,34,0.08)"
                : state === "success"
                  ? "rgba(76,175,80,0.08)"
                  : "rgba(74,158,255,0.08)",
            color:
              state === "error"
                ? "#ff5722"
                : state === "success"
                  ? "#4caf50"
                  : "#4a9eff",
            border: `1px solid ${
              state === "error"
                ? "rgba(255,87,34,0.15)"
                : state === "success"
                  ? "rgba(76,175,80,0.15)"
                  : "rgba(74,158,255,0.15)"
            }`,
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}
