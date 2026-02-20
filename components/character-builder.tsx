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
  skinTone: "#fae4d8",
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
  { value: "#fae4d8", label: "Claro" },
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

// Viewbox: 0 0 280 520 — tall anime proportions
export function CharacterAvatar({ parts, energyColor, size = 200, className = "" }: Props) {
  const { hair, eyeColor, skinTone, outfit } = parts
  const w = size
  const h = size * (520 / 280)

  const s = skinTone
  const sd = darken(s, 18)
  const sd2 = darken(s, 30)
  const sl = lighten(s, 12)
  const ec = energyColor
  const ecd = darken(ec, 25)
  const ecl = lighten(ec, 25)
  const ecll = lighten(ec, 40)
  const lipBase = s === "#8d5e3c" ? "#a8605a" : s === "#c68c5a" ? "#c47070" : s === "#e8b896" ? "#d4787e" : "#e08090"
  const lipDk = darken(lipBase, 15)

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 -z-10 scale-110 rounded-full opacity-40 blur-[30px] animate-glow-pulse" style={{ backgroundColor: ec }} aria-hidden="true" />
      <svg viewBox="0 0 280 520" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fg" cx="0.45" cy="0.35" r="0.55">
            <stop offset="0%" stopColor={sl} />
            <stop offset="60%" stopColor={s} />
            <stop offset="100%" stopColor={sd} />
          </radialGradient>
          <radialGradient id="bg" cx="0.5" cy="0.25" r="0.65">
            <stop offset="0%" stopColor={sl} />
            <stop offset="100%" stopColor={sd} />
          </radialGradient>
          <radialGradient id="ig" cx="0.38" cy="0.32" r="0.55">
            <stop offset="0%" stopColor={lighten(eyeColor, 40)} />
            <stop offset="40%" stopColor={eyeColor} />
            <stop offset="100%" stopColor={darken(eyeColor, 35)} />
          </radialGradient>
          <linearGradient id="om" x1="0.1" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={ecl} />
            <stop offset="50%" stopColor={ec} />
            <stop offset="100%" stopColor={ecd} />
          </linearGradient>
          <linearGradient id="od" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ecd} />
            <stop offset="100%" stopColor={darken(ec, 40)} />
          </linearGradient>
          <linearGradient id="hm" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor={lighten(ec, 40)} />
            <stop offset="25%" stopColor={ec} />
            <stop offset="100%" stopColor={darken(ec, 18)} />
          </linearGradient>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lipBase} />
            <stop offset="100%" stopColor={lipDk} />
          </linearGradient>
          <filter id="gl"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {/* ====== LEGS — long, slim anime legs ====== */}
        {/* Left leg */}
        <path d="M118 340 Q115 370 113 405 Q112 430 113 450 Q113 460 115 468
                 C116 472 118 475 120 475 C122 475 124 472 125 468
                 Q126 460 126 450 Q127 430 126 405 Q125 370 123 340"
          fill="url(#bg)" stroke={sd} strokeWidth="0.5" />
        {/* Right leg */}
        <path d="M157 340 Q154 370 152 405 Q151 430 152 450 Q152 460 154 468
                 C155 472 157 475 159 475 C161 475 163 472 164 468
                 Q165 460 165 450 Q166 430 165 405 Q164 370 162 340"
          fill="url(#bg)" stroke={sd} strokeWidth="0.5" />
        {/* Inner leg shadow */}
        <path d="M122 345 Q123 380 124 420" stroke={sd2} strokeWidth="1.5" fill="none" opacity="0.15" />
        <path d="M158 345 Q157 380 156 420" stroke={sd2} strokeWidth="1.5" fill="none" opacity="0.15" />
        {/* Knee highlights */}
        <ellipse cx="119" cy="400" rx="4" ry="6" fill={sl} opacity="0.12" />
        <ellipse cx="159" cy="400" rx="4" ry="6" fill={sl} opacity="0.12" />

        {/* ====== SHOES — platform mary-janes ====== */}
        <path d="M106 470 Q105 478 108 484 Q114 490 122 490 Q130 490 133 484 Q135 478 132 470 Q126 467 119 467 Q112 467 106 470Z"
          fill="#1a1a2a" />
        <path d="M146 470 Q145 478 148 484 Q154 490 162 490 Q170 490 173 484 Q175 478 172 470 Q166 467 159 467 Q152 467 146 470Z"
          fill="#1a1a2a" />
        {/* Shoe straps */}
        <path d="M110 474 Q119 471 130 474" stroke="#2a2a3a" strokeWidth="2" fill="none" />
        <path d="M150 474 Q159 471 170 474" stroke="#2a2a3a" strokeWidth="2" fill="none" />
        {/* Platform sole */}
        <path d="M104 484 Q106 492 122 492 Q132 492 135 484" stroke="#0a0a15" strokeWidth="2.5" fill="none" />
        <path d="M144 484 Q146 492 162 492 Q172 492 175 484" stroke="#0a0a15" strokeWidth="2.5" fill="none" />
        {/* Shoe buckle */}
        <circle cx="119" cy="473" r="2" fill={ec} opacity="0.6" />
        <circle cx="159" cy="473" r="2" fill={ec} opacity="0.6" />

        {/* ====== LEG WARMERS (tech style) ====== */}
        {renderLegWarmers(ec, ecd, ecl)}

        {/* ====== OUTFIT — torso, arms, details ====== */}
        {renderOutfit(outfit, ec, ecd, ecl, ecll, s, sd, sd2, sl)}

        {/* ====== NECK — slim, elegant ====== */}
        <path d="M128 155 Q126 162 125 172 L155 172 Q154 162 152 155" fill={s} />
        <path d="M130 160 Q140 163 150 160" stroke={sd} strokeWidth="0.6" fill="none" opacity="0.2" />
        {/* Collarbone hints */}
        <path d="M112 175 Q125 180 140 178" stroke={sd} strokeWidth="0.7" fill="none" opacity="0.2" />
        <path d="M168 175 Q155 180 140 178" stroke={sd} strokeWidth="0.7" fill="none" opacity="0.2" />

        {/* ====== HEAD — large anime head ====== */}
        <ellipse cx="140" cy="105" rx="52" ry="58" fill="url(#fg)" />
        {/* Jaw contour */}
        <path d="M92 95 Q95 130 115 150 Q130 158 140 158 Q150 158 165 150 Q185 130 188 95"
          fill="none" stroke={sd} strokeWidth="0.5" opacity="0.15" />
        {/* Cheek soft shadow */}
        <ellipse cx="140" cy="120" rx="46" ry="40" fill={sd} opacity="0.05" />

        {/* ====== EYES — large expressive anime eyes ====== */}
        {/* Upper lash line (thick, expressive) */}
        <path d="M105 92 Q112 84 128 87" stroke="#1a1520" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M152 87 Q168 84 175 92" stroke="#1a1520" strokeWidth="3.5" fill="none" strokeLinecap="round" />

        {/* Eye whites with slight blue tint */}
        <ellipse cx="116" cy="97" rx="15" ry="13" fill="#f8f8ff" />
        <ellipse cx="164" cy="97" rx="15" ry="13" fill="#f8f8ff" />

        {/* Lower lid line */}
        <path d="M102 101 Q116 110 130 101" stroke={sd} strokeWidth="0.7" fill="none" opacity="0.35" />
        <path d="M150 101 Q164 110 178 101" stroke={sd} strokeWidth="0.7" fill="none" opacity="0.35" />

        {/* Iris — large with radial gradient */}
        <circle cx="118" cy="97" r="11" fill="url(#ig)" />
        <circle cx="166" cy="97" r="11" fill="url(#ig)" />
        {/* Iris outer ring */}
        <circle cx="118" cy="97" r="11" fill="none" stroke={darken(eyeColor, 25)} strokeWidth="1" />
        <circle cx="166" cy="97" r="11" fill="none" stroke={darken(eyeColor, 25)} strokeWidth="1" />
        {/* Iris inner detail ring */}
        <circle cx="118" cy="97" r="7" fill="none" stroke={lighten(eyeColor, 20)} strokeWidth="0.5" opacity="0.5" />
        <circle cx="166" cy="97" r="7" fill="none" stroke={lighten(eyeColor, 20)} strokeWidth="0.5" opacity="0.5" />
        {/* Iris radial lines for detail */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const rad = (a * Math.PI) / 180
          return (
            <g key={a}>
              <line x1={118 + Math.cos(rad) * 5} y1={97 + Math.sin(rad) * 5}
                x2={118 + Math.cos(rad) * 10} y2={97 + Math.sin(rad) * 10}
                stroke={darken(eyeColor, 15)} strokeWidth="0.3" opacity="0.3" />
              <line x1={166 + Math.cos(rad) * 5} y1={97 + Math.sin(rad) * 5}
                x2={166 + Math.cos(rad) * 10} y2={97 + Math.sin(rad) * 10}
                stroke={darken(eyeColor, 15)} strokeWidth="0.3" opacity="0.3" />
            </g>
          )
        })}

        {/* Pupils */}
        <circle cx="119" cy="96" r="5" fill="#08080f" />
        <circle cx="167" cy="96" r="5" fill="#08080f" />

        {/* Eye reflections — multiple for glass/3D */}
        <ellipse cx="123" cy="91" rx="3.5" ry="3" fill="white" opacity="0.92" />
        <ellipse cx="171" cy="91" rx="3.5" ry="3" fill="white" opacity="0.92" />
        <circle cx="114" cy="100" r="2" fill="white" opacity="0.45" />
        <circle cx="162" cy="100" r="2" fill="white" opacity="0.45" />
        <circle cx="121" cy="95" r="1" fill="white" opacity="0.3" />
        <circle cx="169" cy="95" r="1" fill="white" opacity="0.3" />

        {/* Eyelashes — long, curved */}
        <path d="M102 90 L98 84 Q99 83 101 85" stroke="#1a1520" strokeWidth="1.5" fill="#1a1520" />
        <path d="M106 87 L103 81 Q104 80 106 83" stroke="#1a1520" strokeWidth="1.2" fill="#1a1520" />
        <path d="M178 90 L182 84 Q181 83 179 85" stroke="#1a1520" strokeWidth="1.5" fill="#1a1520" />
        <path d="M174 87 L177 81 Q176 80 174 83" stroke="#1a1520" strokeWidth="1.2" fill="#1a1520" />

        {/* Eyebrows — sharp, elegant */}
        <path d="M104 80 Q114 74 130 78" stroke="#3a2a35" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M150 78 Q166 74 176 80" stroke="#3a2a35" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* ====== NOSE — delicate anime ====== */}
        <path d="M138 118 L140 124 L142 120" stroke={sd2} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Nose shadow dot */}
        <circle cx="140" cy="125" r="0.8" fill={sd2} opacity="0.25" />

        {/* ====== LIPS — soft, defined ====== */}
        {/* Upper lip with cupid's bow */}
        <path d="M130 134 Q134 131 140 133 Q146 131 150 134" fill="url(#lg)" />
        {/* Lower lip — fuller */}
        <path d="M130 134 Q134 136 140 140 Q146 136 150 134" fill={lipBase} />
        {/* Lip center line */}
        <path d="M131 134 Q140 136 149 134" stroke={lipDk} strokeWidth="0.4" fill="none" />
        {/* Upper lip highlight */}
        <path d="M135 132.5 Q140 131.5 145 132.5" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* Lower lip shine (3D) */}
        <ellipse cx="140" cy="137" rx="5" ry="2" fill="white" opacity="0.12" />
        {/* Mouth corners */}
        <circle cx="130" cy="134" r="0.5" fill={lipDk} opacity="0.3" />
        <circle cx="150" cy="134" r="0.5" fill={lipDk} opacity="0.3" />

        {/* ====== BLUSH ====== */}
        <ellipse cx="100" cy="115" rx="11" ry="5" fill="#ff8888" opacity="0.15" />
        <ellipse cx="180" cy="115" rx="11" ry="5" fill="#ff8888" opacity="0.15" />

        {/* ====== HAIR — on top ====== */}
        {renderHair(hair, ec, ecl, darken(ec, 18), ecll)}

        {/* ====== TECH EARPIECE ====== */}
        <ellipse cx="88" cy="104" rx="5" ry="6" fill={ecd} />
        <ellipse cx="88" cy="104" rx="3.5" ry="4" fill={ec} opacity="0.6" />
        <circle cx="88" cy="104" r="2" fill={ecl} filter="url(#gl)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* ====== FLOATING PARTICLES ====== */}
        <circle cx="210" cy="65" r="2.5" fill={ec} opacity="0.35">
          <animate attributeName="cy" values="65;57;65" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="80" r="1.8" fill={ec} opacity="0.25">
          <animate attributeName="cy" values="80;73;80" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="205" y="110" width="5" height="5" rx="1" fill="none" stroke={ec} strokeWidth="0.7" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2.5s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  )
}

