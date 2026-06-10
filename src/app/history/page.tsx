"use client"

import { useEffect, useState } from "react"
import { Clock, ChevronRight, MessageSquare, ScanSearch, History, Calculator } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useTelegramUser } from "@/components/providers/TelegramProvider"

type HistoryItem = {
  id: string
  title: string
  type: string
  created_at: string
}

const typeConfig: Record<string, { color: string; icon: any }> = {
  Chat: { color: "bg-blue-100 text-blue-600", icon: MessageSquare },
  Tashxis: { color: "bg-violet-100 text-violet-600", icon: ScanSearch },
  Kalkulyator: { color: "bg-teal-100 text-teal-600", icon: Calculator },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "Hozirgina"
  if (hours < 24) return `${hours} soat oldin`
  if (hours < 48) return "Kecha"
  return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" })
}

export default function HistoryPage() {
  const { user } = useTelegramUser()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("Barchasi")

  const filters = ["Barchasi", "Chat", "Tashxis", "Kalkulyator"]

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let query = supabase
          .from("history")
          .select("id, title, type, created_at")
          .order("created_at", { ascending: false })
          .limit(50)

        if (user?.id) query = query.eq("user_id", user.id.toString())

        const { data, error } = await query
        if (!error && data) setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  const filtered = filter === "Barchasi" ? items : items.filter(i => i.type === filter)

  return (
    <div className="pb-24 min-h-screen bg-[#f5f7f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#52b788] px-5 pt-10 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
            <History className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">Mening Tarixim</h1>
          <p className="text-white/70 text-sm mt-1">{items.length} ta yozuv saqlangan</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === f
                  ? "bg-[#2d6a4f] text-white shadow-sm"
                  : "bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-pulse">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-600 mb-1">Tarix bo'sh</h3>
            <p className="text-sm text-slate-400">AI bilan suhbat boshlang, u yerda saqlanadi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => {
              const cfg = typeConfig[item.type] || typeConfig["Chat"]
              const Icon = cfg.icon
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-800 truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[11px] text-slate-400">{formatDate(item.created_at)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${cfg.color}`}>{item.type}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
