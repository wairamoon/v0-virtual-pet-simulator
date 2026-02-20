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
        top: 5 + Math.random() * 50,
        size: 1.5 + Math.random() * 3,
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 5,
      }))
    )
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <style jsx>{`
        @keyframes cloud-drift-1 {
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0); }
        }
        @keyframes cloud-drift-2 {
          0% { transform: translateX(0); }
          50% { transform: translateX(-35px); }
          100% { transform: translateX(0); }
        }
        @keyframes cloud-drift-3 {
          0% { transform: translateX(0); }
          50% { transform: translateX(25px); }
          100% { transform: translateX(0); }
        }
        @keyframes sparkle-pulse {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 0.7; transform: scale(1); }
        }
      `}</style>

      {/* ===== LAYER 1: SKY ===== */}
      {/* Deep realistic sky gradient — not flat, with depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              #1565C0 0%,
              #1976D2 8%,
              #1E88E5 16%,
              #2196F3 24%,
              #42A5F5 33%,
              #64B5F6 42%,
              #90CAF9 52%,
              #B3D9F7 58%,
              #D4ECFB 62%,
              #E8F5E9 64%,
              #66BB6A 66%,
              #4CAF50 70%,
              #43A047 76%,
              #388E3C 84%,
              #2E7D32 92%,
              #1B5E20 100%
            )`,
        }}
      />

      {/* Atmospheric haze near horizon — soft light band */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "58%",
          height: "10%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.05) 70%, transparent 100%)",
        }}
      />

      {/* Sunlight warm glow — left side ambient light */}
      <div
        className="absolute"
        style={{
          top: "10%",
          left: "-5%",
          width: "50%",
          height: "55%",
          background:
            "radial-gradient(ellipse 80% 80% at 30% 50%, rgba(255,248,225,0.15) 0%, transparent 70%)",
        }}
      />

      {/* ===== GRASS TEXTURE & DEPTH ===== */}
      {/* Lighter ridge — rolling hill illusion */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "63%",
          height: "8%",
          background:
            "radial-gradient(ellipse 140% 100% at 40% 0%, rgba(129,199,132,0.5) 0%, transparent 60%)",
        }}
      />
      {/* Second hill ridge */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "68%",
          height: "10%",
          background:
            "radial-gradient(ellipse 100% 80% at 70% 20%, rgba(102,187,106,0.35) 0%, transparent 55%)",
        }}
      />
      {/* Shadow in grass valley */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "75%",
          height: "12%",
          background:
            "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(27,94,32,0.2) 0%, transparent 60%)",
        }}
      />
      {/* Bottom edge darkening */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: "15%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(27,94,32,0.15) 100%)",
        }}
      />

      {/* ===== LAYER 2: CLOUDS ===== */}
      {/* Cloud 1 — large, high */}
      <div
        className="absolute"
        style={{
          top: "8%",
          left: "8%",
          width: "200px",
          height: "45px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 50%, transparent 80%)",
          filter: "blur(12px)",
          animation: "cloud-drift-1 50s ease-in-out infinite",
        }}
      />
      {/* Cloud 2 — right side, wispy */}
      <div
        className="absolute"
        style={{
          top: "14%",
          left: "58%",
          width: "170px",
          height: "35px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 55%, transparent 80%)",
          filter: "blur(10px)",
          animation: "cloud-drift-2 42s ease-in-out infinite",
        }}
      />
      {/* Cloud 3 — big center, top */}
      <div
        className="absolute"
        style={{
          top: "4%",
          left: "30%",
          width: "280px",
          height: "50px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 55%, transparent 80%)",
          filter: "blur(16px)",
          animation: "cloud-drift-3 60s ease-in-out infinite",
        }}
      />
      {/* Cloud 4 — near horizon, faint */}
      <div
        className="absolute"
        style={{
          top: "38%",
          left: "15%",
          width: "240px",
          height: "30px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 50%, transparent 80%)",
          filter: "blur(14px)",
          animation: "cloud-drift-1 55s ease-in-out infinite",
        }}
      />
      {/* Cloud 5 — right near horizon */}
      <div
        className="absolute"
        style={{
          top: "45%",
          left: "65%",
          width: "160px",
          height: "25px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)",
          filter: "blur(12px)",
          animation: "cloud-drift-2 48s ease-in-out infinite",
        }}
      />

      {/* ===== LAYER 3: PERSPECTIVE GRID ===== */}
      {/* Sky grid — flat, very faint */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: "64%",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Ground grid — perspective feel via vertical compression at bottom */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: "64%",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "80px 40px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 100%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* ===== LAYER 4: SPARKLES ===== */}
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
            boxShadow: `0 0 ${s.size * 3}px rgba(200,230,255,0.6), 0 0 ${s.size}px rgba(255,255,255,0.8)`,
            animation: `sparkle-pulse ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(0,0,0,0.08) 100%)",
        }}
      />
    </div>
  )
}
