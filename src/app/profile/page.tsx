"use client"

import { Settings, Crown, Bell, Globe, LogOut, ShieldAlert, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useTelegramUser } from "@/components/providers/TelegramProvider"

export default function ProfilePage() {
  const { user, photoUrl, isReady } = useTelegramUser()

  const fullName = user
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`.trim()
    : isReady ? "Mehmon" : "..."
  const username = user?.username ? `@${user.username}` : isReady ? "Telegram foydalanuvchi" : ""
  const initial = fullName.charAt(0).toUpperCase()
  const loadingPhoto = !isReady && !photoUrl

  const menuItems = [
    { icon: Globe, label: "Til", value: "O'zbek", color: "bg-blue-50 text-blue-500", href: null },
    { icon: Bell, label: "Bildirishnomalar", value: null, toggle: true, color: "bg-orange-50 text-orange-500", href: null },
    { icon: Settings, label: "Umumiy sozlamalar", value: null, color: "bg-slate-100 text-slate-500", href: null },
  ]

  return (
    <div className="pb-24 min-h-screen bg-[#f5f7f5]">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#52b788] pt-10 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>
        <h1 className="text-white text-lg font-bold relative mb-8">Profil</h1>

        {/* Avatar */}
        <div className="relative flex flex-col items-center">
          <div className="relative">
            {loadingPhoto ? (
              <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse border-4 border-white/30" />
            ) : photoUrl ? (
              <img
                src={photoUrl}
                alt="Profil rasmi"
                className="w-24 h-24 rounded-full object-cover border-4 border-white/40 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
                <span className="text-4xl font-bold text-white">{initial}</span>
              </div>
            )}
          </div>

          <h2 className="text-white text-xl font-bold mt-3">{fullName}</h2>
          <p className="text-white/70 text-sm mt-0.5">{username}</p>

          {/* Premium badge */}
          <div className="flex items-center gap-1.5 mt-3 bg-amber-400/90 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            <Crown className="w-3.5 h-3.5" /> Premium Foydalanuvchi
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-4 -mt-6 grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Konsultatsiya", value: "12" },
          { label: "Tashxislar", value: "5" },
          { label: "Saqlanganlar", value: "8" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {/* Settings */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors ${idx < menuItems.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm text-slate-700">{item.label}</span>
                </div>
                {item.value && <span className="text-sm text-slate-400 font-medium">{item.value}</span>}
                {item.toggle && (
                  <div className="w-11 h-6 bg-[#2d6a4f] rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
                  </div>
                )}
                {!item.value && !item.toggle && <ChevronRight className="w-4 h-4 text-slate-300" />}
              </div>
            )
          })}
        </div>

        {/* Admin Panel */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <Link href="/admin" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm text-purple-600">Admin Panel</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Link>
        </div>

        {/* Logout */}
        <button className="w-full py-4 bg-white border border-red-100 text-red-500 font-bold rounded-3xl hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" /> Chiqish
        </button>
      </div>
    </div>
  )
}
