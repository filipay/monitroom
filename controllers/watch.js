var Watch = function (interval) {
  var metrics = require('../controllers/metrics');
  var self = this;

  self._interval = interval || 5;

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

        metrics.networkScan(function (data) {
          console.log(data);
        });

        metrics.cpuUsage(function (data) {
          console.log(data);
        });
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

module.exports = function () {
  return new Watch();
};
