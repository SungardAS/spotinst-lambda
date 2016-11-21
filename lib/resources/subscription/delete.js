var _ = require('lodash');
var handler = require('lambda-formation').resource.delete;
var util = require('lambda-formation').util;
var request = require('request');
var spotUtil = require('../../util');

var destroy = function (err, event, context) {
  if (err) {
    return spotUtil.done(err);
  }

  spotUtil.getToken(event, function(err,token) {
    if (err) return spotUtil.done(err,event,context);

    var refId = event.id || event.PhysicalResourceId;

    // Let CloudFormation rollbacks happen for failed stacks
    if (event.StackId && !_.startsWith(refId,'sis'))
      return spotUtil.done(null,event,context);

    var createOptions = {
      method: 'DELETE',
      url: 'https://api.spotinst.io/events/subscription/'+refId,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };

    console.log('Deleting subscription ' + refId);
    request(createOptions, function (err, res, body) {
      spotUtil.validateResponse({
        err: err,
        res: res,
        body: body,
        event: event,
        context: context,
        resource: 'subscription',
        action: 'delete',
        successCb: function(spotResponse) {
          // Ensure JSON
          body = JSON.parse(body.toString());

          spotUtil.done(err,event,context,body);
        }
      });
    });

  });
};

/* Do not change this function */
module.exports.handler = function (event, context) {
  handler.apply(this, [event, context, destroy]);
};

