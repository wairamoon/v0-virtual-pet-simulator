"use client"

import { useState, useEffect, useCallback } from "react"
import type { PixSimData } from "./pixsim-create"
import { StatBar } from "./stat-bar"
import { CharacterAvatar, defaultParts } from "./character-builder"
import { RechargeButton } from "./recharge-button"
import { PowerIcon } from "./power-icon"
import { PowerEffect } from "./power-effects"
import { HeartIcon, MuscleIcon, FruitIcon } from "./stat-icons"
import { PixSimChat } from "./pixsim-chat"
import { FeedButton } from "./feed-button"

const energyColor: Record<string, string> = {
  water: "#00bcd4",
  fire: "#ff5722",
  earth: "#4caf50",
  // legacy
  aqua: "#00bcd4",
  lilac: "#9c7cf4",
  sky: "#4a9eff",
}

const energyIcon: Record<string, string> = {
  water: "water",
  fire: "fire",
  earth: "earth",
  aqua: "water",
  lilac: "water",
  sky: "water",
}

const energyLabel: Record<string, string> = {
  water: "Agua",
  fire: "Fuego",
  earth: "Tierra",
  aqua: "Aqua",
  lilac: "Lila",
  sky: "Cielo",
}

const STORAGE_KEY = "pixsim-data"

