"use client"

import Image from "next/image"

interface AvatarFigureProps {
  identity: "femenino" | "masculino" | "sin-genero"
  energyColor: string
  className?: string
}

const avatarMap: Record<string, string> = {
  femenino: "/images/avatar-femenino.png",
  masculino: "/images/avatar-masculino.png",
  "sin-genero": "/images/avatar-neutro.png",
}

export function AvatarFigure({ identity, energyColor, className = "" }: AvatarFigureProps) {
  const src = avatarMap[identity] ?? avatarMap["sin-genero"]

  return (
    <div className={`relative ${className}`}>
      {/* Glow aura behind avatar */}
      <div
        className="absolute inset-0 -z-10 scale-110 rounded-full opacity-50 blur-[30px] animate-glow-pulse"
        style={{ backgroundColor: energyColor }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 scale-125 rounded-full opacity-25 blur-[50px]"
        style={{ backgroundColor: energyColor }}
        aria-hidden="true"
      />
      <Image
        src={src}
        alt={`Avatar ${identity}`}
        width={200}
        height={320}
        className="relative z-10 h-full w-full rounded-2xl object-cover drop-shadow-lg"
        priority
      />
    </div>
  )
}
