var Device = function (data) {
  if (!data) throw Error('Data not provided for device creation!');

  var self = this;

  self.mac_addr = data.mac;
  self.ip = data.ip;
  self.vendor = data.vendor;
  self.device_name = data.device_name || '';
  self.times = {
    start: data.timestamp,
    last: data.timestamp
  };

  self.setTTL = function (minutes) {
    self._ttl = minutes * 60 * 1000;
  };

  self.updateTime = function (timestamp) {
    if (timestamp - self.times.last > self._ttl) {
      self.times.start = timestamp;
    }
    self.times.last = timestamp;
  };

  //Return variables of the objects only
  self.__self__ = function () {
    return {
      mac_addr : self.mac_addr,
      ip : self.ip,
      vendor : self.vendor,
      device_name : self.device_name,
      times : self.times
    };
  };
};
