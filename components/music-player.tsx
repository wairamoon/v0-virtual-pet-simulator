"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [showTap, setShowTap] = useState(true)

  // Create audio element once
  useEffect(() => {
    const audio = new Audio("/audio/bgm.mp3")
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio

    audio.addEventListener("play", () => setPlaying(true))
    audio.addEventListener("pause", () => setPlaying(false))

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Try autoplay on first user interaction
  const startMusic = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.play().then(() => {
      setShowTap(false)
    }).catch(() => {
      // Browser blocked autoplay — keep tap prompt
    })
  }, [])

  // Listen for first interaction anywhere
  useEffect(() => {
    const handler = () => startMusic()
    document.addEventListener("click", handler, { once: true })
    document.addEventListener("touchstart", handler, { once: true })
    return () => {
      document.removeEventListener("click", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [startMusic])

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      setShowTap(false)
    }
  }

  return (
    <>
      {/* Tap to start overlay — only shows until first interaction */}
      {showTap && !playing && (
        <div
          onClick={startMusic}
          style={{
            position: "fixed", bottom: "80px", left: "50%",
            transform: "translateX(-50%)", zIndex: 9998,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            padding: "8px 18px", borderRadius: "20px",
            fontSize: "12px", color: "#fff", cursor: "pointer",
            animation: "fadeInUp 0.5s ease",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          🎵 Toca para activar música
        </div>
      )}

      {/* Floating mute/unmute button */}
      <button
        onClick={toggle}
        style={{
          position: "fixed", bottom: "20px", left: "20px",
          zIndex: 9999, width: "40px", height: "40px",
          borderRadius: "50%", border: "none", cursor: "pointer",
          background: playing
            ? "linear-gradient(135deg, #4dc9f6, #4d67ff)"
            : "rgba(0,0,0,0.4)",
          color: "#fff", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
          boxShadow: playing
            ? "0 2px 12px rgba(77,201,246,0.4)"
            : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "all 0.2s",
        }}
        aria-label={playing ? "Silenciar música" : "Activar música"}
      >
        {playing ? "🔊" : "🔇"}
      </button>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  )
}
