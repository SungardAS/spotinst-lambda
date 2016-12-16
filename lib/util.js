var _    = require('lodash');
var diff = require('deep-diff');
var log = require("./log").getLogger();
var properties = require("./properties");
var request = require('request');
var util    = require('lambda-formation').util;

const RESOURCES = ['group', 'subscription'];

var done = module.exports.done = function(err, event, context, body, physicalResourceId) {
  var opts = {
    cfn_responder: {
      returnError: false
    }
  };

  util.done(err, event, context, body, physicalResourceId, opts);
};

var getToken = module.exports.getToken = function(event, cb) {
  var config = event.ResourceProperties || event;

  if(config.username && config.password && config.clientId && config.clientSecret) {
    var request      = require('request');
    var tokenOptions = {
      method:  'POST',
      url:     properties.oauthUrl + '/token',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body:    'username=' + config.username + '&password=' + config.password + '&grant_type=password&client_id=' + config.clientId + '&client_secret=' + config.clientSecret
    };
    request(tokenOptions, function(err, response, body) {
      if(err) return cb("Token creation failed: " + err);
      if(response.statusCode > 201) return cb("Token creation failed: " + response.statusMessage);

      var accessToken = JSON.parse(body)['response']['items'][0]['accessToken'];
      cb(null, accessToken);
    });
  }
  else if(config.accessToken) {
    cb(null, config.accessToken);
  }
  else {
    cb("No valid long or short term credentials provided");
  }
};

var getConfig = module.exports.getConfig = function(event, cb) {
  var config;

  if (event.ResourceProperties) {
    var matchResourceConfig = _.intersection(_.keys(event.ResourceProperties),RESOURCES);
    if (matchResourceConfig.length === 1) {
      if (event.OldResourceProperties) {
        config = addNulls(
          event.OldResourceProperties[matchResourceConfig[0]],
          event.ResourceProperties[matchResourceConfig[0]]
        );
      }
      else {
        config = event.ResourceProperties[matchResourceConfig[0]];
      }
    }
  }
  if(!config) {
    var matchResourceConfig = _.intersection(_.keys(event), RESOURCES);
    config                  = event[matchResourceConfig[0]];
  }

  if(config) {
    cb(null, config);
  }
  /* TODO
   *else if (config.configUrl) {
   *  var tokenOptions = {
   *    method: 'GET',
   *    url: config.configUrl
   *  };
   *  request(requestOptions, function (err, response, body) {
   *    if (err) return cb(err);
   *    if (response.statusCode != 200) return cb(response.statusMessage);
   *    var jsonConfig = JSON.parse(body);
   *    cb(null,jsonConfig);
   *  });
   *}
   */
  else {
    cb("Must define groupConfig");
  }

};

var getTokenAndConfig = module.exports.getTokenAndConfig = function(event, cb) {
  var count    = 0;
  var response = {};

  var complete = function(err, name, obj) {
    if(err) return cb(err);
    count          = count + 1;
    response[name] = obj;
    if(count == 2) {
      return cb(null, response);
    }
  };

  getConfig(event, function(err, cfg) {
    complete(err, 'config', cfg);
  });

  getToken(event, function(err, t) {
    complete(err, 'token', t);
  });
};

var validateResponse = module.exports.validateResponse = function(spotResponse) {
  var res     = spotResponse.res;
  var body    = spotResponse.body;
  var event   = spotResponse.event;
  var context = spotResponse.context;

  //log.info('Spotinst response',JSON.stringify(body, null, 2));
  log.info('Spotinst response',body);

  if(res.statusCode > 201) {
    var errMsg = '';
    try {
      var errors = body.response.errors;
      errors.forEach(function(error) {
        errMsg = errMsg + error.code + ": " + error.message + "\n";
      });
    }
    catch(e) {
      errMsg = res.statusCode;
    }

    if(spotResponse.failureCb != null) {
      spotResponse.failureCb(spotResponse);
    }
    else {
      return done(spotResponse.resource + " " + spotResponse.action + " failed: " + errMsg, event, context);
    }
  }
  else {
    spotResponse.successCb(spotResponse);
  }
};


var addNulls = module.exports.addNulls = function(oldConfig, newConfig) {
  var patchConfig = _.cloneDeep(newConfig);

  diff.observableDiff(oldConfig, patchConfig, function (d) {
    if (d.kind === "D") {
      var patch = new Object();
      Object.defineProperty(patch,"kind",{value: "N", enumerable: true});
      Object.defineProperty(patch,"path",{value: d.path, enumerable: true});
      Object.defineProperty(patch,"rhs",{value: null, enumerable: true});

      diff.applyChange(patchConfig,oldConfig,patch);
    }
  });

  return patchConfig;
};
