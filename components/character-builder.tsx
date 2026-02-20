"use client"

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
  const h = size * 1.8
  const sd1 = darken(skinTone, 12)
  const sd2 = darken(skinTone, 25)
  const sl = lighten(skinTone, 15)
  const ec = energyColor
  const ecd = darken(ec, 25)
  const ecl = lighten(ec, 25)
  const lipColor = skinTone === "#8d5e3c" ? "#b5645a" : skinTone === "#c68c5a" ? "#c46b6b" : "#e07088"
  const lipDark = darken(lipColor, 15)

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 -z-10 scale-110 rounded-full opacity-40 blur-[30px] animate-glow-pulse"
        style={{ backgroundColor: energyColor }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 240 432" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Skin gradients for 3D effect */}
          <radialGradient id="faceGrad" cx="0.45" cy="0.35" r="0.6">
            <stop offset="0%" stopColor={sl} />
            <stop offset="50%" stopColor={skinTone} />
            <stop offset="100%" stopColor={sd1} />
          </radialGradient>
          <radialGradient id="bodyGrad" cx="0.5" cy="0.2" r="0.7">
            <stop offset="0%" stopColor={sl} />
            <stop offset="100%" stopColor={sd1} />
          </radialGradient>
          <linearGradient id="neckGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skinTone} />
            <stop offset="100%" stopColor={sd1} />
          </linearGradient>
          {/* Eye gradient */}
          <radialGradient id="irisGrad" cx="0.4" cy="0.35" r="0.5">
            <stop offset="0%" stopColor={lighten(eyeColor, 30)} />
            <stop offset="50%" stopColor={eyeColor} />
            <stop offset="100%" stopColor={darken(eyeColor, 30)} />
          </radialGradient>
          {/* Outfit gradients */}
          <linearGradient id="outfitMain" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor={ecl} />
            <stop offset="40%" stopColor={ec} />
            <stop offset="100%" stopColor={ecd} />
          </linearGradient>
          <linearGradient id="outfitDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ecd} />
            <stop offset="100%" stopColor={darken(ec, 40)} />
          </linearGradient>
          {/* Hair gradient */}
          <linearGradient id="hairMain" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor={lighten(ec, 35)} />
            <stop offset="30%" stopColor={ec} />
            <stop offset="100%" stopColor={darken(ec, 20)} />
          </linearGradient>
          <linearGradient id="hairShine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Lip gradient */}
          <linearGradient id="lipGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lipColor} />
            <stop offset="100%" stopColor={lipDark} />
          </linearGradient>
          {/* 3D shading filters */}
          <filter id="softShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="3" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="1" dy="2" result="off" />
            <feComposite in="off" in2="SourceGraphic" operator="arithmetic" k2="1" k3="-0.5" />
          </filter>
        </defs>

        {/* ===== LEGS (slim anime) ===== */}
        {/* Left leg */}
        <path d="M98 295 Q95 330 93 370 Q92 385 95 395 Q98 400 102 395 Q105 385 104 370 Q106 330 105 295" 
          fill="url(#bodyGrad)" />
        {/* Right leg */}
        <path d="M135 295 Q132 330 130 370 Q129 385 132 395 Q135 400 139 395 Q142 385 141 370 Q143 330 142 295" 
          fill="url(#bodyGrad)" />
        {/* Leg 3D shading */}
        <path d="M100 300 Q98 340 97 375" stroke={sd2} strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M137 300 Q135 340 134 375" stroke={sd2} strokeWidth="1" fill="none" opacity="0.3" />

        {/* ===== BOOTS ===== */}
        <path d="M86 388 Q85 395 88 400 Q92 406 102 406 Q110 406 112 400 Q114 394 110 388 Q104 385 98 385 Q90 385 86 388Z" fill={ecd} />
        <path d="M123 388 Q122 395 125 400 Q129 406 139 406 Q147 406 149 400 Q151 394 147 388 Q141 385 135 385 Q127 385 123 388Z" fill={ecd} />
        {/* Boot details */}
        <path d="M89 394 Q100 391 109 394" stroke={ecl} strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M126 394 Q137 391 146 394" stroke={ecl} strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="99" cy="397" r="1.5" fill={ecl} opacity="0.4" />
        <circle cx="136" cy="397" r="1.5" fill={ecl} opacity="0.4" />

        {/* ===== OUTFIT (TORSO + ARMS) ===== */}
        {renderOutfit(outfit, ec, ecd, ecl, skinTone, sd1, sl)}

        {/* ===== NECK (slim) ===== */}
        <path d="M110 148 Q108 155 107 165 Q107 168 112 168 L128 168 Q133 168 133 165 Q132 155 130 148" 
          fill="url(#neckGrad)" />
        {/* Neck shadow */}
        <path d="M112 160 Q120 162 128 160" stroke={sd2} strokeWidth="1" fill="none" opacity="0.2" />

        {/* ===== HEAD (anime proportions - large) ===== */}
        <ellipse cx="120" cy="105" rx="48" ry="55" fill="url(#faceGrad)" />
        {/* Cheek contour (3D) */}
        <ellipse cx="120" cy="115" rx="44" ry="45" fill={sd1} opacity="0.08" />
        {/* Jaw line highlight */}
        <path d="M78 100 Q80 130 100 148 Q120 155 140 148 Q160 130 162 100" 
          fill="none" stroke={sl} strokeWidth="0.5" opacity="0.3" />

        {/* ===== EYES (large anime) ===== */}
        {/* Upper eyelid lines (thick) */}
        <path d="M88 88 Q95 82 108 84" stroke="#2a2a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M132 84 Q145 82 152 88" stroke="#2a2a3a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Eye whites */}
        <ellipse cx="98" cy="94" rx="13" ry="11" fill="white" />
        <ellipse cx="142" cy="94" rx="13" ry="11" fill="white" />
        {/* Lower eyelid subtle */}
        <path d="M86 97 Q98 104 110 97" stroke={sd1} strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M130 97 Q142 104 154 97" stroke={sd1} strokeWidth="0.8" fill="none" opacity="0.4" />

        {/* Irises (large, gradient for 3D) */}
        <ellipse cx="100" cy="94" rx="10" ry="10" fill="url(#irisGrad)" />
        <ellipse cx="144" cy="94" rx="10" ry="10" fill="url(#irisGrad)" />
        {/* Iris ring detail */}
        <ellipse cx="100" cy="94" rx="10" ry="10" fill="none" stroke={darken(eyeColor, 20)} strokeWidth="0.8" />
        <ellipse cx="144" cy="94" rx="10" ry="10" fill="none" stroke={darken(eyeColor, 20)} strokeWidth="0.8" />
        {/* Inner iris pattern */}
        <ellipse cx="100" cy="94" rx="6" ry="6" fill="none" stroke={lighten(eyeColor, 15)} strokeWidth="0.5" opacity="0.5" />
        <ellipse cx="144" cy="94" rx="6" ry="6" fill="none" stroke={lighten(eyeColor, 15)} strokeWidth="0.5" opacity="0.5" />

        {/* Pupils */}
        <circle cx="101" cy="93" r="4.5" fill="#0a0a15" />
        <circle cx="145" cy="93" r="4.5" fill="#0a0a15" />

        {/* Eye reflections (multiple for 3D) */}
        <circle cx="104" cy="89" r="3" fill="white" opacity="0.95" />
        <circle cx="148" cy="89" r="3" fill="white" opacity="0.95" />
        <circle cx="96" cy="96" r="2" fill="white" opacity="0.5" />
        <circle cx="140" cy="96" r="2" fill="white" opacity="0.5" />
        <circle cx="103" cy="93" r="1" fill="white" opacity="0.3" />
        <circle cx="147" cy="93" r="1" fill="white" opacity="0.3" />

        {/* Eyelashes */}
        <path d="M86 87 L83 82" stroke="#2a2a3a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M89 85 L87 80" stroke="#2a2a3a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M154 87 L157 82" stroke="#2a2a3a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M151 85 L153 80" stroke="#2a2a3a" strokeWidth="1.2" strokeLinecap="round" />

        {/* Eyebrows (expressive) */}
        <path d="M86 78 Q95 73 110 77" stroke="#3a3040" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M130 77 Q145 73 154 78" stroke="#3a3040" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* ===== NOSE (subtle anime) ===== */}
        <path d="M118 112 Q120 118 122 112" stroke={sd2} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="120" cy="115" r="0.8" fill={sd2} opacity="0.3" />

        {/* ===== LIPS (detailed 3D) ===== */}
        {/* Upper lip */}
        <path d="M110 125 Q114 122 120 124 Q126 122 130 125" fill="url(#lipGrad)" />
        {/* Lower lip */}
        <path d="M110 125 Q114 126 120 130 Q126 126 130 125" fill={lipColor} />
        {/* Lip highlight */}
        <path d="M114 124 Q120 123 126 124" stroke="white" strokeWidth="0.6" fill="none" opacity="0.35" />
        {/* Lip line */}
        <path d="M110 125 Q120 127 130 125" stroke={lipDark} strokeWidth="0.5" fill="none" />
        {/* Lower lip shine */}
        <ellipse cx="120" cy="128" rx="5" ry="2" fill="white" opacity="0.15" />

        {/* ===== BLUSH ===== */}
        <ellipse cx="82" cy="110" rx="10" ry="5" fill="#ff8888" opacity="0.2" />
        <ellipse cx="158" cy="110" rx="10" ry="5" fill="#ff8888" opacity="0.2" />

        {/* ===== HAIR (on top of face) ===== */}
        {renderHair(hair, ec, ecl, darken(ec, 20))}

        {/* ===== TECH EARPIECE ===== */}
        <ellipse cx="72" cy="100" rx="6" ry="7" fill={ecd} />
        <ellipse cx="72" cy="100" rx="4" ry="5" fill={ec} opacity="0.7" />
        <circle cx="72" cy="100" r="2" fill={ecl} filter="url(#glow)" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* ===== FLOATING PARTICLES ===== */}
        <circle cx="185" cy="70" r="2.5" fill={ec} opacity="0.4">
          <animate attributeName="cy" values="70;62;70" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="85" r="1.8" fill={ec} opacity="0.3">
          <animate attributeName="cy" values="85;78;85" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="178" y="110" width="6" height="6" rx="1" fill="none" stroke={ec} strokeWidth="0.8" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <polygon points="55,140 58,134 61,140 55,140" fill="none" stroke={ec} strokeWidth="0.6" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.5;0.25" dur="3s" repeatCount="indefinite" />
        </polygon>
      </svg>
    </div>
  )
}

