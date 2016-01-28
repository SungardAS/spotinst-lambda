var util = require('./lib/util');


exports.handler = function(event,context) {
  var resourceType = event.resourceType || event.ResourceType;

  if (!resourceType) util.done("resourceType must be set");

  require('./lib/'+resourceType).handler(event,context);
};

exports.elastigroup = function(event,context) {
  require('./lib/elastigroup').handler(event,context);
};
