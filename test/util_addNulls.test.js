var assert = require('assert'),
  util = require('../lib/util');


describe("util addNulls", function() {

  var newConfig = {
    key2: {
      name: "thing"
    },
    key1: {
    }
  };

  var oldConfig = {
    key1: {
      key1_1: {
        key1_1_1: {
          "name": "value"
        }
      }
    },
    key2: {
    }
  };

  it("should find nulls to add", function() {
    var patchedConfig = util.addNulls(oldConfig,newConfig);
    assert.deepEqual(patchedConfig,{ key2: { name: 'thing' }, key1: { key1_1: null } });
  });

});
