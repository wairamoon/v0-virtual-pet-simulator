"use client"

import { useState, useCallback, useRef } from "react"

// ─── Config ─────────────────────────────────────────────
const HUB_BASE = "https://regenmon-final.vercel.app/api"
const RETRY_DELAY = 2000 // 2 segundos
const FRIENDLY_ERROR = "El HUB está descansando, intenta después 🍎"

// ─── Types ──────────────────────────────────────────────
export interface HubRegenmon {
  id: string
  name: string
  ownerName: string
  appUrl: string
  sprite: string
  email?: string
  stats?: {
    hunger: number
    happiness: number
    energy: number
    level: number
    xp: number
  }
  createdAt?: string
  updatedAt?: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  ownerName: string
  level: number
  xp: number
  sprite: string
}

export interface HubMessage {
  id: string
  fromId: string
  fromName: string
  toId: string
  text: string
  createdAt: string
}

export interface ActivityEntry {
  id: string
  type: string
  actorName: string
  description: string
  createdAt: string
}

interface HubState {
  loading: boolean
  error: string | null
}

// ─── Internal fetch with 1 automatic retry ──────────────
async function hubFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${HUB_BASE}${path}`

  const attempt = async (): Promise<T> => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `HTTP ${res.status}`)
    }

    return res.json()
  }

  try {
    return await attempt()
  } catch (err: any) {
    // Retry once after 2s for network errors
    if (isNetworkError(err)) {
      await sleep(RETRY_DELAY)
      return await attempt() // If this also fails, it throws to caller
    }
    throw err
  }
}

function isNetworkError(err: any): boolean {
  return (
    err instanceof TypeError || // fetch network failure
    err.message?.includes("Failed to fetch") ||
    err.message?.includes("NetworkError") ||
    err.message?.includes("ECONNREFUSED")
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// ─── Hook ───────────────────────────────────────────────
export function useHub() {
  const [state, setState] = useState<HubState>({
    loading: false,
    error: null,
  })

  // Prevent concurrent calls from stomping state
  const activeRef = useRef(0)

  const wrap = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      const id = ++activeRef.current
      setState((s) => ({ ...s, loading: true, error: null }))

      try {
        const result = await fn()
        if (activeRef.current === id) {
          setState({ loading: false, error: null })
        }
        return result
      } catch (err: any) {
        console.error("[useHub]", err)
        if (activeRef.current === id) {
          setState({ loading: false, error: FRIENDLY_ERROR })
        }
        return null
      }
    },
    []
  )

  // ─── API Functions ──────────────────────────────────

  /** Register a new Regenmon in the HUB */
  const registerRegenmon = useCallback(
    (data: {
      name: string
      ownerName: string
      appUrl: string
      sprite: string
      email?: string
    }) =>
      wrap(() =>
        hubFetch<{ data: HubRegenmon; alreadyRegistered?: boolean }>(
          "/register",
          { method: "POST", body: JSON.stringify(data) }
        )
      ),
    [wrap]
  )

  /** Sync local stats to the HUB */
  const syncRegenmon = useCallback(
    (hubId: string, stats: HubRegenmon["stats"]) =>
      wrap(() =>
        hubFetch<{ data: HubRegenmon }>("/sync", {
          method: "POST",
          body: JSON.stringify({ id: hubId, stats }),
        })
      ),
    [wrap]
  )

  /** Get the leaderboard */
  const getLeaderboard = useCallback(
    () =>
      wrap(() =>
        hubFetch<{ data: LeaderboardEntry[] }>("/leaderboard")
      ),
    [wrap]
  )

  /** Get a specific Regenmon by ID */
  const getRegenmonById = useCallback(
    (id: string) =>
      wrap(() =>
        hubFetch<{ data: HubRegenmon }>(`/regenmon/${id}`)
      ),
    [wrap]
  )

  /** Feed another player's Regenmon */
  const feedRegenmon = useCallback(
    (targetId: string, fromId: string) =>
      wrap(() =>
        hubFetch<{ data: HubRegenmon }>("/feed", {
          method: "POST",
          body: JSON.stringify({ targetId, fromId }),
        })
      ),
    [wrap]
  )

  /** Gift an item to another Regenmon */
  const giftRegenmon = useCallback(
    (targetId: string, fromId: string, item: string) =>
      wrap(() =>
        hubFetch<{ success: boolean }>("/gift", {
          method: "POST",
          body: JSON.stringify({ targetId, fromId, item }),
        })
      ),
    [wrap]
  )

  /** Get messages for a Regenmon */
  const getMessages = useCallback(
    (hubId: string) =>
      wrap(() =>
        hubFetch<{ data: HubMessage[] }>(`/messages?id=${hubId}`)
      ),
    [wrap]
  )

  /** Send a message to another Regenmon */
  const sendMessage = useCallback(
    (fromId: string, toId: string, text: string) =>
      wrap(() =>
        hubFetch<{ data: HubMessage }>("/messages", {
          method: "POST",
          body: JSON.stringify({ fromId, toId, text }),
        })
      ),
    [wrap]
  )

  /** Get global activity feed */
  const getActivity = useCallback(
    () =>
      wrap(() =>
        hubFetch<{ data: ActivityEntry[] }>("/feed")
      ),
    [wrap]
  )

  return {
    // State
    loading: state.loading,
    error: state.error,
    clearError: useCallback(
      () => setState((s) => ({ ...s, error: null })),
      []
    ),

    // API
    registerRegenmon,
    syncRegenmon,
    getLeaderboard,
    getRegenmonById,
    feedRegenmon,
    giftRegenmon,
    getMessages,
    sendMessage,
    getActivity,
  }
}
