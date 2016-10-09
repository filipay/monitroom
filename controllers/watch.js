var Watch = function (app, interval) {
  var metrics = app.metrics;
  var logger = app.logger;
  var self = this;
  self._watch = {};

  self.DEFAULT_NET_SCAN = {
    TYPE: 'NET_SCAN',
    eyes: function() {
      metrics.networkScan(true, function (data) {
        return logger.info('WATCH /devices', logger.infoMerge('devices', {devices : data}));
      });
    }
  };

  self.DEFAULT_CPU_UTIL = {
    TYPE: 'CPU_UTIL',
    eyes: function () {
      metrics.cpuUsage(function (data) {
        return logger.info('WATCH /cpu', logger.infoMerge('cpu', data));
      });
    }
  };

  self.DEFAULT_NET_SPEED = {
    TYPE: 'NET_SPEED',
    eyes: function() {
      metrics.networkSpeed(app.CONFIG.speedTest.maxTime * 60 * 1000, function (data) {
        return logger.info('WATCH /netSpeed', logger.infoMerge('speed', data));
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
    if (minutes <= 0) return;
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
};

module.exports = function (app, interval) {
  return new Watch(app, interval);
};
