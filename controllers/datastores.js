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

db.devices.fetchDevices = function (callback) {

  db.devices.find({}, function (err, docs) {
    //TODO log as error instead of just throwing it
    if (err) throw err;
    if (callback) callback(docs);
  });

};

db.devices.updateDevices = function (devices, callback) {

  devices.forEach(function (device) {
    db.devices.update({ mac_addr: device.mac_addr }, device, { upsert: true }, function (err) {
      if (err) throw err;
    });
  });

  if (callback) callback(devices);
};



module.exports = db;
