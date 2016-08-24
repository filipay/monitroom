var Metrics = function () {
  var self = this;
  var Device = require('../models/device');
  var _scanner = require('arpscan');
  var _os = require('os');

  //Cache mostly exists so we can check has been online for right now
  self._cache = {};

  self.networkScan = function (callback) {
    _scanner(function (err, data) {
      //TODO log as error instead of just throwing it
      if (err) throw err;

      var devices = [];
      data.forEach(function (device) {
        //Check if device is already cached, if not create new device
        var currDevice = self._cache[device.mac] || new Device(device);
        currDevice.updateTime(device.timestamp);
        self._cache[device.mac] = currDevice;
        devices.push(currDevice.__self__());
      });

      if (callback) callback(devices);
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