function renderLegWarmers(ec: string, ecd: string, ecl: string) {
  // Chunky leg warmers like the reference image
  return (
    <g>
      {/* Left leg warmer */}
      <path d="M108 418 Q106 425 106 435 Q105 445 106 455 Q107 462 110 465
               L128 465 Q131 462 132 455 Q133 445 132 435 Q132 425 130 418"
        fill={ec} />
      {/* Wrinkle folds */}
      <path d="M108 425 Q118 422 130 425" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M107 435 Q118 432 131 435" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M107 445 Q118 442 131 445" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M108 455 Q118 452 130 455" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      {/* Highlight */}
      <path d="M115 420 Q116 440 115 460" stroke={ecl} strokeWidth="1.5" fill="none" opacity="0.2" />

      {/* Right leg warmer */}
      <path d="M148 418 Q146 425 146 435 Q145 445 146 455 Q147 462 150 465
               L168 465 Q171 462 172 455 Q173 445 172 435 Q172 425 170 418"
        fill={ec} />
      <path d="M148 425 Q158 422 170 425" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M147 435 Q158 432 171 435" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M147 445 Q158 442 171 445" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M148 455 Q158 452 170 455" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M155 420 Q156 440 155 460" stroke={ecl} strokeWidth="1.5" fill="none" opacity="0.2" />
    </g>
  )
}

