"use client"

import { useEffect, useState } from "react"

interface Bubble {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function AeroBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    const generated: Bubble[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 12 + Math.random() * 60,
      duration: 10 + Math.random() * 18,
      delay: Math.random() * 12,
      opacity: 0.08 + Math.random() * 0.18,
    }))
    setBubbles(generated)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Main blue sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #d6eeff 0%, #aed8f7 25%, #8ec5f0 50%, #b8d9f8 75%, #daeeff 100%)",
        }}
      />

      {/* Glossy shine overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 75% 70%, rgba(255,255,255,0.3) 0%, transparent 55%)",
        }}
      />

      {/* Soft orbs / star shapes */}
      <div
        className="absolute left-[10%] top-[15%] h-32 w-32 rounded-full blur-[50px]"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}
      />
      <div
        className="absolute right-[15%] top-[25%] h-24 w-24 rounded-full blur-[40px]"
        style={{ backgroundColor: "rgba(200, 230, 255, 0.5)" }}
      />
      <div
        className="absolute bottom-[20%] left-[20%] h-40 w-40 rounded-full blur-[60px]"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.35)" }}
      />
      <div
        className="absolute bottom-[30%] right-[10%] h-28 w-28 rounded-full blur-[45px]"
        style={{ backgroundColor: "rgba(180, 220, 255, 0.4)" }}
      />
      <div
        className="absolute left-[50%] top-[60%] h-20 w-20 rounded-full blur-[35px]"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      />

      {/* Animated translucent bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), rgba(180,220,255,0.3) 60%, rgba(140,200,255,0.1))",
            border: "1px solid rgba(255,255,255,0.4)",
            animation: `bubble-float ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
