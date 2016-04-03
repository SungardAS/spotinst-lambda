var handler = require('lambda-formation').resource.create;
var util = require('lambda-formation').util;
var request = require('request');
var spotUtil = require('../../util');

/*
  Here is a skelton of what the update function might look like.
  Change to fit your needs.
*/
var update = function (err, event, context) {
  if (err) {
    return util.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err,tc) {
    if (err) return util.done(err,event,context);

    delete tc.config.compute.product;

    var groupId = event.groupId || event.PhysicalResourceId;

    var createOptions = {
      method: 'PUT',
      url: 'https://www.spotinst.com:8081/aws/ec2/group/'+groupId,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + tc.token
      },
      json: {
        group: tc.config
      }
    };
    request(createOptions, function (err, res, body) {
      if (res.statusCode > 201) return context.done("Elasticgroup update failed: " + res.statusMessage,event,context);

      util.done(err,event,context,body,groupId);
    });
  });
};

/* Do not change this function */
module.exports.handler = function (event, context) {
  handler.apply(this, [event, context, update]);
};
