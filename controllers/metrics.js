var Metrics = function () {
  var self = this;

  var _db = require('../controllers/datastores');
  var _scanner = require('arpscan');
  var _os = require('os');

  self.networkScan = function (callback) {
    return _scanner(function (err, data) {
      if (err) throw err;
      callback(data);
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

  self._startNieghbourhoodWatch = function (minutes) {
    if (!self._watch) {
      console.log("Starting the watch... (o_o)");

      var eyes = function () {

        self.networkScan(function (data) {
          console.log(data);
        });

        console.log(self.cpuUsage());
      };

      eyes();

      self._watch = setInterval( eyes, minutes * 60 * 1000);
    } else {
      console.log("Already watching... (0_0)");
    }
  };

  self._stopNeighbourhoodWatch = function () {
    console.log("Stopping the watch... (-.-)zzz");
  };

  self._noticeVisitors = function () {

  };

  self._startNieghbourhoodWatch(1);
};

module.exports = new Metrics();
