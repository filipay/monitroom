var express = require('express');
var router = express.Router();
var metrics = require('../controllers/metrics');

metrics.setCheckRate(0.5);
/* GET users listing. */
router.get('/scan', function(req, res, next) {
  metrics.networkScan(function (data) {
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
