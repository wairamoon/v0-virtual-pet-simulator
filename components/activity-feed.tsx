"use client"

import { useState, useEffect, useCallback } from "react"
import { useHub, type ActivityEntry, type HubMessage } from "../hooks/useHub"

// ─── Config ─────────────────────────────────────────────
const REFRESH_INTERVAL = 60_000 // 1 min auto-refresh
const MAX_ITEMS = 20

type Tab = "global" | "messages"

// ─── Time formatting ────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "ahora"
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}

function activityIcon(type: string): string {
  const icons: Record<string, string> = {
    register: "🆕",
    feed: "🍎",
    gift: "🎁",
    message: "📨",
    sync: "🔄",
    evolve: "⭐",
    train: "🏋️",
    levelup: "🎉",
  }
  return icons[type] || "📌"
}

// ─── Component ──────────────────────────────────────────
interface ActivityFeedProps {
  onViewProfile?: (id: string) => void
}

export function ActivityFeed({ onViewProfile }: ActivityFeedProps) {
  const { getActivity, getMessages, loading, error } = useHub()

  const [tab, setTab] = useState<Tab>("global")
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [messages, setMessages] = useState<HubMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const myHubId = typeof window !== "undefined"
    ? localStorage.getItem("hubRegenmonId")
    : null

  // ─── Fetch ──────────────────────────────────────────
  const fetchActivity = useCallback(async () => {
    const result = await getActivity()
    if (result?.data) {
      setActivities(result.data.slice(0, MAX_ITEMS))
    }
  }, [getActivity])

  const fetchMessages = useCallback(async () => {
    if (!myHubId) return
    const result = await getMessages(myHubId)
    if (result?.data) {
      setMessages(result.data.slice(0, MAX_ITEMS))

      // Count unread (messages since last seen)
      const lastSeen = localStorage.getItem("pixsim-lastMsgSeen") || "0"
      const unread = result.data.filter(
        (m) => new Date(m.createdAt).getTime() > Number(lastSeen)
      ).length
      setUnreadCount(unread)
    }
  }, [getMessages, myHubId])

  // Initial load + auto-refresh
  useEffect(() => {
    fetchActivity()
    if (myHubId) fetchMessages()

    const interval = setInterval(() => {
      fetchActivity()
      if (myHubId) fetchMessages()
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchActivity, fetchMessages, myHubId])

  // Mark messages as seen when switching to messages tab
  function handleTabChange(t: Tab) {
    setTab(t)
    if (t === "messages" && messages.length > 0) {
      localStorage.setItem("pixsim-lastMsgSeen", String(Date.now()))
      setUnreadCount(0)
    }
  }

  // ─── Render ─────────────────────────────────────────
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "8px",
      padding: "16px", width: "100%",
    }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <h3 style={{
          fontSize: "16px", fontWeight: "bold", color: "#333",
          display: "flex", alignItems: "center", gap: "8px", margin: 0,
        }}>
          📡 Actividad
        </h3>
        <button
          onClick={() => { fetchActivity(); if (myHubId) fetchMessages() }}
          disabled={loading}
          style={{
            background: "none", border: "1px solid #ddd",
            borderRadius: "8px", padding: "4px 10px",
            fontSize: "12px", color: "#666", cursor: "pointer",
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "⏳" : "🔄"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px" }}>
        <TabButton
          active={tab === "global"}
          onClick={() => handleTabChange("global")}
          label="🌍 Global"
        />
        <TabButton
          active={tab === "messages"}
          onClick={() => handleTabChange("messages")}
          label="💬 Mensajes"
          badge={unreadCount > 0 ? unreadCount : undefined}
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{
          fontSize: "12px", color: "#e67e22",
          background: "#fff8e1", padding: "8px 12px",
          borderRadius: "8px", textAlign: "center", margin: 0,
        }}>
          {error}
        </p>
      )}

      {/* Content */}
      <div style={{
        display: "flex", flexDirection: "column", gap: "6px",
        maxHeight: "320px", overflowY: "auto",
        paddingRight: "4px",
      }}>
        {tab === "global" && (
          activities.length === 0 && !loading ? (
            <EmptyState emoji="🌱" text="Sin actividad aún. ¡Sé el primero!" />
          ) : (
            activities.map((a) => (
              <ActivityRow
                key={a.id}
                icon={activityIcon(a.type)}
                actor={a.actorName}
                text={a.description}
                time={timeAgo(a.createdAt)}
              />
            ))
          )
        )}

        {tab === "messages" && (
          !myHubId ? (
            <EmptyState emoji="🔒" text="Regístrate en el HUB para ver mensajes" />
          ) : messages.length === 0 && !loading ? (
            <EmptyState emoji="📭" text="No tienes mensajes aún" />
          ) : (
            messages.map((m) => (
              <MessageRow
                key={m.id}
                from={m.fromName}
                fromId={m.fromId}
                text={m.text}
                time={timeAgo(m.createdAt)}
                isFromMe={m.fromId === myHubId}
                onTapSender={onViewProfile}
              />
            ))
          )
        )}

        {/* Loading skeletons */}
        {loading && activities.length === 0 && messages.length === 0 && (
          [1, 2, 3].map((i) => (
            <div key={i} style={{
              height: "48px", borderRadius: "10px",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
              animation: "pulse 1.5s infinite",
            }} />
          ))
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────

function TabButton({ active, onClick, label, badge }: {
  active: boolean; onClick: () => void; label: string; badge?: number
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "8px", borderRadius: "8px", border: "none",
      fontSize: "12px", fontWeight: "bold", cursor: "pointer",
      transition: "all 0.15s", position: "relative",
      background: active ? "linear-gradient(135deg, #4dc9f6, #4d67ff)" : "#f0f0f0",
      color: active ? "#fff" : "#666",
    }}>
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          position: "absolute", top: "-4px", right: "-2px",
          background: "#ef5350", color: "#fff",
          fontSize: "9px", fontWeight: "bold",
          padding: "1px 5px", borderRadius: "10px",
          minWidth: "16px", textAlign: "center",
        }}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  )
}

