var properties = require("./properties");
var loglevel = require("loglevel");


module.exports.getLogger = function() {
  var localLogger = loglevel.getLogger("local");
  localLogger.setLevel(properties.logLevel);
  return localLogger;
};


