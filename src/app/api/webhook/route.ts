import { NextResponse } from 'next/server'
import { Telegraf } from 'telegraf'

// Initialize bot if token exists
const bot = process.env.TELEGRAM_BOT_TOKEN ? new Telegraf(process.env.TELEGRAM_BOT_TOKEN) : null

if (bot) {
  // Simple start command
  bot.start((ctx) => {
    const webAppUrl = 'https://agro-ai.vercel.app'
    
    ctx.reply(
      'Assalomu alaykum 🌱 Agro AI ga xush kelibsiz! Sizga qishloq xo‘jaligi va chorvachilik bo‘yicha yordam beraman.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'AGRO AI MASLAHATCHINI OCHISH', web_app: { url: webAppUrl } }]
          ]
        }
      }
    )
  })

  // Boshqa barcha yozuvlarga ham xuddi shu javobni berish (to'xtab qolmasligi uchun)
  bot.on('message', (ctx) => {
    const webAppUrl = 'https://agro-ai.vercel.app'
    
    ctx.reply(
      'Assalomu alaykum 🌱 Agro AI ga xush kelibsiz! Sizga qishloq xo‘jaligi va chorvachilik bo‘yicha yordam beraman.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'AGRO AI MASLAHATCHINI OCHISH', web_app: { url: webAppUrl } }]
          ]
        }
      }
    )
  })
}

export async function POST(req: Request) {
  if (!bot) {
    return NextResponse.json({ error: 'Bot token topilmadi' }, { status: 500 })
  }
  
  try {
    const body = await req.json()
    // Process the update with Telegraf
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Failed to process update' }, { status: 500 })
  }
}

// Security: Check token in URL params or headers in production
export async function GET() {
  return NextResponse.json({ status: 'Webhook is running. Bot token: ' + (bot ? 'Set' : 'Missing') })
}