function renderHair(style: number, color: string, light: string, dark: string) {
  switch (style) {
    case 0: // Corto
      return (
        <g>
          {/* Main hair mass */}
          <path d="M72 85 Q70 55 85 42 Q100 32 120 30 Q140 32 155 42 Q170 55 168 85 Q165 70 155 60 Q140 50 120 48 Q100 50 85 60 Q75 70 72 85"
            fill="url(#hairMain)" />
          {/* Top volume */}
          <path d="M75 75 Q78 45 100 35 Q120 28 145 35 Q165 45 165 75"
            fill={color} />
          {/* Bangs */}
          <path d="M78 82 Q85 60 98 75 Q105 62 120 73 Q130 60 140 75 Q150 62 162 82"
            fill={color} />
          {/* 3D shine streaks */}
          <path d="M95 40 Q110 35 125 38" stroke={light} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M90 50 Q105 46 115 48" stroke={light} strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
          {/* Shadow layer */}
          <path d="M80 78 Q85 68 98 72" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M142 72 Q155 68 160 78" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.3" />
        </g>
      )
    case 1: // Largo
      return (
        <g>
          {/* Back hair (behind everything, but drawn on top since SVG) */}
          <path d="M68 80 Q62 140 60 210 Q58 250 65 270 Q70 275 75 265 Q78 240 76 200 Q74 140 75 80"
            fill={dark} />
          <path d="M172 80 Q178 140 180 210 Q182 250 175 270 Q170 275 165 265 Q162 240 164 200 Q166 140 165 80"
            fill={dark} />
          {/* Main hair */}
          <path d="M68 80 Q66 50 85 38 Q105 28 120 26 Q135 28 155 38 Q174 50 172 80"
            fill="url(#hairMain)" />
          {/* Side hair strands */}
          <path d="M68 80 Q63 130 62 190 Q60 230 64 260 Q67 268 72 258 Q74 230 72 190 Q70 130 72 80"
            fill={color} />
          <path d="M172 80 Q177 130 178 190 Q180 230 176 260 Q173 268 168 258 Q166 230 168 190 Q170 130 168 80"
            fill={color} />
          {/* Bangs */}
          <path d="M75 80 Q88 55 120 68 Q152 55 165 80"
            fill={color} />
          {/* Hair strands over forehead */}
          <path d="M82 78 Q90 58 102 72" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M138 72 Q150 58 158 78" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* 3D shine */}
          <path d="M90 38 Q110 32 130 36" stroke={light} strokeWidth="3.5" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M85 50 Q100 45 115 48" stroke={light} strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
          {/* Side shine */}
          <path d="M66 120 Q68 160 66 200" stroke={light} strokeWidth="2" fill="none" opacity="0.15" />
          <path d="M174 120 Q172 160 174 200" stroke={light} strokeWidth="2" fill="none" opacity="0.15" />
        </g>
      )
    case 2: // Puntas (spiky)
      return (
        <g>
          {/* Spike shapes */}
          <path d="M68 78 L50 25 L82 60 L60 5 L100 52 L90 10 L120 48 L130 0 L140 52 L160 8 L155 60 L178 20 L168 60 L190 30 L172 78"
            fill="url(#hairMain)" />
          {/* Base hair */}
          <path d="M72 80 Q70 55 90 42 Q110 34 130 34 Q150 42 168 55 Q170 65 168 80"
            fill={color} />
          {/* Bangs (spiky) */}
          <path d="M78 82 Q82 58 92 72 Q96 50 108 68 Q115 48 125 68 Q132 48 142 70 Q148 56 162 82"
            fill={color} />
          {/* 3D highlights */}
          <path d="M85 30 Q100 20 115 25" stroke={light} strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M65 45 L72 55" stroke={light} strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
          <path d="M158 45 L165 55" stroke={light} strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
          {/* Dark edges */}
          <path d="M55 20 L78 58" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.2" />
          <path d="M185 25 L165 58" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.2" />
        </g>
      )
    case 3: // Coletas (twin tails)
      return (
        <g>
          {/* Main head hair */}
          <path d="M72 82 Q70 50 88 38 Q108 28 120 27 Q132 28 152 38 Q170 50 168 82"
            fill="url(#hairMain)" />
          {/* Twin tails */}
          <path d="M72 72 Q52 80 40 120 Q30 170 35 230 Q38 250 45 240 Q52 210 50 170 Q52 120 60 90 Q65 78 72 74"
            fill={color} />
          <path d="M168 72 Q188 80 200 120 Q210 170 205 230 Q202 250 195 240 Q188 210 190 170 Q188 120 180 90 Q175 78 168 74"
            fill={color} />
          {/* Tail 3D shading */}
          <path d="M42 130 Q45 170 43 210" stroke={light} strokeWidth="3" fill="none" opacity="0.2" />
          <path d="M198 130 Q195 170 197 210" stroke={light} strokeWidth="3" fill="none" opacity="0.2" />
          <path d="M48 140 Q50 180 48 220" stroke={dark} strokeWidth="2" fill="none" opacity="0.15" />
          <path d="M192 140 Q190 180 192 220" stroke={dark} strokeWidth="2" fill="none" opacity="0.15" />
          {/* Hair ties (ornament) */}
          <circle cx="64" cy="78" r="7" fill={light} />
          <circle cx="64" cy="78" r="4" fill="white" opacity="0.5" />
          <circle cx="176" cy="78" r="7" fill={light} />
          <circle cx="176" cy="78" r="4" fill="white" opacity="0.5" />
          {/* Bangs */}
          <path d="M78 80 Q92 58 120 70 Q148 58 162 80" fill={color} />
          {/* Shine */}
          <path d="M92 38 Q110 30 135 36" stroke={light} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
        </g>
      )
    default:
      return null
  }
}

