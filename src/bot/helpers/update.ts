import { MiddlewareFn } from 'telegraf';
import { MyContext, StickerMessageUpdate, TextMessageUpdate } from '@/types';

/**
 * Middleware to ensure the message contains a photo.
 * If the message contains a photo, it will execute the handler.
 * If not, it will reply to the user asking them to send a photo.
 *
 * @param handler - The middleware handler that will be executed if the message contains a photo.
 * @returns The middleware function that checks for photo in the message.
 */
export const withPhotoMessage = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'photo' in ctx.message) {
      return handler(ctx, next);
    } else {
      await ctx.reply('Please send a photo.');
    }
  };
};

/**
 * Middleware to ensure the message contains a voice note.
 * Runs the handler when voice is present, or prompts otherwise.
 *
 * @param handler - Middleware handler for voice messages.
 * @returns Middleware function for filtering voice note messages.
 */
export const withVoiceMessage = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'voice' in ctx.message) {
      return handler(ctx, next);
    } else {
      await ctx.reply('Please send a voice message.');
    }
  };
};

/**
 * Middleware to ensure the message contains a video.
 * If the message contains a video, it will execute the handler.
 * If not, it will reply to the user asking them to send a video.
 *
 * @param handler - The middleware handler that will be executed if the message contains a video.
 * @returns The middleware function that checks for video in the message.
 */
export const withVideoMessage = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'video' in ctx.message) {
      return handler(ctx, next);
    } else {
      await ctx.reply('Please send a video.');
    }
  };
};

/**
 * Middleware to ensure the message contains a document file.
 * If the message contains a document, it will execute the handler.
 * If not, it will reply to the user asking them to send a document.
 *
 * @param handler - The middleware handler that will be executed if the message contains a document.
 * @returns The middleware function that checks for document in the message.
 */
export const withDocumentMessage = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'document' in ctx.message) {
      return handler(ctx, next);
    } else {
      await ctx.reply('Please send a document file.');
    }
  };
};

/**
 * Middleware to ensure the message contains a location.
 * If the message contains a location, it will execute the handler.
 * If not, it will reply to the user asking them to share a location.
 *
 * @param handler - The middleware handler that will be executed if the message contains a location.
 * @returns The middleware function that checks for location in the message.
 */
export const withLocationMessage = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'location' in ctx.message) {
      return handler(ctx, next);
    } else {
      await ctx.reply('Please share your location.');
    }
  };
};

/**
 * Middleware to ensure the update contains a poll.
 * If a poll is received, it executes the handler.
 * Otherwise, informs the user that a poll is expected.
 *
 * @param handler - The middleware handler to run when a poll is received.
 * @returns Middleware function for filtering poll messages.
 */
export const withPollMessage = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if ('poll' in ctx.update) {
      return handler(ctx, next);
    } else {
      await ctx.reply('Please send a poll.');
    }
  };
};

/**
 * Middleware to ensure the message contains a contact.
 * Executes handler if a contact is received, otherwise prompts the user.
 *
 * @param handler - The middleware handler to run when contact is present.
 * @returns Middleware function for filtering contact messages.
 */
export const withContactMessage = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'contact' in ctx.message) {
      return handler(ctx, next);
    } else {
      await ctx.reply('Please share a contact.');
    }
  };
};

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
export const withTextMessage = (
  handler: MiddlewareFn<MyContext<TextMessageUpdate>>,
): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (ctx.message && 'text' in ctx.message) {
      return handler(ctx as MyContext<TextMessageUpdate>, next);
    } else {
      await ctx.reply('Please respond with text.');
    }
  };
};

/**
 * Middleware that allows execution only if the user is an admin in a group chat.
 * Useful for restricting features to admins only.
 *
 * @param handler - Middleware handler for admin users.
 * @returns Middleware function that checks admin status.
 */
export const withAdminOnly = (handler: MiddlewareFn<MyContext>): MiddlewareFn<MyContext> => {
  return async (ctx, next) => {
    if (!ctx.chat || ctx.chat.type === 'private') {
      return ctx.reply('This command can only be used in group chats.');
    }

    try {
      if (!ctx.from) {
        await ctx.reply('User info not available.');
        return;
      }

      const member = await ctx.getChatMember(ctx.from.id);
      if (['administrator', 'creator'].includes(member.status)) {
        return handler(ctx, next);
      } else {
        return ctx.reply('You must be an admin to use this command.');
      }
    } catch (err) {
      console.error(err);
      return ctx.reply('Unable to verify admin status.');
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
