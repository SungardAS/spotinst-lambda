var response = require('cfn-response'),
request = require('request');

var getToken = module.exports.getToken = function(event,cb) {
  var config = event.ResourceProperties || event;

  if (config.username && config.password && config.clientId && config.clientSecret) {
    var request = require('request');
    var tokenOptions = {
      method: 'POST',
      url: 'https://www.spotinst.com:9540/token',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: 'username='+config.username+'&password='+config.password+'&grant_type=password&client_id='+config.clientId+'&client_secret='+config.clientSecret
    };
    request(tokenOptions, function (err, response, body) {
      if (err) return cb("Token creation failed: " + err);
      if (response.statusCode > 201) return cb("Token creation failed: " + response.statusMessage);

      var accessToken = JSON.parse(body)['response']['items'][0]['accessToken'];
      cb(null,accessToken);
    });
  }
  else if (config.accessToken) {
    cb(null,config.accessToken);
  }
  else {
    cb("No valid long or short term credentials provided");
  }
};

var getConfig = module.exports.getConfig = function(event,cb) {
  var config = event.ResourceProperties || event;

  if (config.groupConfig) {
    cb(null,config.groupConfig);
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

var getTokenAndConfig = module.exports.getTokenAndConfig = function(event,cb) {
  var count = 0;
  var response = {};

  var done = function(err,name,obj) {
    if (err) return cb(err);
    count = count + 1;
    response[name] = obj;
    if (count == 2) {
      return cb(null,response);
    }
  };

  getConfig(event, function(err,cfg) {
    done(err,'config',cfg);
  });

  getToken(event, function(err,t) {
    done(err,'token',t);
  });
}



var done = module.exports.done = function(err,event,context,obj,physicalResourceId) {
  if (event.StackId) {
    var responseStatus = response.SUCCESS;
    if (err) responseStatus = response.FAILED;
    response.send(event, context, responseStatus, obj, physicalResourceId);
  }
  else {
    context.done(err,obj);
  }
};



