var _        = require('lodash');
var handler  = require('lambda-formation').resource.update;
var log = require("../../log").getLogger();
var properties = require("../../properties");
var request  = require('request');
var spotUtil = require('../../util');

var update = function(err, event, context) {
  if(err) {
    return spotUtil.done(err);
  }

  spotUtil.getTokenAndConfig(event, function(err, tc) {
    if(err) return spotUtil.done(err, event, context);

    _.unset(tc.config, 'compute.product');
    _.unset(tc.config, 'capacity.unit');

    var refId = event.id || event.PhysicalResourceId;

    var updateOptions = {
      method:  'PUT',
      url:     properties.restUrl + '/aws/ec2/group/' + refId,
      headers: {
        'Content-Type':  'application/json',
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
        url:     properties.restUrl + '/aws/ec2/group/' + refId + '/roll',
        headers: {
          'Content-Type':  'application/json',
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
            spotUtil.done(err, event, context, body, refId);
          }
        });
      });
    };

    log.info('Updating group',{data: tc.config});
    log.debug('Update Policy config', {data: updatePolicy});

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
          if(updatePolicy &&
             updatePolicy.shouldRoll &&
             updatePolicy.shouldRoll == 'true') {
            rollGroup();
          } else {
            spotUtil.done(err, event, context, body, refId);
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















