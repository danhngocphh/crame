const winston = require('winston');

const config = require('../../config');

const transports = [];
if (config.env === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    })
  );
} else {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format(info => {
      info.level = info.level.toUpperCase()
      return info;
    })(),
    winston.format.errors({
      stack: true,
    }),
    winston.format.splat(),
    winston.format.json(),
    winston.format.colorize(),
  ),
  transports,
});

module.exports = logger;
