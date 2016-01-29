var util = require('../util'),
  _ = require('lodash');

module.exports.handler = function(event,context) {
  var requestType = event.RequestType || event.requestType;

  if (!requestType) return util.done("requestType not defined",event,context);

  requestType = requestType.toLowerCase();

  if (!_.includes(['create','update','delete'],requestType))
    return util.done("Invalid requestType: " + requestType,event,context);

  require('./'+requestType.toLowerCase()).handler(event,context);
}
