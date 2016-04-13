var _ = require('lodash'),
  assert = require('assert'),
  update = require('../../lib/resources/subscription/update'),
  subscription = require('../../lib/resources/subscription'),
  lambda = require('../../'),
  nock = require('nock');

var subscriptionConfig = {
  "subscription": {
    "resourceId": "sis-11111111",
    "protocol": "http",
    "endpoint": "http://fakeurl.io",
    "eventType": "AWS_EC2_INSTANCE_TERMINATE"
  }
}

describe("subscription", function() {
  describe("update", function() {

    before(function() {
      for (var i=0; i<3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams":true})
        .put('/events/subscription/sis-11111111', {"subscription":{"resourceId":"sis-11111111","protocol":"http","endpoint":"http://fakeurl.io","eventType":"AWS_EC2_INSTANCE_TERMINATE"}})
        .reply(200, {"request":{"id":"303a56bf-bc74-4b7d-9758-e411d7b15080","url":"/events/subscription/sis-11111111","method":"PUT","timestamp":"2016-04-12T18:16:53.840Z"},"response":{"status":{"code":200,"message":"OK"},"affectedRows":0}}, { 'access-control-allow-headers': 'Origin,Accept,Content-Type,X-Requested-With,X-CSRF-Token',
               'access-control-allow-methods': 'GET,POST,DELETE,PUT',
               'access-control-allow-origin': '*',
               'content-type': 'application/json; charset=utf-8',
               date: 'Tue, 12 Apr 2016 18:16:53 GMT',
               'x-download-options': 'noopen',
               'x-frame-options': 'SAMEORIGIN',
               'x-request-id': '303a56bf-bc74-4b7d-9758-e411d7b15080',
               'x-response-time': '239ms',
               'content-length': '292',
               connection: 'Close' });

      }
    });

    it("update handler should update an existing group", function(done) {
      var context = {
        done: done
      };

      update.handler(
        _.merge({
          id: 'sis-11111111',
          accessToken: ACCESSTOKEN
        },subscriptionConfig),
        context
      );
    });

    it("subscription handler should update an existing group", function(done) {
      var context = {
        done: done
      };

      update.handler(
        _.merge({
          id: 'sis-11111111',
          requestType: 'update',
          accessToken: ACCESSTOKEN
        },subscriptionConfig),
        context
      );
    });

    it("lambda handler should update an existing group", function(done) {
      var context = {
        done: done
      };

      update.handler(
        _.merge({
          id: 'sis-11111111',
          resourceType: 'subscription',
          requestType: 'update',
          accessToken: ACCESSTOKEN
        },subscriptionConfig),
        context
      );
    });
  });
});