function renderOutfit(style: number, ec: string, ecd: string, ecl: string, skin: string, skinD: string, skinL: string) {
  switch (style) {
    case 0: // Cyber Suit
      return (
        <g>
          {/* Torso (slim anime) */}
          <path d="M95 168 Q88 178 84 200 Q80 230 82 260 Q84 280 88 295 L152 295 Q156 280 158 260 Q160 230 156 200 Q152 178 145 168"
            fill="url(#outfitMain)" />
          {/* Center seam */}
          <line x1="120" y1="172" x2="120" y2="290" stroke={ecd} strokeWidth="1.5" opacity="0.6" />
          {/* Chest panel */}
          <path d="M102 180 L120 188 L138 180 L135 210 L120 214 L105 210 Z" fill={ecd} opacity="0.5" />
          {/* Tech circle */}
          <circle cx="120" cy="195" r="6" fill={ecd} />
          <circle cx="120" cy="195" r="4" fill={ecl} filter="url(#glow)" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Shoulder pads */}
          <ellipse cx="82" cy="172" rx="14" ry="8" fill={ecd} />
          <ellipse cx="82" cy="172" rx="10" ry="5" fill={ec} opacity="0.5" />
          <ellipse cx="158" cy="172" rx="14" ry="8" fill={ecd} />
          <ellipse cx="158" cy="172" rx="10" ry="5" fill={ec} opacity="0.5" />
          {/* Belt */}
          <rect x="80" y="250" width="80" height="10" rx="4" fill={ecd} />
          <circle cx="120" cy="255" r="5" fill={ecl} opacity="0.6" />
          {/* Arms (slim) */}
          <path d="M68 172 Q60 200 56 235 Q54 250 55 260" fill={skin} stroke={skinD} strokeWidth="0.5" />
          <path d="M82 175 Q72 198 66 230 Q64 248 65 258" fill={ec} />
          <path d="M172 172 Q180 200 184 235 Q186 250 185 260" fill={skin} stroke={skinD} strokeWidth="0.5" />
          <path d="M158 175 Q168 198 174 230 Q176 248 175 258" fill={ec} />
          {/* Arm guards */}
          <rect x="58" y="218" width="14" height="22" rx="5" fill={ecd} opacity="0.8" />
          <rect x="168" y="218" width="14" height="22" rx="5" fill={ecd} opacity="0.8" />
          {/* HANDS with fingers */}
          {renderHand(50, 260, skin, skinD, skinL, false)}
          {renderHand(180, 260, skin, skinD, skinL, true)}
        </g>
      )
    case 1: // Hoodie Tech
      return (
        <g>
          {/* Hoodie body */}
          <path d="M90 165 Q82 180 78 210 Q74 250 78 295 L162 295 Q166 250 162 210 Q158 180 150 165 Q136 158 120 158 Q104 158 90 165"
            fill="url(#outfitMain)" />
          {/* Hood */}
          <path d="M90 165 Q96 155 120 152 Q144 155 150 165 Q145 158 120 150 Q95 158 90 165" fill={ecd} />
          {/* Pocket */}
          <path d="M95 235 Q95 228 120 228 Q145 228 145 235 Q145 250 120 250 Q95 250 95 235" fill={ecd} opacity="0.35" />
          {/* Drawstrings */}
          <line x1="112" y1="165" x2="110" y2="195" stroke={ecl} strokeWidth="1.2" opacity="0.5" />
          <line x1="128" y1="165" x2="130" y2="195" stroke={ecl} strokeWidth="1.2" opacity="0.5" />
          <circle cx="110" cy="196" r="2" fill={ecl} opacity="0.4" />
          <circle cx="130" cy="196" r="2" fill={ecl} opacity="0.4" />
          {/* Logo */}
          <circle cx="120" cy="200" r="10" fill="none" stroke={ecl} strokeWidth="1.2" opacity="0.4" />
          <circle cx="120" cy="200" r="4" fill={ecl} opacity="0.2" />
          {/* Sleeves + arms */}
          <path d="M72 170 Q58 200 52 240 Q50 258 52 268" fill={ec} />
          <path d="M168 170 Q182 200 188 240 Q190 258 188 268" fill={ec} />
          {/* Hands */}
          {renderHand(46, 268, skin, skinD, skinL, false)}
          {renderHand(184, 268, skin, skinD, skinL, true)}
          {/* Hoodie wrinkle lines */}
          <path d="M95 200 Q100 205 105 200" stroke={ecd} strokeWidth="0.8" fill="none" opacity="0.3" />
          <path d="M135 200 Q140 205 145 200" stroke={ecd} strokeWidth="0.8" fill="none" opacity="0.3" />
        </g>
      )
    case 2: // Armadura
      return (
        <g>
          {/* Under suit */}
          <path d="M92 168 Q86 185 82 215 Q80 245 82 280 Q84 290 88 295 L152 295 Q156 290 158 280 Q160 245 158 215 Q154 185 148 168"
            fill={ecd} />
          {/* Chest armor plate */}
          <path d="M88 172 L120 182 L152 172 L148 225 L120 230 L92 225 Z" fill="url(#outfitMain)" />
          {/* Armor 3D highlight */}
          <path d="M95 178 L120 186 L145 178" stroke={ecl} strokeWidth="1" fill="none" opacity="0.5" />
          {/* Center gem */}
          <polygon points="120,192 128,200 120,210 112,200" fill={ecl} filter="url(#glow)">
            <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
          </polygon>
          {/* Shoulder armor */}
          <path d="M65 162 Q58 158 55 168 Q58 182 72 186 Q84 180 80 170 Z" fill="url(#outfitMain)" />
          <path d="M175 162 Q182 158 185 168 Q182 182 168 186 Q156 180 160 170 Z" fill="url(#outfitMain)" />
          <path d="M60 165 Q65 162 72 165" stroke={ecl} strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M168 165 Q175 162 180 165" stroke={ecl} strokeWidth="1" fill="none" opacity="0.4" />
          {/* Arms (armored) */}
          <path d="M62 182 Q54 210 52 248 Q51 260 53 268" fill={ecd} />
          <path d="M178 182 Q186 210 188 248 Q189 260 187 268" fill={ecd} />
          {/* Gauntlets */}
          <rect x="46" y="235" width="16" height="20" rx="5" fill="url(#outfitMain)" />
          <rect x="178" y="235" width="16" height="20" rx="5" fill="url(#outfitMain)" />
          {/* Hands (armored gloves) */}
          {renderHand(48, 256, ec, ecd, ecl, false)}
          {renderHand(182, 256, ec, ecd, ecl, true)}
          {/* Belt armor */}
          <rect x="80" y="252" width="80" height="12" rx="4" fill="url(#outfitMain)" />
          <rect x="108" y="254" width="24" height="8" rx="3" fill={ecl} opacity="0.4" />
          {/* Leg armor accents */}
          <rect x="86" y="296" width="24" height="6" rx="2" fill={ec} opacity="0.6" />
          <rect x="130" y="296" width="24" height="6" rx="2" fill={ec} opacity="0.6" />
        </g>
      )
    case 3: // Vestido Digital
      return (
        <g>
          {/* Dress body (flared) */}
          <path d="M95 168 Q88 180 82 210 Q68 270 55 310 L185 310 Q172 270 158 210 Q152 180 145 168 Q134 160 120 160 Q106 160 95 168"
            fill="url(#outfitMain)" />
          {/* Collar */}
          <path d="M95 168 Q120 162 145 168 Q140 175 120 178 Q100 175 95 168" fill={ecd} />
          {/* Circuit pattern overlay */}
          <path d="M100 200 L108 200 L108 220 L132 220 L132 200 L140 200" stroke={ecl} strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M92 250 L102 250 L102 268 L138 268 L138 250 L148 250" stroke={ecl} strokeWidth="0.8" fill="none" opacity="0.2" />
          <circle cx="108" cy="220" r="2" fill={ecl} opacity="0.3" />
          <circle cx="132" cy="220" r="2" fill={ecl} opacity="0.3" />
          {/* Waist sash */}
          <path d="M82 218 Q120 212 158 218 Q155 226 120 222 Q85 226 82 218" fill={ecd} opacity="0.5" />
          {/* Arms (bare) */}
          <path d="M82 170 Q68 200 62 240 Q60 258 60 268" fill={skin} stroke={skinD} strokeWidth="0.5" />
          <path d="M158 170 Q172 200 178 240 Q180 258 180 268" fill={skin} stroke={skinD} strokeWidth="0.5" />
          {/* Arm highlight */}
          <path d="M76 185 Q70 210 66 240" stroke={skinL} strokeWidth="1.5" fill="none" opacity="0.25" />
          <path d="M164 185 Q170 210 174 240" stroke={skinL} strokeWidth="1.5" fill="none" opacity="0.25" />
          {/* Bracelets */}
          <rect x="56" y="228" width="12" height="5" rx="2.5" fill={ecl} opacity="0.5" />
          <rect x="172" y="228" width="12" height="5" rx="2.5" fill={ecl} opacity="0.5" />
          {/* Hands */}
          {renderHand(54, 268, skin, skinD, skinL, false)}
          {renderHand(174, 268, skin, skinD, skinL, true)}
          {/* Sparkles on dress */}
          <circle cx="110" cy="195" r="1.5" fill={ecl} opacity="0.5">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="135" cy="240" r="1.2" fill={ecl} opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="95" cy="270" r="1" fill={ecl} opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      )
    default:
      return null
  }
}

