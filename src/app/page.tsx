"use client"

import Link from "next/link"
import {
  Sprout, Syringe, ScanSearch, Calculator, BookOpen,
  Wind, Droplets, TrendingUp, Plus, History, Settings, Thermometer
} from "lucide-react"
import { useEffect, useState } from "react"
import { useTelegramUser } from "@/components/providers/TelegramProvider"

interface WeatherData {
  temp: number
  humidity: number
  wind: number
  description: string
  emoji?: string
  city?: string | null
}

export default function Home() {
  const { user, photoUrl } = useTelegramUser()
  const [time, setTime] = useState("")
  const [greeting, setGreeting] = useState("Xayrli kun")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)

  // Time & greeting
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours()
      setGreeting(h < 6 ? "Xayrli tun" : h < 12 ? "Xayrli tong" : h < 18 ? "Xayrli kun" : "Xayrli kech")
      setTime(
        now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }) +
        " | " +
        now.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" })
      )
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])

  // Weather via server API (OpenWeatherMap or Open-Meteo fallback)
  useEffect(() => {
    if (!navigator.geolocation) { setWeatherLoading(false); return }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`
          )
          const data = await res.json()
          if (!data.error) setWeather(data)
        } catch {}
        finally { setWeatherLoading(false) }
      },
      () => setWeatherLoading(false),
      { timeout: 8000 }
    )
  }, [])

  const displayName = user
    ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
    : null

  const initial = displayName?.charAt(0).toUpperCase() ?? "?"

  const quickActions = [
    { name: "AI Agronom", icon: Sprout, href: "/chat?type=agronom", bg: "bg-emerald-500" },
    { name: "AI Veterinar", icon: Syringe, href: "/chat?type=vet", bg: "bg-blue-500" },
    { name: "Kasallik", icon: ScanSearch, href: "/detect", bg: "bg-violet-500" },
    { name: "Kalkulyator", icon: Calculator, href: "/calculators", bg: "bg-teal-500" },
    { name: "Bilimlar", icon: BookOpen, href: "/knowledge", bg: "bg-amber-500" },
    { name: "Tarix", icon: History, href: "/history", bg: "bg-slate-500" },
  ]

  return (
    <main className="pb-28 min-h-screen bg-[#f0f4f0]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1a3d2b] via-[#2d6a4f] to-[#40916c] px-5 pt-12 pb-20">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 left-0 w-40 h-40 rounded-full bg-emerald-300/10 blur-2xl pointer-events-none" />

        {/* Top bar */}
        <div className="relative flex items-center justify-between mb-6">
          <Link href="/profile" className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Settings className="w-5 h-5 text-white" />
          </Link>
          <span className="text-white/60 text-xs font-medium tracking-wide">{time}</span>
          <Link href="/profile">
            {photoUrl ? (
              <img src={photoUrl} alt="avatar" className="w-10 h-10 rounded-2xl object-cover border-2 border-white/30 shadow-md" />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white/15 border-2 border-white/20 flex items-center justify-center font-bold text-white text-base backdrop-blur-sm">
                {initial}
              </div>
            )}
          </Link>
        </div>

        {/* Greeting */}
        <div className="relative space-y-1 mb-5">
          <p className="text-white/70 text-sm font-medium">
            {greeting}{displayName ? `, ${displayName}` : ""} 👋
          </p>

          {/* Temperature */}
          {weatherLoading ? (
            <div className="h-16 w-32 bg-white/10 rounded-2xl animate-pulse" />
          ) : weather ? (
            <div className="text-white">
              <div className="text-6xl font-bold tracking-tight leading-none">{weather.temp}°C</div>
              <div className="flex items-center gap-1.5 mt-2 text-white/70 text-sm">
                {weather.emoji && <span>{weather.emoji}</span>}
                <span className="capitalize">{weather.description}</span>
                {weather.city && <span>· {weather.city}</span>}
              </div>
            </div>
          ) : (
            <div className="text-white/50 text-sm">Ob-havo aniqlanmadi</div>
          )}
        </div>

        {/* Weather pills */}
        <div className="relative flex gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium border border-white/10">
            <Wind className="w-3.5 h-3.5" />
            {weather ? `${weather.wind} km/s` : "-- km/s"}
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium border border-white/10">
            <Thermometer className="w-3.5 h-3.5" />
            {weather ? `${weather.temp > 0 ? "+" : ""}${weather.temp}°C` : "--°C"}
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium border border-white/10">
            <Droplets className="w-3.5 h-3.5" />
            {weather ? `${weather.humidity}%` : "--%"}
          </div>
        </div>
      </div>

      {/* ── Cards area — overlaps hero ── */}
      <div className="px-4 -mt-10 space-y-3.5">

        {/* Water Efficiency */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-700 text-[13px]">Suv Samaradorligi</span>
            <span className="text-[11px] font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full">
              Yuqori · 75%
            </span>
          </div>
          <div className="flex gap-[3px] h-2.5 rounded-full overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className={`flex-1 rounded-sm transition-colors ${i < 21 ? "bg-[#2d6a4f]" : "bg-slate-100"}`} />
            ))}
          </div>
        </div>

        {/* Soil + Crop row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Soil Health */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">Tuproq Sog'lig'i</span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
              Normal
            </span>
            <p className="text-slate-800 font-bold text-[15px] mt-2">pH: 6.5</p>
            <p className="text-slate-400 text-[11px]">Optimal</p>
            <div className="flex items-center gap-1 mt-3 text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">+42%</span>
              <span className="text-[10px] text-slate-400 ml-0.5">O'tgan hafta</span>
            </div>
          </div>

          {/* Crop Health Gauge */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-slate-400 mb-2">Hosil Ko'rsatkichi</span>
            <div className="relative w-20 h-11 overflow-hidden">
              <svg viewBox="0 0 100 55" className="w-full">
                <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
                <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#2d6a4f" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray="125" strokeDashoffset="19" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center leading-none">
                <span className="text-lg font-bold text-slate-800">85</span>
                <span className="text-[11px] text-slate-400">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Field banner */}
        <div className="bg-gradient-to-br from-[#40916c] to-[#1a3d2b] rounded-3xl px-4 py-5 flex items-center justify-between overflow-hidden relative shadow-sm">
          <div className="absolute right-14 text-[64px] opacity-10 select-none pointer-events-none">🌾</div>
          <div className="relative z-10">
            <p className="text-white/70 text-xs mb-2">Namlik: 72% · Holat: 85/100</p>
            <Link href="/detect" className="bg-white text-[#2d6a4f] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm w-fit hover:bg-slate-50 transition-colors active:scale-95">
              <ScanSearch className="w-4 h-4" /> Kasallik Aniqlash
            </Link>
          </div>
          <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20 flex-shrink-0">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pb-2">
          <h2 className="text-[13px] font-bold text-slate-500 mb-3 tracking-wide uppercase">Tezkor Amallar</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="bg-white rounded-2xl py-4 px-2 flex flex-col items-center gap-2.5 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight">{action.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}
