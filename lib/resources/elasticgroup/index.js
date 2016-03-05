var resourceHandler = require('lambda-formation').resource.handler;

module.exports.handler = function () {
  resourceHandler.apply(this, arguments);
};
