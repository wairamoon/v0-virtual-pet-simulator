"use client"

import { useState, useRef } from "react"

interface EvaluationResult {
  originality: number
  aesthetic: number
  web3Potential: number
  visualImpact: number
  totalScore: number
  comment: string
}

interface RewardTier {
  xp: number
  coins: number
  label: string
  emoji: string
}

function getRewardTier(score: number): RewardTier {
  if (score >= 90) return { xp: 50, coins: 30, label: "LEGENDARIO", emoji: "👑" }
  if (score >= 75) return { xp: 30, coins: 20, label: "ÉPICO", emoji: "⚡" }
  if (score >= 60) return { xp: 15, coins: 10, label: "NOTABLE", emoji: "✨" }
  return { xp: 5, coins: 0, label: "EN PROGRESO", emoji: "🌱" }
}

interface CreativeLabProps {
  petName: string
  accentColor: string
  onClose: () => void
  creativeXP: number
  creativeCoins: number
  onReward: (xp: number, coins: number) => void
}

function ScoreRing({ value, label, icon, color }: { value: number; label: string; icon: string; color: string }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-[72px] w-[72px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={radius} fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm">{icon}</span>
          <span className="text-[11px] font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <span className="text-[8px] font-semibold uppercase tracking-wider text-primary/50 text-center leading-tight max-w-[80px]">
        {label}
      </span>
    </div>
  )
}

