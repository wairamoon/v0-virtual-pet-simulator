"use client"

import { useState } from "react"
import {
  CharacterAvatar,
  type CharacterParts,
  defaultParts,
  hairLabels,
  outfitLabels,
  eyeColors,
  skinTones,
} from "./character-builder"
import { PowerIcon } from "./power-icon"
import { PowerEffect } from "./power-effects"

export interface PixSimData {
  name: string
  identity: "femenino" | "masculino" | "sin-genero"
  energy: "water" | "fire" | "earth"
  emotional: number
  vital: number
  hunger: number
  createdAt: string
  character: CharacterParts
  creativeXP?: number
  creativeCoins?: number
}

const identityOptions = [
  { value: "femenino" as const, label: "Femenino" },
  { value: "masculino" as const, label: "Masculino" },
  { value: "sin-genero" as const, label: "Sin Genero" },
]

const energyOptions = [
  { value: "water" as const, label: "Agua", cssColor: "#00bcd4", icon: "water" },
  { value: "fire" as const, label: "Fuego", cssColor: "#ff5722", icon: "fire" },
  { value: "earth" as const, label: "Tierra", cssColor: "#4caf50", icon: "earth" },
]

export function PixSimCreate({ onCreate }: { onCreate: (data: PixSimData) => void }) {
  const [name, setName] = useState("")
  const [identity, setIdentity] = useState<PixSimData["identity"] | null>(null)
  const [energy, setEnergy] = useState<PixSimData["energy"] | null>(null)
  const [character, setCharacter] = useState<CharacterParts>(defaultParts)
  const [step, setStep] = useState<"info" | "customize">("info")

  const nameValid = name.length >= 2 && name.length <= 15
  const nameError = name.length > 0 && !nameValid
  const canContinue = nameValid && identity !== null && energy !== null

  const selectedEnergyColor = energyOptions.find((e) => e.value === energy)?.cssColor ?? "#4a9eff"

  function handleSubmit() {
    if (!canContinue || !identity || !energy) return
    onCreate({
      name,
      identity,
      energy,
      emotional: 50,
      vital: 50,
      hunger: 50,
      createdAt: new Date().toISOString(),
      character,
    })
  }

  function updateChar<K extends keyof CharacterParts>(key: K, value: CharacterParts[K]) {
    setCharacter((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex min-h-screen items-start justify-center p-4 py-8 sm:items-center">
      <div className="relative w-full max-w-md animate-fade-in">
        {/* Glossy aero card */}
        <div
          className="overflow-hidden rounded-2xl border shadow-lg"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(230,242,255,0.8))",
            borderColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: "linear-gradient(180deg, rgba(200,225,255,0.6), rgba(180,215,255,0.3))",
              borderBottom: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #ff9999, #e05555)" }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #ffe066, #ddb030)" }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #80dd80, #40aa40)" }} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              {step === "info" ? "PixSim v2.0" : "Editor de Personaje"}
            </span>
          </div>

          <div className="p-6 md:p-8">
            {step === "info" ? (
              <>
                {/* Header */}
                <div className="mb-6 text-center">
                  <h1 className="mb-1 text-2xl font-bold tracking-wider text-primary md:text-3xl">
                    Activa tu PixSim
                  </h1>
                  <p className="text-xs tracking-wide text-primary/50">
                    El inicio de tu identidad digital
                  </p>
                </div>

                {/* Separator */}
                <div className="mb-6 h-px" style={{ background: "rgba(0,80,200,0.1)" }} />

                {/* Name field */}
                <div className="mb-5">
                  <label
                    htmlFor="pixsim-name"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-primary"
                  >
                    Nombre
                  </label>
                  <input
                    id="pixsim-name"
                    type="text"
                    maxLength={15}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Escribe un nombre..."
                    className="w-full rounded-lg px-4 py-3 text-sm text-primary outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(200,220,255,0.5)",
                      boxShadow: "inset 0 1px 3px rgba(0,80,200,0.06)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,100,255,0.4)"
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,100,255,0.08), inset 0 1px 3px rgba(0,80,200,0.06)"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(200,220,255,0.5)"
                      e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,80,200,0.06)"
                    }}
                  />
                  {nameError && (
                    <p className="mt-2 text-[10px] text-destructive" role="alert">
                      El nombre debe tener entre 2 y 15 caracteres
                    </p>
                  )}
                  <p className="mt-1 text-right text-[10px] text-primary/40">
                    {name.length}/15
                  </p>
                </div>

                {/* Identity */}
                <div className="mb-5">
                  <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Identidad
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {identityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setIdentity(opt.value)}
                        aria-pressed={identity === opt.value}
                        className="flex flex-col items-center gap-1 rounded-lg px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition-all"
                        style={
                          identity === opt.value
                            ? {
                                background: "linear-gradient(180deg, #4a9eff, #0066ff)",
                                color: "#fff",
                                border: "1px solid rgba(0,80,200,0.3)",
                                boxShadow: "0 3px 10px rgba(0,100,255,0.25), inset 0 1px 2px rgba(255,255,255,0.3)",
                              }
                            : {
                                background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,248,255,0.5))",
                                color: "hsl(216 100% 50%)",
                                border: "1px solid rgba(200,220,255,0.5)",
                              }
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power */}
                <div className="mb-6">
                  <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Poder Elemental
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {energyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEnergy(opt.value)}
                        aria-pressed={energy === opt.value}
                        className="flex flex-col items-center gap-2 rounded-lg px-2 py-4 transition-all"
                        style={
                          energy === opt.value
                            ? {
                                background: "rgba(255,255,255,0.8)",
                                border: `2px solid ${opt.cssColor}`,
                                boxShadow: `0 3px 12px ${opt.cssColor}30`,
                              }
                            : {
                                background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,248,255,0.5))",
                                border: "1px solid rgba(200,220,255,0.5)",
                              }
                        }
                      >
                        <PowerIcon type={opt.icon} color={opt.cssColor} size={32} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Separator */}
                <div className="mb-6 h-px" style={{ background: "rgba(0,80,200,0.1)" }} />

                {/* Continue to customization */}
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep("customize")}
                  className="w-full rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all"
                  style={
                    canContinue
                      ? {
                          background: "linear-gradient(180deg, #4a9eff, #0066ff)",
                          color: "#fff",
                          boxShadow: "0 4px 14px rgba(0,100,255,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
                        }
                      : {
                          background: "rgba(200,220,240,0.5)",
                          color: "rgba(100,140,180,0.6)",
                          cursor: "not-allowed",
                        }
                  }
                >
                  Personalizar Personaje →
                </button>
              </>
            ) : (
              <>
                {/* Character customization step */}
                <div className="mb-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("info")}
                    className="rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/60 transition-all hover:text-primary"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,245,255,0.5))",
                      border: "1px solid rgba(200,220,255,0.5)",
                    }}
                  >
                    ← Atras
                  </button>
                  <h2 className="text-sm font-bold tracking-wider text-primary">
                    Personaliza a {name}
                  </h2>
                </div>

                {/* Avatar preview with power effect */}
                <div className="relative mb-5 flex justify-center rounded-xl p-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.4)" }}>
                  <PowerEffect power={energy ?? ""} active={!!energy} />
                  <div className="relative z-10">
                    <CharacterAvatar
                      parts={character}
                      energyColor={selectedEnergyColor}
                      identity={identity ?? "femenino"}
                      size={140}
                    />
                  </div>
                </div>

                {/* Skin tone */}
                <div className="mb-4">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Tono de Piel
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {skinTones.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateChar("skinTone", opt.value)}
                        className="flex flex-col items-center gap-1.5 rounded-lg py-2.5 transition-all"
                        style={
                          character.skinTone === opt.value
                            ? {
                                background: "rgba(255,255,255,0.8)",
                                border: `2px solid ${opt.value}`,
                                boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                              }
                            : {
                                background: "rgba(255,255,255,0.4)",
                                border: "1px solid rgba(200,220,255,0.5)",
                              }
                        }
                      >
                        <div
                          className="h-5 w-5 rounded-full"
                          style={{ backgroundColor: opt.value, border: "1px solid rgba(0,0,0,0.1)" }}
                        />
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-primary/60">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outfit */}
                <div className="mb-5">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Ropa
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {outfitLabels.map((label, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => updateChar("outfit", i as 0 | 1 | 2 | 3)}
                        className="rounded-lg px-2 py-2.5 text-[9px] font-semibold uppercase tracking-wider transition-all"
                        style={
                          character.outfit === i
                            ? {
                                background: `linear-gradient(180deg, ${selectedEnergyColor}, ${selectedEnergyColor}dd)`,
                                color: "#fff",
                                border: `1px solid ${selectedEnergyColor}`,
                                boxShadow: `0 2px 8px ${selectedEnergyColor}40`,
                              }
                            : {
                                background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,248,255,0.5))",
                                color: "hsl(216 100% 50%)",
                                border: "1px solid rgba(200,220,255,0.5)",
                              }
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Separator */}
                <div className="mb-5 h-px" style={{ background: "rgba(0,80,200,0.1)" }} />

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all"
                  style={{
                    background: "linear-gradient(180deg, #4a9eff, #0066ff)",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(0,100,255,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
                  }}
                >
                  Inicio
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
