var assert = require('assert'),
    nock   = require('nock');
util       = require('../lib/util'),
  _ = require('lodash');

var groupConfig  = {
  'group': {
    'name':                    'Test-Group',
    'capacity':                {
      'minimum': 1,
      'maximum': 10,
      'target':  1
    },
    'strategy':                {
      'risk':               100,
      'availabilityVsCost': 'balanced'
    },
    'compute':                 {
      'instanceTypes':       {
        'ondemand': 't2.nano',
        'spot':     ['m4.large', 'm4.xlarge']
      },
      'availabilityZones':   [{
        'name':     'us-west-2a',
        'subnetId': 'subnet-123456'
      }, {
        'name':     'us-west-2b',
        'subnetId': 'subnet-45678'
      }, {
        'name':     'us-west-2c',
        'subnetId': 'subnet-91011'
      }],
      'product':             'Linux/UNIX',
      'launchSpecification': {
        'securityGroupIds': ['sg-cc32c7a9'],
        'monitoring':       false,
        'imageId':          'ami-f0091d91',
        'iamRole':          {'name': 'ecsInstanceRole'},
        'keyPair':          'KeyOregon'
      }
    },
    'scaling':                 {},
    'scheduling':              {},
    'thirdPartiesIntegration': {}
  }
};
var updatePolicy = {updatePolicy: {}};

describe("util getConfig", function() {

  it("should find groupConfig", function(done) {
    util.getConfig(groupConfig, function(err, config) {
      assert.ifError(err);
      assert.deepEqual(config, groupConfig.group);
      done();
    });
  });

  it("should find groupConfig from CloudFormation", function(done) {
    util.getConfig({
      ResourceProperties: groupConfig
    }, function(err, config) {
      assert.ifError(err);
      assert.deepEqual(config, groupConfig.group);
      done();
    });
  });

  it("should fail if group config cannot be found", function(done) {
    util.getConfig({}, function(err, config) {
      assert(err);
      done();
    });
  });
});
