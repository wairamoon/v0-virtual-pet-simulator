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

// ============ FIRE SPARK DATA ============
interface FireSpark {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  opacity: number
  drift: number // horizontal drift
}

function generateSparks(count: number): FireSpark[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 15 + Math.random() * 70,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    duration: 1.2 + Math.random() * 1.8,
    opacity: 0.3 + Math.random() * 0.5,
    drift: -15 + Math.random() * 30,
  }))
}

interface Ember {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

function generateEmbers(count: number): Ember[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 30 + Math.random() * 60,
    size: 1.5 + Math.random() * 3,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 3,
  }))
}

// ============ FIRE EFFECT ============
export function FirePowerEffect({ active }: { active: boolean }) {
  const [burning, setBurning] = useState(false)
  const [showFlame, setShowFlame] = useState(false)

  const sparks = useMemo(() => generateSparks(35), [])
  const embers = useMemo(() => generateEmbers(15), [])

  useEffect(() => {
    if (!active) {
      setBurning(false)
      setShowFlame(false)
      return
    }

    setBurning(true)
    setShowFlame(true)

    const timer = setTimeout(() => {
      setBurning(false)
    }, EFFECT_DURATION)

    return () => clearTimeout(timer)
  }, [active])

  if (!active && !showFlame) return null

  return (
    <>
      <style jsx>{`
        @keyframes sparkRise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          15% {
            opacity: var(--spark-opacity);
          }
          85% {
            opacity: var(--spark-opacity);
          }
          100% {
            transform: translateY(-120px) translateX(var(--spark-drift)) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes emberGlow {
          0%, 100% {
            opacity: 0;
            transform: scale(0.6);
          }
          30% {
            opacity: var(--ember-opacity, 0.5);
            transform: scale(1);
          }
          70% {
            opacity: var(--ember-opacity, 0.5);
            transform: scale(0.9);
          }
        }

        @keyframes flameFlicker {
          0%, 100% {
            transform: translateY(0) scaleX(1) scaleY(1);
          }
          25% {
            transform: translateY(-2px) scaleX(0.95) scaleY(1.05);
          }
          50% {
            transform: translateY(-4px) scaleX(1.03) scaleY(0.97);
          }
          75% {
            transform: translateY(-1px) scaleX(0.97) scaleY(1.02);
          }
        }

        @keyframes flameAppear {
          0% {
            transform: scale(0) translateY(10px);
            opacity: 0;
          }
          50% {
            transform: scale(1.15) translateY(-3px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes heatWave {
          0%, 100% {
            opacity: 0.06;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.12;
            transform: scaleY(1.05);
          }
        }

        @keyframes innerFlame {
          0%, 100% {
            transform: scaleX(1) scaleY(1);
            opacity: 0.7;
          }
          33% {
            transform: scaleX(0.9) scaleY(1.08);
            opacity: 0.8;
          }
          66% {
            transform: scaleX(1.05) scaleY(0.95);
            opacity: 0.65;
          }
        }
      `}</style>

      {/* ===== FIRE BACKGROUND (behind avatar) ===== */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
        style={{
          zIndex: 0,
          opacity: burning ? 1 : 0,
          transition: "opacity 2s ease-out",
        }}
      >
        {/* Warm aura glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(255, 87, 34, 0.12), rgba(255, 152, 0, 0.06) 50%, transparent 80%)",
            animation: "heatWave 3s ease-in-out infinite",
          }}
        />

        {/* Rising sparks */}
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="absolute rounded-full"
            style={{
              bottom: "10%",
              left: `${spark.x}%`,
              width: spark.size,
              height: spark.size,
              background: `radial-gradient(circle, ${
                Math.random() > 0.5 ? "rgba(255, 200, 50, 0.9)" : "rgba(255, 120, 30, 0.9)"
              }, rgba(255, 87, 34, 0.5))`,
              ["--spark-opacity" as string]: spark.opacity,
              ["--spark-drift" as string]: `${spark.drift}px`,
              animation: `sparkRise ${spark.duration}s ease-out ${spark.delay}s infinite`,
            }}
          />
        ))}

        {/* Floating embers */}
        {embers.map((e) => (
          <div
            key={e.id}
            className="absolute rounded-full"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              width: e.size,
              height: e.size,
              background: "radial-gradient(circle, rgba(255, 180, 50, 0.9), rgba(255, 87, 34, 0.3))",
              ["--ember-opacity" as string]: 0.5,
              animation: `emberGlow ${e.duration}s ease-in-out ${e.delay}s infinite`,
            }}
          />
        ))}

        {/* Bottom heat shimmer */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(255, 87, 34, 0.06), rgba(255, 152, 0, 0.1))",
          }}
        />
      </div>

      {/* ===== FLOATING FLAME (on the hand) ===== */}
      {showFlame && (
        <div
          className="pointer-events-none absolute"
          style={{
            zIndex: 20,
            right: "15%",
            top: "52%",
            animation: "flameAppear 0.8s ease-out forwards",
          }}
        >
          <div style={{ animation: "flameFlicker 1.5s ease-in-out infinite" }}>
            <svg viewBox="0 0 48 64" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="fGrad" x1="0.3" y1="1" x2="0.7" y2="0">
                  <stop offset="0%" stopColor="#ff5722" />
                  <stop offset="40%" stopColor="#ff9800" />
                  <stop offset="70%" stopColor="#ffcc02" />
                  <stop offset="100%" stopColor="#fff8e1" />
                </linearGradient>
                <linearGradient id="fInner" x1="0.3" y1="1" x2="0.7" y2="0">
                  <stop offset="0%" stopColor="#ff9800" />
                  <stop offset="50%" stopColor="#ffcc02" />
                  <stop offset="100%" stopColor="#fffde7" />
                </linearGradient>
                <radialGradient id="fCore" cx="0.5" cy="0.6" r="0.4">
                  <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffcc02" stopOpacity="0" />
                </radialGradient>
                <filter id="fGlow">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer glow */}
              <ellipse cx="24" cy="36" rx="18" ry="22" fill="rgba(255, 152, 0, 0.12)" filter="url(#fGlow)" />

              {/* Main flame */}
              <path
                d="M24 4 Q30 16 34 24 Q40 32 38 42 Q36 52 30 56 Q26 58 24 58 Q22 58 18 56 Q12 52 10 42 Q8 32 14 24 Q18 16 24 4Z"
                fill="url(#fGrad)"
              />

              {/* Inner flame */}
              <path
                d="M24 18 Q28 26 30 32 Q32 38 30 46 Q28 50 24 52 Q20 50 18 46 Q16 38 18 32 Q20 26 24 18Z"
                fill="url(#fInner)"
                style={{ animation: "innerFlame 1.2s ease-in-out infinite" }}
              />

              {/* Hot core */}
              <path
                d="M24 30 Q26 34 26 38 Q26 44 24 46 Q22 44 22 38 Q22 34 24 30Z"
                fill="url(#fCore)"
              />

              {/* Highlight */}
              <ellipse cx="20" cy="28" rx="2.5" ry="5" fill="white" opacity="0.2" transform="rotate(-10 20 28)" />

              {/* Tiny sparks coming off */}
              <circle cx="16" cy="20" r="1" fill="#ffcc02" opacity="0.6">
                <animate attributeName="cy" values="20;14;20" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="18" r="0.8" fill="#ff9800" opacity="0.5">
                <animate attributeName="cy" values="18;12;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="28" cy="14" r="0.6" fill="#fff8e1" opacity="0.4">
                <animate attributeName="cy" values="14;8;14" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" repeatCount="indefinite" />
              </circle>
            </svg>

            {/* Heat distortion below flame */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <div
                className="h-3 w-8 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(255, 152, 0, 0.25), transparent)",
                  animation: "heatWave 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ============ EARTH PLANT DATA ============
interface Vine {
  id: number
  x: number
  height: number
  delay: number
  duration: number
  lean: number
  leaves: number
}

function generateVines(count: number): Vine[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    height: 30 + Math.random() * 50,
    delay: Math.random() * 2.5,
    duration: 2 + Math.random() * 2,
    lean: -8 + Math.random() * 16,
    leaves: 1 + Math.floor(Math.random() * 3),
  }))
}

