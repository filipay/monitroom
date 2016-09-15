var expect = require('chai').expect;
var device = require('../models/device');
var mock_cache = {
  items: {},

  get: function () {}
};
var scanner = function(callback) {
  return callback([{ip: '127.0.0.1', mac_addr: '00:00:00:00:00'}]);
};

var app = {
  caster: device,
  cache: mock_cache,
  scanner: scanner
};

var metrics = require('../controllers/metrics')(app);

describe('Metrics', function() {
  it('should scan the network', function() {

  });
});
