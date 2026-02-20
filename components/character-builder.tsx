"use client"

// SVG-based character builder with customizable parts
// Style: Y2K cybercore anime aesthetic

export interface CharacterParts {
  hair: 0 | 1 | 2 | 3
  eyeColor: string
  skinTone: string
  outfit: 0 | 1 | 2 | 3
}

export const defaultParts: CharacterParts = {
  hair: 0,
  eyeColor: "#4a9eff",
  skinTone: "#fde0c8",
  outfit: 0,
}

export const hairLabels = ["Corto", "Largo", "Puntas", "Coletas"]
export const outfitLabels = ["Cyber Suit", "Hoodie Tech", "Armadura", "Vestido Digital"]
export const eyeColors = [
  { value: "#4a9eff", label: "Azul" },
  { value: "#9c7cf4", label: "Violeta" },
  { value: "#00bcd4", label: "Aqua" },
  { value: "#e0457b", label: "Rosa" },
  { value: "#40aa40", label: "Verde" },
  { value: "#ff8c00", label: "Ámbar" },
]
export const skinTones = [
  { value: "#fde0c8", label: "Claro" },
  { value: "#e8b896", label: "Medio" },
  { value: "#c68c5a", label: "Moreno" },
  { value: "#8d5e3c", label: "Oscuro" },
]

interface Props {
  parts: CharacterParts
  energyColor: string
  size?: number
  className?: string
}

export function CharacterAvatar({ parts, energyColor, size = 200, className = "" }: Props) {
  const { hair, eyeColor, skinTone, outfit } = parts
  const w = size
  const h = size * 1.6

  return (
    <div className={`relative ${className}`}>
      {/* Glow aura */}
      <div
        className="absolute inset-0 -z-10 scale-110 rounded-full opacity-50 blur-[30px] animate-glow-pulse"
        style={{ backgroundColor: energyColor }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 200 320"
        width={w}
        height={h}
        className="drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skinTone} />
            <stop offset="100%" stopColor={darken(skinTone, 15)} />
          </linearGradient>
          <linearGradient id="outfitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={energyColor} />
            <stop offset="100%" stopColor={darken(energyColor, 20)} />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={lighten(energyColor, 20)} />
            <stop offset="100%" stopColor={energyColor} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === LEGS === */}
        <rect x="75" y="240" width="20" height="55" rx="8" fill="url(#bodyGrad)" />
        <rect x="105" y="240" width="20" height="55" rx="8" fill="url(#bodyGrad)" />
        {/* Boots */}
        <rect x="70" y="285" width="28" height="16" rx="6" fill={darken(energyColor, 30)} />
        <rect x="102" y="285" width="28" height="16" rx="6" fill={darken(energyColor, 30)} />
        {/* Boot accents */}
        <rect x="73" y="289" width="22" height="3" rx="1.5" fill={energyColor} opacity="0.6" />
        <rect x="105" y="289" width="22" height="3" rx="1.5" fill={energyColor} opacity="0.6" />

        {/* === BODY / OUTFIT === */}
        {renderOutfit(outfit, energyColor, skinTone)}

        {/* === NECK === */}
        <rect x="90" y="110" width="20" height="15" rx="5" fill="url(#bodyGrad)" />

        {/* === HEAD === */}
        <ellipse cx="100" cy="85" rx="38" ry="42" fill={skinTone} />
        {/* Face shadow */}
        <ellipse cx="100" cy="90" rx="34" ry="36" fill={darken(skinTone, 5)} opacity="0.3" />

        {/* === EYES === */}
        {/* Eye whites */}
        <ellipse cx="84" cy="82" rx="10" ry="8" fill="white" />
        <ellipse cx="116" cy="82" rx="10" ry="8" fill="white" />
        {/* Irises - large anime style */}
        <ellipse cx="86" cy="83" rx="7" ry="7" fill={eyeColor} />
        <ellipse cx="118" cy="83" rx="7" ry="7" fill={eyeColor} />
        {/* Pupils */}
        <circle cx="87" cy="82" r="3" fill="#1a1a2e" />
        <circle cx="119" cy="82" r="3" fill="#1a1a2e" />
        {/* Eye shine */}
        <circle cx="89" cy="80" r="2" fill="white" opacity="0.9" />
        <circle cx="121" cy="80" r="2" fill="white" opacity="0.9" />
        <circle cx="84" cy="84" r="1" fill="white" opacity="0.5" />
        <circle cx="116" cy="84" r="1" fill="white" opacity="0.5" />

        {/* Eyebrows */}
        <path d="M74 72 Q84 68 94 72" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M106 72 Q116 68 126 72" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M98 92 Q100 96 102 92" stroke={darken(skinTone, 20)} strokeWidth="1.5" fill="none" />

        {/* Mouth */}
        <path d="M90 102 Q100 108 110 102" stroke="#e0457b" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="74" cy="96" rx="8" ry="4" fill="#ff9999" opacity="0.3" />
        <ellipse cx="126" cy="96" rx="8" ry="4" fill="#ff9999" opacity="0.3" />

        {/* === HAIR === */}
        {renderHair(hair, energyColor)}

        {/* === TECH ACCENTS === */}
        {/* Ear piece */}
        <circle cx="62" cy="85" r="5" fill={darken(energyColor, 10)} />
        <circle cx="62" cy="85" r="3" fill={energyColor} filter="url(#glow)" opacity="0.8" />

        {/* Floating tech elements */}
        <circle cx="155" cy="60" r="3" fill={energyColor} opacity="0.4">
          <animate attributeName="cy" values="60;55;60" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="70" r="2" fill={energyColor} opacity="0.3">
          <animate attributeName="cy" values="70;65;70" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="148" y="90" width="8" height="8" rx="2" fill="none" stroke={energyColor} strokeWidth="1" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  )
}