function renderHair(style: number, color: string, light: string, dark: string, vlight: string) {
  switch (style) {
    case 0: // Corto
      return (
        <g>
          <path d="M88 90 Q86 55 105 40 Q125 28 140 26 Q155 28 175 40 Q194 55 192 90 Q188 70 175 58 Q158 46 140 44 Q122 46 105 58 Q92 70 88 90"
            fill="url(#hm)" />
          <path d="M90 82 Q94 50 120 38 Q140 30 165 38 Q190 50 190 82" fill={color} />
          {/* Bangs — chunky anime style */}
          <path d="M92 88 Q100 62 115 80 Q120 65 140 78 Q155 62 165 80 Q175 65 188 88" fill={color} />
          {/* Hair strand details */}
          <path d="M98 80 Q105 60 112 76" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M165 76 Q172 58 180 80" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* 3D shine */}
          <path d="M115 40 Q135 32 155 38" stroke={vlight} strokeWidth="4" fill="none" opacity="0.35" strokeLinecap="round" />
          <path d="M108 52 Q125 46 138 50" stroke={light} strokeWidth="2.5" fill="none" opacity="0.2" strokeLinecap="round" />
        </g>
      )
    case 1: // Largo — like reference image, straight long hair
      return (
        <g>
          {/* Back hair (long, past shoulders) */}
          <path d="M82 85 Q76 150 74 220 Q72 270 76 300 Q78 308 82 300 Q84 270 84 220 Q84 150 86 85" fill={dark} />
          <path d="M198 85 Q204 150 206 220 Q208 270 204 300 Q202 308 198 300 Q196 270 196 220 Q196 150 194 85" fill={dark} />
          {/* Main hair cap */}
          <path d="M84 88 Q82 50 105 36 Q128 24 140 22 Q152 24 175 36 Q198 50 196 88" fill="url(#hm)" />
          {/* Side hair — long flowing */}
          <path d="M84 88 Q78 140 76 210 Q74 260 78 295 Q80 302 84 292 Q86 260 86 210 Q86 140 88 88" fill={color} />
          <path d="M196 88 Q202 140 204 210 Q206 260 202 295 Q200 302 196 292 Q194 260 194 210 Q194 140 192 88" fill={color} />
          {/* Inner hair strands */}
          <path d="M88 90 Q84 140 82 200 Q80 240 82 270" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.2" />
          <path d="M192 90 Q196 140 198 200 Q200 240 198 270" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.2" />
          {/* Bangs */}
          <path d="M90 86 Q108 58 140 72 Q172 58 190 86" fill={color} />
          {/* Bang strands */}
          <path d="M96 84 Q104 60 116 78" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M164 78 Q176 60 184 84" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* 3D shine streaks */}
          <path d="M112 34 Q135 26 158 32" stroke={vlight} strokeWidth="4.5" fill="none" opacity="0.35" strokeLinecap="round" />
          <path d="M105 48 Q125 42 140 46" stroke={light} strokeWidth="2.5" fill="none" opacity="0.2" strokeLinecap="round" />
          {/* Side hair shine */}
          <path d="M80 130 Q82 180 80 240" stroke={light} strokeWidth="2.5" fill="none" opacity="0.12" />
          <path d="M200 130 Q198 180 200 240" stroke={light} strokeWidth="2.5" fill="none" opacity="0.12" />
        </g>
      )
    case 2: // Puntas — spiky/edgy
      return (
        <g>
          {/* Spikes */}
          <path d="M82 82 L62 22 L98 65 L72 0 L120 55 L105 8 L140 50 L148 -5 L158 55 L178 5 L170 65 L200 15 L188 65 L215 28 L196 82"
            fill="url(#hm)" />
          {/* Base cap */}
          <path d="M88 86 Q86 55 108 42 Q130 32 150 32 Q170 42 192 55 Q194 70 192 86" fill={color} />
          {/* Spiky bangs */}
          <path d="M92 86 Q98 58 110 76 Q116 50 128 72 Q135 48 148 70 Q155 46 165 74 Q172 56 188 86" fill={color} />
          {/* Shine */}
          <path d="M102 25 Q120 15 140 20" stroke={vlight} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M78 40 L88 55" stroke={light} strokeWidth="2.5" fill="none" opacity="0.25" strokeLinecap="round" />
          <path d="M192 40 L184 55" stroke={light} strokeWidth="2.5" fill="none" opacity="0.25" strokeLinecap="round" />
        </g>
      )
    case 3: // Coletas — twin tails
      return (
        <g>
          {/* Hair cap */}
          <path d="M88 86 Q86 48 108 35 Q130 24 140 22 Q150 24 172 35 Q194 48 192 86" fill="url(#hm)" />
          {/* Twin tails — long, flowing */}
          <path d="M86 76 Q62 85 48 130 Q35 185 40 260 Q42 278 50 265 Q56 230 55 185 Q58 130 70 95 Q78 82 86 78"
            fill={color} />
          <path d="M194 76 Q218 85 232 130 Q245 185 240 260 Q238 278 230 265 Q224 230 225 185 Q222 130 210 95 Q202 82 194 78"
            fill={color} />
          {/* Tail shading */}
          <path d="M46 140 Q50 190 48 240" stroke={light} strokeWidth="3.5" fill="none" opacity="0.15" />
          <path d="M234 140 Q230 190 232 240" stroke={light} strokeWidth="3.5" fill="none" opacity="0.15" />
          <path d="M52 150 Q54 200 52 250" stroke={dark} strokeWidth="2" fill="none" opacity="0.12" />
          <path d="M228 150 Q226 200 228 250" stroke={dark} strokeWidth="2" fill="none" opacity="0.12" />
          {/* Hair ties — ornaments */}
          <circle cx="78" cy="82" r="8" fill={light} />
          <circle cx="78" cy="82" r="5" fill="white" opacity="0.45" />
          <circle cx="202" cy="82" r="8" fill={light} />
          <circle cx="202" cy="82" r="5" fill="white" opacity="0.45" />
          {/* Bangs */}
          <path d="M92 86 Q110 58 140 72 Q170 58 188 86" fill={color} />
          {/* Shine */}
          <path d="M112 32 Q132 24 158 30" stroke={vlight} strokeWidth="4" fill="none" opacity="0.35" strokeLinecap="round" />
        </g>
      )
    default:
      return null
  }
}

