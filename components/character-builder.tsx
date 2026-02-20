"use client"

import Image from "next/image"

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

const outfitImages: Record<number, string> = {
  0: "/images/outfits/cyber-suit.webp",
  1: "/images/outfits/hoodie.webp",
  2: "/images/outfits/armor.webp",
  3: "/images/outfits/dress.webp",
}

// Map energy color to CSS hue-rotate degrees (base images are blue-toned)
const hueMap: Record<string, string> = {
  "#00bcd4": "0deg",     // water/cyan — close to base blue, minimal rotation
  "#ff5722": "160deg",   // fire/orange-red
  "#4caf50": "90deg",    // earth/green
  "#4a9eff": "0deg",     // legacy blue
  "#9c7cf4": "270deg",   // legacy violet
  "#e0457b": "320deg",   // legacy pink
  "#40aa40": "90deg",    // legacy green
  "#ff8c00": "30deg",    // legacy amber
}

interface Props {
  parts: CharacterParts
  energyColor: string
  size?: number
  className?: string
}

export function CharacterAvatar({ parts, energyColor, size = 200, className = "" }: Props) {
  const { outfit } = parts
  const src = outfitImages[outfit] ?? outfitImages[0]
  const hue = hueMap[energyColor] ?? "0deg"

  return (
    <div className={`relative ${className}`}>
      {/* Glow aura behind avatar */}
      <div
        className="absolute inset-0 -z-10 scale-110 rounded-full opacity-40 blur-[30px] animate-glow-pulse"
        style={{ backgroundColor: energyColor }}
        aria-hidden="true"
      />
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: size,
          height: size * 1.5,
        }}
      >
        <Image
          src={src}
          alt="Avatar"
          width={size}
          height={size * 1.5}
          className="h-full w-full object-contain drop-shadow-lg"
          priority
        />
      </div>
    </div>
  )
}
