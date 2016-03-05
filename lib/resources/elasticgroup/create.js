var handler = require('lambda-formation').resource.create;
var util = require('lambda-formation').util;
var request = require('request');
var spotUtil = require('../../util');

/*
  Here is a skelton of what the create function might look like.
  Change to fit your needs.
*/
var create = function (err, event, context) {
  if (err) {
    return util.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err,tc) {
    if (err) return util.done(err,event,context);

    var createOptions = {
      method: 'POST',
      url: 'https://www.spotinst.com:8081/aws/ec2/group',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + tc.token
      },
      json: {
        group: tc.config
      }
    };
    request(createOptions, function (err, res, body) {
      // TODO better error response, include body message
      if (res.statusCode > 201) return util.done("Elasticgroup creation failed: " + res.statusMessage,event,context);

      util.done(err,event,context,body,body.response.items[0].id);
    });
  });

};

/* Do not change this function */
module.exports.handler = function (event, context) {
  handler.apply(this, [event, context, create]);
};

