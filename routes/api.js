var express = require('express');
var router = express.Router();

var metrics = require('../controllers/metrics');
var watch = require('../controllers/watch')();
var db = require('../storage/datastores');
var logger = require('../storage/logger');

// watch.startWatching(watch.DEFAULT_CPU_UTIL, 1);
// watch.startWatching(watch.DEFAULT_NET_SCAN, 0.5);

//GET shows all devices, both online
router.get('/scan/all', function (req, res) {

  //TODO make sure the latest data merges with the old data
  db.devices.fetchAll(function (devices) {
    logger.info('GET /scan', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

//GET showing only online devices
router.get('/scan/live', function(req, res, next) {
  metrics.networkScan(function (devices) {
    db.devices.updateAll(devices);
    logger.info('GET /scan/live', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

router.put('/device', function (req, res) {
  db.devices.updateName(req.body);
  logger.info('PUT /device', req.body);
  res.send('OK');
});

router.get('/cpu', function (req, res, next) {
  metrics.cpuUsage(function (data) {
    logger.info('GET /cpu', data);
    res.send(data);
  });

});

router.get('/speed', function () {

});

module.exports = router;