function renderHand(x: number, y: number, skin: string, skinD: string, skinL: string, mirror: boolean) {
  const dir = mirror ? -1 : 1
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Palm */}
      <ellipse cx={dir * 6} cy="4" rx="8" ry="7" fill={skin} />
      {/* Palm 3D */}
      <ellipse cx={dir * 5} cy="3" rx="5" ry="4" fill={skinL} opacity="0.2" />
      {/* Thumb */}
      <path d={`M${dir * -1},0 Q${dir * -5},-4 ${dir * -3},-8 Q${dir * -1},-10 ${dir * 1},-6 Q${dir * 1},-2 ${dir * -1},0`}
        fill={skin} stroke={skinD} strokeWidth="0.5" />
      {/* Index finger */}
      <path d={`M${dir * 2},-2 Q${dir * 3},-10 ${dir * 4},-14 Q${dir * 5},-15 ${dir * 6},-14 Q${dir * 7},-10 ${dir * 6},-2`}
        fill={skin} stroke={skinD} strokeWidth="0.4" />
      {/* Middle finger */}
      <path d={`M${dir * 6},-2 Q${dir * 7},-11 ${dir * 8},-16 Q${dir * 9},-17 ${dir * 10},-16 Q${dir * 11},-11 ${dir * 10},-2`}
        fill={skin} stroke={skinD} strokeWidth="0.4" />
      {/* Ring finger */}
      <path d={`M${dir * 10},-1 Q${dir * 11},-9 ${dir * 12},-13 Q${dir * 13},-14 ${dir * 14},-13 Q${dir * 14},-9 ${dir * 13},-1`}
        fill={skin} stroke={skinD} strokeWidth="0.4" />
      {/* Pinky */}
      <path d={`M${dir * 12},1 Q${dir * 13},-5 ${dir * 14},-8 Q${dir * 15},-9 ${dir * 15},-8 Q${dir * 16},-5 ${dir * 14},1`}
        fill={skin} stroke={skinD} strokeWidth="0.4" />
      {/* Knuckle highlights */}
      <circle cx={dir * 5} cy={-12} r="0.6" fill={skinL} opacity="0.3" />
      <circle cx={dir * 9} cy={-14} r="0.6" fill={skinL} opacity="0.3" />
    </g>
  )
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