function renderOutfit(style: number, ec: string, ecd: string, ecl: string, ecll: string, s: string, sd: string, sd2: string, sl: string) {
  switch (style) {
    case 0: // Cyber Suit — fitted bodysuit
      return (
        <g>
          {/* Torso — slim anime waist */}
          <path d="M112 175 Q102 185 96 210 Q90 240 92 270 Q94 300 98 320
                   Q102 335 108 340 L172 340 Q178 335 182 320
                   Q186 300 188 270 Q190 240 184 210 Q178 185 168 175"
            fill="url(#om)" />
          {/* Center seam */}
          <line x1="140" y1="180" x2="140" y2="335" stroke={ecd} strokeWidth="1" opacity="0.4" />
          {/* Chest contour */}
          <path d="M112 185 Q118 195 140 198 Q162 195 168 185" stroke={ecd} strokeWidth="0.8" fill="none" opacity="0.3" />
          {/* Tech panel */}
          <rect x="128" y="210" width="24" height="16" rx="3" fill={ecd} opacity="0.4" />
          <circle cx="140" cy="218" r="4" fill={ecl} filter="url(#gl)" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Waist */}
          <path d="M96 250 Q140 244 184 250" stroke={ecd} strokeWidth="1" fill="none" opacity="0.3" />
          {/* Belt */}
          <rect x="92" y="268" width="96" height="8" rx="3" fill={ecd} />
          <circle cx="140" cy="272" r="4" fill={ecl} opacity="0.5" />
          {/* Shoulder area */}
          <ellipse cx="100" cy="178" rx="14" ry="7" fill={ecd} opacity="0.6" />
          <ellipse cx="180" cy="178" rx="14" ry="7" fill={ecd} opacity="0.6" />
          {/* Arms — slim, skin visible below short sleeves */}
          <path d="M86 178 Q74 210 68 250 Q66 270 67 285" fill={s} stroke={sd} strokeWidth="0.5" />
          <path d="M194 178 Q206 210 212 250 Q214 270 213 285" fill={s} stroke={sd} strokeWidth="0.5" />
          {/* Arm 3D */}
          <path d="M80 190 Q74 220 70 255" stroke={sl} strokeWidth="1.5" fill="none" opacity="0.2" />
          <path d="M200 190 Q206 220 210 255" stroke={sl} strokeWidth="1.5" fill="none" opacity="0.2" />
          {/* Short sleeves */}
          <path d="M98 175 Q86 180 80 195 Q84 200 96 192" fill={ec} />
          <path d="M182 175 Q194 180 200 195 Q196 200 184 192" fill={ec} />
          {/* Arm guards */}
          <rect x="62" y="240" width="12" height="18" rx="4" fill={ecd} opacity="0.7" />
          <rect x="206" y="240" width="12" height="18" rx="4" fill={ecd} opacity="0.7" />
          {/* Hands */}
          {renderHand(62, 285, s, sd, sl, false)}
          {renderHand(208, 285, s, sd, sl, true)}
        </g>
      )
    case 1: // Hoodie Tech — oversized hoodie
      return (
        <g>
          {/* Hoodie body — slightly oversized */}
          <path d="M105 170 Q92 185 86 215 Q80 255 84 300 Q86 325 92 340
                   L188 340 Q194 325 196 300 Q200 255 194 215 Q188 185 175 170
                   Q158 162 140 160 Q122 162 105 170"
            fill="url(#om)" />
          {/* Hood collar */}
          <path d="M105 170 Q112 160 140 156 Q168 160 175 170 Q170 164 140 154 Q110 164 105 170" fill={ecd} />
          {/* Front pocket */}
          <path d="M108 258 Q108 248 140 248 Q172 248 172 258 Q172 275 140 275 Q108 275 108 258" fill={ecd} opacity="0.3" />
          {/* Drawstrings */}
          <line x1="130" y1="170" x2="128" y2="205" stroke={ecl} strokeWidth="1" opacity="0.4" />
          <line x1="150" y1="170" x2="152" y2="205" stroke={ecl} strokeWidth="1" opacity="0.4" />
          <circle cx="128" cy="206" r="2" fill={ecl} opacity="0.3" />
          <circle cx="152" cy="206" r="2" fill={ecl} opacity="0.3" />
          {/* Logo */}
          <circle cx="140" cy="218" r="12" fill="none" stroke={ecl} strokeWidth="1.2" opacity="0.35" />
          <circle cx="140" cy="218" r="5" fill={ecl} opacity="0.15" />
          {/* Wrinkle lines */}
          <path d="M105 210 Q112 215 118 210" stroke={ecd} strokeWidth="0.7" fill="none" opacity="0.25" />
          <path d="M162 210 Q168 215 175 210" stroke={ecd} strokeWidth="0.7" fill="none" opacity="0.25" />
          {/* Sleeves — long, covers most of arm */}
          <path d="M88 175 Q70 210 60 260 Q58 280 60 295" fill={ec} />
          <path d="M192 175 Q210 210 220 260 Q222 280 220 295" fill={ec} />
          {/* Sleeve wrinkles */}
          <path d="M78 220 Q82 225 86 220" stroke={ecd} strokeWidth="0.7" fill="none" opacity="0.2" />
          <path d="M194 220 Q198 225 202 220" stroke={ecd} strokeWidth="0.7" fill="none" opacity="0.2" />
          {/* Hands peeking out */}
          {renderHand(54, 295, s, sd, sl, false)}
          {renderHand(216, 295, s, sd, sl, true)}
        </g>
      )
    case 2: // Armadura — sleek cyber armor
      return (
        <g>
          {/* Under suit */}
          <path d="M110 175 Q100 190 94 220 Q90 255 92 290 Q94 320 100 340
                   L180 340 Q186 320 188 290 Q190 255 186 220 Q180 190 170 175"
            fill={ecd} />
          {/* Chest plate */}
          <path d="M104 178 L140 192 L176 178 L172 245 L140 250 L108 245 Z" fill="url(#om)" />
          {/* Chest highlight */}
          <path d="M110 184 L140 196 L170 184" stroke={ecll} strokeWidth="1" fill="none" opacity="0.4" />
          {/* Core gem */}
          <polygon points="140,205 148,215 140,228 132,215" fill={ecl} filter="url(#gl)">
            <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
          </polygon>
          {/* Waist armor */}
          <rect x="92" y="265" width="96" height="12" rx="4" fill="url(#om)" />
          <rect x="125" y="267" width="30" height="8" rx="3" fill={ecl} opacity="0.35" />
          {/* Shoulder plates */}
          <path d="M78 168 Q70 164 66 175 Q70 192 86 196 Q100 188 96 178 Z" fill="url(#om)" />
          <path d="M202 168 Q210 164 214 175 Q210 192 194 196 Q180 188 184 178 Z" fill="url(#om)" />
          <path d="M72 172 Q80 168 90 172" stroke={ecll} strokeWidth="0.8" fill="none" opacity="0.35" />
          <path d="M190 172 Q200 168 208 172" stroke={ecll} strokeWidth="0.8" fill="none" opacity="0.35" />
          {/* Arms — armored */}
          <path d="M76 192 Q66 225 62 265 Q60 280 62 292" fill={ecd} />
          <path d="M204 192 Q214 225 218 265 Q220 280 218 292" fill={ecd} />
          {/* Gauntlets */}
          <rect x="55" y="258" width="16" height="22" rx="5" fill="url(#om)" />
          <rect x="209" y="258" width="16" height="22" rx="5" fill="url(#om)" />
          {/* Armored hands */}
          {renderHand(58, 280, ec, ecd, ecl, false)}
          {renderHand(214, 280, ec, ecd, ecl, true)}
          {/* Leg armor */}
          <rect x="100" y="342" width="24" height="6" rx="2" fill={ec} opacity="0.5" />
          <rect x="156" y="342" width="24" height="6" rx="2" fill={ec} opacity="0.5" />
        </g>
      )
    case 3: // Vestido Digital — strapless dress with pleated skirt
      return (
        <g>
          {/* Dress top — strapless sweetheart */}
          <path d="M108 178 Q104 185 100 195 Q96 210 94 225 Q92 240 94 252
                   L186 252 Q188 240 186 225 Q184 210 180 195 Q176 185 172 178
                   Q156 170 140 168 Q124 170 108 178"
            fill="url(#om)" />
          {/* Sweetheart neckline */}
          <path d="M108 178 Q118 184 140 186 Q162 184 172 178 Q165 172 140 168 Q115 172 108 178"
            fill={ecd} opacity="0.3" />
          <path d="M110 178 Q125 183 140 184 Q155 183 170 178" stroke={ecl} strokeWidth="0.8" fill="none" opacity="0.3" />
          {/* Waist seam */}
          <path d="M94 252 Q140 246 186 252" stroke={ecd} strokeWidth="1.2" fill="none" opacity="0.4" />
          {/* Pleated skirt */}
          <path d="M94 252 Q80 290 70 340 L210 340 Q200 290 186 252" fill="url(#om)" />
          {/* Pleat lines */}
          <line x1="100" y1="255" x2="80" y2="338" stroke={ecd} strokeWidth="1" opacity="0.25" />
          <line x1="112" y1="254" x2="98" y2="338" stroke={ecd} strokeWidth="1" opacity="0.25" />
          <line x1="124" y1="253" x2="116" y2="338" stroke={ecd} strokeWidth="1" opacity="0.25" />
          <line x1="140" y1="252" x2="140" y2="338" stroke={ecd} strokeWidth="1" opacity="0.25" />
          <line x1="156" y1="253" x2="164" y2="338" stroke={ecd} strokeWidth="1" opacity="0.25" />
          <line x1="168" y1="254" x2="182" y2="338" stroke={ecd} strokeWidth="1" opacity="0.25" />
          <line x1="180" y1="255" x2="200" y2="338" stroke={ecd} strokeWidth="1" opacity="0.25" />
          {/* Skirt hem highlight */}
          <path d="M70 338 Q140 332 210 338" stroke={ecl} strokeWidth="0.8" fill="none" opacity="0.2" />
          {/* Bare shoulders/arms */}
          <path d="M108 178 Q95 180 82 188 Q72 198 66 220 Q62 245 62 270 Q62 282 63 290"
            fill={s} stroke={sd} strokeWidth="0.5" />
          <path d="M172 178 Q185 180 198 188 Q208 198 214 220 Q218 245 218 270 Q218 282 217 290"
            fill={s} stroke={sd} strokeWidth="0.5" />
          {/* Arm highlight */}
          <path d="M88 190 Q78 220 70 255" stroke={sl} strokeWidth="1.5" fill="none" opacity="0.2" />
          <path d="M192 190 Q202 220 210 255" stroke={sl} strokeWidth="1.5" fill="none" opacity="0.2" />
          {/* Bracelets */}
          <rect x="58" y="248" width="10" height="4" rx="2" fill={ecl} opacity="0.5" />
          <rect x="212" y="248" width="10" height="4" rx="2" fill={ecl} opacity="0.5" />
          {/* Hands */}
          {renderHand(57, 290, s, sd, sl, false)}
          {renderHand(212, 290, s, sd, sl, true)}
          {/* Circuit sparkles */}
          <circle cx="125" cy="210" r="1.5" fill={ecl} opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="155" cy="230" r="1.2" fill={ecl} opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>
      )
    default:
      return null
  }
}

