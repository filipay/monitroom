var express = require('express');
var router = express.Router();
var metrics = require('../controllers/metrics');
var db = require('../controllers/datastores');
var watch = require('../controllers/watch')();

watch.setCheckRate(5);

//GET showing only online devices
router.get('/scan/live', function(req, res, next) {
  metrics.networkScan(function (devices) {
    db.devices.updateDevices(devices);
    res.send(devices);
  });
});

//GET shows all devices, both online
router.get('/scan/all', function (req, res) {

  //TODO make sure the latest data merges with the old data
  db.devices.fetchDevices(function (data) {
    res.send(data);
  });
});

router.put('/scan', function (req, res) {
  console.log(req.body());
  res.send();
});

router.get('/cpu', function (req, res, next) {
  res.send(metrics.cpuUsage());
});

router.get('/speed', function () {

});

module.exports = router;
