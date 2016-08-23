var Datastore = require('nedb');
var Device = require('../models/device');

var db = {};
db.devices = new Datastore({filename: 'db/devices.db', autoload: true});
db.cpu = new Datastore({filename: 'db/cpu.db', autoload: true});
db.network = new Datastore({filename: 'db/network.db', autoload: true});

db.cpu.ensureIndex({ fieldName: 'timestamp', unique: true }, function (err) {
});
db.network.ensureIndex({ fieldName: 'timestamp', unique: true }, function (err) {
});
db.devices.ensureIndex({ fieldName: 'mac_addr', unique: true }, function (err) {
});

//Cache latest info
db.devices._cache = {};

db.devices.fetchDevices = function (callback) {

  db.devices.find({}, function (err, docs) {
    //TODO log as error instead of just throwing it
    if (err) throw err;

    docs.forEach(function (doc) {
      if (!db.devices._cache[doc.mac_addr]) {
        db.devices._cache[doc.mac_addr] = new Device(doc);
      }
    });
    console.log(db.devices._cache);
    if (callback) callback(docs);
  });

};

db.devices.updateDevices = function (devices, callback) {
  var meaningful_devices = [];
  devices.forEach(function (device) {
    //Check if device is already cached, if not create new device
    var currDevice = db.devices._cache[device.mac] || new Device(device);
    currDevice.updateTime(device.timestamp);
    db.devices._cache[device.mac] = currDevice;
    meaningful_devices.push(currDevice.__self__());

    db.devices.update({ mac_addr: device.mac }, currDevice.__self__(), { upsert: true }, function (err) {
      if (err) throw err;
    });
  });

  if (callback) callback(meaningful_devices);
  console.log(db.devices._cache);

};



module.exports = db;
