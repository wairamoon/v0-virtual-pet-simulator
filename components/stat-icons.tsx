export function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9ec5" />
          <stop offset="100%" stopColor="#e0457b" />
        </linearGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#heartGrad)"
      />
      {/* Glossy highlight */}
      <ellipse cx="9" cy="7.5" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.35)" />
    </svg>
  )
}

export function MuscleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7ec8ff" />
          <stop offset="100%" stopColor="#2a8fd4" />
        </linearGradient>
      </defs>
      <path
        d="M5.2 10c-.7-2.2.3-4.5 2.5-5.2 1.3-.4 2.5 0 3.3.8l1 1.2 1-1.2c.8-.8 2-1.2 3.3-.8 2.2.7 3.2 3 2.5 5.2L12 20 5.2 10z"
        fill="url(#muscleGrad)"
      />
      {/* Lightning bolt / energy symbol */}
      <path d="M11 8l-1.5 3.5h2.5L10.5 16l4-5h-2.5L13 8h-2z" fill="rgba(255,255,255,0.5)" />
      <ellipse cx="9.5" cy="8" rx="2" ry="1.5" fill="rgba(255,255,255,0.25)" />
    </svg>
  )
}

export function FruitIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fruitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#80eec0" />
          <stop offset="100%" stopColor="#00bcd4" />
        </linearGradient>
      </defs>
      {/* Futuristic fruit - crystal apple shape */}
      <ellipse cx="12" cy="14" rx="6.5" ry="7" fill="url(#fruitGrad)" />
      {/* Stem */}
      <path d="M12 7V4.5" stroke="#2a9d8f" strokeWidth="1.5" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M12 5c1.5-1.5 4-1.5 4 0s-2 1.5-4 0z" fill="#5ec4a0" />
      {/* Glossy shine */}
      <ellipse cx="10" cy="11.5" rx="2.5" ry="3" fill="rgba(255,255,255,0.3)" />
      {/* Crystal facet lines */}
      <path d="M8.5 14l3.5-4 3.5 4" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
    </svg>
  )
}
