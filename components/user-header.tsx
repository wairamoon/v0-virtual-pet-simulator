"use client"

import { usePrivy } from "@privy-io/react-auth"

const COINS_KEY_PREFIX = "pixsim-coins-"

function getUserCoins(userId: string): number {
  if (typeof window === "undefined") return 0
  try {
    return Number(localStorage.getItem(`${COINS_KEY_PREFIX}${userId}`)) || 0
  } catch {
    return 0
  }
}

export function UserHeader() {
  const { ready, authenticated, user, login, logout } = usePrivy()

  if (!ready) return null

  const displayName =
    user?.google?.name ||
    user?.email?.address ||
    user?.id?.slice(0, 10) ||
    "Usuario"

  const coins = authenticated && user ? getUserCoins(user.id) : 0

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2"
      style={{
        background:
          "linear-gradient(180deg, rgba(230,242,255,0.95), rgba(200,225,255,0.85))",
        borderBottom: "1px solid rgba(255,255,255,0.5)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left: user info */}
      <div className="flex items-center gap-2 min-w-0">
        {authenticated ? (
          <>
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #4a9eff, #0066ff)",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate text-[10px] font-semibold tracking-wider text-primary/70">
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
      <div className="flex items-center gap-1">
        <span className="text-sm">🍊</span>
        {authenticated ? (
          <span className="text-[11px] font-bold tracking-wider text-primary">
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
          className="rounded-lg px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-primary/50 transition-all hover:text-destructive"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,245,255,0.5))",
            border: "1px solid rgba(200,220,255,0.5)",
          }}
        >
          Cerrar Sesión
        </button>
      ) : (
        <button
          type="button"
          onClick={login}
          className="rounded-lg px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white transition-all"
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
