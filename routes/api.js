var express = require('express');
var router = express.Router();

var metrics = require('../controllers/metrics');
var watch = require('../controllers/watch')();
var db = require('../helper/datastores');
var logger = require('../helper/logger');


//GET showing only online devices
router.get('/scan/live', function(req, res, next) {
  metrics.networkScan(function (devices) {
    db.devices.updateDevices(devices);
    logger.info('GET /scan/live', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

//GET shows all devices, both online
router.get('/scan', function (req, res) {

  //TODO make sure the latest data merges with the old data
  db.devices.fetchDevices(function (devices) {
    logger.info('GET /scan/live', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(data);
  });
});

router.put('/scan', function (req, res) {
  db.devices.update('')
  res.send();
});

router.get('/cpu', function (req, res, next) {
  res.send(metrics.cpuUsage());
});

router.get('/speed', function () {

});

module.exports = router;
