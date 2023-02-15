// eslint-disable-next-line import/no-extraneous-dependencies
const { format, createLogger, transports } = require('winston');

const { timestamp, combine, printf, errors, colorize } = format;

// eslint-disable-next-line no-shadow
const logFormat = printf(({ message, level, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()]
});

module.exports = logger;
