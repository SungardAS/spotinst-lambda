var properties = require("./properties");
var winston = require("winston");


module.exports.getLogger = function() {
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: properties.logLevel,
        json: false,
        stringify: true,
        timestamp: true,
        prettyPrint: true
      })
    ]
  });
  return logger;
};


