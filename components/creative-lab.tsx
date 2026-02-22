"use client"

import { useState, useRef, useEffect } from "react"
import { getEvolutionLevel } from "./evolution-overlay"

type LabCategory = "nails" | "clothing" | "content"

interface CategoryConfig {
  value: LabCategory
  label: string
  icon: string
  description: string
  specialty: string
  metrics: { key: string; label: string; icon: string; color: string }[]
}

const LAB_CATEGORIES: CategoryConfig[] = [
  {
    value: "clothing", label: "Diseño de Ropa", icon: "👗",
    description: "Moda cyberpunk, retro tech y Web3",
    specialty: "moda cyberpunk, retro tech, cybercore, streetwear futurista y moda Web3",
    metrics: [
      { key: "originality", label: "Originalidad", icon: "💡", color: "#e0457b" },
      { key: "aesthetic", label: "Coherencia Estética", icon: "🎨", color: "#9c7cf4" },
      { key: "web3Potential", label: "Potencial Web3", icon: "🌐", color: "#4a9eff" },
      { key: "visualImpact", label: "Impacto Visual", icon: "⚡", color: "#00bcd4" },
      { key: "cybercore", label: "Nivel Cybercore", icon: "🤖", color: "#ff5722" },
    ],
  },
  {
    value: "nails", label: "Diseño de Uñas", icon: "💅",
    description: "Nail art futurista, cyberpunk y experimental",
    specialty: "nail art futurista, cyberpunk, chrome effects, 3D nail art, tech-inspired designs y tendencias Web3",
    metrics: [
      { key: "technicalDetail", label: "Detalle Técnico", icon: "🔍", color: "#e0457b" },
      { key: "patternCreativity", label: "Creatividad del Patrón", icon: "✨", color: "#9c7cf4" },
      { key: "trendStyle", label: "Tendencia y Estilo", icon: "🔥", color: "#ff5722" },
      { key: "visualPrecision", label: "Precisión Visual", icon: "🎯", color: "#4a9eff" },
      { key: "microImpact", label: "Impacto en Microformato", icon: "💎", color: "#00bcd4" },
    ],
  },
  {
    value: "content", label: "Post & Audiovisual", icon: "🎬",
    description: "Diseño gráfico, posts y material digital",
    specialty: "diseño gráfico digital, posts para redes sociales, material audiovisual, branding futurista y estética cybercore",
    metrics: [
      { key: "composition", label: "Composición Visual", icon: "🖼️", color: "#e0457b" },
      { key: "messageClear", label: "Claridad del Mensaje", icon: "💬", color: "#9c7cf4" },
      { key: "branding", label: "Branding", icon: "🏷️", color: "#ff5722" },
      { key: "digitalImpact", label: "Impacto Digital", icon: "📱", color: "#4a9eff" },
      { key: "viralPotential", label: "Potencial Viral", icon: "🚀", color: "#00bcd4" },
    ],
  },
]

interface EvaluationResult {
  [key: string]: number | string
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

interface LabHistoryEntry {
  id: string
  thumbnail: string // small base64
  date: string
  totalScore: number
  originality: number
  aesthetic: number
  web3Potential: number
  visualImpact: number
  comment: string
  levelAtTime: number
  levelTitle: string
  xpEarned: number
  coinsEarned: number
}

const HISTORY_KEY = "pixsim-lab-history"

function loadHistory(): LabHistoryEntry[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") } catch { return [] }
}

function saveHistory(entries: LabHistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 50)))
}

