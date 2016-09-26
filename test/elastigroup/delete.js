var assert = require('assert'),
  deleteGroup = require('../../lib/resources/elastigroup/delete'),
  elastigroup = require('../../lib/resources/elastigroup'),
  lambda = require('../../'),
  nock = require('nock');

describe("elastigroup", function() {
  describe("delete resource", function() {
    before(function() {
      for(var i=0;i<3;i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams":true})
        .delete('/aws/ec2/group/sig-11111111')
        .reply(200, {"request":{"id":"9bad8ebc-a42c-425f-83ab-fbec3b1cbd8a","url":"/aws/ec2/group/sig-11111111","method":"DELETE","timestamp":"2016-01-28T17:34:37.072Z"},"response":{"status":{"code":200,"message":"OK"}}}, { 'content-type': 'application/json; charset=utf-8',
               date: 'Thu, 28 Jan 2016 17:34:37 GMT',
               vary: 'Accept-Encoding',
               'x-request-id': '9aad8ebb-a42d-424f-83aa-fbfc3b14bd8a',
               'x-response-time': '1115ms',
               'content-length': '266',
               connection: 'Close' });
      }
    });

    it("delete handler should delete an existing group", function(done) {
      var context = {
        done: function(err,obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/aws/ec2/group/sig-11111111");
          done(err,obj);
        }
      };

      deleteGroup.handler({
        accessToken: ACCESSTOKEN,
        id: 'sig-11111111'
      }, context);
    });

    it("elastigroup handler should delete an existing group", function(done) {
      var context = {
        done: function(err,obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/aws/ec2/group/sig-11111111");
          done(err,obj);
        }
      };

      elastigroup.handler({
        requestType: 'delete',
        accessToken: ACCESSTOKEN,
        id: 'sig-11111111'
      }, context);
    });

    it("lambda handler should delete an existing group", function(done) {
      var context = {
        done: function(err,obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/aws/ec2/group/sig-11111111");
          done(err,obj);
        }
      };

      lambda.handler({
        resourceType: 'elastigroup',
        requestType: 'delete',
        accessToken: ACCESSTOKEN,
        id: 'sig-11111111'
      }, context);
    });

    it("lambda handler should delete for CloudFormation", function(done) {

      nock('https://api.spotinst.io', {"encodedQueryParams":true})
      .delete('/aws/ec2/group/sig-11111111')
      .reply(200, {});

      nock('https://fake.url')
      .put('/', {"Status":"SUCCESS","Reason":"See the details in CloudWatch Log Stream: undefined","StackId":"arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid","RequestId":"unique id for this create request","LogicalResourceId":"name of resource in template"})
      .reply(200, {});

      var context = {
        done: function(err,obj) {
          assert.ifError(err);
          done(err,obj);
        }
      };

      lambda.handler({
        ResourceType: 'Custom::elastigroup',
        ResourceProperties: {
          accessToken: ACCESSTOKEN,
        },
        RequestType: "Delete",
        RequestId: "unique id for this create request",
        ResponseURL: "https://fake.url",
        LogicalResourceId: "name of resource in template",
        PhysicalResourceId: 'sig-11111111',
        StackId: "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
      },
      context);
    });
  });
});
