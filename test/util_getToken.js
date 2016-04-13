var assert = require('assert'),
  nock = require('nock'),
  util = require('../lib/util');

describe("util getToken", function() {

  before(function() {

    nock('https://oauth.spotinst.io', {"encodedQueryParams":true})
    .post('/token', "username=mock.username&password=mock.password&grant_type=password&client_id=mock.clientId&client_secret=mock.clientSecret")
    .reply(200, {"request":{"id":"963e071a-b62c-4a12-b4d9-0ca34cbe9320","url":"/token","method":"POST","timestamp":"2016-01-25T20:20:59.446Z"},"response":{"status":{"code":200,"message":"OK"},"kind":"spotinst:oauth2:token","items":[{"accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzcG90aW5zdCIsInVpZCI6MTEyLCJvaWQiOjYwNjA3OTg2MTgwMywiZXhwIjoxNDUzNzYwNDU5LCJpYXQiOjE0NTM3NTMyNTl9.T_pqS6nyywc0Fa6ydKfZ6zWl-3o7kU_aejJA7WbAGXw","tokenType":"bearer","expiresIn":7200},{"refreshToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzcG90aW5zdCIsInVpZCI6MTEyLCJvaWQiOjYwNjA3OTg2MTgwMywiZXhwIjoxNDU0OTYyODU5LCJpYXQiOjE0NTM3NTMyNTl9.kkhfR4Fr8p3bm10V5g7XwPn5hT3i_9EiLRUqW3gQo78","tokenType":"bearer","expiresIn":1209600}],"count":2}}, { 'cache-control': 'no-store',
           'content-type': 'application/json; charset=utf-8',
           date: 'Mon, 25 Jan 2016 20:20:59 GMT',
           pragma: 'no-cache',
           vary: 'Accept-Encoding',
           'x-request-id': '963e071a-b62c-4a12-b4d9-0ca34cbe9320',
           'x-response-time': '135ms',
           'content-length': '901',
           connection: 'Close' });

    nock('https://oauth.spotinst.io', {"encodedQueryParams":true})
    .post('/token', "username=mock.username&password=mock.password&grant_type=password&client_id=mock.clientId&client_secret=mock.clientSecret")
    .reply(200, {"request":{"id":"963e071a-b62c-4a12-b4d9-0ca34cbe9320","url":"/token","method":"POST","timestamp":"2016-01-25T20:20:59.446Z"},"response":{"status":{"code":200,"message":"OK"},"kind":"spotinst:oauth2:token","items":[{"accessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzcG90aW5zdCIsInVpZCI6MTEyLCJvaWQiOjYwNjA3OTg2MTgwMywiZXhwIjoxNDUzNzYwNDU5LCJpYXQiOjE0NTM3NTMyNTl9.T_pqS6nyywc0Fa6ydKfZ6zWl-3o7kU_aejJA7WbAGXw","tokenType":"bearer","expiresIn":7200},{"refreshToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzcG90aW5zdCIsInVpZCI6MTEyLCJvaWQiOjYwNjA3OTg2MTgwMywiZXhwIjoxNDU0OTYyODU5LCJpYXQiOjE0NTM3NTMyNTl9.kkhfR4Fr8p3bm10V5g7XwPn5hT3i_9EiLRUqW3gQo78","tokenType":"bearer","expiresIn":1209600}],"count":2}}, { 'cache-control': 'no-store',
           'content-type': 'application/json; charset=utf-8',
           date: 'Mon, 25 Jan 2016 20:20:59 GMT',
           pragma: 'no-cache',
           vary: 'Accept-Encoding',
           'x-request-id': '963e071a-b62c-4a12-b4d9-0ca34cbe9320',
           'x-response-time': '135ms',
           'content-length': '901',
           connection: 'Close' });

  });

  it("should find accessToken", function(cb) {
    util.getToken({accessToken: '123456'},function(err,token) {
      assert.ifError(err);
      assert.equal(token,123456);
      cb();
    });
  });

  it("should find accessToken for CloudFormation", function(cb) {
    util.getToken({ResourceProperties: {accessToken: '123456'}},function(err,token) {
      assert.ifError(err);
      assert.equal(token,123456);
      cb();
    });
  });

  it("should get accessToken for long term credentials", function(cb) {
    util.getToken({
      username: USERNAME,
      password: PASSWORD,
      clientId: CLIENTID,
      clientSecret: CLIENTSECRET
    },function(err,token) {
      assert.ifError(err);
      assert(token);
      cb();
    });
  });

  it("should get accessToken for long term credentials from CloudFormation", function(cb) {
    util.getToken({
      ResourceProperties: {
        username: USERNAME,
        password: PASSWORD,
        clientId: CLIENTID,
        clientSecret: CLIENTSECRET
      }
    },function(err,token) {
      assert.ifError(err);
      assert(token);
      cb();
    });
  });

  it("should fail if no credentials are given", function(cb) {
    util.getToken({},function(err,token) {
      assert(err);
      assert.equal(token,null);
      cb();
    });
  });

});
