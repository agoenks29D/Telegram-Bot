import { MiddlewareFn } from 'telegraf';
import { MyContext, StickerMessageUpdate, TextMessageUpdate } from '@/types';

/**
 * Middleware to ensure the message contains a sticker.
 * If the message is a sticker, it will execute the handler.
 * If not, it will reply to the user asking them to send a sticker.
 *
 * @param handler - The middleware handler that will be executed if the message is a sticker.
 * @returns The middleware function that checks for stickers in the message.
 */
export const withStickerMessage = (
  handler: MiddlewareFn<MyContext<StickerMessageUpdate>>,
): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'sticker' in ctx.message) {
      return handler(ctx as MyContext<StickerMessageUpdate>, next);
    } else {
      await ctx.reply('Please send a sticker.');
    }
  };
};

/**
 * Middleware to ensure the message contains text.
 * If the message contains text, it will execute the handler.
 * If not, it will reply to the user asking them to respond with text.
 *
 * @param handler - The middleware handler that will be executed if the message is text.
 * @returns The middleware function that checks for text in the message.
 */
export const withTextMessage: (
  handler: MiddlewareFn<MyContext<TextMessageUpdate>>,
) => MiddlewareFn<MyContext> = (handler) => {
  return async (ctx, next) => {
    if (ctx.message && 'text' in ctx.message) {
      return handler(ctx as MyContext<TextMessageUpdate>, next);
    } else {
      await ctx.reply('Please respond with text.');
    }
  };
};

/**
 * Middleware wrapper that only executes the given handler
 * if the current chat type matches one of the allowed types.
 *
 * This is useful for running middleware only in private chats,
 * groups, or supergroups without blocking other middleware in the chain.
 *
 * @param types - Allowed chat types (e.g. ['private'], ['group', 'supergroup'])
 * @param handler - The middleware to run if chat type matches
 * @returns Middleware function that filters by chat type
 */
export const withChatType = (
  types: Array<'private' | 'group' | 'supergroup' | 'channel'>,
  handler: MiddlewareFn<MyContext>,
): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.chat && 'type' in ctx.chat && types.includes(ctx.chat.type)) {
      return handler(ctx, next);
    }
    return next();
  };
};
