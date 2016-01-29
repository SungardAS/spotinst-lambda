var util = require('../util'),
  request = require('request');

module.exports.handler = function(event,context) {
  util.getToken(event, function(err,token) {
    if (err) return context.done(err,event,context);

    var groupId = event.groupId || event.PhysicalResourceId;

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
