import { NextResponse } from 'next/server'
import { Telegraf } from 'telegraf'

// Initialize bot if token exists
const bot = process.env.TELEGRAM_BOT_TOKEN ? new Telegraf(process.env.TELEGRAM_BOT_TOKEN) : null

const WELCOME_TEXT = '🌱 Agro AI ga xush kelibsiz! Sizga qishloq xo\u2019zaligi va chorvachilik bo\u2019yicha yordam beraman.'
const APP_URL = 'https://agro-ai-three.vercel.app'

if (bot) {
  // /start command
  bot.start(async (ctx) => {
    await ctx.reply(WELCOME_TEXT, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌿 AGRO AI MASLAHATCHINI OCHISH', url: APP_URL }]
        ]
      }
    })
  })

  // Barcha boshqa xabarlarga ham bir xil javob
  bot.on('message', async (ctx) => {
    await ctx.reply(WELCOME_TEXT, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌿 AGRO AI MASLAHATCHINI OCHISH', url: APP_URL }]
        ]
      }
    })
  })
}

export async function POST(req: Request) {
  if (!bot) {
    return NextResponse.json({ error: 'Bot token topilmadi' }, { status: 500 })
  }
  
  try {
    const body = await req.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Failed to process update' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook is running. Bot token: ' + (bot ? 'Set' : 'Missing') })
}
