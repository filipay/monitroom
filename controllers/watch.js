var Watch = function (interval) {
  var metrics = require('../controllers/metrics');
  var self = this;
  self._watch = {};

  self.DEFAULT_NET_SCAN = {
    TYPE: 'NET_SCAN',
    eyes: function() {
      metrics.networkScan(function (data) {
        console.log(data);
      });
    }
  };

  self.DEFAULT_CPU_UTIL = {
    TYPE: 'CPU_UTIL',
    eyes: function () {
      metrics.cpuUsage(function (data) {
        console.log(data);
      });
    }
  };

  self.DEFAULT_NET_SPEED = {
    TYPE: 'NET_SPEED',
    eyes: function() {
      metrics.networkSpeed(function (data) {
        console.log(data);
      });
    }
  };

  self._interval = interval || 5;

  self.setCheckRate = function (watch, minutes) {
    if (self._watch[watch.TYPE]) self.stopWatching(watch);

    self._interval = minutes || self._interval;
    self.startWatching(watch, minutes);
  };

  self.startWatching = function (watch, minutes) {
    minutes = minutes || self._interval;
    if (!self._watch[watch.TYPE]) {

      watch.eyes();
      self._watch[watch.TYPE] = setInterval( watch.eyes, minutes * 60 * 1000);

    } else {
      logger.error("Watch already in place... ¬.¬", watch.TYPE);
    }
  };

  self.stopWatching = function (watch) {
    if (self._watch[watch.TYPE]) {
      logger.info("Stopping the watch... (-.-)zzz", watch.TYPE);

      clearInterval(self._watch[watch.TYPE]);
      self._watch[watch.TYPE] = undefined;
      self._interval = 5;

    } else {
      logger.error("We never started watching... >.>", watch.TYPE);
    }

  };

  self._noticeVisitors = function () {

  };
};

module.exports = function (interval) {
  return new Watch(interval);
};
