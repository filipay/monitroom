var Device = function (data) {
  if (!data) throw Error('Data not provided for device creation!');

  var self = this;

  self.mac_addr = data.mac || data.mac_addr;
  self.ip = data.ip;
  self.vendor = data.vendor;
  self.name = data.name || '';
  self.timestamps = data.timestamps || {
    start: data.timestamp,
    end: data.timestamp
  };

  self._ttl = 5 * 60 * 1000;

  self.setTTL = function (minutes) {
    self._ttl = minutes * 60 * 1000;
  };

  self.updateTime = function (timestamp) {
    //Check if the diff in time is bigger than ttl
    if (timestamp - self.timestamps.end > self._ttl) {
      self.timestamps.start = timestamp;
    }
    self.timestamps.end = timestamp;
  };

  //Return variables of the objects only
  self.__self__ = function () {
    return {
      mac_addr : self.mac_addr,
      ip : self.ip,
      vendor : self.vendor,
      name : self.name,
      timestamps : self.timestamps
    };
  };
};

module.exports = Device;
