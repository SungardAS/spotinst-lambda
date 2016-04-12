var _ = require('lodash'),
  assert = require('assert'),
  create = require('../../lib/resources/subscription/create'),
  subscription = require('../../lib/resources/subscription'),
  lambda = require('../../'),
  nock = require('nock');

var subscriptionConfig = {
  "subscription": {
    "resourceId": "sig-985aae92",
    "protocol": "aws-sns",
    "endpoint": "arn:aws:sns:us-east-1:546276914724:spotinst-test",
    "eventType": "AWS_EC2_INSTANCE_TERMINATE"
  }
}

describe("subscription", function() {
  describe("create resource", function() {
    before(function() {
      for (var i=0; i<4; i++) {

        nock('https://api.spotinst.io', {"encodedQueryParams":true})
        .post('/events/subscription', {"subscription":{"resourceId":"sig-985aae92","protocol":"aws-sns","endpoint":"arn:aws:sns:us-east-1:546276914724:spotinst-test","eventType":"AWS_EC2_INSTANCE_TERMINATE"}})
        .reply(201, {"request":{"id":"10ad8a73-a848-4ca6-b99a-2ae8afac4ef3","url":"/events/subscription","method":"POST","timestamp":"2016-04-12T16:42:57.078Z"},"response":{"status":{"code":201,"message":"Created"},"kind":"spotinst:subscription","items":[{"id":"sis-b34f3bcb","resourceId":"sig-985aae92","protocol":"aws-sns","endpoint":"arn:aws:sns:us-east-1:546276914724:spotinst-test","eventType":"AWS_EC2_INSTANCE_TERMINATE","updatedAt":"2016-04-12T16:42:57.000Z","createdAt":"2016-04-12T16:42:57.000Z"}],"count":1}}, { 'access-control-allow-headers': 'Origin,Accept,Content-Type,X-Requested-With,X-CSRF-Token',
               'access-control-allow-methods': 'GET,POST,DELETE,PUT',
               'access-control-allow-origin': '*',
               'content-type': 'application/json; charset=utf-8',
               date: 'Tue, 12 Apr 2016 16:42:57 GMT',
               'x-download-options': 'noopen',
               'x-frame-options': 'SAMEORIGIN',
               'x-request-id': '10ad8a73-a848-4ca6-b99a-2ae8afac4ef3',
               'x-response-time': '223ms',
               'content-length': '672',
               connection: 'Close' });

      }
    });

    it("create handler should create a new subscription", function(done) {
      var context = {
        done: done
      };

      create.handler(
        _.merge({accessToken: ACCESSTOKEN}, subscriptionConfig),
        context
      );
    });

    it("subscription handler should create a new subscription", function(done) {
      var context = {
        done: done
      };

      subscription.handler(
        _.merge({
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        },subscriptionConfig),
        context
      );
    });

    it("lambda handler should create a new subscription", function(done) {
      var context = {
        done: done
      };

      lambda.handler(
        _.merge({
          resourceType: 'subscription',
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        }, subscriptionConfig),
        context
      );
    });

    it("lambda handler should create a new subscription from CloudFormation", function(done) {
      var context = {
        done: done
      };

      lambda.handler({
        ResourceType: 'Custom::subscription',
        RequestType: 'Create',
        ResourceProperties: _.merge({accessToken: ACCESSTOKEN},subscriptionConfig)
      },
      context
                    );
    });

  });
});
