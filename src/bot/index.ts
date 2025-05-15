import { Markup, session, SessionStore, Telegraf, TelegramError } from 'telegraf';
import { Redis } from '@telegraf/session/redis';
import { MyContext, MySession } from '@/types';
import { BOT_TOKEN } from './config';
import { example1, example2, example3, example4 } from './examples';
import { logger } from './utils';

const bot = new Telegraf<MyContext>(BOT_TOKEN);
const store: SessionStore<MySession> = Redis<MySession>({
  url: process.env.REDIS_URL,
});

bot.start(async (ctx) => {
  const { reply_markup } = Markup.inlineKeyboard([
    Markup.button.url(
      'Add me to your chat',
      `https://t.me/${ctx.botInfo.username}?startgroup=true`,
    ),
  ]);

  await ctx.reply('Start', {
    reply_markup,
  });
});

bot.settings(async (ctx) => {
  await ctx.reply('Display bot settings');
});

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
 * Load examples
 */
bot.use(example1, example2, example3, example4);

/**
 * Back command for default
 */
bot.command('back', async (ctx) => {
  await ctx.reply('There is no active process to go back to');
});

/**
 * Cancel command for default
 */
bot.command('cancel', async (ctx) => {
  await ctx.reply('There is no ongoing process to cancel');
});

/**
 * Help command for default
 */
bot.help(async (ctx) => {
  await ctx.reply('Display bot help');
});

/**
 * Bot error handler
 */
bot.catch(async (error, ctx) => {
  if (error instanceof TelegramError) {
    // create error log
    logger.error(error);

    // display error
    const [, errorCode] = error.description.split(':');
    const errorMessage = `Error: \`${errorCode}\``;

    try {
      const sendError = await ctx.replyWithMarkdownV2(errorMessage);
      setTimeout(async () => {
        await ctx.deleteMessage(sendError.message_id);
      }, 4000);
    } catch (err) {
      // create error log
      logger.error(err);
    }
  }
});

export default bot;