interface FloatingLeaf {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  rotation: number
}

function generateLeaves(count: number): FloatingLeaf[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 60,
    size: 6 + Math.random() * 10,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
    rotation: Math.random() * 360,
  }))
}

interface GrowSpore {
  id: number
  x: number
  delay: number
  duration: number
  size: number
}

function generateSpores(count: number): GrowSpore[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 15 + Math.random() * 70,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2.5,
    size: 2 + Math.random() * 3,
  }))
}

// ============ EARTH EFFECT ============
export function EarthPowerEffect({ active }: { active: boolean }) {
  const [growing, setGrowing] = useState(false)
  const [showPlant, setShowPlant] = useState(false)

  const vines = useMemo(() => generateVines(12), [])
  const leaves = useMemo(() => generateLeaves(10), [])
  const spores = useMemo(() => generateSpores(20), [])

  useEffect(() => {
    if (!active) {
      setGrowing(false)
      setShowPlant(false)
      return
    }

    setGrowing(true)
    setShowPlant(true)

    const timer = setTimeout(() => {
      setGrowing(false)
    }, EFFECT_DURATION)

    return () => clearTimeout(timer)
  }, [active])

  if (!active && !showPlant) return null

  return (
    <>
      <style jsx>{`
        @keyframes vineGrow {
          0% {
            clip-path: inset(100% 0 0 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            clip-path: inset(0% 0 0 0);
            opacity: 1;
          }
        }

        @keyframes leafFloat {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) rotate(var(--leaf-rot)) scale(0.7);
          }
          20% {
            opacity: var(--leaf-opacity, 0.4);
            transform: translateY(-5px) rotate(calc(var(--leaf-rot) + 15deg)) scale(1);
          }
          80% {
            opacity: var(--leaf-opacity, 0.4);
            transform: translateY(-12px) rotate(calc(var(--leaf-rot) - 10deg)) scale(0.95);
          }
        }

        @keyframes sporeRise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: var(--spore-opacity, 0.4);
          }
          80% {
            opacity: var(--spore-opacity, 0.4);
          }
          100% {
            transform: translateY(-80px) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes plantSprout {
          0% {
            transform: scale(0) translateY(15px);
            opacity: 0;
          }
          40% {
            transform: scale(0.6) translateY(5px);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.1) translateY(-2px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes plantSway {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
          }
          25% {
            transform: rotate(2deg) translateY(-1px);
          }
          75% {
            transform: rotate(-2deg) translateY(-2px);
          }
        }

        @keyframes auraPulse {
          0%, 100% {
            opacity: 0.06;
          }
          50% {
            opacity: 0.12;
          }
        }
      `}</style>

      {/* ===== EARTH BACKGROUND (behind avatar) ===== */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
        style={{
          zIndex: 0,
          opacity: growing ? 1 : 0,
          transition: "opacity 2.5s ease-out",
        }}
      >
        {/* Green aura */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.05) 50%, transparent 80%)",
            animation: "auraPulse 4s ease-in-out infinite",
          }}
        />

        {/* Growing vines from bottom */}
        {vines.map((vine) => (
          <div
            key={vine.id}
            className="absolute bottom-0"
            style={{
              left: `${vine.x}%`,
              width: "2px",
              height: `${vine.height}%`,
              transform: `rotate(${vine.lean}deg)`,
              transformOrigin: "bottom center",
              animation: `vineGrow ${vine.duration}s ease-out ${vine.delay}s both`,
            }}
          >
            {/* Vine stem */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(180deg, rgba(76, 175, 80, 0.15), rgba(56, 142, 60, 0.5))`,
              }}
            />
            {/* Leaves on vine */}
            {Array.from({ length: vine.leaves }).map((_, li) => {
              const leafY = 20 + li * 30 + Math.random() * 15
              const side = li % 2 === 0 ? -1 : 1
              return (
                <svg
                  key={li}
                  viewBox="0 0 20 14"
                  width="12"
                  height="8"
                  className="absolute"
                  style={{
                    top: `${leafY}%`,
                    left: side > 0 ? "2px" : "-12px",
                    transform: `scaleX(${side})`,
                    opacity: 0.6,
                  }}
                >
                  <path
                    d="M2 7 Q6 0 18 2 Q14 7 18 12 Q6 14 2 7Z"
                    fill="rgba(76, 175, 80, 0.7)"
                  />
                  <path d="M3 7 Q10 5 17 3" stroke="rgba(56, 142, 60, 0.4)" strokeWidth="0.5" fill="none" />
                </svg>
              )
            })}
          </div>
        ))}

        {/* Floating leaves */}
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              ["--leaf-rot" as string]: `${leaf.rotation}deg`,
              ["--leaf-opacity" as string]: 0.35,
              animation: `leafFloat ${leaf.duration}s ease-in-out ${leaf.delay}s infinite`,
            }}
          >
            <svg viewBox="0 0 20 14" width={leaf.size * 1.4} height={leaf.size} xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2 7 Q6 0 18 2 Q14 7 18 12 Q6 14 2 7Z"
                fill="rgba(129, 199, 132, 0.6)"
              />
              <path d="M3 7 Q10 5 17 3" stroke="rgba(76, 175, 80, 0.4)" strokeWidth="0.4" fill="none" />
            </svg>
          </div>
        ))}

        {/* Rising spores / pollen particles */}
        {spores.map((sp) => (
          <div
            key={sp.id}
            className="absolute rounded-full"
            style={{
              bottom: "5%",
              left: `${sp.x}%`,
              width: sp.size,
              height: sp.size,
              background: "radial-gradient(circle, rgba(200, 230, 150, 0.8), rgba(129, 199, 132, 0.3))",
              ["--spore-opacity" as string]: 0.45,
              animation: `sporeRise ${sp.duration}s ease-out ${sp.delay}s infinite`,
            }}
          />
        ))}

        {/* Bottom earth glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/5"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(76, 175, 80, 0.06), rgba(56, 142, 60, 0.1))",
          }}
        />
      </div>

      {/* ===== FLOATING PLANT (on the hand) ===== */}
      {showPlant && (
        <div
          className="pointer-events-none absolute"
          style={{
            zIndex: 20,
            right: "14%",
            top: "50%",
            animation: "plantSprout 1.2s ease-out forwards",
          }}
        >
          <div style={{ animation: "plantSway 4s ease-in-out infinite" }}>
            <svg viewBox="0 0 48 64" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="stemG" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#2e7d32" />
                  <stop offset="100%" stopColor="#4caf50" />
                </linearGradient>
                <linearGradient id="leafG1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#81c784" />
                  <stop offset="100%" stopColor="#388e3c" />
                </linearGradient>
                <linearGradient id="leafG2" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a5d6a7" />
                  <stop offset="100%" stopColor="#4caf50" />
                </linearGradient>
                <radialGradient id="plantAura" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="rgba(76, 175, 80, 0.2)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="pGlow">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Aura */}
              <ellipse cx="24" cy="34" rx="20" ry="24" fill="url(#plantAura)" />

              {/* Main stem */}
              <path d="M24 58 Q24 48 22 40 Q20 34 24 26" stroke="url(#stemG)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Small branch left */}
              <path d="M22 42 Q18 38 14 36" stroke="#388e3c" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Small branch right */}
              <path d="M23 36 Q28 32 32 30" stroke="#388e3c" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Main leaf (right, top) */}
              <path d="M24 26 Q34 16 42 10 Q44 18 40 26 Q34 34 24 26Z" fill="url(#leafG1)" />
              <path d="M26 24 Q34 18 40 13" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
              <path d="M27 26 Q33 22 38 18" stroke="#2e7d32" strokeWidth="0.4" fill="none" opacity="0.4" />

              {/* Second leaf (left) */}
              <path d="M22 34 Q12 26 6 22 Q6 30 10 36 Q16 42 22 34Z" fill="url(#leafG2)" />
              <path d="M20 33 Q14 28 8 24" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
              <path d="M19 35 Q13 30 8 26" stroke="#2e7d32" strokeWidth="0.4" fill="none" opacity="0.35" />

              {/* Third small leaf (right lower) */}
              <path d="M26 38 Q34 34 38 30 Q36 36 32 40 Q28 42 26 38Z" fill="#81c784" opacity="0.7" />

              {/* Tiny bud at top */}
              <ellipse cx="36" cy="10" rx="2.5" ry="3" fill="#a5d6a7" />
              <ellipse cx="36" cy="9" rx="1.5" ry="1.5" fill="#c8e6c9" opacity="0.6" />

              {/* Leaf shine */}
              <ellipse cx="34" cy="20" rx="2" ry="4" fill="white" opacity="0.15" transform="rotate(-30 34 20)" />

              {/* Energy sparkles */}
              <circle cx="18" cy="28" r="1" fill="#c8e6c9" opacity="0.5" filter="url(#pGlow)">
                <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="38" cy="22" r="0.8" fill="#a5d6a7" opacity="0.4" filter="url(#pGlow)">
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="10" cy="32" r="0.7" fill="#c8e6c9" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Circuit accents (cybercore touch) */}
              <path d="M40 28 L44 28 L44 32" stroke="rgba(129, 199, 132, 0.35)" strokeWidth="0.6" fill="none" />
              <circle cx="44" cy="32" r="0.8" fill="rgba(129, 199, 132, 0.4)" />
              <path d="M8 36 L4 36 L4 32" stroke="rgba(129, 199, 132, 0.35)" strokeWidth="0.6" fill="none" />
              <circle cx="4" cy="32" r="0.8" fill="rgba(129, 199, 132, 0.4)" />
            </svg>

            {/* Ground particles below plant */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <div
                className="h-2 w-10 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(76, 175, 80, 0.2), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
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
