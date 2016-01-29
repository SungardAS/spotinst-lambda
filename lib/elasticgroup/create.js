var util = require('../util'),
  request = require('request');

module.exports.handler = function(event,context) {
  util.getTokenAndConfig(event, function(err,tc) {
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

