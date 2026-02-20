// Coin management system for $FRUTA
const COINS_PREFIX = "pixsim-coins-"
const DAILY_PREFIX = "pixsim-daily-"
const INITIAL_COINS = 100
const MAX_DAILY_EARNINGS = 50
const FEED_COST = 10

export interface CoinState {
  balance: number
  dailyEarned: number
  dailyDate: string
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function loadCoins(userId: string): CoinState {
  if (typeof window === "undefined") return { balance: INITIAL_COINS, dailyEarned: 0, dailyDate: todayKey() }
  try {
    const raw = localStorage.getItem(`${COINS_PREFIX}${userId}`)
    if (!raw) {
      // New user → 100 coins
      const state: CoinState = { balance: INITIAL_COINS, dailyEarned: 0, dailyDate: todayKey() }
      saveCoins(userId, state)
      return state
    }
    const state = JSON.parse(raw) as CoinState
    // Reset daily if new day
    if (state.dailyDate !== todayKey()) {
      state.dailyEarned = 0
      state.dailyDate = todayKey()
      saveCoins(userId, state)
    }
    return state
  } catch {
    return { balance: INITIAL_COINS, dailyEarned: 0, dailyDate: todayKey() }
  }
}

export function saveCoins(userId: string, state: CoinState) {
  localStorage.setItem(`${COINS_PREFIX}${userId}`, JSON.stringify(state))
}

/**
 * Try to earn coins from chatting.
 * Returns amount earned (0 if none).
 * - Base: 2-5 coins
 * - Higher chance if below 100
 * - Lower chance if above 100
 * - Daily cap of 50
 */
export function tryEarnCoins(userId: string): number {
  const state = loadCoins(userId)

  // Daily cap check
  if (state.dailyEarned >= MAX_DAILY_EARNINGS) return 0

  // Probability: higher when low on coins
  let chance: number
  if (state.balance < 30) chance = 0.8
  else if (state.balance < 60) chance = 0.6
  else if (state.balance < 100) chance = 0.45
  else if (state.balance < 200) chance = 0.25
  else chance = 0.1

  if (Math.random() > chance) return 0

  // Amount: 2-5
  const amount = Math.floor(Math.random() * 4) + 2
  const capped = Math.min(amount, MAX_DAILY_EARNINGS - state.dailyEarned)

  state.balance += capped
  state.dailyEarned += capped
  saveCoins(userId, state)

  return capped
}

/**
 * Spend coins for feeding. Returns true if successful.
 */
export function spendCoins(userId: string, amount: number = FEED_COST): boolean {
  const state = loadCoins(userId)
  if (state.balance < amount) return false
  state.balance -= amount
  saveCoins(userId, state)
  return true
}

export function getBalance(userId: string): number {
  return loadCoins(userId).balance
}

export { FEED_COST, INITIAL_COINS, MAX_DAILY_EARNINGS }
