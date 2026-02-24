"use client"

import { useState, useEffect } from "react"
import { useHub, type LeaderboardEntry } from "../hooks/useHub"

interface LeaderboardProps {
  onViewProfile?: (id: string) => void
}

export function Leaderboard({ onViewProfile }: LeaderboardProps) {
  const { getLeaderboard, loading, error } = useHub()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [myId] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("hubRegenmonId")
      : null
  )

  useEffect(() => {
    fetchBoard()
  }, [])

  async function fetchBoard() {
    const result = await getLeaderboard()
    if (result?.data) {
      setEntries(result.data)
    }
  }

  const medals = ["🥇", "🥈", "🥉"]

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "12px",
      padding: "16px", width: "100%",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <h3 style={{
          fontSize: "16px", fontWeight: "bold", color: "#333",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          🏆 Leaderboard
        </h3>
        <button
          onClick={fetchBoard}
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

      {/* Error */}
      {error && (
        <p style={{
          fontSize: "12px", color: "#e67e22",
          background: "#fff8e1", padding: "8px 12px",
          borderRadius: "8px", textAlign: "center",
        }}>
          {error}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && entries.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              height: "56px", borderRadius: "12px",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
              animation: "pulse 1.5s infinite",
            }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && entries.length === 0 && !error && (
        <div style={{
          textAlign: "center", padding: "32px 16px", color: "#999",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🌱</div>
          <p style={{ fontSize: "13px" }}>
            Aún no hay jugadores. ¡Sé el primero!
          </p>
        </div>
      )}

      {/* Entries */}
      {entries.map((entry, i) => {
        const isMe = entry.id === myId
        const rank = i + 1

        return (
          <div
            key={entry.id}
            onClick={() => onViewProfile?.(entry.id)}
            role="button"
            style={{
              cursor: onViewProfile ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 14px",
              background: isMe
                ? "linear-gradient(135deg, rgba(77,201,246,0.15), rgba(77,103,255,0.10))"
                : "rgba(255,255,255,0.7)",
              borderRadius: "12px",
              border: isMe ? "2px solid #4dc9f6" : "1px solid rgba(0,0,0,0.06)",
              transition: "transform 0.15s",
            }}
          >
            {/* Rank */}
            <div style={{
              width: "32px", textAlign: "center",
              fontSize: rank <= 3 ? "20px" : "14px",
              fontWeight: "bold", color: "#888",
              flexShrink: 0,
            }}>
              {rank <= 3 ? medals[rank - 1] : `#${rank}`}
            </div>

            {/* Sprite */}
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "#f0f4f8", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              border: "2px solid rgba(0,0,0,0.08)",
            }}>
              {entry.sprite ? (
                <img
                  src={entry.sprite}
                  alt={entry.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              ) : (
                <span style={{ fontSize: "18px" }}>🐾</span>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "13px", fontWeight: "bold",
                color: isMe ? "#4d67ff" : "#333",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                {entry.name}
                {isMe && (
                  <span style={{
                    fontSize: "9px", background: "#4dc9f6", color: "#fff",
                    padding: "1px 5px", borderRadius: "4px", fontWeight: "normal",
                  }}>
                    TÚ
                  </span>
                )}
              </div>
              <div style={{ fontSize: "11px", color: "#999" }}>
                {entry.ownerName}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              textAlign: "right", flexShrink: 0,
            }}>
              <div style={{
                fontSize: "14px", fontWeight: "bold", color: "#4a9eff",
              }}>
                Lv.{entry.level ?? 1}
              </div>
              <div style={{ fontSize: "10px", color: "#aaa" }}>
                {entry.xp ?? 0} XP
              </div>
            </div>
          </div>
        )
      })}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
