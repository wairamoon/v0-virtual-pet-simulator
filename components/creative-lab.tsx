"use client"

import { useState, useRef } from "react"

interface CreativeLabProps {
  petName: string
  accentColor: string
  onClose: () => void
}

export function CreativeLab({ petName, accentColor, onClose }: CreativeLabProps) {
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    if (file.size > 10 * 1024 * 1024) return // max 10MB
    setFileName(file.name)
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
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      {/* Header */}
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
              Sube una imagen de tu diseño o creación. {petName} la evaluará para ayudarte a evolucionar.
            </p>
          </div>

          {/* Upload Zone */}
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
              dragOver ? "scale-[1.02]" : ""
            }`}
            style={{
              borderColor: dragOver ? accentColor : image ? `${accentColor}60` : "rgba(200,220,240,0.6)",
              background: dragOver
                ? `${accentColor}10`
                : image
                ? "rgba(255,255,255,0.5)"
                : "rgba(200,225,255,0.1)",
              minHeight: image ? "auto" : "200px",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !image && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />

            {image ? (
              /* Image Preview */
              <div className="p-4 flex flex-col items-center gap-3">
                <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ maxHeight: "300px" }}>
                  <img
                    src={image}
                    alt="Preview del diseño"
                    className="max-w-full max-h-[300px] object-contain rounded-xl"
                  />
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
              /* Upload Prompt */
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-6">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <p className="text-[11px] font-semibold text-primary/60">
                  Arrastra una imagen aquí
                </p>
                <p className="text-[9px] text-primary/30">
                  o haz clic para seleccionar
                </p>
                <p className="text-[8px] text-primary/20">
                  PNG, JPG, WEBP • Máx 10MB
                </p>
              </div>
            )}
          </div>

          {/* Evaluate Button */}
          <button
            type="button"
            disabled={!image}
            className="w-full rounded-xl px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: image
                ? `linear-gradient(135deg, ${accentColor}dd, ${accentColor})`
                : `${accentColor}20`,
              color: image ? "#fff" : `${accentColor}80`,
              border: `1px solid ${image ? accentColor : `${accentColor}30`}`,
              boxShadow: image ? `0 4px 15px ${accentColor}40` : "none",
            }}
          >
            🔬 Evaluar Diseño
          </button>

          {!image && (
            <p className="text-center text-[8px] text-primary/25 uppercase tracking-widest">
              Sube una imagen para activar la evaluación
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
