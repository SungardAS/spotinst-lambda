var handler  = require('lambda-formation').resource.update;
var util     = require('lambda-formation').util;
var request  = require('request');
var _        = require('lodash');
var spotUtil = require('../../util');

var update    = function(err, event, context) {
  if(err) {
    return util.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err, tc) {
    if(err) return util.done(err, event, context);

    delete tc.config.compute.product;

    var refId = event.id || event.PhysicalResourceId;

    var createOptions = {
      method:  'PUT',
      url:     'https://api.spotinst.io/aws/ec2/group/' + refId,
      headers: {
        'content-type':  'application/json',
        'Authorization': 'Bearer ' + tc.token
      },
      json:    {
        group: tc.config
      }
    };
    var rollConfig    = getRollConfig(event);
    var rollGroup     = function() {
      var rollOptions = {
        method:  'PUT',
        url:     'https://api.spotinst.io/aws/ec2/group/' + refId + '/roll',
        headers: {
          'content-type':  'application/json',
          'Authorization': 'Bearer ' + tc.token
        },
        json:    rollConfig || {}
      };
      request(rollOptions, function(err, res, body) {
        spotUtil.validateResponse({
          err:       err,
          res:       res,
          body:      body,
          event:     event,
          context:   context,
          resource:  'roll',
          action:    'create',
          successCb: function(spotResponse) {
            util.done(err, event, context, body, refId);
          }
        });
      });
    };

    request(createOptions, function(err, res, body) {
      spotUtil.validateResponse({
        err:       err,
        res:       res,
        body:      body,
        event:     event,
        context:   context,
        resource:  'elasticgroup',
        action:    'update',
        successCb: function(spotResponse) {
          if(_.isEmpty(rollConfig)) {
            util.done(err, event, context, body, refId);
          }
          else {
            rollGroup();
          }
        }
      });
    });

  });
};

var getRollConfig = function(event) {
  var rollConfig = _.get(event, 'ResourceProperties.updatePolicy.rollConfig') || _.get(event, 'updatePolicy.rollConfig');

  return rollConfig;
};

/* Do not change this function */
module.exports.handler = function(event, context) {
  handler.apply(this, [event, context, update]);
};
