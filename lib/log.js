var properties = require("./properties");
var loglevel = require("loglevel");

var localLogger = loglevel.getLogger("local")
localLogger.setLevel(properties.logLevel);

module.exports = localLogger;


