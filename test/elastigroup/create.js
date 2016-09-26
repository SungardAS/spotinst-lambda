var _ = require('lodash'),
  assert = require('assert'),
  create = require('../../lib/resources/elastigroup/create'),
  elastigroup = require('../../lib/resources/elastigroup'),
  lambda = require('../../'),
  nock = require('nock');

var groupConfig = {
  "group": {
    "name": "test",
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
      "launchSpecification": {
        "securityGroupIds": [
          "sg-11111111"
        ],
        "monitoring": false,
        "imageId": "ami-60b6c60a",
        "keyPair": "testkey"
      },
      "product": "Linux/UNIX"
    },
    "scheduling": {},
    "thirdPartiesIntegration": {}
  }
}

describe("elastigroup", function() {
  describe("create resource", function() {
    before(function() {
      for (var i=0; i<4; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams":true})
        .post('/aws/ec2/group', {"group":{"name":"test","strategy":{"risk":100,"onDemandCount":null,"availabilityVsCost":"balanced"},"capacity":{"target":1,"minimum":1,"maximum":1},"scaling":{},"compute":{"instanceTypes":{"ondemand":"m3.medium","spot":["m3.medium"]},"availabilityZones":[{"name":"us-east-1a","subnetId":"subnet-11111111"}],"launchSpecification":{"securityGroupIds":["sg-11111111"],"monitoring":false,"imageId":"ami-60b6c60a","keyPair":"testkey"},"product":"Linux/UNIX"},"scheduling":{},"thirdPartiesIntegration":{}}})
        .reply(200, {"request":{"id":"09c9bc9d-b234-4e06-bf2e-ec5f55033551","url":"/aws/ec2/group","method":"POST","timestamp":"2016-01-28T16:18:15.015Z"},"response":{"status":{"code":200,"message":"OK"},"kind":"spotinst:aws:ec2:group","items":[{"id":"sig-a307d690","name":"test","capacity":{"minimum":1,"maximum":1,"target":1},"strategy":{"risk":100,"availabilityVsCost":"balanced","drainingTimeout":0},"compute":{"instanceTypes":{"ondemand":"m3.medium","spot":["m3.medium"]},"availabilityZones":[{"name":"us-east-1a","subnetId":"subnet-11111111"}],"product":"Linux/UNIX","launchSpecification":{"securityGroupIds":["sg-11111111"],"monitoring":false,"imageId":"ami-60b6c60a","keyPair":"testkey"}},"scaling":{},"scheduling":{},"thirdPartiesIntegration":{},"createdAt":"2016-01-28T16:18:14.000+0000","updatedAt":"2016-01-28T16:18:14.000+0000"}],"count":1}}, { 'content-type': 'application/json; charset=utf-8',
               date: 'Thu, 28 Jan 2016 16:18:15 GMT',
               vary: 'Accept-Encoding',
               'x-request-id': '08c9bb9d-b235-4e06-be2e-ec5f54033551',
               'x-response-time': '6733ms',
               'content-length': '1416',
               connection: 'Close' });
      }

    });

    it("create handler should create a new group", function(done) {
      var context = {
        done: done
      };

      create.handler(
        _.merge({accessToken: ACCESSTOKEN}, groupConfig),
        context
      );
    });

    it("elastigroup handler should create a new group", function(done) {
      var context = {
        done: done
      };

      elastigroup.handler(
        _.merge({
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        },groupConfig),
        context
      );
    });

    it("lambda handler should create a new group", function(done) {
      var context = {
        done: done
      };

      lambda.handler(
        _.merge({
          resourceType: 'elastigroup',
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        }, groupConfig),
        context
      );
    });

    it("lambda handler should create a new group from CloudFormation", function(done) {
      var context = {
        done: done
      };

      lambda.handler({
        ResourceType: 'Custom::elastigroup',
        RequestType: 'Create',
        ResourceProperties: _.merge({accessToken: ACCESSTOKEN},groupConfig)
      },
      context
                    );
    });

  });
});
