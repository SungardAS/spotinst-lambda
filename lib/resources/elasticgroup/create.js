var handler  = require('lambda-formation').resource.create;
var log = require("../../log").getLogger();
var properties = require("../../properties");
var request  = require('request');
var spotUtil = require('../../util');

var create = function(err, event, context) {
  if(err) {
    return spotUtil.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err, tc) {
    if(err) return spotUtil.done(err, event, context);

    log.debug("Spotinst Create Event", event);

    var createOptions = {
      method:  'POST',
      url:     properties.restUrl + '/aws/ec2/group',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + tc.token
      },
      json:    {
        group: tc.config
      }
    };

    log.info('Creating group',JSON.stringify(tc.config, null, 2));
    request(createOptions, function(err, res, body) {
      spotUtil.validateResponse({
        err:       err,
        res:       res,
        body:      body,
        event:     event,
        context:   context,
        resource:  'elasticgroup',
        action:    'create',
        successCb: function(spotResponse) {
          log.debug("Create Success Callback",err,event,body);
          spotUtil.done(err, event, context, body, body.response.items[0].id);
        }
      });
    });
  });
};

/* Do not change this function */
module.exports.handler = function(event, context) {
  log.trace("Entering Spotinst Create Handler");
  handler.apply(this, [event, context, create]);
};

