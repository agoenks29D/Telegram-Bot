import { Markup, session, SessionStore, Telegraf, TelegramError } from 'telegraf';
import { ChatMemberRestricted } from 'telegraf/types';
import { Redis } from '@telegraf/session/redis';
import { ChatAdministratorModel, ChatModel } from '@/models';
import { ExtendedChatMemberAdministrator, MyContext, MySession } from '@/types';
import { BOT_TOKEN } from './config';
import { logger } from './utils';

const bot = new Telegraf<MyContext>(BOT_TOKEN);

// Initialize session store using Redis
const store: SessionStore<MySession> = Redis<MySession>({
  url: process.env.REDIS_URL,
});

/**
 * Handler for the /start command
 */
bot.start(async (ctx) => {
  if (ctx.chat.type === 'private' && !ctx.session.firstStart) {
    ctx.session.firstStart = true;
    const firstName = ctx.from.first_name;
    const lastName = ctx.from.last_name;

    await ChatModel.create({
      chatId: ctx.chat.id,
      type: ctx.chat.type,
      firstName,
      lastName,
      status: 'available',
    });
  }

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
 * Triggered when the bot is added, promoted, or restricted in a chat (channel, group or supergroup)
 */
bot.on('my_chat_member', async (ctx, next) => {
  const myChatMember = ctx.update.my_chat_member;
  const newChatMember = myChatMember.new_chat_member;

  if (['member', 'administrator'].includes(newChatMember.status)) {
    await ChatModel.upsert({
      chatId: ctx.chat.id,
      type: ctx.chat.type,
      title: ctx.chat.type !== 'private' ? ctx.chat.title : null,
      status: 'available',
    });

    await ChatAdministratorModel.destroy({ where: { chatId: ctx.chat.id } });

    const chatAdministrators = await ctx.getChatAdministrators();
    if (newChatMember.status === 'administrator') {
      const customData = Object.fromEntries(
        Object.entries(newChatMember).filter(
          ([key]) => key.startsWith('can_') || key.startsWith('is_'),
        ),
      ) as ExtendedChatMemberAdministrator;

      await ChatAdministratorModel.create({
        chatId: ctx.chat.id,
        userId: ctx.botInfo.id,
        firstName: ctx.botInfo.first_name,
        status: newChatMember.status,
        customData,
      });
    }

    chatAdministrators.forEach(async (chatAdministrator) => {
      if (chatAdministrator.user.id !== ctx.botInfo.id) {
        await ChatAdministratorModel.create({
          chatId: ctx.chat.id,
          userId: chatAdministrator.user.id,
          firstName: chatAdministrator.user.first_name,
          lastName: chatAdministrator.user.last_name,
          status: chatAdministrator.status,
        });
      }
    });
  } else if (newChatMember.status === 'restricted') {
    const restricted = Object.fromEntries(
      Object.entries(newChatMember).filter(([key]) => key.startsWith('can_')),
    ) as ChatMemberRestricted;

    await ChatModel.update({ restricted }, { where: { chatId: ctx.chat.id } });
  }

  // Pass to next middleware
  return next();
});

/**
 * Triggered when the bot is removed, left, or unblocked from a chat
 */
bot.on('my_chat_member', async (ctx) => {
  const myChatMember = ctx.update.my_chat_member;
  const oldChatMember = myChatMember.old_chat_member;
  const newChatMember = myChatMember.new_chat_member;

  if (['kicked', 'left'].includes(newChatMember.status)) {
    await ChatModel.update(
      {
        status: 'unavailable',
      },
      { where: { chatId: ctx.chat.id } },
    );
  }

  if (oldChatMember.status === 'kicked') {
    await ChatModel.update({ status: 'available' }, { where: { chatId: ctx.chat.id } });
  }
});

/**
 * Triggered when the bot is added, promoted, or restricted in a chat (channel, group or supergroup)
 */
bot.on('my_chat_member', async (ctx, next) => {
  const myChatMember = ctx.update.my_chat_member;
  const newChatMember = myChatMember.new_chat_member;

  if (['member', 'administrator'].includes(newChatMember.status)) {
    await ChatModel.upsert({
      chatId: ctx.chat.id,
      type: ctx.chat.type,
      title: ctx.chat.type !== 'private' ? ctx.chat.title : null,
      status: 'available',
    });

    await ChatAdministratorModel.destroy({ where: { chatId: ctx.chat.id } });

    const chatAdministrators = await ctx.getChatAdministrators();
    if (newChatMember.status === 'administrator') {
      const customData = Object.fromEntries(
        Object.entries(newChatMember).filter(
          ([key]) => key.startsWith('can_') || key.startsWith('is_'),
        ),
      ) as ExtendedChatMemberAdministrator;

      await ChatAdministratorModel.create({
        chatId: ctx.chat.id,
        userId: ctx.botInfo.id,
        firstName: ctx.botInfo.first_name,
        status: newChatMember.status,
        customData,
      });
    }

    chatAdministrators.forEach(async (chatAdministrator) => {
      if (chatAdministrator.user.id !== ctx.botInfo.id) {
        await ChatAdministratorModel.create({
          chatId: ctx.chat.id,
          userId: chatAdministrator.user.id,
          firstName: chatAdministrator.user.first_name,
          lastName: chatAdministrator.user.last_name,
          status: chatAdministrator.status,
        });
      }
    });
  } else if (newChatMember.status === 'restricted') {
    const restricted = Object.fromEntries(
      Object.entries(newChatMember).filter(([key]) => key.startsWith('can_')),
    ) as ChatMemberRestricted;

    await ChatModel.update({ restricted }, { where: { chatId: ctx.chat.id } });
  }

  // Pass to next middleware
  return next();
});

/**
 * Triggered when the bot is removed, left, or unblocked from a chat
 */
bot.on('my_chat_member', async (ctx) => {
  const myChatMember = ctx.update.my_chat_member;
  const oldChatMember = myChatMember.old_chat_member;
  const newChatMember = myChatMember.new_chat_member;

  if (['kicked', 'left'].includes(newChatMember.status)) {
    await ChatModel.update(
      {
        status: 'unavailable',
      },
      { where: { chatId: ctx.chat.id } },
    );
  }

  if (oldChatMember.status === 'kicked') {
    await ChatModel.update({ status: 'available' }, { where: { chatId: ctx.chat.id } });
  }
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
