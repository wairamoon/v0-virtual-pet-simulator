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
import { CreativeLab } from "./creative-lab"
import { SocialTab } from "./social-tab"
import { EvolutionOverlay, LevelBadge, getEvolutionLevel } from "./evolution-overlay"

const energyColor: Record<string, string> = {
  water: "#00bcd4", fire: "#ff5722", earth: "#4caf50",
  aqua: "#00bcd4", lilac: "#9c7cf4", sky: "#4a9eff",
}
const energyIcon: Record<string, string> = {
  water: "water", fire: "fire", earth: "earth",
  aqua: "water", lilac: "water", sky: "water",
}
const energyLabel: Record<string, string> = {
  water: "Agua", fire: "Fuego", earth: "Tierra",
  aqua: "Aqua", lilac: "Lila", sky: "Cielo",
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
  const [showChat, setShowChat] = useState(false)
  const [showLab, setShowLab] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const [avatarRotation, setAvatarRotation] = useState(0)
  const [isRotating, setIsRotating] = useState(false)

  const color = energyColor[data.energy] ?? energyColor.sky

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

  const rotateAvatar = useCallback((dir: 1 | -1) => {
    setIsRotating(true)
    setAvatarRotation((prev) => prev + dir * 25)
    setTimeout(() => setIsRotating(false), 300)
  }, [])

  const recharge = useCallback((stat: "emotional" | "vital" | "hunger") => {
    setData((prev) => {
      const next = { ...prev, [stat]: Math.min(100, prev[stat] + 5) }
      persist(next)
      return next
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* ===== MAIN LAYOUT: Character Select Screen ===== */}
      <div className="flex flex-1 flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 p-4 pt-2 lg:gap-6 lg:p-8">

        {/* ===== LEFT: Avatar Area (60% on desktop) ===== */}
        <div className="avatar-stage-wrapper relative flex w-full flex-col items-center justify-center lg:w-[58%]">
          {/* Avatar stage — absolute centered, 80vh */}
          <div className="avatar-stage">
            {/* Power effect — hidden when companion exists */}
            {data.energy !== "fire" && data.energy !== "water" && data.energy !== "aqua" && data.energy !== "sky" && data.energy !== "earth" && (
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <PowerEffect power={energyIcon[data.energy] ?? "water"} active={true} />
              </div>
            )}

            {/* Ground shadow */}
            <div
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2 h-4 w-36 rounded-full opacity-20 blur-[12px]"
              style={{ backgroundColor: "#000" }}
              aria-hidden="true"
            />

            {/* Avatar — 80vh centered */}
            <div
              className="avatar-float relative z-10"
              style={{
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: `rotateY(${avatarRotation}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <CharacterAvatar
                parts={data.character ?? defaultParts}
                energyColor={color}
                identity={data.identity}
                size={Math.round(typeof window !== "undefined" ? window.innerHeight * 0.5 : 320)}
                className="avatar-image-80vh"
              />
              <EvolutionOverlay
                level={getEvolutionLevel(data.creativeXP ?? 0).level}
                size={Math.round(typeof window !== "undefined" ? window.innerHeight * 0.5 : 320)}
                color={getEvolutionLevel(data.creativeXP ?? 0).color}
              />

              {/* Fire companion */}
              {(data.energy === "fire") && (
                <div className="energy-companion fire-companion" aria-label="Compañero de fuego">
                  <img src="/images/fire-companion.png" alt="Fire companion" className="companion-img" />
                </div>
              )}

              {/* Water companion */}
              {(data.energy === "water" || data.energy === "aqua" || data.energy === "sky") && (
                <>
                  <div className="energy-companion water-companion" aria-label="Compañero de agua">
                    <img src="/images/water-companion.png" alt="Water companion" className="companion-img" />
                  </div>
                  <div className="water-dolphin" aria-label="Delfín">
                    <img src="/images/water-dolphin.png" alt="Dolphin" className="companion-img" />
                  </div>
                </>
              )}

              {/* Earth companion */}
              {(data.energy === "earth") && (
                <div className="energy-companion earth-companion" aria-label="Compañero de tierra">
                  <img src="/images/earth-companion.png" alt="Earth companion" className="companion-img" />
                </div>
              )}
            </div>
          </div>

          {/* Rotation arrows removed */}

          {/* Name + power below avatar on mobile */}
          <div className="mt-3 text-center lg:hidden">
            <h2 className="text-2xl font-bold tracking-wider text-white drop-shadow-lg">
              {data.name}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-2">
              <PowerIcon type={energyIcon[data.energy] ?? "water"} color={color} size={16} glow />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
                Poder de {energyLabel[data.energy] ?? data.energy}
              </span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Stats Panel (glassmorphism) ===== */}
        <div className="w-full lg:w-[38%] lg:max-w-sm">
          <div
            className="overflow-hidden rounded-2xl shadow-xl"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(220,230,240,0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: "rgba(200,225,255,0.3)",
                borderBottom: "1px solid rgba(200,220,240,0.5)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ background: `${color}cc` }} />
                  <div className="h-2 w-2 rounded-full bg-primary/10" />
                  <div className="h-2 w-2 rounded-full bg-primary/10" />
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/60">
                  Estado
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="rounded-md px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-primary/40 transition-all hover:text-red-400 hover:bg-red-50"
              >
                Reiniciar
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Name + identity (desktop) */}
              <div className="hidden lg:block">
                <h2 className="text-xl font-bold tracking-wider text-primary">
                  {data.name}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  <PowerIcon type={energyIcon[data.energy] ?? "water"} color={color} size={16} glow />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
                    Poder de {energyLabel[data.energy] ?? data.energy}
                  </span>
                </div>
                <p className="mt-0.5 text-[9px] uppercase tracking-widest text-primary/30">
                  {data.identity === "femenino" ? "Identidad Femenina" : data.identity === "masculino" ? "Identidad Masculina" : "Sin Género"}
                </p>
              </div>

              {/* Separator */}
              <div className="hidden lg:block h-px bg-gray-200" />

              {/* Stats */}
              <div className="flex flex-col gap-4">
                {/* Emotional */}
                <div>
                  <StatBar label="Estado emocional" value={data.emotional} max={100} barColor="#e0457b" />
                  {data.emotional === 0 && (
                    <p className="mt-1 text-[8px] font-semibold tracking-wider text-red-400 animate-fade-in">Necesita recarga</p>
                  )}
                  <div className="mt-1.5 flex justify-end">
                    <RechargeButton icon={<HeartIcon className="h-3.5 w-3.5" />} label="Recargar" color="#e0457b" onClick={() => recharge("emotional")} />
                  </div>
                </div>

                {/* Vital */}
                <div>
                  <StatBar label="Energía vital" value={data.vital} max={100} barColor="#4a9eff" />
                  {data.vital === 0 && (
                    <p className="mt-1 text-[8px] font-semibold tracking-wider text-red-400 animate-fade-in">Necesita recarga</p>
                  )}
                  <div className="mt-1.5 flex justify-end">
                    <RechargeButton icon={<MuscleIcon className="h-3.5 w-3.5" />} label="Recargar" color="#4a9eff" onClick={() => recharge("vital")} />
                  </div>
                </div>

                {/* Hunger */}
                <div>
                  <StatBar label="Conexión regenerativa" value={data.hunger} max={100} barColor="#00bcd4" />
                  {data.hunger === 0 && (
                    <p className="mt-1 text-[8px] font-semibold tracking-wider text-red-400 animate-fade-in">Necesita recarga</p>
                  )}
                  <div className="mt-1.5 flex justify-end">
                    <RechargeButton icon={<FruitIcon className="h-3.5 w-3.5" />} label="Recargar" color="#00bcd4" onClick={() => recharge("hunger")} />
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-200" />

              {/* Lab toggle — arriba de alimentar */}
              <button
                type="button"
                onClick={() => { setShowLab(!showLab); if (!showLab) setShowChat(false) }}
                className="w-full rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: showLab ? "rgba(200,220,240,0.3)" : `${color}20`,
                  border: `1px solid ${showLab ? "rgba(200,220,240,0.5)" : `${color}40`}`,
                }}
              >
                {showLab ? "✕ Cerrar Lab" : "🧪 Laboratorio Creativo"}
              </button>

              {/* Feed button */}
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

              {/* Chat toggle */}
              <button
                type="button"
                onClick={() => setShowChat(!showChat)}
                className="w-full rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: showChat ? "rgba(200,220,240,0.3)" : `${color}20`,
                  border: `1px solid ${showChat ? "rgba(200,220,240,0.5)" : `${color}40`}`,
                }}
              >
                {showChat ? "✕ Cerrar Chat" : `💬 Hablar con ${data.name}`}
              </button>

              {/* Social toggle */}
              <button
                type="button"
                onClick={() => { setShowSocial(!showSocial); if (!showSocial) { setShowChat(false); setShowLab(false) } }}
                className="w-full rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: showSocial ? "rgba(200,220,240,0.3)" : `${color}20`,
                  border: `1px solid ${showSocial ? "rgba(200,220,240,0.5)" : `${color}40`}`,
                }}
              >
                {showSocial ? "✕ Cerrar Social" : "🌍 Social HUB"}
              </button>

              {/* Evolution Level + Creative Stats */}
              {(data.creativeXP ?? 0) > 0 && (
                <>
                  <LevelBadge xp={data.creativeXP ?? 0} />
                  <div className="flex gap-2">
                    <div
                      className="flex-1 flex items-center justify-between rounded-xl px-3 py-2"
                      style={{ background: "rgba(156,124,244,0.08)", border: "1px solid rgba(156,124,244,0.15)" }}
                    >
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#9c7cf4]">🧪 XP</span>
                      <span className="text-xs font-bold text-[#9c7cf4]">{data.creativeXP ?? 0}</span>
                    </div>
                    {(data.creativeCoins ?? 0) > 0 && (
                      <div
                        className="flex-1 flex items-center justify-between rounded-xl px-3 py-2"
                        style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.15)" }}
                      >
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-[#d4a800]">🪙</span>
                        <span className="text-xs font-bold text-[#d4a800]">{data.creativeCoins ?? 0}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Creation date */}
              <p className="text-center text-[8px] uppercase tracking-widest text-primary/30">
                Creado el{" "}
                {new Date(data.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CHAT PANEL (slides up from bottom) ===== */}
      {showChat && (
        <div className="animate-fade-in px-4 pb-6 lg:px-8">
          <div
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl shadow-xl"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(220,230,240,0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="p-4">
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
            </div>
          </div>
        </div>
      )}

      {/* ===== CREATIVE LAB PANEL ===== */}
      {showLab && (
        <div className="animate-fade-in px-4 pb-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <CreativeLab
              petName={data.name}
              accentColor={color}
              onClose={() => setShowLab(false)}
              creativeXP={data.creativeXP ?? 0}
              creativeCoins={data.creativeCoins ?? 0}
              onReward={(xp, coins) => {
                setData((prev) => {
                  const hungerBoost = coins > 0 ? Math.max(10, coins) : 5
                  const vitalBoost = Math.max(5, Math.round(xp * 0.5))
                  const emotionalBoost = Math.max(3, Math.round(xp * 0.2))
                  const next = {
                    ...prev,
                    creativeXP: (prev.creativeXP ?? 0) + xp,
                    creativeCoins: (prev.creativeCoins ?? 0) + coins,
                    hunger: Math.min(100, prev.hunger + hungerBoost),
                    vital: Math.min(100, prev.vital + vitalBoost),
                    emotional: Math.min(100, prev.emotional + emotionalBoost),
                  }
                  persist(next)
                  return next
                })
              }}
              petIdentity={data.identity}
              petPower={data.energy}
              stats={{ emotional: data.emotional, vital: data.vital, hunger: data.hunger }}
            />
          </div>
        </div>
      )}

      {/* ===== SOCIAL HUB ===== */}
      {showSocial && (
        <div className="animate-fade-in px-4 pb-6 lg:px-8">
          <div
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl"
            style={{
              background: "transparent",
            }}
          >
            <SocialTab />
          </div>
        </div>
      )}

      {/* ===== RESET MODAL ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <div
            className="w-full max-w-sm animate-fade-in overflow-hidden rounded-2xl shadow-xl"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ background: "rgba(255,80,80,0.15)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-red-300">
                Confirmar
              </span>
            </div>
            <div className="p-6">
              <h3 id="reset-title" className="mb-2 text-center text-sm font-bold tracking-wider text-primary">
                Reiniciar experiencia
              </h3>
              <p className="mb-6 text-center text-[11px] leading-relaxed text-primary/50">
                Esto eliminará tu PixSim actual, sus stats y el historial de chat. Las memorias se conservarán.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg py-2.5 text-[10px] font-semibold uppercase tracking-wider text-primary/60 transition-all hover:bg-gray-100"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); onReset() }}
                  className="flex-1 rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(180deg, #f87171, #dc2626)",
                    boxShadow: "0 3px 10px rgba(220,38,38,0.3)",
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
