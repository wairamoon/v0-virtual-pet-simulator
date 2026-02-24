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

// Image map: identity -> outfit -> image path
const outfitImages: Record<string, Record<number, string>> = {
  femenino: {
    0: "/images/outfits/f-cyber-suit.webp",
    1: "/images/outfits/f-hoodie.webp",
    2: "/images/outfits/f-armor.webp",
    3: "/images/outfits/f-dress.webp",
  },
  masculino: {
    0: "/images/outfits/m-cyber-suit.webp",
    1: "/images/outfits/m-hoodie.webp",
    2: "/images/outfits/m-armor.webp",
    3: "/images/outfits/m-dress.webp",
  },
  "sin-genero": {
    0: "/images/outfits/n-cyber-suit.webp",
    1: "/images/outfits/n-hoodie.webp",
    2: "/images/outfits/n-armor.webp",
    3: "/images/outfits/n-dress.webp",
  },
}

interface Props {
  parts: CharacterParts
  energyColor: string
  identity: string
  size?: number
  className?: string
}

// Map skin tone hex to CSS brightness/contrast adjustments
const skinFilter: Record<string, string> = {
  "#fae4d8": "none",                                    // Claro — base (no filter)
  "#e8b896": "brightness(0.92) saturate(1.1)",          // Medio
  "#c68c5a": "brightness(0.82) saturate(1.2)",          // Moreno
  "#8d5e3c": "brightness(0.68) saturate(1.3) contrast(1.05)", // Oscuro
}

export function CharacterAvatar({ parts, energyColor, identity, size = 200, className = "" }: Props) {
  const { outfit, skinTone } = parts
  const identityMap = outfitImages[identity] ?? outfitImages["femenino"]
  const src = identityMap[outfit] ?? identityMap[0]
  const filter = skinFilter[skinTone] ?? "none"

  return (
    <div className={`relative ${className}`}>
      {/* No aura — clean background */}
      <div
        className="avatar-inner relative overflow-hidden rounded-2xl"
        style={{
          width: size,
          height: size * 1.5,
        }}
      >
        <Image
          src={src}
          alt={`Avatar ${identity}`}
          width={size}
          height={size * 1.5}
          className="h-full w-full object-contain drop-shadow-lg"
          style={{ filter }}
          priority
        />
      </div>
    </div>
  )
}
