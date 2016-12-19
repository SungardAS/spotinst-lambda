var rc = require("rc");

var properties = rc("spotinst_lambda",{
  oauthUrl: "https://oauth.spotinst.io",
  restUrl: "https://api.spotinst.io",
  logLevel: "info"
});

module.exports = properties;
