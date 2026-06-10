"use client"

import Link from "next/link"
import { Sprout, Syringe, ScanSearch, Calculator, BookOpen, Settings, Wind, Thermometer, Droplets, TrendingUp, Map, Plus } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const [user, setUser] = useState<{ first_name: string; last_name?: string; username?: string } | null>(null)
  const [time, setTime] = useState("")
  const [greeting, setGreeting] = useState("Xayrli kun")

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser((window as any).Telegram.WebApp.initDataUnsafe.user)
    }
    const now = new Date()
    const h = now.getHours()
    setGreeting(h < 12 ? "Xayrli tong" : h < 18 ? "Xayrli kun" : "Xayrli kech")
    setTime(now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }) + " | " +
      now.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" }))
  }, [])

  const firstName = user?.first_name || "Fermer"

  const quickActions = [
    { name: "AI Agronom", icon: Sprout, href: "/chat?type=agronom", bg: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
    { name: "AI Veterinar", icon: Syringe, href: "/chat?type=vet", bg: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
    { name: "Kasallik", icon: ScanSearch, href: "/detect", bg: "bg-violet-500", light: "bg-violet-50 text-violet-600" },
    { name: "Kalkulyator", icon: Calculator, href: "/calculators", bg: "bg-teal-500", light: "bg-teal-50 text-teal-600" },
    { name: "Bilimlar", icon: BookOpen, href: "/knowledge", bg: "bg-amber-500", light: "bg-amber-50 text-amber-600" },
    { name: "Barchasi", icon: Plus, href: "/history", bg: "bg-slate-400", light: "bg-slate-50 text-slate-600" },
  ]

  return (
    <main className="pb-24 min-h-screen bg-[#f5f7f5]">

      {/* ── Hero: Green header with background image feel ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2d6a4f] via-[#40916c] to-[#52b788] min-h-[260px] px-5 pt-10 pb-16">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-emerald-300 blur-2xl"></div>
        </div>

        {/* Top row */}
        <div className="relative flex items-center justify-between mb-6">
          <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </button>
          <span className="text-white/80 text-xs font-medium">{time}</span>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base">
            {firstName.charAt(0)}
          </div>
        </div>

        {/* Greeting & weather */}
        <div className="relative">
          <p className="text-white/80 text-sm mb-0.5">{greeting}, {firstName} 👋</p>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-white text-6xl font-bold tracking-tight leading-none">26°C</div>
              <div className="text-white/70 text-sm mt-1 flex items-center gap-1">
                ☀️ <span>Ochiq havo · Samarqand</span>
              </div>
            </div>
            <div className="text-right text-white/90 text-sm font-semibold">Ochiq havo</div>
          </div>

          {/* Weather pills */}
          <div className="flex gap-2 mt-4">
            {[
              { icon: Wind, label: "5 km/s" },
              { icon: Thermometer, label: "+12°C" },
              { icon: Droplets, label: "42.5%" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="px-4 -mt-6 space-y-4">

        {/* Water Efficiency Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-700 text-sm">Suv Samaradorligi</span>
            <span className="text-xs font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full">Yuqori · 75%</span>
          </div>
          {/* Progress bar segmented */}
          <div className="flex gap-[3px] h-3 rounded-full overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${i < 21 ? "bg-[#2d6a4f]" : "bg-slate-100"}`}
              />
            ))}
          </div>
        </div>

        {/* Soil Health + Crop Score */}
        <div className="grid grid-cols-2 gap-3">
          {/* Soil Health */}
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-500">Tuproq Sog'lig'i</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">Normal</span>
            </div>
            <p className="text-slate-800 font-bold text-sm">pH: 6.5</p>
            <p className="text-slate-400 text-xs">Optimal</p>
            <div className="flex items-center gap-1 mt-3 text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">+42%</span>
              <span className="text-xs text-slate-400 ml-1">O'tgan hafta</span>
            </div>
          </div>

          {/* Crop Health Score – Gauge */}
          <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-500 mb-2">Hosil Ko'rsatkichi</span>
            {/* Simple SVG gauge */}
            <div className="relative w-20 h-11 overflow-hidden">
              <svg viewBox="0 0 100 55" className="w-full">
                {/* Background arc */}
                <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
                {/* Filled arc 85% */}
                <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#2d6a4f" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray="125" strokeDashoffset="19" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center">
                <span className="text-lg font-bold text-slate-800">85</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map / Field Banner */}
        <div className="bg-gradient-to-br from-[#52b788] to-[#2d6a4f] rounded-3xl p-4 shadow-sm flex items-center justify-between overflow-hidden relative min-h-[90px]">
          <div className="absolute inset-0 opacity-10 text-[80px] flex items-center justify-center select-none">🌾</div>
          <div className="relative z-10">
            <p className="text-white/80 text-xs mb-1">Namlik: 72% · Holat: 85/100</p>
            <button className="bg-white text-[#2d6a4f] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm hover:scale-105 transition-transform active:scale-95">
              <Map className="w-3.5 h-3.5" /> Xaritani Ko'r
            </button>
          </div>
          <button className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-base font-bold text-slate-700 mb-3">Tezkor Amallar</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="bg-white rounded-2xl p-3.5 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <div className={`w-11 h-11 ${action.bg} rounded-xl flex items-center justify-center shadow-sm`}>
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
