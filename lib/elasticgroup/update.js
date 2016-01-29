var util = require('../util'),
  request = require('request');

module.exports.handler = function(event,context) {
  util.getTokenAndConfig(event, function(err,tc) {
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

