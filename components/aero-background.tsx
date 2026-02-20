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
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70, // only in sky area
        size: 2 + Math.random() * 4,
        delay: Math.random() * 8,
        duration: 3 + Math.random() * 4,
      }))
    )
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Layer 1: Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a8fe0 0%, #4ab3f4 30%, #7ccbf9 50%, #a8ddf7 62%, #4caf50 62%, #3d9142 75%, #2e7d32 100%)",
        }}
      />

      {/* Horizon glow */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "58%",
          height: "12%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        }}
      />

      {/* Layer 2: Clouds (slow horizontal drift) */}
      <style jsx>{`
        @keyframes cloud-drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(30px); }
          100% { transform: translateX(0); }
        }
        @keyframes cloud-drift-2 {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25px); }
          100% { transform: translateX(0); }
        }
        @keyframes sparkle-blink {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>

      {/* Cloud 1 */}
      <div
        className="absolute rounded-full blur-[30px]"
        style={{
          top: "10%",
          left: "5%",
          width: "220px",
          height: "60px",
          background: "rgba(255,255,255,0.5)",
          animation: "cloud-drift 40s ease-in-out infinite",
        }}
      />
      {/* Cloud 2 */}
      <div
        className="absolute rounded-full blur-[25px]"
        style={{
          top: "18%",
          left: "55%",
          width: "180px",
          height: "50px",
          background: "rgba(255,255,255,0.45)",
          animation: "cloud-drift-2 35s ease-in-out infinite",
        }}
      />
      {/* Cloud 3 */}
      <div
        className="absolute rounded-full blur-[35px]"
        style={{
          top: "6%",
          left: "35%",
          width: "260px",
          height: "55px",
          background: "rgba(255,255,255,0.35)",
          animation: "cloud-drift 50s ease-in-out infinite",
        }}
      />
      {/* Cloud 4 */}
      <div
        className="absolute rounded-full blur-[20px]"
        style={{
          top: "28%",
          left: "75%",
          width: "150px",
          height: "40px",
          background: "rgba(255,255,255,0.4)",
          animation: "cloud-drift-2 45s ease-in-out infinite",
        }}
      />
      {/* Cloud 5 - near horizon */}
      <div
        className="absolute rounded-full blur-[28px]"
        style={{
          top: "42%",
          left: "15%",
          width: "200px",
          height: "35px",
          background: "rgba(255,255,255,0.3)",
          animation: "cloud-drift 55s ease-in-out infinite",
        }}
      />

      {/* Grass depth: lighter band on top */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: "62%",
          background:
            "radial-gradient(ellipse 120% 40% at 50% 0%, rgba(100,200,100,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Layer 3: Cyber grid overlay (very subtle) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(150,210,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(150,210,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Layer 4: Sparkles / glitch dots */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(180,220,255,0.4))",
            boxShadow: `0 0 ${s.size * 2}px rgba(180,220,255,0.5)`,
            animation: `sparkle-blink ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
