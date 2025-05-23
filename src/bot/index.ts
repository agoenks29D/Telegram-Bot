import { Markup, session, SessionStore, Telegraf, TelegramError } from 'telegraf';
import { Redis } from '@telegraf/session/redis';
import { MyContext, MySession } from '@/types';
import { BOT_TOKEN } from './config';
import { logger } from './utils';

const bot = new Telegraf<MyContext>(BOT_TOKEN);

// Initialize session store using Redis
const store: SessionStore<MySession> = Redis<MySession>({
  url: process.env.REDIS_URL,
});

/**
 * Global middleware
 * - Initializes session with default values
 * - Adds full name to the context
 * - Logs incoming updates
 */
bot.use(
  session({
    store,
    defaultSession: () => ({
      firstStart: false,
    }),
  }),
  (ctx, next) => {
    if (ctx.from) {
      ctx.fullName = `${ctx.from.first_name} ${ctx.from.last_name}`.trim();
    }

    // log updates
    logger.log('updates', ctx.update);

    return next();
  },
);

/**
 * Handler for the /start command
 */
bot.start(async (ctx) => {
  const { reply_markup } = Markup.inlineKeyboard([
    Markup.button.url(
      'Add me to your chat',
      `https://t.me/${ctx.botInfo.username}?startgroup=true`,
    ),
  ]);

  const message = `
Here are the available commands:

/start - Start interaction with the bot
/help - Display help information
/settings - Display bot settings
/back - Go back to the previous step
/cancel - Cancel the current operation
  `.trim();

  await ctx.reply(message, { reply_markup });
});

/**
 * Handler for the /settings command
 */
bot.settings(async (ctx) => {
  await ctx.reply('Display bot settings');
});

/**
 * Handler for the /back command
 * (Default response if there's no active process)
 */
bot.command('back', async (ctx) => {
  await ctx.reply('There is no active process to go back to');
});

/**
 * Handler for the /cancel command
 * (Default response if there's no ongoing process)
 */
bot.command('cancel', async (ctx) => {
  await ctx.reply('There is no ongoing process to cancel');
});

/**
 * Handler for the /help command
 */
bot.help(async (ctx) => {
  await ctx.reply('Display bot help');
});

/**
 * Global error handler
 */
bot.catch(async (error, ctx) => {
  if (error instanceof TelegramError) {
    // Log Telegram API errors
    logger.error(error);

    const [, errorCode] = error.description.split(':');
    const errorMessage = `Error: \`${errorCode}\``;

    try {
      // Send error message to user
      const sendError = await ctx.replyWithMarkdownV2(errorMessage);
      setTimeout(async () => {
        await ctx.deleteMessage(sendError.message_id);
      }, 4000);
    } catch (err) {
      // Log any error while sending or deleting the message
      logger.error(err);
    }
  }
});

export default bot;
