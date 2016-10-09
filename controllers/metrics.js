var Metrics = function (app) {
  var self = this;
  var Device = app.caster || require('../models/device');
  var _scanner = app.scanner || require('arpscan');
  var _os = require('os');
  var _speedTest = app.speedtest || require('speedtest-net');
  var logger = app.logger;
  var CONFIG = app.CONFIG;
  //Cache mostly exists so we can check has been online for right now
  self._cache = app.cache;

  self.networkScan = function (live, callback) {
    var list = self._cache.getLatest(CONFIG.cache.time);

    if ( !live && list.length > 0 && self._cache.intial_scan) {
      return callback(list);
    }

    _scanner(function (err, data) {
      self._cache.intial_scan = true;
      if (err) {
        logger.error('Scanner err', err);
        return callback([]);
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
      if (callback) {
        if ( live ) {
          return callback(devices);
        } else {
          return callback(self._cache.getAll(devices));
        }
      }
    }, { sudo: true });
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
  self.networkSpeed = function (maxTime, callback) {
    var summary = { download: 0, upload: 0 };

    var speedTest = _speedTest({maxTime: maxTime});
    speedTest.on('error', function(error) {
      logger.error('ERROR /speed', error);
      if (callback) callback(summary);
      else return summary;
    });

    speedTest.on('data',function(data) {
      if (typeof data.speeds.download !== 'number') {
        logger.error('ERROR: download is not a number', data.speeds);
        data.speeds.download = 0;
      }
      if (typeof data.speeds.upload !== 'number') {
        logger.error('ERROR: upload is not a number', data.speeds);
        data.speeds.upload = 0;
      }
      summary.download = data.speeds.download;
      summary.upload = data.speeds.upload;
      if (callback) callback(summary);
      else return summary;
    });
  };
};

module.exports = function (app) {
  return new Metrics(app);
};
