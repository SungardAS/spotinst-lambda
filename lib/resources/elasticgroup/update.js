var handler  = require('lambda-formation').resource.update;
var util     = require('lambda-formation').util;
var request  = require('request');
var _        = require('lodash');
var spotUtil = require('../../util');

var update = function(err, event, context) {
  if(err) {
    return util.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err, tc) {
    if(err) return util.done(err, event, context);

    _.unset(tc.config, 'compute.product');
    _.unset(tc.config, 'capacity.unit');

    var refId = event.id || event.PhysicalResourceId;

    var updateOptions = {
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

    var updatePolicy = getUpdatePolicyConfig(event);
    var rollGroup    = function() {
      var rollOptions = {
        method:  'PUT',
        url:     'https://api.spotinst.io/aws/ec2/group/' + refId + '/roll',
        headers: {
          'content-type':  'application/json',
          'Authorization': 'Bearer ' + tc.token
        },
        json:    updatePolicy.rollConfig || {}
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

    console.log('Updating group ' + refId + ':' + JSON.stringify(tc.config, null, 2));
    console.log('Update Policy config: ' + JSON.stringify(updatePolicy, null, 2));

    request(updateOptions, function(err, res, body) {
      spotUtil.validateResponse({
        err:       err,
        res:       res,
        body:      body,
        event:     event,
        context:   context,
        resource:  'elasticgroup',
        action:    'update',
        successCb: function(spotResponse) {
          if(updatePolicy && updatePolicy.shouldRoll) {
            rollGroup();
          } else {
            util.done(err, event, context, body, refId);
          }
        }
      });
    });

  });
};

var getUpdatePolicyConfig = function(event) {
  var updatePolicy = _.get(event, 'ResourceProperties.updatePolicy') || _.get(event, 'updatePolicy');
  return updatePolicy;
};

/* Do not change this function */
module.exports.handler = function(event, context) {
  handler.apply(this, [event, context, update]);
};















