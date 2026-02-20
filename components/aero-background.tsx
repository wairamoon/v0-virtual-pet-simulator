"use client"

import { useEffect, useState } from "react"

interface Sparkle {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

export function AeroBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    setSparkles(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 5 + Math.random() * 55,
        size: 1.5 + Math.random() * 3,
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 5,
      }))
    )
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <style jsx>{`
        @keyframes sparkle-pulse {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 0.7; transform: scale(1); }
        }
      `}</style>

      {/* Layer 1: Windows XP Bliss wallpaper image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/bg-bliss.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Layer 2: Subtle cyber grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Layer 3: Sparkles / digital glint */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: "rgba(255,255,255,0.9)",
            boxShadow: `0 0 ${s.size * 3}px rgba(200,230,255,0.5), 0 0 ${s.size}px rgba(255,255,255,0.8)`,
            animation: `sparkle-pulse ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 50%, rgba(0,0,0,0.06) 100%)",
        }}
      />
    </div>
  )
}
