var Device = function (data) {
  if (!data) throw Error('Data not provided for device creation!');

  var self = this;

  self.mac_addr = data.mac || data.mac_addr;
  self.ip = data.ip;
  self.vendor = data.vendor;
  self.device_name = data.device_name || '';
  self.times = data.times || {
    start: data.timestamp,
    end: data.timestamp
  };
  self._ttl = 5 * 60 * 1000;

  self.setTTL = function (minutes) {
    self._ttl = minutes * 60 * 1000;
  };

  self.updateTime = function (timestamp) {
    //Check if the diff in time is bigger than ttl
    if (timestamp - self.times.end > self._ttl) {
      self.times.start = timestamp;
    }
    self.times.end = timestamp;
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

module.exports = Device;
