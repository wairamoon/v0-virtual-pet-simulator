"use client"

import { useState, useEffect } from "react"
import { useHub } from "../hooks/useHub"

interface RegisterHubProps {
  onRegistered: (hubId: string) => void
}

export function RegisterHub({ onRegistered }: RegisterHubProps) {
  const [email, setEmail] = useState("")
  const { registerRegenmon, loading, error } = useHub()

  // Check if already registered on mount
  useEffect(() => {
    const hubId = localStorage.getItem("hubRegenmonId")
    const isRegistered = localStorage.getItem("isRegisteredInHub") === "true"
    if (isRegistered && hubId) {
      onRegistered(hubId)
    }
  }, [onRegistered])

  async function handleRegister() {
    // Read pet data from localStorage
    const raw = localStorage.getItem("pixsim-data")
    if (!raw) return

    const petData = JSON.parse(raw)
    const appUrl = window.location.origin
    const sprite = `${appUrl}/pixel-${petData.energy || "water"}.png`

    const result = await registerRegenmon({
      name: petData.name || "PixSim",
      ownerName: petData.name || "Anónimo",
      appUrl,
      sprite,
      email: email.trim() || undefined,
    })

    const id = result?.data?.id
    if (id) {
      localStorage.setItem("hubRegenmonId", id)
      localStorage.setItem("isRegisteredInHub", "true")
      onRegistered(id)
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "16px", padding: "24px", textAlign: "center",
      background: "rgba(255,255,255,0.85)",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.9)",
      backdropFilter: "blur(16px)",
      margin: "8px",
    }}>
      <div style={{ fontSize: "48px" }}>🌍</div>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#4a9eff" }}>
        Unirse al Social HUB
      </h2>
      <p style={{ fontSize: "13px", color: "#666", maxWidth: "280px" }}>
        Conecta tu PixSim con otros jugadores. Comparte tu progreso y compite en el leaderboard.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (opcional)"
        style={{
          width: "100%", maxWidth: "280px", padding: "10px 14px",
          borderRadius: "10px", border: "1px solid #ccc",
          background: "#fff", color: "#333", fontSize: "14px",
          outline: "none",
        }}
      />

      {error && (
        <p style={{ fontSize: "12px", color: "#e67e22" }}>{error}</p>
      )}

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          width: "100%", maxWidth: "280px", padding: "12px",
          borderRadius: "10px", border: "none",
          background: loading ? "#aaa" : "linear-gradient(135deg, #4dc9f6, #4d67ff)",
          color: "#fff", fontSize: "14px", fontWeight: "bold",
          cursor: loading ? "default" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {loading ? "Registrando..." : "🚀 Registrar mi PixSim"}
      </button>
    </div>
  )
}
