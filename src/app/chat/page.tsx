"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Image as ImageIcon, Mic, ArrowLeft, Bot } from "lucide-react"
import Link from "next/link"
import { useTelegramUser } from "@/components/providers/TelegramProvider"

type Message = { role: "user" | "ai"; content: string }

export default function ChatPage() {
  const { user } = useTelegramUser()

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Assalomu alaykum! Men Agro AI man. Qishloq xo'jaligi yoki chorvachilik bo'yicha qanday yordam bera olaman?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    "Pomidor barglari sarg'ayib ketdi",
    "Sigirim ovqat yemayapti",
    "Bug'doy uchun qaysi o'g'it tavsiya qilasiz?",
  ]

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { role: "user", content: text }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const tgUserId = user?.id?.toString() ?? "guest"

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], userId: tgUserId })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages(prev => [...prev, { role: "ai", content: data.content || data.role }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Kechirasiz, tarmoq xatosi yuz berdi. Qaytadan urinib ko'ring." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f5f7f5]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <Link href="/" className="p-2 -ml-1 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-[#2d6a4f] rounded-full flex items-center justify-center shadow-sm">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-800">Agro AI Maslahatchi</h1>
          <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Onlayn
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-[#2d6a4f] rounded-full flex-shrink-0 flex items-center justify-center mb-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-[#2d6a4f] text-white rounded-br-sm shadow-sm"
                : "bg-white text-slate-800 rounded-bl-sm shadow-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-[#2d6a4f] rounded-full flex-shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && !isLoading && (
          <div className="pt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-3.5 py-2 bg-white text-slate-600 rounded-full text-xs font-medium shadow-sm border border-slate-100 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 bg-white border-t border-slate-100 pb-safe">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 transition-colors flex-shrink-0">
            <ImageIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-slate-100 rounded-3xl flex items-center px-4 min-h-[46px]">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Xabar yozing..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-[15px] py-2 placeholder:text-slate-400 disabled:opacity-60"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all flex-shrink-0 ${
              input.trim() && !isLoading
                ? "bg-[#2d6a4f] text-white shadow-md hover:scale-105 active:scale-95"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {input.trim() ? <Send className="w-4.5 h-4.5 ml-0.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
