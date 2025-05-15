import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

/**
 * Logger configuration using Winston for logging bot-related events.
 * - In production, logs are more focused on errors.
 * - In development, logs are more detailed (including debug).
 * - Logs are stored in daily rotated files and in the console.
 */
export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    updates: 5,
  },
  exitOnError: false,
  handleExceptions: true,
  handleRejections: true,
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.printf(({ timestamp, message, stack }) => {
      return `[${moment(timestamp as string).format('DD-MM-YYYY HH:mm:ss')}]: ${stack || message}`;
    }),
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      silent: process.env.NODE_ENV === 'production',
    }),
    new transports.DailyRotateFile({
      level: 'updates',
      filename: 'logs/bot/updates/%DATE%.log',
      format: format.json(),
      datePattern: 'YYYY.MM.DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/bot/errors/%DATE%.log',
      datePattern: 'YYYY.MM.DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: 'logs/bot/exceptions/%DATE%.log',
      datePattern: 'YYYY.MM.DD',
    }),
  ],
  rejectionHandlers: [
    new transports.DailyRotateFile({
      filename: 'logs/bot/rejections/%DATE%.log',
      datePattern: 'YYYY.MM.DD',
    }),
  ],
});
