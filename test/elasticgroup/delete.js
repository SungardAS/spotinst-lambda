var assert = require('assert'),
  deleteGroup = require('../../lib/elasticgroup/delete'),
  nock = require('nock');

describe("elasticgroup", function() {
  before(function() {
    nock('https://www.spotinst.com:8081', {"encodedQueryParams":true})
    .delete('/aws/ec2/group/sig-11111111')
    .reply(200, {"request":{"id":"9bad8ebc-a42c-425f-83ab-fbec3b1cbd8a","url":"/aws/ec2/group/sig-11111111","method":"DELETE","timestamp":"2016-01-28T17:34:37.072Z"},"response":{"status":{"code":200,"message":"OK"}}}, { 'content-type': 'application/json; charset=utf-8',
      date: 'Thu, 28 Jan 2016 17:34:37 GMT',
      vary: 'Accept-Encoding',
      'x-request-id': '9aad8ebb-a42d-424f-83aa-fbfc3b14bd8a',
      'x-response-time': '1115ms',
      'content-length': '266',
      connection: 'Close' });
  });

  it("should delete an existing group", function(done) {
    var context = {
      done: function(err,obj) {
        assert.ifError(err);
        assert.equal(obj.request.url, "/aws/ec2/group/sig-11111111");
        done(err,obj);
      }
    };

    deleteGroup.handler({
        accessToken: ACCESSTOKEN,
        groupId: 'sig-11111111'
      },
      context
    );

  });
});