function renderHair(style: number, color: string) {
  const light = lighten(color, 20)
  const dark = darken(color, 15)

  switch (style) {
    case 0: // Corto
      return (
        <g>
          <ellipse cx="100" cy="62" rx="42" ry="30" fill={color} />
          <path d="M58 70 Q60 50 80 42 Q100 35 120 42 Q140 50 142 70" fill={dark} />
          {/* Bangs */}
          <path d="M65 72 Q75 55 85 68 Q90 58 100 66 Q110 56 115 68 Q125 55 135 72" fill={color} />
          {/* Shine */}
          <path d="M80 50 Q90 45 100 48" stroke={light} strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      )
    case 1: // Largo
      return (
        <g>
          <ellipse cx="100" cy="60" rx="44" ry="32" fill={color} />
          <path d="M56 70 Q58 48 80 40 Q100 33 120 40 Q142 48 144 70" fill={dark} />
          {/* Long sides */}
          <path d="M56 70 Q52 120 55 180 Q58 200 65 180 Q68 140 62 70" fill={color} />
          <path d="M144 70 Q148 120 145 180 Q142 200 135 180 Q132 140 138 70" fill={color} />
          {/* Bangs */}
          <path d="M62 72 Q80 52 100 65 Q120 52 138 72" fill={color} />
          {/* Shine */}
          <path d="M75 48 Q90 42 105 46" stroke={light} strokeWidth="3" fill="none" opacity="0.4" />
        </g>
      )
    case 2: // Puntas (spiky)
      return (
        <g>
          <ellipse cx="100" cy="62" rx="42" ry="30" fill={color} />
          {/* Spikes */}
          <path d="M58 65 L45 30 L70 55 L55 15 L85 50 L80 20 L100 48 L110 10 L115 50 L130 18 L125 55 L145 25 L142 65" fill={color} />
          <path d="M58 65 L50 35 L72 58" fill={dark} opacity="0.5" />
          <path d="M142 65 L140 30 L128 58" fill={dark} opacity="0.5" />
          {/* Front bangs */}
          <path d="M68 72 Q78 55 88 70 Q95 58 105 68 Q112 54 120 70 Q128 58 132 72" fill={color} />
          {/* Shine */}
          <path d="M85 35 Q95 28 110 32" stroke={light} strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      )
    case 3: // Coletas (twin tails)
      return (
        <g>
          <ellipse cx="100" cy="62" rx="42" ry="30" fill={color} />
          <path d="M58 70 Q60 48 80 42 Q100 35 120 42 Q140 48 142 70" fill={dark} />
          {/* Twin tails */}
          <path d="M62 60 Q45 65 35 100 Q28 140 35 180 Q38 190 45 175 Q52 140 50 100 Q52 75 62 65" fill={color} />
          <path d="M138 60 Q155 65 165 100 Q172 140 165 180 Q162 190 155 175 Q148 140 150 100 Q148 75 138 65" fill={color} />
          {/* Hair ties */}
          <circle cx="55" cy="68" r="5" fill={light} />
          <circle cx="145" cy="68" r="5" fill={light} />
          {/* Bangs */}
          <path d="M65 72 Q80 55 100 66 Q120 55 135 72" fill={color} />
          {/* Shine */}
          <path d="M78 48 Q92 42 106 46" stroke={light} strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      )
    default:
      return null
  }
}

