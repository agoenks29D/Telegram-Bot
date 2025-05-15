import { Composer, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { MyContext } from '@/types';

const composer = new Composer<MyContext>();

/**
 * Command handler for /example2
 * Displays a custom reply keyboard (not inline).
 * Useful for collecting structured answers with limited options.
 */
composer.command('example2', async (ctx) => {
  const keyboard = Markup.keyboard([
    ['Example 2 Option 1', 'Example 2 Option 2'],
    ['Example 2 Option 3', 'Example 2 Option 4'],
  ])
    .oneTime()
    .resize();

  await ctx.reply('📌 Please choose one of the options from the keyboard below:', keyboard);
});

/**
 * Handles plain text responses from the user
 * If the message matches one of the expected options, it replies and removes the keyboard
 */
composer.on(message('text'), async (ctx, next) => {
  const regex = /^Example 2 Option \d$/;
  const isExample2 = regex.test(ctx.message.text);

  if (!isExample2) {
    return next(); // Message doesn't match expected options
  }

  // Escape MarkdownV2 special characters
  const safeText = ctx.message.text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');

  await ctx.reply(`✅ You selected: \`${safeText}\``, {
    parse_mode: 'MarkdownV2',
    ...Markup.removeKeyboard(),
  });
});

export default composer;
