"use client"

import { useState, useCallback } from "react"
import { RegisterHub } from "./register-hub"

export function SocialTab() {
  const [hubId, setHubId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    const id = localStorage.getItem("hubRegenmonId")
    const reg = localStorage.getItem("isRegisteredInHub") === "true"
    return reg && id ? id : null
  })

  const handleRegistered = useCallback((id: string) => {
    setHubId(id)
  }, [])

  // Not registered yet — show register form
  if (!hubId) {
    return <RegisterHub onRegistered={handleRegistered} />
  }

  // Registered — show social panel (placeholder for now)
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "16px", padding: "24px", textAlign: "center",
    }}>
      <div style={{ fontSize: "48px" }}>✅</div>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
        ¡Conectado al HUB!
      </h2>
      <p style={{ fontSize: "13px", color: "#aaa" }}>
        Tu PixSim está registrado en el Social HUB.
      </p>
      <p style={{
        fontSize: "11px", color: "#666",
        background: "#1a1a2e", padding: "8px 12px",
        borderRadius: "8px", fontFamily: "monospace",
      }}>
        ID: {hubId}
      </p>
      <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
        🏆 Leaderboard e interacciones próximamente...
      </p>
    </div>
  )
}
