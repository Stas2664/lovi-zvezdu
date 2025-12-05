import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN must be provided!');
  process.exit(1);
}

const bot = new Telegraf(token);
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://your-domain.com';

// Database file to store claimed gifts
const DB_FILE = path.resolve(__dirname, 'gifts_db.json');

// Helper to check if gift is claimed
function isGiftClaimed(giftId: string): boolean {
  if (!fs.existsSync(DB_FILE)) return false;
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  return !!data[giftId];
}

// Helper to mark gift as claimed
function claimGift(giftId: string, userId: number, username: string) {
  let data: any = {};
  if (fs.existsSync(DB_FILE)) {
    data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  }
  data[giftId] = {
    claimedBy: userId,
    username: username,
    claimedAt: new Date().toISOString()
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Image for the Gift Card (Green Star Card)
const GIFT_IMAGE_URL = 'https://cdn-icons-png.flaticon.com/512/8672/8672669.png'; // Beautiful Star Icon as placeholder
// Or use a real banner if you have one.

bot.start(async (ctx) => {
  const payload = ctx.payload;

  // Check if it's a gift link: gift_UNIQUEID_AMOUNT
  if (payload && payload.startsWith('gift_')) {
    const parts = payload.split('_');
    // Format: gift_ID_AMOUNT
    const giftId = parts[1]; 
    const amount = parts[2];

    if (!giftId || !amount) {
      return ctx.reply('⚠️ Некорректная ссылка на подарок.');
    }

    // 1. Check if already claimed
    if (isGiftClaimed(giftId)) {
       return ctx.replyWithPhoto('https://cdn-icons-png.flaticon.com/512/1828/1828843.png', {
         caption: `🚫 **Этот чек уже был активирован!**\n\nКто-то оказался быстрее вас.`,
         parse_mode: 'Markdown'
       });
    }

    // 2. Mark as claimed
    claimGift(giftId, ctx.from.id, ctx.from.username || 'Anon');

    // 3. Send Success Message
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

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Bot is running...');
