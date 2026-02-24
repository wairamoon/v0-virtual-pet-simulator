"use client"

import { useState, useCallback } from "react"
import { RegisterHub } from "./register-hub"
import { Leaderboard } from "./leaderboard"
import { PublicProfile } from "./public-profile"
import { ActivityFeed } from "./activity-feed"
import { useHubSync } from "../hooks/useHubSync"

type SocialView = "hub" | "profile"
type HubSection = "leaderboard" | "activity"

export function SocialTab() {
  const [view, setView] = useState<SocialView>("hub")
  const [profileId, setProfileId] = useState<string | null>(null)
  const [section, setSection] = useState<HubSection>("leaderboard")

  const [hubId, setHubId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    const id = localStorage.getItem("hubRegenmonId")
    const reg = localStorage.getItem("isRegisteredInHub") === "true"
    return reg && id ? id : null
  })

  // Auto-sync starts when registered
  useHubSync()

  const handleRegistered = useCallback((id: string) => {
    setHubId(id)
  }, [])

  function openProfile(id: string) {
    setProfileId(id)
    setView("profile")
  }

  // Not registered — show register form
  if (!hubId) {
    return <RegisterHub onRegistered={handleRegistered} />
  }

  // Viewing a profile
  if (view === "profile" && profileId) {
    return (
      <PublicProfile
        id={profileId}
        onBack={() => { setView("hub"); setProfileId(null) }}
      />
    )
  }

  // Registered — show HUB with sections
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "0",
      background: "rgba(255,255,255,0.85)",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.9)",
      backdropFilter: "blur(16px)",
      margin: "8px",
      overflow: "hidden",
    }}>

      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px 8px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "11px", color: "#4caf50",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#4caf50", display: "inline-block",
          }} />
          Conectado al HUB
        </div>
        <span style={{
          fontSize: "9px", color: "#aaa", fontFamily: "monospace",
          background: "#f5f5f5", padding: "2px 6px", borderRadius: "4px",
        }}>
          {hubId.slice(0, 8)}…
        </span>
      </div>

      {/* Section toggle */}
      <div style={{
        display: "flex", gap: "4px", padding: "0 16px 8px",
      }}>
        <SectionBtn
          active={section === "leaderboard"}
          onClick={() => setSection("leaderboard")}
          label="🏆 Ranking"
        />
        <SectionBtn
          active={section === "activity"}
          onClick={() => setSection("activity")}
          label="📡 Actividad"
        />
      </div>

      {/* Section content */}
      {section === "leaderboard" && (
        <Leaderboard onViewProfile={openProfile} />
      )}
      {section === "activity" && (
        <ActivityFeed onViewProfile={openProfile} />
      )}
    </div>
  )
}

// ─── Section button ─────────────────────────────────────
function SectionBtn({ active, onClick, label }: {
  active: boolean; onClick: () => void; label: string
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "8px", borderRadius: "8px", border: "none",
      fontSize: "12px", fontWeight: "bold", cursor: "pointer",
      transition: "all 0.15s",
      background: active ? "linear-gradient(135deg, #4dc9f6, #4d67ff)" : "#f0f0f0",
      color: active ? "#fff" : "#888",
    }}>
      {label}
    </button>
  )
}
