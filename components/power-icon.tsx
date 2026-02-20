"use client"

interface PowerIconProps {
  type: string
  color: string
  size?: number
  className?: string
  glow?: boolean
}

export function PowerIcon({ type, color, size = 32, className = "", glow = false }: PowerIconProps) {
  const s = size
  const glowFilter = glow ? "url(#powerGlow)" : undefined

  return (
    <svg viewBox="0 0 64 64" width={s} height={s} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="powerGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`pg-${type}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={lighten(color, 40)} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={darken(color, 30)} />
        </linearGradient>
        <radialGradient id={`prg-${type}`} cx="0.4" cy="0.35" r="0.55">
          <stop offset="0%" stopColor={lighten(color, 50)} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>

      {type === "water" && (
        <g filter={glowFilter}>
          {/* Cyber water drop */}
          <path d="M32 8 Q32 8 20 32 Q14 44 20 52 Q26 60 32 60 Q38 60 44 52 Q50 44 44 32 Q32 8 32 8Z"
            fill={`url(#pg-${type})`} />
          {/* Inner highlight */}
          <path d="M32 16 Q28 28 24 38 Q20 46 24 52 Q28 56 32 56"
            fill="none" stroke={lighten(color, 50)} strokeWidth="1.5" opacity="0.4" />
          {/* Shine */}
          <ellipse cx="27" cy="36" rx="3" ry="5" fill="white" opacity="0.35" transform="rotate(-15 27 36)" />
          {/* Circuit lines */}
          <path d="M28 42 L24 42 L24 48" stroke={lighten(color, 30)} strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M36 38 L40 38 L40 44 L36 44" stroke={lighten(color, 30)} strokeWidth="0.8" fill="none" opacity="0.5" />
          {/* Data dots */}
          <circle cx="24" cy="48" r="1.2" fill={lighten(color, 40)} opacity="0.6" />
          <circle cx="36" cy="44" r="1.2" fill={lighten(color, 40)} opacity="0.6" />
          {/* Outer glow ring */}
          <ellipse cx="32" cy="38" rx="16" ry="20" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
        </g>
      )}

      {type === "fire" && (
        <g filter={glowFilter}>
          {/* Main flame */}
          <path d="M32 6 Q38 18 42 26 Q48 34 46 44 Q44 54 38 58 Q34 60 32 60 Q30 60 26 58 Q20 54 18 44 Q16 34 22 26 Q26 18 32 6Z"
            fill={`url(#pg-${type})`} />
          {/* Inner flame */}
          <path d="M32 22 Q36 30 38 36 Q40 42 38 48 Q36 52 32 54 Q28 52 26 48 Q24 42 26 36 Q28 30 32 22Z"
            fill={lighten(color, 30)} opacity="0.7" />
          {/* Core */}
          <path d="M32 34 Q34 38 34 42 Q34 46 32 48 Q30 46 30 42 Q30 38 32 34Z"
            fill={lighten(color, 60)} opacity="0.8" />
          {/* Shine */}
          <ellipse cx="27" cy="34" rx="2" ry="4" fill="white" opacity="0.25" transform="rotate(-10 27 34)" />
          {/* Circuit sparks */}
          <line x1="20" y1="36" x2="14" y2="32" stroke={lighten(color, 40)} strokeWidth="0.8" opacity="0.5" />
          <line x1="44" y1="36" x2="50" y2="32" stroke={lighten(color, 40)} strokeWidth="0.8" opacity="0.5" />
          <circle cx="14" cy="32" r="1" fill={lighten(color, 40)} opacity="0.5" />
          <circle cx="50" cy="32" r="1" fill={lighten(color, 40)} opacity="0.5" />
          {/* Heat distortion lines */}
          <path d="M28 4 Q30 0 32 4" stroke={lighten(color, 30)} strokeWidth="0.6" fill="none" opacity="0.3" />
          <path d="M34 2 Q36 -2 38 2" stroke={lighten(color, 30)} strokeWidth="0.6" fill="none" opacity="0.2" />
        </g>
      )}

      {type === "earth" && (
        <g filter={glowFilter}>
          {/* Stem */}
          <path d="M32 60 Q32 48 30 40 Q28 34 32 28" stroke={darken(color, 20)} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Small branch */}
          <path d="M30 42 Q26 38 22 36" stroke={darken(color, 15)} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Main leaf (right) */}
          <path d="M32 28 Q42 18 48 12 Q50 18 48 26 Q44 34 32 28Z"
            fill={`url(#prg-${type})`} />
          {/* Leaf vein */}
          <path d="M34 26 Q40 20 46 15" stroke={darken(color, 10)} strokeWidth="0.6" fill="none" opacity="0.4" />
          {/* Second leaf (left) */}
          <path d="M30 34 Q20 26 14 22 Q14 28 18 34 Q22 40 30 34Z"
            fill={`url(#pg-${type})`} opacity="0.85" />
          {/* Leaf vein */}
          <path d="M28 33 Q22 28 16 24" stroke={darken(color, 10)} strokeWidth="0.6" fill="none" opacity="0.4" />
          {/* Small leaf */}
          <path d="M22 36 Q16 32 14 28 Q18 30 22 36Z" fill={lighten(color, 20)} opacity="0.5" />
          {/* Shine on leaf */}
          <ellipse cx="40" cy="20" rx="2.5" ry="4" fill="white" opacity="0.25" transform="rotate(-30 40 20)" />
          {/* Circuit/digital accents */}
          <path d="M48 28 L52 28 L52 32" stroke={lighten(color, 30)} strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M14 34 L10 34 L10 30" stroke={lighten(color, 30)} strokeWidth="0.8" fill="none" opacity="0.4" />
          <circle cx="52" cy="32" r="1" fill={lighten(color, 40)} opacity="0.5" />
          <circle cx="10" cy="30" r="1" fill={lighten(color, 40)} opacity="0.5" />
          {/* Ground particles */}
          <circle cx="28" cy="58" r="1.5" fill={darken(color, 10)} opacity="0.3" />
          <circle cx="36" cy="60" r="1" fill={darken(color, 10)} opacity="0.25" />
        </g>
      )}
    </svg>
  )
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) }
}
function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("")}`
}
function darken(hex: string, n: number) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r - n, g - n, b - n) }
function lighten(hex: string, n: number) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r + n, g + n, b + n) }
