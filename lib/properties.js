var rc = require("rc");
var log = require("loglevel");

var properties = rc("spotinst_lambda",{
  oauthUrl: "https://oauth.spotinst.io",
  restUrl: "https://api.spotinst.io",
  logLevel: "info"
});

log.setLevel(properties.logLevel);

module.exports = properties;
