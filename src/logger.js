import chalk from 'chalk';

/**
 * Creates a named logger with colored output and icons.
 * @param {string} name - The name of the logger (e.g., module or component).
 * @returns {Object} Logger object with log, info, warn, error methods.
 */
export function createLogger(name) {
  const icons = {
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    log: '✅',
  };

  const formatTime = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

  const formatMessage = (icon, message) => `[${formatTime()}] ${icon} ${name}: ${message}`;

  return {
    log: (message) => console.log(chalk.blue(formatMessage(icons.log, message))),
    info: (message) => console.info(chalk.cyan(formatMessage(icons.info, message))),
    warn: (message) => console.warn(chalk.yellow(formatMessage(icons.warn, message))),
    error: (message) => console.error(chalk.red(formatMessage(icons.error, message))),
  };
}
