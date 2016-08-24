var express = require('express');
var router = express.Router();
var metrics = require('../controllers/metrics');
var db = require('../controllers/datastores');
var watch = require('../controllers/watch')();

watch.setCheckRate(5);

// metrics.setCheckRate(0.5);
/* GET users listing. */
router.get('/scan', function(req, res, next) {
  metrics.networkScan(function (data) {
    db.devices.updateDevices(data, callback);
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
