"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { init, miniApp, themeParams, viewport } from "@telegram-apps/sdk"

interface TgUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

interface TgContextType {
  user: TgUser | null
  photoUrl: string | null
  isReady: boolean
}

const TgContext = createContext<TgContextType>({ user: null, photoUrl: null, isReady: false })

export function useTelegramUser() {
  return useContext(TgContext)
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TgUser | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 1. Initialize Telegram SDK
    try {
      init()
      if (miniApp.mount.isAvailable()) miniApp.mount()
      if (themeParams.mount.isAvailable()) {
        themeParams.mount()
        themeParams.bindCssVars()
        if (themeParams.isDark()) document.documentElement.classList.add("dark")
        else document.documentElement.classList.remove("dark")
      }
      if (viewport.mount.isAvailable()) {
        viewport.mount()
        viewport.expand()
      }
    } catch (e) {
      console.warn("Not in Telegram or SDK error:", e)
    }

    // 2. Read user data — retry up to 3 times with delays
    const tryGetUser = (attempt = 0) => {
      const tg = (window as any).Telegram?.WebApp
      const u = tg?.initDataUnsafe?.user
      if (u?.id) {
        setUser(u)
        // Fetch profile photo from server
        fetch(`/api/user-photo?user_id=${u.id}`)
          .then(r => r.json())
          .then(d => { if (d.photo_url) setPhotoUrl(d.photo_url) })
          .catch(() => {})
        setIsReady(true)
      } else if (attempt < 4) {
        setTimeout(() => tryGetUser(attempt + 1), [0, 300, 800, 1500, 3000][attempt + 1])
      } else {
        // Not in Telegram — still show app for browser testing
        setIsReady(true)
      }
    }

    tryGetUser()
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center animate-pulse">
            <span className="text-white text-xl">🌱</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <TgContext.Provider value={{ user, photoUrl, isReady }}>
      {children}
    </TgContext.Provider>
  )
}
