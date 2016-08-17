var express = require('express');
var router = express.Router();
var metrics = require('../controllers/metrics');
/* GET users listing. */
router.get('/scan', function(req, res, next) {
  metrics.networkScan(function (data) {
    res.send(data);
  });
});

router.get('/cpu', function (req, res, next) {
  res.send(metrics.cpuUsage());
});

router.get('/speed', function () {

});

router.put('/scan', function (req, res, next) {

});
// setInterval(listenToNetworkHosts,1000);

module.exports = router;
