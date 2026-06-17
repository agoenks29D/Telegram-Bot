import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

/**
 * Logger configuration using Winston for application and service logging.
 * Supports custom logging contexts such as app, bot, express, or other modules.
 * - In production, logs are more focused on errors.
 * - In development, logs are more detailed (including debug).
 * - Logs are stored in daily rotated files and in the console.
 */
export const logger = (context: 'app' | 'bot') => {
  return createLogger({
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
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
        silent: process.env.NODE_ENV === 'production',
      }),
      new transports.DailyRotateFile({
        level: 'error',
        filename: `logs/${context}/errors/%DATE%.log`,
        datePattern: 'YYYY.MM.DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
    exceptionHandlers: [
      new transports.DailyRotateFile({
        filename: `logs/${context}/exceptions/%DATE%.log`,
        datePattern: 'YYYY.MM.DD',
      }),
    ],
    rejectionHandlers: [
      new transports.DailyRotateFile({
        filename: `logs/${context}/rejections/%DATE%.log`,
        datePattern: 'YYYY.MM.DD',
      }),
    ],
  });
};
