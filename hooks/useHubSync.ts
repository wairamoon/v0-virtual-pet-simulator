"use client"

import { useEffect, useCallback, useRef } from "react"
import { useHub } from "./useHub"

// ─── Config ─────────────────────────────────────────────
const SYNC_INTERVAL = 5 * 60 * 1000 // 5 minutos
const STORAGE_KEY = "pixsim-data"

// ─── Types ──────────────────────────────────────────────
interface PetData {
  name?: string
  energy?: string
  hunger?: number
  happiness?: number
  level?: number
  xp?: number
  totalPoints?: number
  trainingHistory?: Array<{
    date: string
    score: number
    topic?: string
  }>
  [key: string]: any
}

// ─── Helpers ────────────────────────────────────────────
function getHubId(): string | null {
  if (typeof window === "undefined") return null
  const id = localStorage.getItem("hubRegenmonId")
  const reg = localStorage.getItem("isRegisteredInHub") === "true"
  return reg && id ? id : null
}

function getPetData(): PetData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function buildSyncBody(hubId: string, pet: PetData) {
  return {
    id: hubId,
    stats: {
      hunger: pet.hunger ?? 50,
      happiness: pet.happiness ?? 50,
      energy: pet.energy ? 100 : 50,
      level: pet.level ?? 1,
      xp: pet.xp ?? 0,
    },
    totalPoints: pet.totalPoints ?? 0,
    trainingHistory: pet.trainingHistory ?? [],
  }
}

// ─── Hook ───────────────────────────────────────────────
export function useHubSync() {
  const { syncRegenmon } = useHub()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const syncingRef = useRef(false)

  /** Core sync — reads localStorage, sends to HUB, updates if new balance */
  const doSync = useCallback(async () => {
    const hubId = getHubId()
    if (!hubId) return // Not registered — skip

    const pet = getPetData()
    if (!pet) return

    if (syncingRef.current) return // Prevent overlapping syncs
    syncingRef.current = true

    try {
      const body = buildSyncBody(hubId, pet)
      const result = await syncRegenmon(hubId, body.stats)

      // If HUB returns updated data, merge into localStorage
      if (result?.data?.stats) {
        const fresh = getPetData()
        if (fresh) {
          const hubStats = result.data.stats
          const updated = {
            ...fresh,
            hunger: hubStats.hunger ?? fresh.hunger,
            happiness: hubStats.happiness ?? fresh.happiness,
            level: hubStats.level ?? fresh.level,
            xp: hubStats.xp ?? fresh.xp,
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
      }
    } finally {
      syncingRef.current = false
    }
  }, [syncRegenmon])

  /** Call after training completes */
  const syncAfterTraining = useCallback(() => {
    doSync()
  }, [doSync])

  // Auto-sync on mount + every 5 minutes
  useEffect(() => {
    const hubId = getHubId()
    if (!hubId) return // Not registered — no sync

    // Sync on mount
    doSync()

    // Sync every 5 min
    intervalRef.current = setInterval(doSync, SYNC_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [doSync])

  return { syncAfterTraining, syncNow: doSync }
}
