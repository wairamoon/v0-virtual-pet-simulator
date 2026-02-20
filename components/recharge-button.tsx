"use client"

import { useState, useCallback } from "react"

interface RechargeButtonProps {
  icon: React.ReactNode
  label: string
  color: string
  onClick: () => void
}

export function RechargeButton({ icon, label, color, onClick }: RechargeButtonProps) {
  const [bouncing, setBouncing] = useState(false)

  const handleClick = useCallback(() => {
    setBouncing(true)
    onClick()
    setTimeout(() => setBouncing(false), 350)
  }, [onClick])

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`group relative flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all animate-float-slow ${
        bouncing ? "animate-bounce-click" : ""
      }`}
      style={{
        background: `linear-gradient(180deg, ${color}cc, ${color}88)`,
        boxShadow: `0 4px 12px ${color}40, 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.5)`,
        color: "#fff",
        border: `1px solid ${color}60`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 6px 20px ${color}60, 0 3px 8px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.6)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${color}40, 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.5)`
      }}
    >
      {/* Glossy shine overlay */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)",
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 text-base" aria-hidden="true">{icon}</span>
      <span className="relative z-10">+5</span>
    </button>
  )
}
