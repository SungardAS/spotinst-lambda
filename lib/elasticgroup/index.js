var util = require('../util');

module.exports.handler = function(event,context) {
  var requestType = event.RequestType || event.requestType;

  if (!requestType) util.done("requestType not defined");

  require('./'+requestType.toLowerCase()).handler(event,context);
}
