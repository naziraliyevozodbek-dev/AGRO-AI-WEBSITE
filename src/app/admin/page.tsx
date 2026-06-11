import { Users, MessageSquare, AlertCircle, TrendingUp, Settings, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0; // Disable caching so it always shows fresh data

export default async function AdminPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Ma'lumotlarni bazadan olish
  const { data: history } = await supabase
    .from('history')
    .select('*')
    .order('created_at', { ascending: false })

  const uniqueUsers = new Set((history || []).map(h => h.user_id))
  
  const stats = [
    { name: "Noyob Foydalanuvchilar", value: uniqueUsers.size.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { name: "Jami Chatlar", value: (history?.length || 0).toString(), icon: MessageSquare, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { name: "Kasallik aniqlangan", value: "0", icon: AlertCircle, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { name: "Premium Obunalar", value: "0", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  ]

  return (
    <div className="p-4 space-y-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-slate-500">Agro AI Boshqaruvi va Statistika</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-xs text-slate-500 font-medium">{stat.name}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">So'nggi Murojaatlar</h2>
          <button className="text-sm text-primary font-medium">Barchasi</button>
        </div>
        <div className="space-y-4">
          {history && history.length > 0 ? (
            history.slice(0, 15).map((item) => (
              <div key={item.id} className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate w-[200px]">{item.title}</p>
                    <p className="text-xs text-slate-500">ID: {item.user_id} • {new Date(item.created_at).toLocaleString('uz-UZ', { hour: '2-digit', minute:'2-digit', day:'2-digit', month:'short' })}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[10px] rounded-md font-bold uppercase shrink-0">
                  {item.type || "Chat"}
                </span>
              </div>
            ))
          ) : (
             <p className="text-sm text-slate-500 text-center py-4">Hozircha hech qanday ma'lumot yo'q</p>
          )}
        </div>
      </div>

      <button className="w-full py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 font-medium">
        <Settings className="w-5 h-5" /> Tizim Sozlamalari
      </button>
    </div>
  )
}