function renderHand(x: number, y: number, skin: string, skinD: string, skinL: string, mirror: boolean) {
  const d = mirror ? -1 : 1
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Palm */}
      <ellipse cx={d * 5} cy="3" rx="7" ry="6" fill={skin} />
      <ellipse cx={d * 4} cy="2" rx="4" ry="3" fill={skinL} opacity="0.15" />
      {/* Thumb */}
      <path d={`M${d*-1},1 Q${d*-4},-2 ${d*-3},-7 Q${d*-1},-9 ${d*1},-5 Q${d*1},-1 ${d*-1},1`}
        fill={skin} stroke={skinD} strokeWidth="0.4" />
      {/* Index */}
      <path d={`M${d*1},-1 Q${d*2},-8 ${d*3},-12 Q${d*4.5},-13 ${d*5.5},-12 Q${d*6},-8 ${d*5},-1`}
        fill={skin} stroke={skinD} strokeWidth="0.3" />
      {/* Middle */}
      <path d={`M${d*5},-1 Q${d*6},-9 ${d*7},-14 Q${d*8.5},-15 ${d*9.5},-14 Q${d*10},-9 ${d*9},-1`}
        fill={skin} stroke={skinD} strokeWidth="0.3" />
      {/* Ring */}
      <path d={`M${d*9},0 Q${d*10},-7 ${d*11},-11 Q${d*12},-12 ${d*12.5},-11 Q${d*13},-7 ${d*12},0`}
        fill={skin} stroke={skinD} strokeWidth="0.3" />
      {/* Pinky */}
      <path d={`M${d*11},1 Q${d*12},-4 ${d*13},-7 Q${d*13.5},-8 ${d*14},-7 Q${d*14},-4 ${d*13},1`}
        fill={skin} stroke={skinD} strokeWidth="0.3" />
      {/* Nail hints */}
      <ellipse cx={d*4} cy={-11.5} rx="1.2" ry="0.8" fill={skinL} opacity="0.25" />
      <ellipse cx={d*8} cy={-13.5} rx="1.2" ry="0.8" fill={skinL} opacity="0.25" />
    </g>
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
