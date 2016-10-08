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

logger.infoMerge = function (name, data, request) {
  var result = {};

  result.name = name;
  result.data = data;
  data.timestamp = Date.now();

  if (request) {
    result.request = {
      ip : request.ip,
      method : request.method,
      protocol : request.protocol,
      url : request.originalUrl
    };
  }

  return result;
};
module.exports = { logger: logger, winston: winston };