function ActivityRow({ icon, actor, text, time }: {
  icon: string; actor: string; text: string; time: string
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      padding: "8px 10px", borderRadius: "10px",
      background: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(0,0,0,0.04)",
    }}>
      <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "12px", color: "#333", margin: 0,
          lineHeight: "1.4",
        }}>
          <strong>{actor}</strong>{" "}
          <span style={{ color: "#666" }}>{text}</span>
        </p>
        <p style={{ fontSize: "10px", color: "#aaa", margin: "2px 0 0" }}>{time}</p>
      </div>
    </div>
  )
}

function MessageRow({ from, fromId, text, time, isFromMe, onTapSender }: {
  from: string; fromId: string; text: string; time: string
  isFromMe: boolean; onTapSender?: (id: string) => void
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      padding: "8px 10px", borderRadius: "10px",
      background: isFromMe
        ? "rgba(77,103,255,0.06)"
        : "rgba(255,255,255,0.7)",
      border: `1px solid ${isFromMe ? "rgba(77,103,255,0.12)" : "rgba(0,0,0,0.04)"}`,
    }}>
      <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>
        {isFromMe ? "📤" : "📩"}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>
          {isFromMe ? (
            <span style={{ color: "#999" }}>Tú enviaste</span>
          ) : (
            <strong
              onClick={() => onTapSender?.(fromId)}
              style={{
                color: "#4d67ff",
                cursor: onTapSender ? "pointer" : "default",
                textDecoration: onTapSender ? "underline dotted" : "none",
              }}
            >
              {from}
            </strong>
          )}
        </p>
        <p style={{
          fontSize: "12px", color: "#444", margin: "2px 0 0",
          lineHeight: "1.3", wordBreak: "break-word",
        }}>
          {text}
        </p>
        <p style={{ fontSize: "10px", color: "#aaa", margin: "2px 0 0" }}>{time}</p>
      </div>
    </div>
  )
}

function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div style={{
      textAlign: "center", padding: "28px 16px", color: "#999",
    }}>
      <div style={{ fontSize: "36px", marginBottom: "8px" }}>{emoji}</div>
      <p style={{ fontSize: "12px", margin: 0 }}>{text}</p>
    </div>
  )
}
