"use client"

export interface EvolutionLevel {
  level: number
  title: string
  minXP: number
  emoji: string
  color: string
}

export const EVOLUTION_LEVELS: EvolutionLevel[] = [
  { level: 1, title: "Asistente Creativo", minXP: 0, emoji: "🔰", color: "#a0aec0" },
  { level: 2, title: "Diseñador Experimental", minXP: 100, emoji: "🔬", color: "#9c7cf4" },
  { level: 3, title: "Arquitecto Cyber", minXP: 300, emoji: "⚙️", color: "#00bcd4" },
  { level: 4, title: "Visionario Web3", minXP: 600, emoji: "🌐", color: "#4a9eff" },
  { level: 5, title: "Maestro Sintético", minXP: 1000, emoji: "👑", color: "#ffd700" },
]

export function getEvolutionLevel(xp: number): EvolutionLevel {
  for (let i = EVOLUTION_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= EVOLUTION_LEVELS[i].minXP) return EVOLUTION_LEVELS[i]
  }
  return EVOLUTION_LEVELS[0]
}

export function getNextLevel(xp: number): EvolutionLevel | null {
  const current = getEvolutionLevel(xp)
  const next = EVOLUTION_LEVELS.find(l => l.level === current.level + 1)
  return next ?? null
}

export function getXPProgress(xp: number): number {
  const current = getEvolutionLevel(xp)
  const next = getNextLevel(xp)
  if (!next) return 100
  const range = next.minXP - current.minXP
  const progress = xp - current.minXP
  return Math.min(100, Math.round((progress / range) * 100))
}

/**
 * Visual overlay that adds progressive tech details on top of the avatar.
 * Each level adds MORE effects (cumulative).
 */
export function EvolutionOverlay({ level, size, color }: { level: number; size: number; color: string }) {
  const h = size * 1.5

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ width: size, height: h }}
    >
      {/* Level 2+: Subtle circuit lines on edges */}
      {level >= 2 && (
        <>
          <div
            className="absolute top-3 left-2 w-8 opacity-40"
            style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`, height: 12, borderRadius: "4px 0 0 0" }}
          />
          <div
            className="absolute top-3 right-2 w-8 opacity-40"
            style={{ borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}`, height: 12, borderRadius: "0 4px 0 0" }}
          />
          <div
            className="absolute bottom-6 left-2 w-6 opacity-30"
            style={{ borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}`, height: 8, borderRadius: "0 0 0 4px" }}
          />
          <div
            className="absolute bottom-6 right-2 w-6 opacity-30"
            style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}`, height: 8, borderRadius: "0 0 4px 0" }}
          />
        </>
      )}

      {/* Level 3+: Glowing data nodes (small dots) */}
      {level >= 3 && (
        <>
          <div className="absolute top-[15%] left-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}`, animation: "pulse 2s ease-in-out infinite" }} />
          <div className="absolute top-[35%] right-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}`, animation: "pulse 2.5s ease-in-out infinite" }} />
          <div className="absolute bottom-[25%] left-2 h-1 w-1 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}`, animation: "pulse 3s ease-in-out infinite" }} />
          {/* Thin connecting line */}
          <div className="absolute top-[15%] left-[7px] w-px opacity-20" style={{ height: "20%", background: `linear-gradient(to bottom, ${color}, transparent)` }} />
        </>
      )}

      {/* Level 4+: Holographic scan line + hex pattern hint */}
      {level >= 4 && (
        <>
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-px opacity-30"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              animation: "scanLine 3s ease-in-out infinite",
            }}
          />
          {/* Corner brackets */}
          <div className="absolute top-1 left-1 opacity-25" style={{ color, fontSize: "10px", fontFamily: "monospace" }}>&#x2553;</div>
          <div className="absolute top-1 right-1 opacity-25" style={{ color, fontSize: "10px", fontFamily: "monospace" }}>&#x2556;</div>
          <div className="absolute bottom-4 left-1 opacity-25" style={{ color, fontSize: "10px", fontFamily: "monospace" }}>&#x2559;</div>
          <div className="absolute bottom-4 right-1 opacity-25" style={{ color, fontSize: "10px", fontFamily: "monospace" }}>&#x255C;</div>
          {/* Micro data text */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-15" style={{ color, fontSize: "6px", fontFamily: "monospace", letterSpacing: "2px" }}>LVL.04</div>
        </>
      )}

      {/* Level 5: Full cyber aura + particle ring */}
      {level >= 5 && (
        <>
          {/* Outer glow ring */}
          <div
            className="absolute -inset-2 rounded-3xl opacity-15"
            style={{
              border: `1px solid ${color}`,
              boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}20`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          {/* Orbiting particle */}
          <div
            className="absolute"
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
              animation: "orbit 4s linear infinite",
              top: "50%",
              left: "50%",
            }}
          />
          {/* Crown indicator */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg"
            style={{ filter: `drop-shadow(0 0 6px ${color})`, animation: "float 3s ease-in-out infinite" }}
          >
            👑
          </div>
          {/* Micro text */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-20" style={{ color, fontSize: "5px", fontFamily: "monospace", letterSpacing: "3px" }}>MAESTRO</div>
        </>
      )}

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes scanLine {
          0%, 100% { top: 10%; }
          50% { top: 85%; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(${size * 0.55}px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(${size * 0.55}px) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-4px); }
        }
      `}</style>
    </div>
  )
}

/** Compact level badge for panels */
export function LevelBadge({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const level = getEvolutionLevel(xp)
  const next = getNextLevel(xp)
  const progress = getXPProgress(xp)

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{level.emoji}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: level.color }}>
          Nv.{level.level}
        </span>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ background: `${level.color}08`, border: `1px solid ${level.color}20` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{level.emoji}</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: level.color }}>
              Nv.{level.level} — {level.title}
            </p>
          </div>
        </div>
        <span className="text-[9px] font-semibold text-primary/40">{xp} XP</span>
      </div>
      {next && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: level.color }}
            />
          </div>
          <span className="text-[7px] text-primary/30 flex-shrink-0">{next.minXP - xp} XP → Nv.{next.level}</span>
        </div>
      )}
      {!next && (
        <p className="text-[8px] text-center uppercase tracking-widest" style={{ color: level.color }}>
          ✦ Nivel Máximo Alcanzado ✦
        </p>
      )}
    </div>
  )
}