function renderOutfit(style: number, color: string, skin: string) {
  const dark = darken(color, 20)
  const light = lighten(color, 15)

  switch (style) {
    case 0: // Cyber Suit
      return (
        <g>
          {/* Torso */}
          <path d="M72 125 Q70 130 68 170 Q68 200 75 240 L125 240 Q132 200 132 170 Q130 130 128 125 Q115 118 100 118 Q85 118 72 125" fill={color} />
          {/* Center line */}
          <line x1="100" y1="125" x2="100" y2="235" stroke={dark} strokeWidth="2" />
          {/* Tech panel */}
          <rect x="88" y="145" width="24" height="18" rx="3" fill={dark} opacity="0.6" />
          <rect x="92" y="149" width="16" height="10" rx="2" fill={light} opacity="0.3" />
          {/* Shoulder pads */}
          <ellipse cx="68" cy="128" rx="12" ry="8" fill={dark} />
          <ellipse cx="132" cy="128" rx="12" ry="8" fill={dark} />
          {/* Arms */}
          <path d="M56 128 Q50 160 52 195 Q53 200 58 195 Q60 160 62 130" fill={skin} />
          <path d="M144 128 Q150 160 148 195 Q147 200 142 195 Q140 160 138 130" fill={skin} />
          {/* Arm guards */}
          <rect x="49" y="155" width="12" height="20" rx="4" fill={color} opacity="0.7" />
          <rect x="139" y="155" width="12" height="20" rx="4" fill={color} opacity="0.7" />
          {/* Belt */}
          <rect x="68" y="195" width="64" height="8" rx="3" fill={dark} />
          <circle cx="100" cy="199" r="4" fill={light} filter="url(#glow)" opacity="0.8" />
        </g>
      )
    case 1: // Hoodie Tech
      return (
        <g>
          {/* Torso - hoodie shape */}
          <path d="M65 122 Q62 140 60 180 Q60 210 68 240 L132 240 Q140 210 140 180 Q138 140 135 122 Q118 115 100 115 Q82 115 65 122" fill={color} />
          {/* Hood */}
          <path d="M68 122 Q75 112 100 110 Q125 112 132 122 Q128 116 100 108 Q72 116 68 122" fill={dark} />
          {/* Pocket */}
          <path d="M78 185 Q78 178 100 178 Q122 178 122 185 Q122 200 100 200 Q78 200 78 185" fill={dark} opacity="0.4" />
          {/* Drawstrings */}
          <line x1="92" y1="122" x2="90" y2="150" stroke={light} strokeWidth="1.5" />
          <line x1="108" y1="122" x2="110" y2="150" stroke={light} strokeWidth="1.5" />
          {/* Arms (sleeved) */}
          <path d="M58 125 Q50 155 48 190 Q48 195 54 190 Q56 155 62 128" fill={color} />
          <path d="M142 125 Q150 155 152 190 Q152 195 146 190 Q144 155 138 128" fill={color} />
          {/* Hands */}
          <circle cx="50" cy="192" r="6" fill={skin} />
          <circle cx="150" cy="192" r="6" fill={skin} />
          {/* Tech logo */}
          <circle cx="100" cy="155" r="10" fill="none" stroke={light} strokeWidth="1.5" opacity="0.5" />
          <circle cx="100" cy="155" r="4" fill={light} opacity="0.3" />
        </g>
      )
    case 2: // Armadura
      return (
        <g>
          {/* Chest plate */}
          <path d="M70 122 Q68 140 66 175 Q66 205 72 240 L128 240 Q134 205 134 175 Q132 140 130 122 Q116 115 100 115 Q84 115 70 122" fill={dark} />
          {/* Armor panels */}
          <path d="M75 125 L100 135 L125 125 L120 170 L100 175 L80 170 Z" fill={color} opacity="0.9" />
          {/* Center gem */}
          <polygon points="100,140 106,148 100,156 94,148" fill={light} filter="url(#glow)" />
          {/* Shoulder armor */}
          <path d="M55 120 Q50 118 48 125 Q50 135 60 138 Q70 130 68 122 Z" fill={color} />
          <path d="M145 120 Q150 118 152 125 Q150 135 140 138 Q130 130 132 122 Z" fill={color} />
          {/* Arms (armored) */}
          <path d="M55 135 Q48 165 50 195 Q51 200 56 195 Q58 165 60 138" fill={dark} />
          <path d="M145 135 Q152 165 150 195 Q149 200 144 195 Q142 165 140 138" fill={dark} />
          {/* Gauntlets */}
          <rect x="46" y="175" width="14" height="15" rx="4" fill={color} />
          <rect x="140" y="175" width="14" height="15" rx="4" fill={color} />
          {/* Belt */}
          <rect x="66" y="200" width="68" height="10" rx="3" fill={color} />
          <rect x="90" y="202" width="20" height="6" rx="2" fill={light} opacity="0.5" />
          {/* Leg armor accents */}
          <rect x="74" y="242" width="22" height="5" rx="2" fill={color} opacity="0.7" />
          <rect x="104" y="242" width="22" height="5" rx="2" fill={color} opacity="0.7" />
        </g>
      )
    case 3: // Vestido Digital
      return (
        <g>
          {/* Dress body */}
          <path d="M72 122 Q70 135 68 160 Q58 210 50 250 L150 250 Q142 210 132 160 Q130 135 128 122 Q116 115 100 115 Q84 115 72 122" fill={color} />
          {/* Overlay pattern */}
          <path d="M80 130 Q100 125 120 130 L115 170 Q100 165 85 170 Z" fill={light} opacity="0.2" />
          {/* Digital circuit lines */}
          <path d="M80 160 L90 160 L90 180 L110 180 L110 160 L120 160" stroke={light} strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M75 200 L85 200 L85 215 L115 215 L115 200 L125 200" stroke={light} strokeWidth="1" fill="none" opacity="0.3" />
          {/* Collar */}
          <path d="M78 122 Q100 118 122 122 Q118 128 100 130 Q82 128 78 122" fill={dark} />
          {/* Arms */}
          <path d="M65 125 Q55 155 53 190 Q53 195 58 190 Q60 155 68 128" fill={skin} />
          <path d="M135 125 Q145 155 147 190 Q147 195 142 190 Q140 155 132 128" fill={skin} />
          {/* Bracelet accents */}
          <rect x="52" y="170" width="10" height="4" rx="2" fill={light} opacity="0.6" />
          <rect x="138" y="170" width="10" height="4" rx="2" fill={light} opacity="0.6" />
          {/* Waist sash */}
          <path d="M68 168 Q100 162 132 168 Q130 175 100 172 Q70 175 68 168" fill={dark} opacity="0.6" />
          {/* Sparkle */}
          <circle cx="95" cy="145" r="2" fill={light} opacity="0.5">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )
    default:
      return null
  }
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("")}`
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r - amount, g - amount, b - amount)
}

function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r + amount, g + amount, b + amount)
}
