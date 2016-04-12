var handler = require('lambda-formation').resource.create;
var util = require('lambda-formation').util;
var request = require('request');
var spotUtil = require('../../util');

var create = function (err, event, context) {
  if (err) {
    return util.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err,tc) {
    if (err) return util.done(err,event,context);

    var createOptions = {
      method: 'POST',
      url: 'https://api.spotinst.io/events/subscription',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + tc.token
      },
      json: {
        subscription: tc.config
      }
    };
    request(createOptions, function (err, res, body) {
      // TODO better error response, include body message
      if (res.statusCode > 201) return util.done("Subscription creation failed: " + res.statusMessage,event,context);

      util.done(err,event,context,body,body.response.items[0].id);
    });
  });

};

/* Do not change this function */
module.exports.handler = function (event, context) {
  handler.apply(this, [event, context, create]);
};

