var _ = require('lodash'),
  _s = require('underscore.string'),
  util = require('./lib/util');


exports.handler = function(event,context) {
  var resourceType = event.resourceType || event.ResourceType;

  if (!resourceType)
    return util.done("resourceType must be set",event,context);

  if (_s.startsWith(resourceType,'Custom',event,context))
    resourceType = _s.strRight(resourceType,'Custom::');

  if (!_.includes(['elasticgroup'],resourceType))
    return util.done("Invalid resourceType:" + resourceType,event,context);

  require('./lib/'+resourceType).handler(event,context);
};

exports.elastigroup = function(event,context) {
  require('./lib/elastigroup').handler(event,context);
};
