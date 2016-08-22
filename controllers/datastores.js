var Datastore = require('nedb');
var Device = require('../controllers/device');

var db = {};
db.devices = new Datastore({filename: 'db/devices.db', autoload: true});
db.stats = new Datastore({filename: 'db/stats.db', autoload: true});

db.stats.ensureIndex({ fieldName: 'mac_addr', unique: true }, function (err) {
});
db.devices.ensureIndex({ fieldName: 'mac_addr', unique: true }, function (err) {
});

//Cache latest info
db.devices._cache = {};

db.devices.fetchDevices = function (callback) {
  if (db.devices._cache) { callback(db.devices._cache); }
  else {
    db.devices.find({}, function (err, docs) {
      //TODO log as error instead of just throwing it
      if (err) throw err;
      callback(docs);
    });
  }

};

db.devices.updateDevices = function (devices, callback) {
  devices.forEach(function (device) {
    //Check if device is already cached, if not create new device
    var currDevice = db.devices._cache[device.mac] || new Device(device);
    currDevice.updateTime(device.timestamp);
    db.devices._cache[device.mac] = currDevice;

    db.devices.update({ mac_addr: device.mac }, currDevice.__self__(), { upsert: true }, function (err) {
      if (err) throw err;
    });
  });

  console.log(db.devices._cache);

  // db.devices.update({} );

};


module.exports = db;
