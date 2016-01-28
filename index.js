var request = require('request');


//exports.cloudformation = function(event, context) {
  //require('./lib/request-types/'+event.RequestType).handler(event, context);
//};

exports.elastigroup = function(event,context) {
  require('./lib/elastigroup').handler(event,context);
};
