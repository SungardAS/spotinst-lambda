var assert = require('assert'),
  lambda = require('../');

describe('handler', function() {
  it('should require resourceType', function(done) {
    var context = {
      done: function(err,obj) {
        assert(err);
        done();
      }
    };

    lambda.handler({}, context);
  });

  it('should verify resourceType', function(done) {
    var context = {
      done: function(err,obj) {
        assert(err);
        done();
      }
    };

    lambda.handler({resourceType: 'badType'}, context);
  });

});