function TotalScoreBadge({ score, color }: { score: number; color: string }) {
  const tier =
    score >= 90 ? { label: "LEGENDARIO", emoji: "👑" } :
    score >= 75 ? { label: "ÉPICO", emoji: "⚡" } :
    score >= 60 ? { label: "NOTABLE", emoji: "✨" } :
    score >= 40 ? { label: "PROMETEDOR", emoji: "🌱" } :
    { label: "EN PROGRESO", emoji: "🔧" }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}40)`,
          border: `2px solid ${color}60`,
          boxShadow: `0 4px 20px ${color}30`,
        }}
      >
        <div className="text-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>
        {tier.emoji} {tier.label}
      </span>
    </div>
  )
}

export function CreativeLab({ petName, accentColor, onClose, creativeXP, creativeCoins, onReward }: CreativeLabProps) {
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rewardAnimation, setRewardAnimation] = useState<RewardTier | null>(null)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    if (file.size > 10 * 1024 * 1024) return
    setFileName(file.name)
    setEvaluation(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    setImage(null)
    setFileName(null)
    setEvaluation(null)
    setError(null)
    setRewardAnimation(null)
    setRewardClaimed(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleEvaluate() {
    if (!image) return
    setEvaluating(true)
    setError(null)
    setEvaluation(null)
    setRewardAnimation(null)
    setRewardClaimed(false)
    try {
      const res = await fetch("/api/evaluate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: image }),
      })
      const data = await res.json()
      if (data.evaluation) {
        setEvaluation(data.evaluation)
        // Trigger reward animation after a short delay
        const reward = getRewardTier(data.evaluation.totalScore)
        setTimeout(() => {
          setRewardAnimation(reward)
          // Auto-claim after animation
          setTimeout(() => {
            onReward(reward.xp, reward.coins)
            setRewardClaimed(true)
          }, 2000)
        }, 800)
      } else {
        setError(data.error || "Error en la evaluación")
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      <div
        className="overflow-hidden rounded-2xl shadow-xl"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(220,230,240,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: "rgba(200,225,255,0.3)",
            borderBottom: "1px solid rgba(200,220,240,0.5)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full" style={{ background: `${accentColor}cc` }} />
              <div className="h-2 w-2 rounded-full bg-primary/10" />
              <div className="h-2 w-2 rounded-full bg-primary/10" />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/60">
              Laboratorio Creativo
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-primary/40 transition-all hover:text-primary/70 hover:bg-gray-100"
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Description */}
          <div className="text-center">
            <h3 className="text-lg font-bold tracking-wider text-primary">
              🧪 Laboratorio Creativo
            </h3>
            <p className="mt-1 text-[10px] text-primary/50 leading-relaxed max-w-sm mx-auto">
              Sube una imagen de tu diseño. Un experto en moda futurista cyberpunk/cybercore/web3 lo evaluará.
            </p>
          </div>

          {/* Main content: Image + Results side by side on desktop */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* LEFT: Upload zone */}
            <div className="flex-1 flex flex-col gap-4">
              <div
                className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${dragOver ? "scale-[1.02]" : ""}`}
                style={{
                  borderColor: dragOver ? accentColor : image ? `${accentColor}60` : "rgba(200,220,240,0.6)",
                  background: dragOver ? `${accentColor}10` : image ? "rgba(255,255,255,0.5)" : "rgba(200,225,255,0.1)",
                  minHeight: image ? "auto" : "200px",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !image && inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />

                {image ? (
                  <div className="p-4 flex flex-col items-center gap-3">
                    <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ maxHeight: "300px" }}>
                      <img src={image} alt="Preview" className="max-w-full max-h-[300px] object-contain rounded-xl" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-primary/40 truncate max-w-[200px]">{fileName}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemove() }}
                        className="rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-red-400 transition-all hover:bg-red-50"
                        style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-6">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <p className="text-[11px] font-semibold text-primary/60">Arrastra una imagen aquí</p>
                    <p className="text-[9px] text-primary/30">o haz clic para seleccionar</p>
                    <p className="text-[8px] text-primary/20">PNG, JPG, WEBP • Máx 10MB</p>
                  </div>
                )}
              </div>

              {/* Evaluate Button */}
              <button
                type="button"
                disabled={!image || evaluating}
                onClick={handleEvaluate}
                className="w-full rounded-xl px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: image && !evaluating ? `linear-gradient(135deg, ${accentColor}dd, ${accentColor})` : `${accentColor}20`,
                  color: image && !evaluating ? "#fff" : `${accentColor}80`,
                  border: `1px solid ${image && !evaluating ? accentColor : `${accentColor}30`}`,
                  boxShadow: image && !evaluating ? `0 4px 15px ${accentColor}40` : "none",
                }}
              >
                {evaluating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Analizando diseño...
                  </span>
                ) : evaluation ? (
                  "🔬 Evaluar de nuevo"
                ) : (
                  "🔬 Evaluar Diseño"
                )}
              </button>

              {error && (
                <p className="text-center text-[10px] text-red-400 animate-fade-in">{error}</p>
              )}
            </div>

            {/* RIGHT: Evaluation Results */}
            {evaluation && (
              <div className="flex-1 flex flex-col gap-4 animate-fade-in">
                <div
                  className="rounded-2xl p-5 flex flex-col gap-5"
                  style={{
                    background: "rgba(200,225,255,0.15)",
                    border: "1px solid rgba(200,220,240,0.4)",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: accentColor }} />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/60">
                      Resultados de Evaluación
                    </span>
                  </div>

                  {/* Total Score Badge */}
                  <div className="flex justify-center">
                    <TotalScoreBadge score={evaluation.totalScore} color={accentColor} />
                  </div>

                  {/* Score Rings */}
                  <div className="grid grid-cols-2 gap-4 justify-items-center sm:grid-cols-4">
                    <ScoreRing value={evaluation.originality} label="Originalidad" icon="💡" color="#e0457b" />
                    <ScoreRing value={evaluation.aesthetic} label="Coherencia Estética" icon="🎨" color="#9c7cf4" />
                    <ScoreRing value={evaluation.web3Potential} label="Potencial Web3" icon="🌐" color="#4a9eff" />
                    <ScoreRing value={evaluation.visualImpact} label="Impacto Visual" icon="⚡" color="#00bcd4" />
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-gray-200" />

                  {/* Mentor Comment */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(200,220,240,0.4)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🧠</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                        Mentor Creativo
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-primary/70 italic">
                      &ldquo;{evaluation.comment}&rdquo;
                    </p>
                  </div>

                  {/* Score breakdown mini */}
                  <div className="flex flex-col gap-1.5">
                    {[
                      { label: "Originalidad", value: evaluation.originality, color: "#e0457b" },
                      { label: "Coherencia Estética", value: evaluation.aesthetic, color: "#9c7cf4" },
                      { label: "Potencial Web3", value: evaluation.web3Potential, color: "#4a9eff" },
                      { label: "Impacto Visual", value: evaluation.visualImpact, color: "#00bcd4" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[8px] text-primary/40 w-28 flex-shrink-0">{item.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span className="text-[9px] font-bold w-7 text-right" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reward Animation */}
          {rewardAnimation && evaluation && (
            <div
              className="rounded-2xl p-5 text-center animate-fade-in"
              style={{
                background: rewardClaimed
                  ? "rgba(76,175,80,0.08)"
                  : "linear-gradient(135deg, rgba(156,124,244,0.1), rgba(255,215,0,0.1))",
                border: `1px solid ${rewardClaimed ? "rgba(76,175,80,0.2)" : "rgba(156,124,244,0.3)"}`,
              }}
            >
              {!rewardClaimed ? (
                /* Animated reward reveal */
                <div className="flex flex-col items-center gap-3">
                  <div className="text-4xl" style={{ animation: "bounce 0.6s ease-in-out infinite" }}>
                    {rewardAnimation.emoji}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                    ¡Recompensa Desbloqueada!
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-bold text-[#9c7cf4]">+{rewardAnimation.xp}</span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#9c7cf4]/60">XP Creativo</span>
                    </div>
                    {rewardAnimation.coins > 0 && (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-bold text-[#d4a800]">+{rewardAnimation.coins}</span>
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-[#d4a800]/60">Monedas</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {["✦", "✧", "✦", "✧", "✦"].map((s, i) => (
                      <span key={i} className="text-xs" style={{ color: accentColor, opacity: 0.4 + (i % 2) * 0.3, animation: `pulse ${1 + i * 0.2}s ease-in-out infinite` }}>{s}</span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Claimed confirmation */
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <p className="text-[10px] font-semibold text-green-600">
                    Recompensa reclamada • XP: {creativeXP} • Monedas: {creativeCoins}
                  </p>
                </div>
              )}
            </div>
          )}

          {!image && !evaluation && (
            <p className="text-center text-[8px] text-primary/25 uppercase tracking-widest">
              Sube una imagen para activar la evaluación
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
