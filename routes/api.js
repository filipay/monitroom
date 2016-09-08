var express = require('express');
var router = express.Router();

var app = {};
var db = require('../storage/datastores');
var logger = require('../storage/logger');
var device = require('../models/device');

app.db = db.devices;
app.logger = logger;
app.caster = device;

var watch = require('../controllers/watch')();
var cache = require('../storage/cache')(app);
db.devices.fetchAll(function(devices) {
  cache.init('mac_addr', devices);
});
var metrics = require('../controllers/metrics')({ cache : cache });

// watch.startWatching(watch.DEFAULT_NET_SCAN, 0.5);
// watch.startWatching(watch.DEFAULT_CPU_UTIL, 1);
// watch.startWatching(watch.DEFAULT_NET_SPEED, 0.5);

//GET shows all devices, both online
router.get('/devices/all', function (req, res) {

  //TODO make sure the latest data merges with the old data
  var devices = cache.getAll();
  logger.info('GET /devices/all', devices.map(function (device) {
    return device.mac_addr;
  }));
  res.send(devices);
});

//GET showing only online devices
router.get('/devices', function(req, res, next) {
  metrics.networkScan(function (devices) {
    logger.info('GET /devices', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

router.put('/devices/:mac_addr', function (req, res) {
  var update = { name : req.body.name };
  cache.set(req.params.mac_addr, update);
  // console.log(cache.items);
  logger.info('PUT /devices', { name : req.body.name });
  res.send('OK');
});

router.get('/cpu', function (req, res, next) {
  metrics.cpuUsage(function (data) {
    logger.info('GET /cpu', data);
    res.send(data);
  });
});

router.get('/speed', function () {
  metrics.networkSpeed(function (data) {
    logger.info('GET /netSpeed', data);
    res.send(data);
  });
});

module.exports = router;