/** Resize image to small thumbnail for storage */
function createThumbnail(dataUrl: string, maxW = 120): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      const scale = maxW / img.width
      const canvas = document.createElement("canvas")
      canvas.width = maxW
      canvas.height = img.height * scale
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL("image/jpeg", 0.6))
    }
    img.src = dataUrl
  })
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface CreativeLabProps {
  petName: string
  accentColor: string
  onClose: () => void
  creativeXP: number
  creativeCoins: number
  onReward: (xp: number, coins: number) => void
  petIdentity: string
  petPower: string
  stats: { emotional: number; vital: number; hunger: number }
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

interface GalleryImage {
  id: string
  dataUrl: string
  fileName: string
  evaluation?: EvaluationResult | null
}

export function CreativeLab({ petName, accentColor, onClose, creativeXP, creativeCoins, onReward, petIdentity, petPower, stats }: CreativeLabProps) {
  const [category, setCategory] = useState<LabCategory | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rewardAnimation, setRewardAnimation] = useState<RewardTier | null>(null)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const [history, setHistory] = useState<LabHistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [showLabChat, setShowLabChat] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  async function handleChatSend() {
    if (!chatInput.trim() || chatLoading) return
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput("")
    setChatLoading(true)
    try {
      const res = await fetch("/api/lab-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          petName,
          evaluation: evaluation || null,
          history: chatMessages,
        }),
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Error de conexión... 🔧" }])
    } finally {
      setChatLoading(false)
    }
  }

  const selectedImage = images.find(img => img.id === selectedId) ?? null
  const image = selectedImage?.dataUrl ?? null
  const currentCategoryConfig = LAB_CATEGORIES.find(c => c.value === category)
  const currentMetrics = currentCategoryConfig?.metrics ?? LAB_CATEGORIES[0].metrics

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    if (file.size > 10 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
      const newImg: GalleryImage = { id, dataUrl: e.target?.result as string, fileName: file.name }
      setImages(prev => [...prev, newImg])
      setSelectedId(id)
      setEvaluation(null)
      setError(null)
      setRewardAnimation(null)
      setRewardClaimed(false)
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
    files.forEach(f => handleFile(f))
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    files.forEach(f => handleFile(f))
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleRemoveImage(id: string) {
    setImages(prev => prev.filter(img => img.id !== id))
    if (selectedId === id) {
      setSelectedId(images.find(img => img.id !== id)?.id ?? null)
      setEvaluation(null)
      setRewardAnimation(null)
      setRewardClaimed(false)
    }
  }

  function handleSelectImage(id: string) {
    setSelectedId(id)
    const img = images.find(i => i.id === id)
    setEvaluation(img?.evaluation ?? null)
    setError(null)
    setRewardAnimation(null)
    setRewardClaimed(false)
  }

  async function handleEvaluate() {
    if (!image) return
    setEvaluating(true)
    setError(null)
    setEvaluation(null)
    setRewardAnimation(null)
    setRewardClaimed(false)
    try {
      const catInfo = LAB_CATEGORIES.find(c => c.value === category)
      const metricKeys = catInfo?.metrics.map(m => m.key) ?? []
      const metricLabels = catInfo?.metrics.map(m => `${m.key}: ${m.label}`) ?? []
      const res = await fetch("/api/evaluate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image,
          specialty: catInfo?.specialty ?? "",
          categoryLabel: catInfo?.label ?? "Diseño",
          metricKeys,
          metricLabels,
        }),
      })
      const data = await res.json()
      if (data.evaluation) {
        setEvaluation(data.evaluation)
        // Save evaluation to gallery image
        if (selectedId) {
          setImages(prev => prev.map(img => img.id === selectedId ? { ...img, evaluation: data.evaluation } : img))
        }
        // Save to history
        const reward = getRewardTier(data.evaluation.totalScore)
        const currentLevel = getEvolutionLevel(creativeXP)
        const thumb = await createThumbnail(image)
        const entry: LabHistoryEntry = {
          id: Date.now().toString(36),
          thumbnail: thumb,
          date: new Date().toISOString(),
          totalScore: data.evaluation.totalScore,
          originality: data.evaluation.originality,
          aesthetic: data.evaluation.aesthetic,
          web3Potential: data.evaluation.web3Potential,
          visualImpact: data.evaluation.visualImpact,
          comment: data.evaluation.comment,
          levelAtTime: currentLevel.level,
          levelTitle: currentLevel.title,
          xpEarned: reward.xp,
          coinsEarned: reward.coins,
        }
        const updated = [entry, ...history].slice(0, 50)
        setHistory(updated)
        saveHistory(updated)
        // Trigger reward animation after a short delay
        setTimeout(() => {
          setRewardAnimation(reward)
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
              Elige una especialidad y sube tu diseño para una evaluación experta.
            </p>
          </div>

          {/* Category selector */}
          <div className="grid grid-cols-3 gap-2">
            {LAB_CATEGORIES.map((cat) => {
              const isSelected = category === cat.value
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  style={{
                    background: isSelected ? `${accentColor}15` : "rgba(200,225,255,0.1)",
                    border: isSelected ? `2px solid ${accentColor}60` : "1px solid rgba(200,220,240,0.4)",
                    boxShadow: isSelected ? `0 0 12px ${accentColor}20` : "none",
                  }}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-center leading-tight" style={{ color: isSelected ? accentColor : "rgba(0,0,0,0.5)" }}>
                    {cat.label}
                  </span>
                  <span className="text-[7px] text-primary/30 text-center leading-tight hidden sm:block">
                    {cat.description}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Show selected category label */}
          {category && (
            <div className="flex items-center justify-center gap-2">
              <div className="h-px flex-1" style={{ background: `${accentColor}20` }} />
              <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                {LAB_CATEGORIES.find(c => c.value === category)?.icon} {LAB_CATEGORIES.find(c => c.value === category)?.label}
              </span>
              <div className="h-px flex-1" style={{ background: `${accentColor}20` }} />
            </div>
          )}

          {/* Tab toggle: Evaluador / Historial */}
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowHistory(false)}
              className="flex-1 rounded-xl py-2 text-[9px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: !showHistory ? `${accentColor}15` : "transparent",
                color: !showHistory ? accentColor : "rgba(0,0,0,0.3)",
                border: `1px solid ${!showHistory ? `${accentColor}30` : "rgba(0,0,0,0.06)"}`,
              }}>
              🔬 Evaluador
            </button>
            <button type="button" onClick={() => setShowHistory(true)}
              className="flex-1 rounded-xl py-2 text-[9px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: showHistory ? `${accentColor}15` : "transparent",
                color: showHistory ? accentColor : "rgba(0,0,0,0.3)",
                border: `1px solid ${showHistory ? `${accentColor}30` : "rgba(0,0,0,0.06)"}`,
              }}>
              📜 Historial ({history.length})
            </button>
          </div>

          {showHistory ? (
            /* ===== HISTORY VIEW ===== */
            <div className="flex flex-col gap-3 animate-fade-in">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🧪</p>
                  <p className="text-[10px] text-primary/40">Aún no hay evaluaciones. ¡Sube tu primer diseño!</p>
                </div>
              ) : history.map((entry) => {
                const isExpanded = expandedHistory === entry.id
                const tier = getRewardTier(entry.totalScore)
                return (
                  <div key={entry.id}
                    className="rounded-xl overflow-hidden transition-all cursor-pointer"
                    style={{ background: "rgba(200,225,255,0.1)", border: "1px solid rgba(200,220,240,0.3)" }}
                    onClick={() => setExpandedHistory(isExpanded ? null : entry.id)}>
                    {/* Summary row */}
                    <div className="flex items-center gap-3 p-3">
                      <img src={entry.thumbnail} alt="" className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{tier.emoji}</span>
                          <span className="text-[11px] font-bold" style={{ color: accentColor }}>{entry.totalScore}</span>
                          <span className="text-[8px] uppercase tracking-wider text-primary/30">{tier.label}</span>
                        </div>
                        <p className="text-[8px] text-primary/40 mt-0.5">
                          {new Date(entry.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          {" • Nv."}{entry.levelAtTime} {entry.levelTitle}
                        </p>
                      </div>
                      <span className="text-[10px] text-primary/20">{isExpanded ? "▼" : "▶"}</span>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-3 pb-3 flex flex-col gap-3 border-t border-[rgba(200,220,240,0.3)] pt-3 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        {/* Score bars */}
                        <div className="flex flex-col gap-1.5">
                          {[
                            { label: "Originalidad", value: entry.originality, color: "#e0457b" },
                            { label: "Coherencia Estética", value: entry.aesthetic, color: "#9c7cf4" },
                            { label: "Potencial Web3", value: entry.web3Potential, color: "#4a9eff" },
                            { label: "Impacto Visual", value: entry.visualImpact, color: "#00bcd4" },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                              <span className="text-[8px] text-primary/40 w-28 flex-shrink-0">{item.label}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                                <div className="h-1.5 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                              </div>
                              <span className="text-[9px] font-bold w-7 text-right" style={{ color: item.color }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                        {/* Comment */}
                        <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(200,220,240,0.3)" }}>
                          <p className="text-[10px] text-primary/60 italic leading-relaxed">&ldquo;{entry.comment}&rdquo;</p>
                        </div>
                        {/* Rewards earned */}
                        <div className="flex items-center gap-3 text-[8px] text-primary/40">
                          <span>🧪 +{entry.xpEarned} XP</span>
                          {entry.coinsEarned > 0 && <span>🪙 +{entry.coinsEarned} monedas</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (

          /* ===== EVALUATOR VIEW (existing) ===== */
          <>
          {/* Main content: Image + Results side by side on desktop */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* LEFT: Gallery + Upload */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Selected image preview */}
              {image && (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: `2px solid ${accentColor}40`, background: "rgba(255,255,255,0.5)" }}
                >
                  <div className="p-4 flex flex-col items-center gap-3">
                    <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ maxHeight: "300px" }}>
                      <img src={image} alt="Preview" className="max-w-full max-h-[300px] object-contain rounded-xl" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-primary/40 truncate max-w-[180px]">{selectedImage?.fileName}</span>
                      {selectedImage?.evaluation && (
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ color: accentColor, background: `${accentColor}15` }}>
                          ✓ {selectedImage.evaluation.totalScore}pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Image gallery thumbnails + add button */}
              <div className="flex flex-wrap gap-2 items-center">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group cursor-pointer rounded-xl overflow-hidden transition-all hover:scale-105"
                    style={{
                      width: 64, height: 64,
                      border: selectedId === img.id ? `2px solid ${accentColor}` : "2px solid rgba(200,220,240,0.4)",
                      boxShadow: selectedId === img.id ? `0 0 10px ${accentColor}30` : "none",
                    }}
                    onClick={() => handleSelectImage(img.id)}
                  >
                    <img src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                    {img.evaluation && (
                      <div className="absolute bottom-0 left-0 right-0 text-center text-[7px] font-bold text-white py-0.5" style={{ background: `${accentColor}cc` }}>
                        {img.evaluation.totalScore}
                      </div>
                    )}
                    {/* Remove button on hover */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(img.id) }}
                      className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(239,68,68,0.8)", borderRadius: "0 0 0 6px" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Add more button */}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center justify-center rounded-xl transition-all hover:scale-105 cursor-pointer"
                  style={{
                    width: 64, height: 64,
                    border: `2px dashed ${accentColor}40`,
                    background: `${accentColor}08`,
                  }}
                >
                  <span className="text-xl" style={{ color: `${accentColor}80` }}>+</span>
                </button>
                <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleInputChange} />
              </div>

              {/* Drop zone (only when no images) */}
              {images.length === 0 && (
                <div
                  className={`rounded-2xl border-2 border-dashed transition-all cursor-pointer ${dragOver ? "scale-[1.02]" : ""}`}
                  style={{
                    borderColor: dragOver ? accentColor : "rgba(200,220,240,0.6)",
                    background: dragOver ? `${accentColor}10` : "rgba(200,225,255,0.1)",
                    minHeight: "200px",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <p className="text-[11px] font-semibold text-primary/60">Arrastra imágenes aquí</p>
                    <p className="text-[9px] text-primary/30">o haz clic para seleccionar</p>
                    <p className="text-[8px] text-primary/20">PNG, JPG, WEBP • Máx 10MB</p>
                  </div>
                </div>
              )}

              {/* Drop zone overlay when images exist */}
              {images.length > 0 && (
                <div
                  className="rounded-xl transition-all"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    border: dragOver ? `2px dashed ${accentColor}` : "none",
                    background: dragOver ? `${accentColor}10` : "transparent",
                    padding: dragOver ? "12px" : 0,
                    minHeight: dragOver ? "40px" : 0,
                  }}
                >
                  {dragOver && <p className="text-center text-[9px]" style={{ color: accentColor }}>Suelta para agregar</p>}
                </div>
              )}

              {/* Evaluate Button */}
              <button
                type="button"
                disabled={!image || evaluating || !category}
                onClick={handleEvaluate}
                className="w-full rounded-xl px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: image && !evaluating && category ? `linear-gradient(135deg, ${accentColor}dd, ${accentColor})` : `${accentColor}20`,
                  color: image && !evaluating && category ? "#fff" : `${accentColor}80`,
                  border: `1px solid ${image && !evaluating && category ? accentColor : `${accentColor}30`}`,
                  boxShadow: image && !evaluating && category ? `0 4px 15px ${accentColor}40` : "none",
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

                  {/* Score Rings — dynamic per category */}
                  <div className="grid grid-cols-2 gap-4 justify-items-center sm:grid-cols-3 lg:grid-cols-5">
                    {currentMetrics.map((m) => (
                      <ScoreRing key={m.key} value={Number(evaluation[m.key]) || 0} label={m.label} icon={m.icon} color={m.color} />
                    ))}
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

                  {/* Score breakdown mini — dynamic */}
                  <div className="flex flex-col gap-1.5">
                    {currentMetrics.map((m) => ({ label: m.label, value: Number(evaluation[m.key]) || 0, color: m.color })).map((item) => (
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
                /* Clickable reward claim button */
                <button
                  type="button"
                  onClick={() => {
                    onReward(rewardAnimation.xp, rewardAnimation.coins)
                    setRewardClaimed(true)
                  }}
                  className="w-full flex flex-col items-center gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="text-4xl" style={{ animation: "bounce 0.6s ease-in-out infinite" }}>
                    {rewardAnimation.emoji}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                    ¡Recompensa Desbloqueada!
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-bold text-[#9c7cf4]">+{rewardAnimation.xp}</span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#9c7cf4]/60">XP → Energía Vital</span>
                    </div>
                    {rewardAnimation.coins > 0 && (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-bold text-[#d4a800]">+{rewardAnimation.coins}</span>
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-[#d4a800]/60">Monedas → Comida</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="mt-2 rounded-xl px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor})`, boxShadow: `0 4px 15px ${accentColor}40` }}
                  >
                    🎁 Toca para Reclamar
                  </div>
                  <div className="flex gap-1 mt-1">
                    {["✦", "✧", "✦", "✧", "✦"].map((s, i) => (
                      <span key={i} className="text-xs" style={{ color: accentColor, opacity: 0.4 + (i % 2) * 0.3, animation: `pulse ${1 + i * 0.2}s ease-in-out infinite` }}>{s}</span>
                    ))}
                  </div>
                </button>
              ) : (
                /* Claimed confirmation */
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <p className="text-[10px] font-semibold text-green-600">
                    ¡Reclamada! Energía y comida recargadas
                  </p>
                  <p className="text-[8px] text-green-500">
                    XP: {creativeXP} • Monedas: {creativeCoins}
                  </p>
                </div>
              )}
            </div>
          )}

          {images.length === 0 && !evaluation && (
            <p className="text-center text-[8px] text-primary/25 uppercase tracking-widest">
              Sube imágenes para activar la evaluación
            </p>
          )}

          {/* Lab Chat toggle */}
          <button
            type="button"
            onClick={() => setShowLabChat(!showLabChat)}
            className="w-full rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: showLabChat ? "rgba(200,220,240,0.3)" : `${accentColor}15`,
              border: `1px solid ${showLabChat ? "rgba(200,220,240,0.5)" : `${accentColor}30`}`,
            }}
          >
            {showLabChat ? "✕ Cerrar Chat del Lab" : `💬 Hablar con ${petName} sobre tu diseño`}
          </button>

          {/* Lab Chat Panel */}
          {showLabChat && (
            <div
              className="rounded-2xl overflow-hidden animate-fade-in"
              style={{
                background: "rgba(200,225,255,0.15)",
                border: "1px solid rgba(200,220,240,0.4)",
              }}
            >
              {/* Chat header */}
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(200,220,240,0.3)" }}>
                <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: accentColor }} />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary/60">
                  Chat del Laboratorio
                </span>
              </div>

              {/* Messages */}
              <div className="h-48 overflow-y-auto p-3 flex flex-col gap-2" style={{ scrollbarWidth: "thin" }}>
                {chatMessages.length === 0 && (
                  <p className="text-center text-[9px] text-primary/30 py-6">
                    Pregúntale a {petName} sobre diseño, moda futurista o cómo mejorar tus creaciones 🧪
                  </p>
                )}
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
                      msg.role === "user" ? "ml-auto" : "mr-auto"
                    }`}
                    style={{
                      background: msg.role === "user"
                        ? `${accentColor}20`
                        : "rgba(255,255,255,0.6)",
                      border: `1px solid ${msg.role === "user" ? `${accentColor}30` : "rgba(200,220,240,0.4)"}`,
                      color: msg.role === "user" ? accentColor : "rgba(0,0,0,0.6)",
                    }}
                  >
                    {msg.role === "assistant" && (
                      <p className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                        {petName}
                      </p>
                    )}
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="mr-auto rounded-xl px-3 py-2 text-[11px]" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(200,220,240,0.4)" }}>
                    <span className="animate-pulse" style={{ color: accentColor }}>pensando...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 p-3" style={{ borderTop: "1px solid rgba(200,220,240,0.3)" }}>
                <input
                  type="text"
                  className="flex-1 rounded-xl px-3 py-2 text-[11px] outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(200,220,240,0.4)",
                    color: "rgba(0,0,0,0.7)",
                  }}
                  placeholder={`Escribe a ${petName}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                  maxLength={300}
                  disabled={chatLoading}
                />
                <button
                  type="button"
                  onClick={handleChatSend}
                  disabled={!chatInput.trim() || chatLoading}
                  className="rounded-xl px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-white transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                  style={{ background: accentColor }}
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  )
}