function persist(data: PixSimData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function PixSimDashboard({
  data: initialData,
  onReset,
}: {
  data: PixSimData
  onReset: () => void
}) {
  const [data, setData] = useState(initialData)
  const [showModal, setShowModal] = useState(false)

  const color = energyColor[data.energy] ?? energyColor.sky

  // Auto-decay: -1 every 60 seconds for each stat
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = {
          ...prev,
          emotional: Math.max(0, prev.emotional - 1),
          vital: Math.max(0, prev.vital - 1),
          hunger: Math.max(0, prev.hunger - 1),
        }
        persist(next)
        return next
      })
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const recharge = useCallback((stat: "emotional" | "vital" | "hunger") => {
    setData((prev) => {
      const next = { ...prev, [stat]: Math.min(100, prev[stat] + 5) }
      persist(next)
      return next
    })
  }, [])

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
            className="flex items-center justify-between px-4 py-2.5"
            style={{
              background: "linear-gradient(180deg, rgba(200,225,255,0.6), rgba(180,215,255,0.3))",
              borderBottom: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #ff9999, #e05555)" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #ffe066, #ddb030)" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #80dd80, #40aa40)" }} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                RegenSim
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="rounded-lg px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-primary/70 transition-all hover:text-destructive"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(240,245,255,0.5))",
                border: "1px solid rgba(200,220,255,0.5)",
              }}
            >
              Reiniciar
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Character area */}
            <div className="relative mb-6 flex flex-col items-center justify-center rounded-xl p-6 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.4)" }}
            >
              <PowerEffect power={energyIcon[data.energy] ?? "water"} active={true} />
              {/* Halo circle */}
              <div
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
              >
                <div
                  className="h-44 w-44 rounded-full opacity-40 blur-[40px]"
                  style={{ backgroundColor: color }}
                />
              </div>

              {/* Corner accents */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
                <div className="absolute left-3 top-3 h-4 w-4 border-l border-t rounded-tl" style={{ borderColor: `${color}40` }} />
                <div className="absolute right-3 top-3 h-4 w-4 border-r border-t rounded-tr" style={{ borderColor: `${color}40` }} />
                <div className="absolute bottom-3 left-3 h-4 w-4 border-b border-l rounded-bl" style={{ borderColor: `${color}40` }} />
                <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r rounded-br" style={{ borderColor: `${color}40` }} />
              </div>

              {/* Avatar */}
              <div className="relative z-10 animate-float">
                <CharacterAvatar
                  parts={data.character ?? defaultParts}
                  energyColor={color}
                  identity={data.identity}
                  size={150}
                />
              </div>

              {/* Name & identity */}
              <h2 className="relative z-10 mt-3 text-balance text-center text-xl font-bold tracking-wider text-primary md:text-2xl">
                {data.name}
              </h2>
              <div className="relative z-10 mt-2 flex items-center gap-2">
                <PowerIcon type={energyIcon[data.energy] ?? "water"} color={color} size={20} glow />
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
                  Poder de {energyLabel[data.energy] ?? data.energy}
                </span>
              </div>
              <p className="relative z-10 mt-1 text-[10px] uppercase tracking-widest text-primary/50">
                {data.identity === "femenino"
                  ? "Identidad Femenina"
                  : data.identity === "masculino"
                    ? "Identidad Masculina"
                    : "Sin Genero"}
              </p>
            </div>

            {/* Separator */}
            <div className="mb-5 h-px" style={{ background: "rgba(0,80,200,0.1)" }} />

            {/* Stats with recharge buttons */}
            <div className="flex flex-col gap-5">
              {/* Emotional */}
              <div>
                <StatBar
                  label="Estado emocional"
                  value={data.emotional}
                  max={100}
                  barColor="#e0457b"
                />
                {data.emotional === 0 && (
                  <p className="mt-1 text-[9px] font-semibold tracking-wider text-destructive animate-fade-in">
                    Necesita recarga emocional
                  </p>
                )}
                <div className="mt-2 flex justify-end">
                  <RechargeButton
                    icon={<HeartIcon className="h-4 w-4" />}
                    label="Recargar estado emocional"
                    color="#e0457b"
                    onClick={() => recharge("emotional")}
                  />
                </div>
              </div>

              {/* Vital */}
              <div>
                <StatBar
                  label="Energia vital"
                  value={data.vital}
                  max={100}
                  barColor="#4a9eff"
                />
                {data.vital === 0 && (
                  <p className="mt-1 text-[9px] font-semibold tracking-wider text-destructive animate-fade-in">
                    Necesita recarga de energia
                  </p>
                )}
                <div className="mt-2 flex justify-end">
                  <RechargeButton
                    icon={<MuscleIcon className="h-4 w-4" />}
                    label="Recargar energia vital"
                    color="#4a9eff"
                    onClick={() => recharge("vital")}
                  />
                </div>
              </div>

              {/* Hunger / Conexion regenerativa */}
              <div>
                <StatBar
                  label="Conexion regenerativa"
                  value={data.hunger}
                  max={100}
                  barColor="#00bcd4"
                />
                {data.hunger === 0 && (
                  <p className="mt-1 text-[9px] font-semibold tracking-wider text-destructive animate-fade-in">
                    Necesita recarga regenerativa
                  </p>
                )}
                <div className="mt-2 flex justify-end">
                  <RechargeButton
                    icon={<FruitIcon className="h-4 w-4" />}
                    label="Recargar conexion regenerativa"
                    color="#00bcd4"
                    onClick={() => recharge("hunger")}
                  />
                </div>
              </div>
            </div>

            {/* Feed button */}
            <div className="mt-5">
              <FeedButton
                petName={data.name}
                onFeed={() => {
                  setData((prev) => {
                    const next = { ...prev, hunger: Math.min(100, prev.hunger + 15) }
                    persist(next)
                    return next
                  })
                }}
                hungerValue={data.hunger}
              />
            </div>

            {/* Separator */}
            <div className="mt-5 h-px" style={{ background: "rgba(0,80,200,0.1)" }} />

            {/* Chat */}
            <PixSimChat
              petName={data.name}
              petIdentity={data.identity}
              petPower={data.energy}
              stats={{ emotional: data.emotional, vital: data.vital, hunger: data.hunger }}
              onStatChange={(stat, delta) => {
                setData((prev) => {
                  const val = Math.max(0, Math.min(100, prev[stat] + delta))
                  const next = { ...prev, [stat]: val }
                  persist(next)
                  return next
                })
              }}
            />

            {/* Separator */}
            <div className="mt-5 h-px" style={{ background: "rgba(0,80,200,0.1)" }} />

            {/* Creation date */}
            <p className="mt-4 text-center text-[9px] uppercase tracking-widest text-primary/40">
              {'Creado el '}
              {new Date(data.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Reset modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(150,190,230,0.6)", backdropFilter: "blur(8px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <div
            className="w-full max-w-sm animate-fade-in overflow-hidden rounded-2xl shadow-xl"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(230,242,255,0.88))",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
          >
            {/* Modal title bar */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{
                background: "linear-gradient(180deg, rgba(255,200,200,0.4), rgba(255,220,220,0.2))",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #ff9999, #e05555)" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #ddd, #bbb)" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(180deg, #ddd, #bbb)" }} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-destructive">
                Confirmar
              </span>
            </div>

            <div className="p-6">
              <h3
                id="reset-title"
                className="mb-2 text-center text-sm font-bold tracking-wider text-primary"
              >
                Reiniciar experiencia
              </h3>
              <p className="mb-6 text-center text-[11px] leading-relaxed text-primary/50">
                {'Esto eliminará tu PixSim actual, sus stats y el historial de chat. Las memorias de tu PixSim se conservarán.'}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg py-2.5 text-[10px] font-semibold uppercase tracking-wider text-primary/60 transition-all"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(230,240,255,0.6))",
                    border: "1px solid rgba(200,220,255,0.5)",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    onReset()
                  }}
                  className="flex-1 rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(180deg, #f87171, #dc2626)",
                    boxShadow: "0 3px 10px rgba(220,38,38,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
