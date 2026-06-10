"use client"

import { useState } from "react"
import { Send, Image as ImageIcon, Mic, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Assalomu alaykum! Men Agro AI man. Qishloq xo'jaligi yoki chorvachilik bo'yicha qanday yordam bera olaman?" }
  ])
  const [input, setInput] = useState("")

  const suggestions = [
    "Pomidor barglari sarg'ayib ketdi",
    "Sigirim ovqat yemayapti",
    "Bug'doy uchun qaysi o'g'it tavsiya qilasiz?"
  ]

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: "user" as const, content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    
    try {
      // Get telegram user ID if available
      const tgUserId = typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "guest_user"

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          userId: tgUserId
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setMessages(prev => [...prev, { role: "ai", content: data.content }])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, { role: "ai", content: "Kechirasiz, tarmoq xatosi yuz berdi." }])
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <Link href="/" className="mr-3 p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-primary">AI</span>
          </div>
          <div>
            <h1 className="font-semibold text-sm">Agro AI Maslahatchi</h1>
            <p className="text-[10px] text-green-500">Onlayn</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              msg.role === "user" 
                ? "bg-primary text-primary-foreground rounded-br-none" 
                : "glass-card rounded-bl-none"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((text, i) => (
            <button 
              key={i}
              onClick={() => setInput(text)}
              className="whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <button className="p-3 text-slate-400 hover:text-primary transition-colors flex-shrink-0">
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center px-4 py-1 min-h-[48px]">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Xabar yozing..." 
              className="flex-1 bg-transparent border-none outline-none text-[15px] py-2 placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={input.trim() ? handleSend : undefined}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all flex-shrink-0 shadow-sm ${
              input.trim() 
                ? "bg-primary text-white hover:bg-primary/90 hover:scale-105" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {input.trim() ? (
              <Send className="w-5 h-5 ml-1" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
