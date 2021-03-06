var properties = require("./properties");
var winston = require("winston");


module.exports.getLogger = function() {
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: properties.logLevel,
        json: true,
        stringify: true,
        timestamp: true
      })
    ]
  });
  return logger;
};


