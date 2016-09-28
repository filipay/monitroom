var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      name: 'debug-console',
      level: ['debug']
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'logs/monitroom-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'logs/monitroom-error.log',
      level: 'error'
    })
  ]
});

module.exports = { logger: logger, winston: winston };
