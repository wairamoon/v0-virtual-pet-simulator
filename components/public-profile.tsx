"use client"

import { useState, useEffect, useCallback } from "react"
import { useHub, type HubRegenmon } from "../hooks/useHub"

// ─── Costs & Config ─────────────────────────────────────
const ACTION_COSTS = {
  feed: 10,       // 🍎 Alimentar cuesta 10 puntos
  gift: 25,       // 🎁 Regalar cuesta 25 puntos
  message: 5,     // 📨 Mensaje cuesta 5 puntos
} as const

const COOLDOWNS = {
  feed: 30_000,    // 30s
  gift: 60_000,    // 1min per item
  message: 5_000,  // 5s anti-spam
} as const

const GIFTS = [
  { emoji: "🧸", name: "Peluche", item: "peluche" },
  { emoji: "🎵", name: "Música", item: "musica" },
  { emoji: "⚽", name: "Juguete", item: "juguete" },
] as const

const STORAGE_KEY = "pixsim-data"

// ─── Balance Helpers ────────────────────────────────────
function getBalance(): number {
  if (typeof window === "undefined") return 0
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const data = JSON.parse(raw)
    return data.totalPoints ?? data.xp ?? 0
  } catch { return 0 }
}

function deductBalance(cost: number): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    const current = data.totalPoints ?? data.xp ?? 0
    if (current < cost) return false
    data.totalPoints = current - cost
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch { return false }
}

function refundBalance(cost: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    data.totalPoints = (data.totalPoints ?? 0) + cost
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* silent */ }
}

// ─── Component ──────────────────────────────────────────
interface PublicProfileProps {
  id: string
  onBack: () => void
}

