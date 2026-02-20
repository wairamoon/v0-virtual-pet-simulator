"use client"

import { useEffect, useState, useMemo } from "react"

const EFFECT_DURATION = 30000 // 30 seconds

// ============ RAIN DROP DATA ============
interface RainDrop {
  id: number
  x: number       // % from left
  delay: number    // seconds
  duration: number // seconds
  opacity: number
  width: number
}

function generateRainDrops(count: number): RainDrop[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.6 + Math.random() * 0.8,
    opacity: 0.15 + Math.random() * 0.35,
    width: 1 + Math.random() * 1.5,
  }))
}

// ============ SPARKLE DATA ============
interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

function generateSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 4,
    duration: 1.5 + Math.random() * 2,
  }))
}

// ============ WATER EFFECT ============
export function WaterPowerEffect({ active }: { active: boolean }) {
  const [raining, setRaining] = useState(false)
  const [showDrop, setShowDrop] = useState(false)

  const rainDrops = useMemo(() => generateRainDrops(50), [])
  const sparkles = useMemo(() => generateSparkles(12), [])

  useEffect(() => {
    if (!active) {
      setRaining(false)
      setShowDrop(false)
      return
    }

    // Start rain and drop immediately
    setRaining(true)
    setShowDrop(true)

    // Stop rain after 30 seconds, but keep the drop
    const timer = setTimeout(() => {
      setRaining(false)
    }, EFFECT_DURATION)

    return () => clearTimeout(timer)
  }, [active])

  if (!active && !showDrop) return null

  return (
    <>
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes rainFall {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          10% {
            opacity: var(--rain-opacity);
          }
          90% {
            opacity: var(--rain-opacity);
          }
          100% {
            transform: translateY(calc(100% + 20px));
            opacity: 0;
          }
        }

        @keyframes waterDropFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.05);
          }
        }

        @keyframes waterDropAppear {
          0% {
            transform: scale(0) translateY(10px);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) translateY(-3px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0px);
            opacity: 1;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: var(--sparkle-opacity);
            transform: scale(1);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes rainFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* ===== RAIN BACKGROUND (behind avatar via z-index) ===== */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
        style={{
          zIndex: 0,
          opacity: raining ? 1 : 0,
          transition: "opacity 2s ease-out",
        }}
      >
        {/* Rain drops */}
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute top-0"
            style={{
              left: `${drop.x}%`,
              width: `${drop.width}px`,
              height: "18px",
              background: `linear-gradient(180deg, transparent, rgba(120, 220, 255, ${drop.opacity}), transparent)`,
              borderRadius: "2px",
              ["--rain-opacity" as string]: drop.opacity,
              animation: `rainFall ${drop.duration}s linear ${drop.delay}s infinite`,
            }}
          />
        ))}

        {/* Ambient blue glow at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(0, 188, 212, 0.08))",
          }}
        />

        {/* Sparkle particles */}
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              background: "radial-gradient(circle, rgba(180, 240, 255, 0.9), rgba(0, 188, 212, 0.4))",
              ["--sparkle-opacity" as string]: 0.6,
              animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ===== FLOATING WATER DROP (on the hand area) ===== */}
      {showDrop && (
        <div
          className="pointer-events-none absolute"
          style={{
            zIndex: 20,
            // Position near the right hand of the avatar
            right: "15%",
            top: "55%",
            animation: showDrop
              ? "waterDropAppear 0.8s ease-out forwards"
              : undefined,
          }}
        >
          <div
            style={{
              animation: "waterDropFloat 3s ease-in-out infinite",
            }}
          >
            {/* Drop SVG */}
            <svg viewBox="0 0 48 64" width="28" height="38" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wdGrad" x1="0.2" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor="#b0f0ff" />
                  <stop offset="40%" stopColor="#00bcd4" />
                  <stop offset="100%" stopColor="#00838f" />
                </linearGradient>
                <radialGradient id="wdShine" cx="0.35" cy="0.3" r="0.4">
                  <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <filter id="wdGlow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer glow */}
              <ellipse cx="24" cy="38" rx="14" ry="18" fill="rgba(0, 188, 212, 0.15)" filter="url(#wdGlow)" />

              {/* Main drop shape */}
              <path
                d="M24 4 Q24 4 14 28 Q8 40 14 50 Q20 58 24 58 Q28 58 34 50 Q40 40 34 28 Q24 4 24 4Z"
                fill="url(#wdGrad)"
              />

              {/* Inner highlight */}
              <path
                d="M24 12 Q20 24 16 34 Q12 42 16 50 Q20 54 24 54"
                fill="none" stroke="rgba(180, 240, 255, 0.5)" strokeWidth="1.5"
              />

              {/* Glass shine */}
              <ellipse cx="19" cy="30" rx="4" ry="8" fill="url(#wdShine)" transform="rotate(-15 19 30)" />

              {/* Circuit accent */}
              <path d="M20 38 L16 38 L16 44" stroke="rgba(180, 240, 255, 0.4)" strokeWidth="0.7" fill="none" />
              <circle cx="16" cy="44" r="1" fill="rgba(180, 240, 255, 0.5)" />

              {/* Tiny inner sparkle */}
              <circle cx="28" cy="24" r="1.5" fill="white" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* Ripple rings below the drop */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <div
                className="h-3 w-8 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(0, 188, 212, 0.3), transparent)",
                  animation: "ripple 2s ease-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ============ FIRE EFFECT (placeholder for next) ============
export function FirePowerEffect({ active }: { active: boolean }) {
  if (!active) return null
  return null // TODO
}

// ============ EARTH EFFECT (placeholder for next) ============
export function EarthPowerEffect({ active }: { active: boolean }) {
  if (!active) return null
  return null // TODO
}

// ============ WRAPPER ============
export function PowerEffect({ power, active }: { power: string; active: boolean }) {
  switch (power) {
    case "water":
      return <WaterPowerEffect active={active} />
    case "fire":
      return <FirePowerEffect active={active} />
    case "earth":
      return <EarthPowerEffect active={active} />
    default:
      return null
  }
}
