var Metrics = function (app) {
  var self = this;
  var Device = require('../models/device');
  var _scanner = require('arpscan');
  var _os = require('os');
  var _speedTest = require('speedtest-net');
  var logger = require('../storage/logger');
  //Cache mostly exists so we can check has been online for right now
  self._cache = app.cache;

  self.networkScan = function (callback) {

    var list = self._cache.getLatest(15 * 1000);
    // console.log(list);
    if ( list.length > 0 && self._cache.first_scan ) return callback(list);
    return _scanner(function (err, data) {
      self._cache.first_scan = true;
      //TODO log as error instead of just throwing it
      if (err) {
        // logger.err('Scanner err', err);
        throw err;
      }
      var devices = [];
      data.forEach(function (device) {
        //Check if device is already cached, if not create new device

        self._cache.get(device.mac, function (err, details) {
          var currDevice = details || new Device(device);

          currDevice.updateTime(device.timestamp);
          self._cache.set(device.mac, currDevice);
          devices.push(currDevice.__self__());
        });



      });

      if (callback) callback(devices);
    });
  };

  self.cpuUsage = function (callback) {
    var load = _os.loadavg();
    var summary = {
      _1min: load[0],
      _5min: load[1],
      _15min: load[2]
    };
    if (callback) callback(summary);
    else return summary;
  };

  //TODO more cool stats here like ip, isp, etc to be considered
  self.networkSpeed = function (callback) {
    var speedTest = _speedTest({maxTime:5000});
    speedTest.on('data',function(data) {
      var summary = {
        download: data.speeds.download,
        upload: data.speeds.download
      };
      if (callback) callback(summary);
      else return summary;
    });
  };
};

module.exports = function (app) {
  return new Metrics(app);
};
