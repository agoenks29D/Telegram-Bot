export * from './logger';

/**
 * Sleeps for a specified duration.
 * @param ms - The number of milliseconds to delay.
 * @returns A Promise that resolves after the delay.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
