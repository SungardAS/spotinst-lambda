var _ = require('lodash'),
  assert = require('assert'),
  update = require('../../lib/resources/elastigroup/update'),
  elastigroup = require('../../lib/resources/elastigroup'),
  lambda = require('../../'),
  nock = require('nock');

var groupConfig = {
  "group": {
    "name": "test",
    "description": "asdf",
    "strategy": {
      "risk": 100,
      "onDemandCount": null,
      "availabilityVsCost": "balanced"
    },
    "capacity": {
      "target": 1,
      "minimum": 1,
      "maximum": 1
    },
    "scaling": {},
    "compute": {
      "instanceTypes": {
        "ondemand": "m3.medium",
        "spot": [
          "m3.medium"
        ]
      },
      "availabilityZones": [
        {
          "name": "us-east-1a",
          "subnetId": "subnet-11111111"
        }
      ],
      "product": "Linux/UNIX",
      "launchSpecification": {
        "securityGroupIds": [
          "sg-11111111"
        ],
        "monitoring": false,
        "imageId": "ami-60b6c60a",
        "keyPair": "testkey"
      }
    },
    "scheduling": {},
    "thirdPartiesIntegration": {}
  }
};

groupConfig.group.description = Date.now() / 1000 + "";

describe("elastigroup", function() {
  describe("update resource", function() {

    before(function() {
      for (var i=0; i<3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams":true})
        .put('/aws/ec2/group/sig-11111111', {"group":{"name":"test","description":/.+/,"strategy":{"risk":100,"onDemandCount":null,"availabilityVsCost":"balanced"},"capacity":{"target":1,"minimum":1,"maximum":1},"scaling":{},"compute":{"instanceTypes":{"ondemand":"m3.medium","spot":["m3.medium"]},"availabilityZones":[{"name":"us-east-1a","subnetId":"subnet-11111111"}],"launchSpecification":{"securityGroupIds":["sg-11111111"],"monitoring":false,"imageId":"ami-60b6c60a","keyPair":"testkey"}},"scheduling":{},"thirdPartiesIntegration":{}}})
        .reply(200, {"request":{"id":"70364a6f-348c-4771-8e7d-eb8813339861","url":"/aws/ec2/group/sig-11111111","method":"PUT","timestamp":"2016-01-28T17:13:52.039Z"},"response":{"status":{"code":200,"message":"OK"},"kind":"spotinst:aws:ec2:group","items":[{"id":"sig-11111111","name":"test","description":"1454001231.472","capacity":{"minimum":1,"maximum":1,"target":1},"strategy":{"risk":100,"availabilityVsCost":"balanced","drainingTimeout":0},"compute":{"instanceTypes":{"ondemand":"m3.medium","spot":["m3.medium"]},"availabilityZones":[{"name":"us-east-1a","subnetId":"subnet-11111111"}],"product":"Linux/UNIX","launchSpecification":{"securityGroupIds":["sg-11111111"],"monitoring":false,"imageId":"ami-60b6c60a","keyPair":"testkey"}},"scaling":{},"scheduling":{},"thirdPartiesIntegration":{},"createdAt":"2016-01-28T16:18:14.000+0000","updatedAt":"2016-01-28T17:13:51.000+0000"}],"count":1}}, { 'content-type': 'application/json; charset=utf-8',
               date: 'Thu, 28 Jan 2016 17:13:52 GMT',
               vary: 'Accept-Encoding',
               'x-request-id': '80334a6d-348c-4781-8e9d-eb9813379861',
               'x-response-time': '485ms',
               'content-length': '1469',
               connection: 'Close' });
      }
    });

    it("update handler should update an existing group", function(done) {
      var context = {
        done: done
      };

      update.handler(
        _.merge({
          accessToken: ACCESSTOKEN,
          id: 'sig-11111111'
        },groupConfig),
        context
      );
    });

    it("elastigroup handler should update an existing group", function(done) {
      var context = {
        done: done
      };

      update.handler(
        _.merge({
          requestType: 'update',
          accessToken: ACCESSTOKEN,
          id: 'sig-11111111'
        },groupConfig),
        context
      );
    });

    it("lambda handler should update an existing group", function(done) {
      var context = {
        done: done
      };

      update.handler(
        _.merge({
          resourceType: 'elastigroup',
          requestType: 'update',
          accessToken: ACCESSTOKEN,
          id: 'sig-11111111'
        },groupConfig),
        context
      );
    });
  });
});
