import 'dotenv/config';
import http from 'http';
import bot from './bot';
import { BOT_WEBHOOK_DOMAIN, BOT_WEBHOOK_ENABLE, BOT_WEBHOOK_PATH } from './bot/config';
import routes from './routes';
import { logger } from './utils';

const server = http.createServer(routes);

server.on('listening', async () => {
  try {
    await bot.launch({
      dropPendingUpdates: true,
      webhook: BOT_WEBHOOK_ENABLE
        ? {
            path: BOT_WEBHOOK_PATH,
            domain: BOT_WEBHOOK_DOMAIN,
          }
        : undefined,
    });
    logger.info('Telegram bot launched');
  } catch (error) {
    logger.error(error);
  }

  // Set bot commands
  try {
    await bot.telegram.deleteMyCommands();
    await bot.telegram.setMyCommands(
      [
        { command: '/start', description: 'Start interaction with the bot' },
        { command: '/help', description: 'Display help information' },
        { command: '/settings', description: 'Display bot settings' },
        { command: '/example1', description: 'Example 1: Inline keyboard with callback buttons.' },
        { command: '/example2', description: 'Example 2: Custom keyboard with text options.' },
        {
          command: '/example3',
          description: 'Example 3: A base scene with multi-step questions and basic navigation.',
        },
        {
          command: '/example4',
          description: 'Example 4: Wizard scene with multiple steps and user interaction.',
        },
        {
          command: '/back',
          description: 'Go back to the previous step',
        },
        {
          command: '/cancel',
          description: 'Cancel the current operation',
        },
      ],
      {
        scope: { type: 'default' },
        language_code: 'en',
      },
    );

    logger.info('Bot commands have been successfully set up.');
  } catch (error) {
    logger.error('Failed to set up bot commands:', error);
  }
});

/**
 * Graceful shutdown
 */
process.once('SIGINT', () => {
  logger.info('SIGINT received');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  logger.info('SIGTERM received');
  bot.stop('SIGTERM');
});

server.listen(process.env.PORT || 3000);
