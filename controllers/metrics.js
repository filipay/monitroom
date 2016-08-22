var Metrics = function () {
  var self = this;

  var _db = require('../controllers/datastores');
  var _scanner = require('arpscan');
  var _os = require('os');

  self._interval = 5;
  _db.devices.fetchDevices();

  self.networkScan = function (callback) {
    _scanner(function (err, data) {
      //TODO log as error instead of just throwing it
      if (err) throw err;

      if (callback) callback(data);
    });
  };

  self.cpuUsage = function () {
    var load = _os.loadavg();
    return {
      timestamp: Date.now(),
      _1min: load[0],
      _5min: load[1],
      _15min: load[2]
    };
  };

  self.setCheckRate = function (minutes) {
    self._stopNeighbourhoodWatch();

    self._interval = minutes || self._interval;
    self._startNieghbourhoodWatch(minutes);
  };

  self._startNieghbourhoodWatch = function (minutes) {
    minutes = minutes || self._interval;
    if (!self._watch) {
      console.log("Starting the watch... (o_o)");

      var eyes = function () {

        self.networkScan(function (data) {
          _db.devices.updateDevices(data);
          console.log(data);
        });

        console.log(self.cpuUsage());
      };

      eyes();

      self._watch = setInterval( eyes, self._interval * 60 * 1000);
    } else {
      console.log("Already watching... (0_0)");
    }
  };

  self._stopNeighbourhoodWatch = function () {
    if (self._watch) {
      console.log("Stopping the watch... (-.-)zzz");

      clearInterval(self._watch);
      self._watch = undefined;
      self._interval = 5;

    } else {

      console.log("We never started watching... >.>");

    }

  };

  self._noticeVisitors = function () {

  };
};

module.exports = new Metrics();
