var assert       = require('assert'),
    deleteGroup  = require('../../lib/resources/elasticgroup/delete'),
    elasticgroup = require('../../lib/resources/elasticgroup'),
    lambda       = require('../../'),
    nock         = require('nock');

describe("elasticgroup", function() {
  describe("delete resource", function() {
    before(function() {
      for(var i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .delete('/aws/ec2/group/sig-11111111')
          .reply(200, {
            "request":  {
              "id":        "9bad8ebc-a42c-425f-83ab-fbec3b1cbd8a",
              "url":       "/aws/ec2/group/sig-11111111",
              "method":    "DELETE",
              "timestamp": "2016-01-28T17:34:37.072Z"
            },
            "response": {
              "status": {
                "code":    200,
                "message": "OK"
              }
            }
          }, {
            'content-type':    'application/json; charset=utf-8',
            date:              'Thu, 28 Jan 2016 17:34:37 GMT',
            vary:              'Accept-Encoding',
            'x-request-id':    '9aad8ebb-a42d-424f-83aa-fbfc3b14bd8a',
            'x-response-time': '1115ms',
            'content-length':  '266',
            connection:        'Close'
          });
      }
    });

    it("delete handler should delete an existing group", function(done) {
      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/aws/ec2/group/sig-11111111");
          done(err, obj);
        }
      };

      deleteGroup.handler({
        accessToken: ACCESSTOKEN,
        id:          'sig-11111111'
      }, context);
    });

    it("elasticgroup handler should delete an existing group", function(done) {
      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/aws/ec2/group/sig-11111111");
          done(err, obj);
        }
      };

      elasticgroup.handler({
        requestType: 'delete',
        accessToken: ACCESSTOKEN,
        id:          'sig-11111111'
      }, context);
    });

    it("lambda handler should delete an existing group", function(done) {
      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/aws/ec2/group/sig-11111111");
          done(err, obj);
        }
      };

      lambda.handler({
        resourceType: 'elasticgroup',
        requestType:  'delete',
        accessToken:  ACCESSTOKEN,
        id:           'sig-11111111'
      }, context);
    });

    it("lambda handler should delete for CloudFormation", function(done) {

      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .delete('/aws/ec2/group/sig-11111111')
        .reply(200, {});

      nock('https://fake.url')
        .put('/', {
          "Status":            "SUCCESS",
          "Reason":            "See the details in CloudWatch Log Stream: undefined",
          "StackId":           "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid",
          "RequestId":         "unique id for this create request",
          "LogicalResourceId": "name of resource in template"
        })
        .reply(200, {});

      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          done(err, obj);
        }
      };

      lambda.handler({
          ResourceType:       'Custom::elasticgroup',
          ResourceProperties: {
            accessToken: ACCESSTOKEN,
          },
          RequestType:        "Delete",
          RequestId:          "unique id for this create request",
          ResponseURL:        "https://fake.url",
          LogicalResourceId:  "name of resource in template",
          PhysicalResourceId: 'sig-11111111',
          StackId:            "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
        },
        context);
    });
  });

  describe("delete resource fail", function() {
    beforeEach(function() {
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .delete('/aws/ec2/group/sig-11111111')
        .reply(400, {
          "request":  {
            "id":        "9bad8ebc-a42c-425f-83ab-fbec3b1cbd8a",
            "url":       "/aws/ec2/group/sig-11111111",
            "method":    "DELETE",
            "timestamp": "2016-01-28T17:34:37.072Z"
          },
          "response": {
            "status": {
              "code":    400,
              "message": "Bad Request"
            }
          }
        }, {
          'content-type':    'application/json; charset=utf-8',
          date:              'Thu, 28 Jan 2016 17:34:37 GMT',
          vary:              'Accept-Encoding',
          'x-request-id':    '9aad8ebb-a42d-424f-83aa-fbfc3b14bd8a',
          'x-response-time': '1115ms',
          'content-length':  '266',
          connection:        'Close'
        });
    });

    describe("group exists", function() {
      it("should return error", function(done) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .get('/aws/ec2/group/sig-11111111')
          .reply(200, {
            "request":  {
              "id":        "9bad8ebc-a42c-425f-83ab-fbec3b1cbd8a",
              "url":       "/aws/ec2/group/sig-11111111",
              "method":    "GET",
              "timestamp": "2016-01-28T17:34:37.072Z"
            },
            "response": {
              "status": {
                "code":    200,
                "message": "OK"
              }
            }
          }, {
            'content-type':    'application/json; charset=utf-8',
            date:              'Thu, 28 Jan 2016 17:34:37 GMT',
            vary:              'Accept-Encoding',
            'x-request-id':    '9aad8ebb-a42d-424f-83aa-fbfc3b14bd8a',
            'x-response-time': '1115ms',
            'content-length':  '266',
            connection:        'Close'
          });

        var context = {
          done: function(err, obj) {
            assert.notEqual(err, null);
            done(null, obj);
          }
        };

        deleteGroup.handler({
          accessToken: ACCESSTOKEN,
          id:          'sig-11111111'
        }, context);
      });
    });

    describe("group doesn't exists", function() {
      it("should return ok", function(done) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .get('/aws/ec2/group/sig-11111111')
          .reply(400, {
            "request":  {
              "id":        "9bad8ebc-a42c-425f-83ab-fbec3b1cbd8a",
              "url":       "/aws/ec2/group/sig-11111111",
              "method":    "GET",
              "timestamp": "2016-01-28T17:34:37.072Z"
            },
            "response": {
              "status": {
                "code":    400,
                "message": "Bad Request"
              }
            }
          }, {
            'content-type':    'application/json; charset=utf-8',
            date:              'Thu, 28 Jan 2016 17:34:37 GMT',
            vary:              'Accept-Encoding',
            'x-request-id':    '9aad8ebb-a42d-424f-83aa-fbfc3b14bd8a',
            'x-response-time': '1115ms',
            'content-length':  '266',
            connection:        'Close'
          });

        var context = {
          done: function(err, obj) {
            assert.equal(err, null);
            done(err, obj);
          }
        };

        deleteGroup.handler({
          accessToken: ACCESSTOKEN,
          id:          'sig-11111111'
        }, context);
      });
    });
  });
});
