var handler = require('lambda-formation').resource.update;
var util = require('lambda-formation').util;
var request = require('request');
var spotUtil = require('../../util');

var update = function (err, event, context) {
  if (err) {
    return util.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err,tc) {
    if (err) return util.done(err,event,context);

    delete tc.config.compute.product;

    var refId = event.id || event.PhysicalResourceId;

    var createOptions = {
      method: 'PUT',
      url: 'https://api.spotinst.io/aws/ec2/group/'+refId,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + tc.token
      },
      json: {
        group: tc.config
      }
    };
    request(createOptions, function (err, res, body) {
      if (res.statusCode > 201) {
        var errMsg;
        try {
          errMsg = JSON.stringify(body);
        }
        catch(e) {
          errMsg = res.statusCode;
        }
        return util.done("Elasticgroup update failed: " + errMsg,event,context);
      }

      util.done(err,event,context,body,refId);
    });
  });
};

/* Do not change this function */
module.exports.handler = function (event, context) {
  handler.apply(this, [event, context, update]);
};
