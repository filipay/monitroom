var Datastore = require('nedb');
var Device = require('../models/device');
var logger = require('../storage/logger.js');
var DAY = 24 * 60 * 60 * 1000;

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


db.devices.fetchAll = function (callback) {

  db.devices.find({}, function (err, docs) {
    //TODO log as error instead of just throwing it
    if (err) throw err;
    if (callback) callback(docs);
  });

};

db.devices.updateAll = function (devices, callback) {

  devices.forEach(function (device) {
    db.devices.update({ mac_addr: device.mac_addr }, device, { upsert: true }, function (err) {
      if (err) throw err;
    });
  });

  if (callback) callback(devices);
};

db.devices.updateName = function (mac_addr, name) {

  db.devices.update({ mac_addr : mac_addr }, { $set : { name : name } }, {}, function (err, no, aff) {
    if (err) throw err;
    logger.debug('Updated # rows: ', no);
  });
};

module.exports = db;
