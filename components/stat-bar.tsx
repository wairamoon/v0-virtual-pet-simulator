"use client"

interface StatBarProps {
  label: string
  value: number
  max: number
  barColor: string
}

export function StatBar({ label, value, max, barColor }: StatBarProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          {label}
        </span>
        <span className="text-[10px] font-bold text-primary/70">
          {value}/{max}
        </span>
      </div>
      <div
        className="relative h-3 w-full overflow-hidden rounded-full"
        style={{
          background: "rgba(200,220,240,0.4)",
          boxShadow: "inset 0 1px 3px rgba(0,50,100,0.08)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(180deg, ${barColor}dd, ${barColor})`,
            boxShadow: `0 1px 6px ${barColor}40`,
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${value} de ${max}`}
        >
          {/* Glossy shine on bar */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-full"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent)" }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
