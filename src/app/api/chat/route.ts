import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Using @google/genai as requested by current Google standards
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, userId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    if (!ai) {
      return NextResponse.json({ 
        role: "ai", 
        content: "API kaliti sozlanmagan." 
      })
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        "You are Agro AI, a helpful, professional agricultural assistant for farmers in Uzbekistan. Reply in Uzbek. Keep it concise.",
        ...messages.map((m: any) => `${m.role === 'user' ? 'User:' : 'Agro AI:'} ${m.content}`)
      ].join("\n")
    })
    
    const reply = response.text || "Kechirasiz, xatolik."

    // Save to Supabase History
    if (userId) {
      const lastUserMsg = messages[messages.length - 1].content
      // Try to save silently, don't break chat if DB fails
      supabase.from('history').insert({
        user_id: userId,
        title: lastUserMsg.substring(0, 40) + "...",
        type: "Chat",
        details: { messages: [...messages, { role: "ai", content: reply }] }
      }).then(({error}) => {
        if (error) console.error("Supabase Error:", error)
      })
    }

    return NextResponse.json({ role: "ai", content: reply })
  } catch (error: any) {
    console.error("Gemini API Error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 })
  }
}
