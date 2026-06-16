import { Composer, Context, MiddlewareFn, NarrowedContext } from 'telegraf';
import { Update } from 'telegraf/types';

type MessageContext<C extends Context> = NarrowedContext<C, Update.MessageUpdate>;

declare module 'telegraf' {
  interface Composer<C extends Context> {
    onCommand(
      command: string,
      handler: MiddlewareFn<MessageContext<C> & { payloads?: string[] }>,
    ): this;
  }
}

/**
 * enableCustomCommands function enables custom command handling
 * It adds a new onCommand method to the Composer class and sets up middleware
 * to process commands in the message text (both normal and prefixed commands).
 * @param composer - The Composer instance where commands will be handled.
 * @returns The Composer instance with custom command functionality.
 */
export function enableCustomCommands<C extends Context>(composer: Composer<C>) {
  const customCommand = new Map<
    string,
    MiddlewareFn<MessageContext<C> & { payloads?: string[] }>
  >();

  composer.use(async (ctx, next) => {
    const text = 'message' in ctx && ctx.msg && 'text' in ctx.msg ? ctx.msg.text : undefined;

    if (text?.startsWith('!') || text?.startsWith('/')) {
      const commandText = text.slice(1);
      const [rawCmd, ...args] = commandText.split(' ');
      const [cmd, mention] = rawCmd.split('@');

      if (mention && mention.toLowerCase() !== ctx.botInfo.username.toLowerCase()) {
        return next();
      }

      const handler = customCommand.get(cmd);
      if (handler) {
        (ctx as MessageContext<C> & { payloads?: string[] }).payloads = args;
        return handler(ctx as MessageContext<C> & { payloads?: string[] }, next);
      }
    }

    return next();
  });

  /**
   * onCommand method allows the registration of custom commands and their handlers.
   * @param command - The command to register.
   * @param handler - The handler function that will be executed when the command is called.
   * @returns The Composer instance.
   */
  composer.onCommand = (
    command: string,
    handler: MiddlewareFn<MessageContext<C> & { payloads?: string[] }>,
  ) => {
    customCommand.set(command, handler);
    return composer;
  };

  return composer;
}
