var handler = require('lambda-formation').resource.create;
var log = require("../../log");
var properties = require("../../properties");
var request = require('request');
var spotUtil = require('../../util');

var create = function (err, event, context) {
  if (err) {
    return spotUtil.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err,tc) {
    if (err) return spotUtil.done(err,event,context);

    var createOptions = {
      method: 'POST',
      url: properties.restUrl + '/events/subscription',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + tc.token
      },
      json: {
        subscription: tc.config
      }
    };

    log.info('Creating subscription: ' + JSON.stringify(tc.config, null, 2));
    request(createOptions, function (err, res, body) {
      spotUtil.validateResponse({
        err: err,
        res: res,
        body: body,
        event: event,
        context: context,
        resource: 'subscription',
        action: 'create',
        successCb: function(spotResponse) {
          spotUtil.done(err,event,context,body,body.response.items[0].id);
        }
      });
    });

  });

};

/* Do not change this function */
module.exports.handler = function (event, context) {
  handler.apply(this, [event, context, create]);
};

