var _ = require('lodash');
var handler = require('lambda-formation').resource.create;
var util = require('lambda-formation').util;
var request = require('request');
var spotUtil = require('../../util');

/*
  Here is a skelton of what the delete function might look like.
  Change to fit your needs.
*/
var destroy = function (err, event, context) {
  if (err) {
    return util.done(err);
  }

  spotUtil.getToken(event, function(err,token) {
    if (err) return util.done(err,event,context);

    var groupId = event.groupId || event.PhysicalResourceId;

    // Let CloudFormation rollbacks happen for failed stacks
    if (event.StackId && !_.startsWith(groupId,'sig'))
      return util.done(null,event,context);

    var createOptions = {
      method: 'DELETE',
      url: 'https://www.spotinst.com:8081/aws/ec2/group/'+groupId,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    request(createOptions, function (err, res, body) {

      if (res.statusCode != 200) return context.done("Elasticgroup failed to cancel: " + res.statusMessage,event,context);

      // Ensure JSON
      body = JSON.parse(body.toString());

      util.done(err,event,context,body);
    });
  });
};

/* Do not change this function */
module.exports.handler = function (event, context) {
  handler.apply(this, [event, context, destroy]);
};

