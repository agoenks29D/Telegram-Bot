/**
 * Bot token
 */
export const BOT_TOKEN: string = process.env.BOT_TOKEN || '';

/**
 * Bot session store
 */
export const BOT_STORE: string = process.env.BOT_STORE || 'redis';

/**
 * Bot webhook path
 */
export const BOT_WEBHOOK_PATH: string = process.env.BOT_WEBHOOK_PATH || '/';

/**
 * Bot webhook domain
 */
export const BOT_WEBHOOK_DOMAIN: string = process.env.BOT_WEBHOOK_DOMAIN || '';

/**
 * Bot webhook enable
 */
export const BOT_WEBHOOK_ENABLE: boolean = process.env.BOT_WEBHOOK_ENABLE === 'true';
