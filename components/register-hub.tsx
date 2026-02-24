"use client"

import { useState, useEffect } from "react"

interface RegisterHubProps {
  onRegistered: (hubId: string) => void
}

export function RegisterHub({ onRegistered }: RegisterHubProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if already registered on mount
  useEffect(() => {
    const hubId = localStorage.getItem("hubRegenmonId")
    const isRegistered = localStorage.getItem("isRegisteredInHub") === "true"
    if (isRegistered && hubId) {
      onRegistered(hubId)
    }
  }, [onRegistered])

  async function handleRegister() {
    setLoading(true)
    setError(null)

    try {
      // Read pet data from localStorage
      const raw = localStorage.getItem("pixsim-data")
      if (!raw) {
        setError("No se encontró tu PixSim. Crea uno primero.")
        setLoading(false)
        return
      }

      const petData = JSON.parse(raw)
      const name = petData.name || "PixSim"
      const ownerName = petData.name || "Anónimo"
      const appUrl = window.location.origin
      // Generate sprite from character energy type
      const sprite = `${appUrl}/pixel-${petData.energy || "water"}.png`

      const res = await fetch("https://regenmon-final.vercel.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ownerName,
          appUrl,
          sprite,
          email: email.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok && data.data?.id) {
        localStorage.setItem("hubRegenmonId", data.data.id)
        localStorage.setItem("isRegisteredInHub", "true")
        onRegistered(data.data.id)
      } else if (data.alreadyRegistered && data.data?.id) {
        localStorage.setItem("hubRegenmonId", data.data.id)
        localStorage.setItem("isRegisteredInHub", "true")
        onRegistered(data.data.id)
      } else {
        setError(data.error || "Error al registrar. Intenta de nuevo.")
      }
    } catch (e) {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "16px", padding: "24px", textAlign: "center",
    }}>
      <div style={{ fontSize: "48px" }}>🌍</div>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
        Unirse al Social HUB
      </h2>
      <p style={{ fontSize: "13px", color: "#aaa", maxWidth: "280px" }}>
        Conecta tu PixSim con otros jugadores. Comparte tu progreso y compite en el leaderboard.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (opcional)"
        style={{
          width: "100%", maxWidth: "280px", padding: "10px 14px",
          borderRadius: "10px", border: "1px solid #333",
          background: "#1a1a2e", color: "#fff", fontSize: "14px",
          outline: "none",
        }}
      />

      {error && (
        <p style={{ fontSize: "12px", color: "#ff6b6b" }}>{error}</p>
      )}

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          width: "100%", maxWidth: "280px", padding: "12px",
          borderRadius: "10px", border: "none",
          background: loading ? "#555" : "linear-gradient(135deg, #4dc9f6, #4d67ff)",
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
