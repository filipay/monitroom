var Metrics = function () {
  var self = this;

  var _scanner = require('arpscan');
  var _os = require('os');
  
  self.networkScan = function (callback) {
    _scanner(function (err, data) {
      //TODO log as error instead of just throwing it
      if (err) throw err;
      if (callback) callback(data);
    });
  };

  self.cpuUsage = function (callback) {
    var load = _os.loadavg();
    var summary = {
      timestamp: Date.now(),
      _1min: load[0],
      _5min: load[1],
      _15min: load[2]
    };
    if (callback) callback(summary);
    else return summary;
  };

  //TODO
  self.networkSpeed = function () {

  };
};

module.exports = new Metrics();
