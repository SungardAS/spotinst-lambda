var nock = require("nock");

USERNAME = process.env.SPOTINST_USERNAME || 'mock.username';
PASSWORD = process.env.SPOTINST_PASSWORD || 'mock.password';
CLIENTID = process.env.SPOTINST_CLIENTID || 'mock.clientId';
CLIENTSECRET = process.env.SPOTINST_CLIENTSECRET || 'mock.clientSecret';
ACCESSTOKEN = process.env.SPOTINST_ACCESSTOKEN || 'mock.accessToken';


before(function() {
  nock.disableNetConnect();
//  nock.recorder.rec();

});
