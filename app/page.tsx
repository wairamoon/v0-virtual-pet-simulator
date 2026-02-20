"use client"

import { useEffect, useState } from "react"
import { PixSimCreate, type PixSimData } from "@/components/pixsim-create"
import { PixSimDashboard } from "@/components/pixsim-dashboard"
import { AeroBackground } from "@/components/aero-background"

const STORAGE_KEY = "pixsim-data"

function loadData(): PixSimData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PixSimData
  } catch {
    return null
  }
}

function saveData(data: PixSimData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function clearData() {
  localStorage.removeItem(STORAGE_KEY)
}

export default function PixSimApp() {
  const [data, setData] = useState<PixSimData | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setData(loadData())
    setReady(true)
  }, [])

  function handleCreate(newData: PixSimData) {
    saveData(newData)
    setData(newData)
  }

  function handleReset() {
    clearData()
    setData(null)
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <AeroBackground />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </main>
    )
  }

  return (
    <main>
      <AeroBackground />
      {data ? (
        <PixSimDashboard data={data} onReset={handleReset} />
      ) : (
        <PixSimCreate onCreate={handleCreate} />
      )}
    </main>
  )
}
