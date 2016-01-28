module.exports.handler = function(event,context) {
  require('./'+event.RequestType.toLowerCase()).handler(event,context);
}
