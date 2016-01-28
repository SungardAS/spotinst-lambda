var assert = require('assert'),
  nock = require('nock');
  util = require('../lib/util');


var groupConfig = {'group':{'name':'Test-Group','capacity':{'minimum':1,'maximum':10,'target':1},'strategy':{'risk':100,'availabilityVsCost':'balanced'},'compute':{'instanceTypes':{'ondemand':'t2.nano','spot':['m4.large','m4.xlarge']},'availabilityZones':[{'name':'us-west-2a','subnetId':'subnet-123456'},{'name':'us-west-2b','subnetId':'subnet-45678'},{'name':'us-west-2c','subnetId':'subnet-91011'}],'product':'Linux/UNIX','launchSpecification':{'securityGroupIds':['sg-cc32c7a9'],'monitoring':false,'imageId':'ami-f0091d91','iamRole':{'name':'ecsInstanceRole'},'keyPair':'KeyOregon'}},'scaling':{},'scheduling':{},'thirdPartiesIntegration':{}}};

describe("util getConfig", function() {


  it("should find groupConfig", function(cb) {
    util.getConfig({groupConfig: groupConfig},function(err,config) {
      assert.ifError(err);
      assert.equal(config,groupConfig);
      cb();
    });
  });

  it("should find groupConfig from CloudFormation", function(cb) {
    util.getConfig({
      ResourceProperties: {
        groupConfig: groupConfig
      }
    },function(err,config) {
      assert.ifError(err);
      assert.equal(config,groupConfig);
      cb();
    });
  });

});
