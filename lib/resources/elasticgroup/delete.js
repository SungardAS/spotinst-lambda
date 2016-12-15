var _        = require('lodash');
var handler  = require('lambda-formation').resource.delete;
var log = require("loglevel");
var request  = require('request');
var spotUtil = require('../../util');
var properties = require("../../properties");

var destroy = function(err, event, context) {
  if(err) {
    return spotUtil.done(err);
  }

  spotUtil.getToken(event, function(err, token) {
    if(err) return spotUtil.done(err, event, context);

    var refId = event.id || event.PhysicalResourceId;

    // Let CloudFormation rollbacks happen for failed stacks
    if(event.StackId && !_.startsWith(refId, 'sig'))
      return spotUtil.done(null, event, context);

    log.info('Deleting group: ' + refId);
    var deleteOptions = {
      method:  'DELETE',
      url:     properties.restUrl + '/aws/ec2/group/' + refId,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      }
    };

    request(deleteOptions, function(err, res, body) {
      spotUtil.validateResponse({
        err:       err,
        res:       res,
        body:      body,
        event:     event,
        context:   context,
        resource:  'elasticgroup',
        action:    'delete',
        successCb: function(spotResponse) {
          try { body = JSON.parse(body); } catch (err) {}
          spotUtil.done(err, event, context, body);
        },
        failureCb: function(spotResponse) {
          log.error("Can't delete the group, check if the group even exists")
          validateGroup(refId, token, event, context);
        }
      });
    });

  });
};

function validateGroup(groupId, token, event, context) {
  var getGroupOptions = {
    method:  'GET',
    url:     properties.restUrl + '/aws/ec2/group/' + groupId,
    headers: {
      'content-type':  'application/json',
      'Authorization': 'Bearer ' + token
    }
  };

  request(getGroupOptions, function(err, res, body) {
    spotUtil.validateResponse({
      err:       err,
      res:       res,
      body:      body,
      event:     event,
      context:   context,
      resource:  'elasticgroup',
      action:    'get',
      successCb: function(spotResponse) {
        log.error("The group does exist, fail the delete.")
        // Return failed to delete (cause the group does exist)
        spotUtil.done(spotResponse.resource + " " + spotResponse.action + " failed", event, context);
      },
      failureCb: function(spotResponse) {
        // if the group doesn't exists, we can count the delete as success
        if(spotResponse.res.statusCode === 404 || spotResponse.res.statusCode === 400) {

          log.info("The group doesn't exist, set the delete as success.")
          try { body = JSON.parse(body); } catch (err) {}
          spotUtil.done(null, event, context, body);
        }
        else {
          spotUtil.done("elastigroup delete failed. can't get group", event, context);
        }
      }
    });
  });
}

/* Do not change this function */
module.exports.handler = function(event, context) {
  handler.apply(this, [event, context, destroy]);
};

