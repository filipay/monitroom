var express = require('express');
var router = express.Router();

var metrics = require('../controllers/metrics');
var watch = require('../controllers/watch')();
var db = require('../storage/datastores');
var logger = require('../storage/logger');

// watch.startWatching(watch.DEFAULT_NET_SCAN, 0.5);
// watch.startWatching(watch.DEFAULT_CPU_UTIL, 1);
// watch.startWatching(watch.DEFAULT_NET_SPEED, 0.5);

//GET shows all devices, both online
router.get('/devices/all', function (req, res) {

  //TODO make sure the latest data merges with the old data
  db.devices.fetchAll(function (devices) {
    logger.info('GET /devices/all', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

//GET showing only online devices
router.get('/devices', function(req, res, next) {
  metrics.networkScan(function (devices) {
    db.devices.updateAll(devices);
    logger.info('GET /devices', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

router.put('/devices/:mac_addr', function (req, res) {
  db.devices.updateName(req.params.mac_addr, req.body.name);
  metrics.updateName(req.params.mac_addr, req.body.name);
  logger.info('PUT /devices', req.body);
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
