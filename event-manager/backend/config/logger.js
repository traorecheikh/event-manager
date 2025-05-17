const pino = require('pino');
const path = require('path');

const transport = pino.transport({
  targets: [
    // Development logging with pretty-print to console
    ...(process.env.NODE_ENV === 'development' ? [{
      target: 'pino-pretty',
      level: 'debug',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      }
    }] : []),
    // File logging regardless of environment
    {
      target: 'pino/file',
      level: 'info',
      options: { destination: path.join(__dirname, '../logs/app.log') }
    }
  ]
});

const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
}, transport);

module.exports = logger;
