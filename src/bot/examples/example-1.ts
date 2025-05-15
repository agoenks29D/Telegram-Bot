import { Composer, Markup } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import { generateRandomString } from '@/bot/utils';
import { MyContext } from '@/types';
import { inlineQueryArticles, inlineQueryPhotos } from './inline-query';

const composer = new Composer<MyContext>();

/**
 * Handler for the /example1 command
 * Sends a simple inline keyboard with two buttons.
 * Clicking a button will update the message content.
 */
composer.command('example1', async (ctx) => {
  const { reply_markup } = Markup.inlineKeyboard([
    Markup.button.callback('Button 1', 'Example 1 Callback 1'),
    Markup.button.callback('Button 2', 'Example 1 Callback 2'),
  ]);

  await ctx.reply(
    `This is a simple inline keyboard with two buttons. Click one of them to update the message content.`,
    {
      parse_mode: 'HTML',
      reply_markup,
    },
  );
});

/**
 * Handler for the /example1_callback command
 * Sends a more complex inline keyboard with multiple rows and button formats
 */
composer.command('example1_callback', async (ctx) => {
  const { reply_markup } = Markup.inlineKeyboard([
    [Markup.button.callback('Handle Callback 1', 'example_1_callback_1')],
    [
      Markup.button.callback('Handle Callback 2', 'example_1_callback_2'),
      Markup.button.callback('Handle Callback 3', 'example_1_callback_3'),
    ],
    [Markup.button.callback('Inline Query Example', 'example_1_inline_query')],
    [Markup.button.callback('Handle Callback Other', 'example_1_callback_other')],
    [
      Markup.button.callback('A', 'example_1_callback_1_A'),
      Markup.button.callback('B', 'example_1_callback_1_B'),
      Markup.button.callback('C', 'example_1_callback_1_C'),
      Markup.button.callback('D', 'example_1_callback_1_D'),
    ],
    // Button rows with incrementing numbers
    Array.from({ length: 8 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    Array.from({ length: 7 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    Array.from({ length: 6 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    Array.from({ length: 5 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    Array.from({ length: 4 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    Array.from({ length: 3 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    Array.from({ length: 2 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    Array.from({ length: 1 }, (_, i) =>
      Markup.button.callback(`${i + 1}`, `example_1_callback_2_${i + 1}`),
    ),
    [Markup.button.switchToChat('Switch to another chat (Inline Query)', 'example article')],
    [Markup.button.switchToCurrentChat('Switch in current chat (Inline Query)', 'example article')],
  ]);

  await ctx.reply(
    `This example demonstrates a more complex inline keyboard layout with multiple types of buttons. Try clicking them to see how each one behaves.`,
    {
      reply_markup,
      reply_parameters: {
        message_id: ctx.msgId,
      },
    },
  );
});

/**
 * Handles the "example_1_inline_query" button action
 * Sends a message with two inline query buttons: one for articles and one for photos.
 * These buttons use the "switchToCurrentChat" method to insert pre-filled queries into the input field.
 */
composer.action('example_1_inline_query', async (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.switchToCurrentChat('Article', 'example article'),
    Markup.button.switchToCurrentChat('Photo', 'example photo'),
  ]);

  await ctx.answerCbQuery();
  await ctx.reply('This is an example of an inline query.', keyboard);
});

/**
 * Handles basic callback queries from /example1
 * Updates the message with a unique string so Telegram detects a change
 */
composer.on(callbackQuery('data'), async (ctx, next) => {
  const regex = /Example 1 Callback \d/;
  const isExample1 = regex.test(ctx.callbackQuery.data);

  if (!isExample1) return next();

  await ctx.answerCbQuery(`You selected: ${ctx.callbackQuery.data}`, {
    show_alert: false,
  });

  const { reply_markup } = Markup.inlineKeyboard([
    [
      Markup.button.callback('Button 1', 'Example 1 Callback 1 (NEW) ✨'),
      Markup.button.callback('Button 2', 'Example 1 Callback 2 (NEW) ✨'),
    ],
    [
      Markup.button.callback('Button 3', 'Example 1 Callback 3 (NEW) ✨'),
      Markup.button.callback('Button 4', 'Example 1 Callback 4 (NEW) ✨'),
    ],
  ]);

  const randomString = generateRandomString(4);
  const message = `To force Telegram to update the message, we include a unique string: <code>${randomString}</code>. This ensures the message content is different from before.
  \n<b>Try the extended example:</b>
  👉 /example1_callback for multiple callback types`;

  await ctx.editMessageText(message, {
    parse_mode: 'HTML',
    reply_markup,
  });
});

/**
 * Handles structured callback data from the extended keyboard (/example1_callback)
 * Parses the button type and detail to provide a specific response
 */
composer.on(callbackQuery('data'), async (ctx, next) => {
  const data = ctx.callbackQuery.data;
  const regex = /^example_1_callback_(\d|other|[13])(?:_([A-D]|\d+))?$/;
  const match = data.match(regex);

  if (!match) return next();

  const type = match[1];
  const detail = match[2];

  let message = 'Example 1 callback ';
  let show_alert: boolean = false;

  if (type === 'other') {
    message += 'other';
    show_alert = true;
  } else if (type === '1' && detail && /^[A-D]$/.test(detail)) {
    message += `1 ${detail}`;
  } else if (type === '2' && detail && /^\d+$/.test(detail)) {
    message += `2 ${detail}`;
  } else {
    message += type;
  }

  await ctx.answerCbQuery(`You selected: ${message}`, {
    show_alert,
  });
});

/**
 * Handles custom-formatted callback data
 * Expected format: example-1-article-2-select or example-2-photo-5-open-1
 */
composer.on(callbackQuery('data'), async (ctx, next) => {
  const data = ctx.callbackQuery.data;
  const regex = /example-(\d+)-(article|photo)-(\d+)-(\w+)(?:-(\d+))?/;
  const match = data.match(regex);

  if (!match) return next();

  const [, exampleNumber, type, articleNumber, action, optionNumber] = match;
  const response =
    `You selected example ${exampleNumber}: ${type} #${articleNumber}, action: ${action}` +
    (optionNumber ? ` (option ${optionNumber})` : '');

  await ctx.answerCbQuery(response);
});

/**
 * Handles inline queries like "example article" or "example photo"
 */
composer.inlineQuery(/example (\w+)/, async (ctx, next) => {
  const match = ctx.match;
  if (!match) return next();

  if (match[1] === 'article') {
    await ctx.answerInlineQuery(inlineQueryArticles, {
      cache_time: 0,
      button: {
        text: 'View Articles',
        start_parameter: 'inline_query_articles',
      },
    });
  } else if (match[1] === 'photo') {
    await ctx.answerInlineQuery(inlineQueryPhotos, {
      cache_time: 0,
      button: {
        text: 'View Photos',
        start_parameter: 'inline_query_photos',
      },
    });
  }

  return next();
});

export default composer;
