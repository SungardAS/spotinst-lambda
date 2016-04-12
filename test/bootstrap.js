var nock = require("nock");

USERNAME = process.env.SPOTINST_USERNAME || 'mock.username';
PASSWORD = process.env.SPOTINST_PASSWORD || 'mock.password';
CLIENTID = process.env.SPOTINST_CLIENTID || 'mock.clientId';
CLIENTSECRET = process.env.SPOTINST_CLIENTSECRET || 'mock.clientSecret';
ACCESSTOKEN = process.env.SPOTINST_ACCESSTOKEN || 'mock.accessToken';


before(function() {
/*
 * To create new tests comment disableNetConnect and
 * uncomment the recorder. That will allow nock to make
 * requests to the service and record the output
 *
 * It is also a good idea to use 'describe.only' or 'it.only'
 * during test creation so that only the nock requests being
 * worked on actually run.
 *
 */

  nock.disableNetConnect();
//  nock.recorder.rec();

});
