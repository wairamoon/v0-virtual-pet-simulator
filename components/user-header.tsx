"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useState, useEffect, useCallback } from "react"
import { loadCoins } from "@/lib/coins"

interface FloatingText {
  id: number
  text: string
  color: string
}

let floatId = 0

export function UserHeader() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const [coins, setCoins] = useState(0)
  const [floats, setFloats] = useState<FloatingText[]>([])

  // Poll coins from localStorage every 500ms (for cross-component updates)
  useEffect(() => {
    if (!authenticated || !user) return
    const update = () => setCoins(loadCoins(user.id).balance)
    update()
    const iv = setInterval(update, 500)
    return () => clearInterval(iv)
  }, [authenticated, user])

  // Listen for custom coin events
  useEffect(() => {
    function onCoinChange(e: Event) {
      const detail = (e as CustomEvent).detail
      if (detail?.amount && detail.amount !== 0) {
        const id = ++floatId
        const isGain = detail.amount > 0
        setFloats((prev) => [
          ...prev,
          {
            id,
            text: isGain ? `+${detail.amount} 🍊` : `${detail.amount} 🍊`,
            color: isGain ? "#4caf50" : "#ff5722",
          },
        ])
        setTimeout(() => setFloats((prev) => prev.filter((f) => f.id !== id)), 2200)
      }
      // Update balance
      if (user) setCoins(loadCoins(user.id).balance)
    }
    window.addEventListener("pixsim-coins", onCoinChange)
    return () => window.removeEventListener("pixsim-coins", onCoinChange)
  }, [user])

  if (!ready) return null

  const displayName =
    user?.google?.name ||
    user?.email?.address ||
    user?.id?.slice(0, 10) ||
    "Usuario"

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2"
      style={{
        background: "linear-gradient(180deg, rgba(230,242,255,0.95), rgba(200,225,255,0.85))",
        borderBottom: "1px solid rgba(255,255,255,0.5)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Floating coin animations */}
      <style jsx>{`
        @keyframes coinFloat {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          60% { opacity: 1; transform: translateY(-18px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-28px) scale(0.8); }
        }
      `}</style>

      {/* Left: user info */}
      <div className="flex items-center gap-2 min-w-0">
        {authenticated ? (
          <>
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #4a9eff, #0066ff)" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate text-[10px] font-semibold tracking-wider text-primary/70 max-w-[80px]">
              {displayName}
            </span>
          </>
        ) : (
          <span className="text-[10px] font-semibold tracking-wider text-primary/40">
            No conectado
          </span>
        )}
      </div>

      {/* Center: coins */}
      <div className="relative flex items-center gap-1">
        {/* Float animations */}
        <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
          {floats.map((f) => (
            <span
              key={f.id}
              className="whitespace-nowrap text-[11px] font-bold"
              style={{ color: f.color, animation: "coinFloat 2.2s ease-out forwards" }}
            >
              {f.text}
            </span>
          ))}
        </div>

        <span className="text-sm">🍊</span>
        {authenticated ? (
          <span className="text-[11px] font-bold tracking-wider text-primary transition-all">
            {coins} <span className="text-primary/50">$FRUTA</span>
          </span>
        ) : (
          <span className="text-[11px] font-semibold tracking-wider text-primary/40">
            — <span>$FRUTA</span>
          </span>
        )}
      </div>

      {/* Right: auth button */}
      {authenticated ? (
        <button
          type="button"
          onClick={logout}
          className="rounded-lg px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-primary/50 transition-all hover:text-destructive hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,245,255,0.5))",
            border: "1px solid rgba(200,220,255,0.5)",
          }}
        >
          Cerrar Sesión
        </button>
      ) : (
        <button
          type="button"
          onClick={login}
          className="rounded-lg px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(180deg, #4a9eff, #0066ff)",
            boxShadow: "0 2px 8px rgba(0,100,255,0.25)",
          }}
        >
          Iniciar Sesión
        </button>
      )}
    </div>
  )
}

/** Dispatch coin change event (call from other components) */
export function emitCoinChange(amount: number) {
  window.dispatchEvent(new CustomEvent("pixsim-coins", { detail: { amount } }))
}