export function PublicProfile({ id, onBack }: PublicProfileProps) {
  const {
    getRegenmonById, feedRegenmon, giftRegenmon, sendMessage,
    loading, error, clearError,
  } = useHub()

  const [profile, setProfile] = useState<HubRegenmon | null>(null)
  const [message, setMessage] = useState("")
  const [balance, setBalance] = useState(() => getBalance())

  // Cooldowns: track per-action
  const [feedCooldown, setFeedCooldown] = useState(false)
  const [giftCooldowns, setGiftCooldowns] = useState<Record<string, boolean>>({})
  const [msgCooldown, setMsgCooldown] = useState(false)

  // Feedback toasts
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // Identity — STRICT check
  const myHubId = typeof window !== "undefined"
    ? localStorage.getItem("hubRegenmonId")
    : null
  const isMyProfile = !myHubId || myHubId === id

  // Refresh balance from localStorage
  const refreshBalance = useCallback(() => setBalance(getBalance()), [])

  useEffect(() => {
    loadProfile()
  }, [id])

  async function loadProfile() {
    clearError()
    const result = await getRegenmonById(id)
    if (result?.data) setProfile(result.data)
  }

  function showToast(text: string, type: "success" | "error" = "success") {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ─── Guard: Can afford? ────────────────────────────
  function canAfford(action: keyof typeof ACTION_COSTS): boolean {
    return balance >= ACTION_COSTS[action]
  }

  // ─── FEED ─────────────────────────────────────────
  async function handleFeed() {
    if (isMyProfile || !myHubId) return
    if (feedCooldown) return
    if (!canAfford("feed")) {
      showToast(`Necesitas ${ACTION_COSTS.feed} puntos para alimentar 🍎`, "error")
      return
    }

    // Deduct BEFORE request (optimistic)
    if (!deductBalance(ACTION_COSTS.feed)) {
      showToast("Balance insuficiente 🍎", "error")
      return
    }
    refreshBalance()

    const result = await feedRegenmon(id, myHubId)

    if (result) {
      // Update displayed stats
      if (result.data?.stats) {
        setProfile((p) => p ? { ...p, stats: result.data.stats } : p)
      }
      setFeedCooldown(true)
      setTimeout(() => setFeedCooldown(false), COOLDOWNS.feed)
      showToast(`¡Alimentaste a ${profile?.name}! -${ACTION_COSTS.feed} pts`)
    } else {
      // REFUND on failure
      refundBalance(ACTION_COSTS.feed)
      refreshBalance()
      showToast("No se pudo alimentar. Puntos devueltos 🔄", "error")
    }
  }

  // ─── GIFT ─────────────────────────────────────────
  async function handleGift(item: string, emoji: string) {
    if (isMyProfile || !myHubId) return
    if (giftCooldowns[item]) return
    if (!canAfford("gift")) {
      showToast(`Necesitas ${ACTION_COSTS.gift} puntos para regalar 🎁`, "error")
      return
    }

    if (!deductBalance(ACTION_COSTS.gift)) {
      showToast("Balance insuficiente 🎁", "error")
      return
    }
    refreshBalance()

    const result = await giftRegenmon(id, myHubId, item)

    if (result) {
      setGiftCooldowns((c) => ({ ...c, [item]: true }))
      setTimeout(() => setGiftCooldowns((c) => ({ ...c, [item]: false })), COOLDOWNS.gift)
      showToast(`${emoji} ¡Regalaste ${item}! -${ACTION_COSTS.gift} pts`)
    } else {
      refundBalance(ACTION_COSTS.gift)
      refreshBalance()
      showToast("No se pudo enviar el regalo. Puntos devueltos 🔄", "error")
    }
  }

  // ─── MESSAGE ──────────────────────────────────────
  async function handleSendMessage() {
    if (isMyProfile || !myHubId) return
    if (msgCooldown || !message.trim()) return
    if (!canAfford("message")) {
      showToast(`Necesitas ${ACTION_COSTS.message} puntos para enviar mensaje 📨`, "error")
      return
    }

    if (!deductBalance(ACTION_COSTS.message)) {
      showToast("Balance insuficiente 📨", "error")
      return
    }
    refreshBalance()

    const text = message.trim()
    setMessage("") // Clear immediately for UX

    const result = await sendMessage(myHubId, id, text)

    if (result) {
      setMsgCooldown(true)
      setTimeout(() => setMsgCooldown(false), COOLDOWNS.message)
      showToast(`📨 Mensaje enviado -${ACTION_COSTS.message} pts`)
    } else {
      refundBalance(ACTION_COSTS.message)
      refreshBalance()
      setMessage(text) // Restore message on failure
      showToast("No se pudo enviar. Puntos devueltos 🔄", "error")
    }
  }

  // ─── Render: Loading ──────────────────────────────
  if (loading && !profile) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px", animation: "pulse 1.5s infinite" }}>🔍</div>
          <p style={{ fontSize: "13px" }}>Cargando perfil...</p>
        </div>
        <style>{animations}</style>
      </div>
    )
  }

  // ─── Render: Not found ────────────────────────────
  if (!profile) {
    return (
      <div style={containerStyle}>
        <button onClick={onBack} style={backBtnStyle}>← Volver</button>
        <div style={{ textAlign: "center", padding: "32px", color: "#999" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>😶‍🌫️</div>
          <p style={{ fontSize: "13px" }}>{error || "No se encontró este PixSim"}</p>
        </div>
      </div>
    )
  }

  const stats = profile.stats

  return (
    <div style={containerStyle}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
          padding: "10px 20px", borderRadius: "12px", zIndex: 9999,
          fontSize: "13px", fontWeight: "bold", color: "#fff",
          background: toast.type === "success"
            ? "linear-gradient(135deg, #66bb6a, #43a047)"
            : "linear-gradient(135deg, #ef5350, #c62828)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          animation: "slideDown 0.3s ease",
        }}>
          {toast.text}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "0 0 8px",
      }}>
        <button onClick={onBack} style={backBtnStyle}>←</button>
        <span style={{ fontSize: "14px", fontWeight: "bold", color: "#333", flex: 1 }}>
          Perfil
        </span>
        {isMyProfile && (
          <span style={badgeStyle("#4dc9f6")}>TÚ</span>
        )}
      </div>

      {/* ── Avatar + Name ── */}
      <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: "#f0f4f8", margin: "0 auto 12px",
          overflow: "hidden", display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "3px solid rgba(77,201,246,0.3)",
        }}>
          {profile.sprite ? (
            <img
              src={profile.sprite} alt={profile.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
          ) : (
            <span style={{ fontSize: "36px" }}>🐾</span>
          )}
        </div>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: 0 }}>
          {profile.name}
        </h2>
        <p style={{ fontSize: "12px", color: "#999", margin: "2px 0 0" }}>
          de {profile.ownerName}
        </p>
      </div>

      {/* ── Stats Grid ── */}
      {stats && (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px", padding: "0 0 16px",
        }}>
          <StatBox label="Nivel" value={`${stats.level ?? 1}`} icon="⭐" />
          <StatBox label="XP" value={`${stats.xp ?? 0}`} icon="✨" />
          <StatBox label="Energía" value={`${stats.energy ?? 0}`} icon="⚡" />
          <StatBox label="Hambre" value={`${stats.hunger ?? 0}`} icon="🍎" />
          <StatBox label="Felicidad" value={`${stats.happiness ?? 0}`} icon="💛" />
        </div>
      )}

      {/* ── Error from useHub ── */}
      {error && (
        <p style={{
          fontSize: "12px", color: "#e67e22", textAlign: "center",
          background: "#fff8e1", padding: "8px", borderRadius: "8px",
          marginBottom: "12px",
        }}>
          {error}
        </p>
      )}

      {/* ── Actions (ONLY others) ── */}
      {!isMyProfile && myHubId && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* Balance bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 12px", borderRadius: "10px",
            background: balance > 0 ? "linear-gradient(135deg, #fff8e1, #fff3e0)" : "#fce4ec",
            border: `1px solid ${balance > 0 ? "#ffe0b2" : "#f8bbd0"}`,
          }}>
            <span style={{ fontSize: "12px", color: "#666" }}>Tu balance</span>
            <span style={{
              fontSize: "16px", fontWeight: "bold",
              color: balance > 0 ? "#f57c00" : "#c62828",
            }}>
              {balance} pts
            </span>
          </div>

          {/* Feed button */}
          <ActionButton
            onClick={handleFeed}
            disabled={loading || feedCooldown || !canAfford("feed")}
            active={!feedCooldown && canAfford("feed")}
            gradient={["#66bb6a", "#43a047"]}
          >
            {feedCooldown
              ? "🍎 Ya lo alimentaste (30s)"
              : `🍎 Alimentar · ${ACTION_COSTS.feed} pts`}
          </ActionButton>

          {/* Gifts row */}
          <div style={{ display: "flex", gap: "8px" }}>
            {GIFTS.map((g) => {
              const onCooldown = giftCooldowns[g.item]
              const afford = canAfford("gift")
              return (
                <ActionButton
                  key={g.item}
                  onClick={() => handleGift(g.item, g.emoji)}
                  disabled={loading || onCooldown || !afford}
                  active={!onCooldown && afford}
                  gradient={["#ab47bc", "#8e24aa"]}
                  style={{ flex: 1, fontSize: "11px", padding: "8px 4px" }}
                >
                  {onCooldown ? `${g.emoji} ✓` : `${g.emoji} ${g.name}`}
                </ActionButton>
              )
            })}
          </div>
          <p style={{ fontSize: "10px", color: "#aaa", textAlign: "center", margin: "-4px 0 0" }}>
            Cada regalo cuesta {ACTION_COSTS.gift} pts
          </p>

          {/* Message */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={canAfford("message") ? "Enviar mensaje..." : "Sin puntos para mensaje"}
              maxLength={140}
              disabled={!canAfford("message") || msgCooldown}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              style={{
                flex: 1, padding: "10px 12px", borderRadius: "10px",
                border: "1px solid #ddd", fontSize: "13px",
                background: canAfford("message") ? "#fff" : "#f5f5f5",
                color: "#333", outline: "none",
                opacity: canAfford("message") ? 1 : 0.5,
              }}
            />
            <ActionButton
              onClick={handleSendMessage}
              disabled={loading || !message.trim() || msgCooldown || !canAfford("message")}
              active={!!message.trim() && !msgCooldown && canAfford("message")}
              gradient={["#4dc9f6", "#4d67ff"]}
              style={{ width: "44px", padding: "0", flexShrink: 0 }}
            >
              📨
            </ActionButton>
          </div>
          <p style={{ fontSize: "10px", color: "#aaa", textAlign: "center", margin: "-4px 0 0" }}>
            Mensaje · {ACTION_COSTS.message} pts
          </p>
        </div>
      )}

      {/* ── Own profile notice ── */}
      {isMyProfile && (
        <div style={{
          textAlign: "center", padding: "16px",
          background: "#f0f8ff", borderRadius: "10px",
          color: "#666", fontSize: "12px",
        }}>
          👋 Este es tu perfil. Otros jugadores pueden alimentar, regalar y escribirte desde aquí.
        </div>
      )}

      <style>{animations}</style>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.8)", borderRadius: "10px",
      padding: "8px", textAlign: "center",
      border: "1px solid rgba(0,0,0,0.05)",
    }}>
      <div style={{ fontSize: "16px" }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{value}</div>
      <div style={{ fontSize: "9px", color: "#999" }}>{label}</div>
    </div>
  )
}

function ActionButton({
  children, onClick, disabled, active, gradient, style,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  active: boolean
  gradient: [string, string]
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px", borderRadius: "10px", border: "none",
        color: "#fff", fontSize: "13px", fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        background: active
          ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
          : "#ccc",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── Styles ─────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: "4px",
  padding: "16px",
  background: "rgba(255,255,255,0.85)",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.9)",
  backdropFilter: "blur(16px)",
  margin: "8px",
}

const backBtnStyle: React.CSSProperties = {
  background: "none", border: "1px solid #ddd",
  borderRadius: "8px", padding: "4px 10px",
  fontSize: "13px", color: "#666", cursor: "pointer",
}

function badgeStyle(bg: string): React.CSSProperties {
  return {
    fontSize: "9px", background: bg, color: "#fff",
    padding: "2px 8px", borderRadius: "4px",
  }
}

const animations = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes slideDown {
    from { opacity:0; transform: translateX(-50%) translateY(-10px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }
`
