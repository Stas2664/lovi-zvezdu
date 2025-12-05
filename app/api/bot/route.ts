import { Telegraf, Markup } from 'telegraf';
import { NextRequest, NextResponse } from 'next/server';

// Initialize bot
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN is not defined');
}
const bot = new Telegraf(token);
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://google.com';

// --- BOT LOGIC STARTS HERE ---

bot.start(async (ctx) => {
  const payload = ctx.payload;

  // Check gift link
  if (payload && payload.startsWith('gift_')) {
    const parts = payload.split('_');
    const giftId = parts[1]; 
    const amount = parts[2];

    if (!giftId || !amount) {
       return ctx.reply('⚠️ Некорректная ссылка.');
    }

    // Note: On Vercel (Serverless), saving to a local JSON file won't work permanently 
    // (files are reset after execution). For a real production app, you need a database (like MongoDB/Postgres).
    // For now, we will just show the success message to demonstrate UI.
    
    await ctx.replyWithPhoto('https://img.freepik.com/premium-vector/3d-star-icon-vector-render-yellow-soft-shape_175086-1363.jpg', {
      caption: `✅ **Вы успешно получили ${amount}** ⭐️\n\nОни добавлены в ваш инвентарь.`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.webApp('🚀 Открыть кошелек', WEB_APP_URL)
      ])
    });

  } else {
    ctx.reply(
      'Добро пожаловать в ЛОВИ ЗВЕЗДУ! ⭐️',
      Markup.keyboard([
        Markup.button.webApp('Открыть приложение', WEB_APP_URL),
      ]).resize()
    );
  }
});

bot.on('contact', (ctx) => {
    if (ctx.message.contact.user_id === ctx.from.id) {
        ctx.reply('Спасибо! Доступ открыт.', Markup.removeKeyboard());
    }
});

// --- SERVERLESS HANDLER ---

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling update', error);
    return NextResponse.json({ ok: false, error: 'Failed to handle update' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Bot API is running' });
}

