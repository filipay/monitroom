var express = require('express');
var router = express.Router();

var app = {};
var db = require('../storage/datastores');
var log = require('../storage/logger');
var winston = log.winston;
var logger = log.logger;
var device = require('../models/device');

app.db = db.devices;
app.logger = logger;
app.caster = device;

var watch = require('../controllers/watch')();
var cache = require('../storage/cache')(app);
cache.create('mac_addr');
var metrics = require('../controllers/metrics')({ cache : cache });

// watch.startWatching(watch.DEFAULT_NET_SCAN, 0.5);
// watch.startWatching(watch.DEFAULT_CPU_UTIL, 1);
// watch.startWatching(watch.DEFAULT_NET_SPEED, 0.5);

//GET shows all devices, both online
router.get('/devices/all', function (req, res) {

  //TODO make sure the latest data merges with the old data
  metrics.networkScan(false, function (devices) {
    logger.info('GET /devices/all', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

//GET showing only online devices
router.get('/devices', function(req, res, next) {
  metrics.networkScan(true, function (devices) {
    logger.info('GET /devices', devices.map(function (device) {
      return device.mac_addr;
    }));
    res.send(devices);
  });
});

router.put('/devices/:mac_addr', function (req, res) {
  var update = {
    name : req.body.name,
    mac_addr: req.params.mac_addr
  };
  cache.set(req.params.mac_addr, update, function(err) {
    if (err) {
      logger.err('Error: PUT /devices', err);
      res.sendStatus(403);
    }

    logger.info('PUT /devices', { put_name: update });
    res.sendStatus(200);
  });

});

router.get('/cpu', function (req, res, next) {
  console.log(req.query);
  if (Object.keys(req.query).length > 0) {
    if (req.query.start_t) {
      var q = {
        from: Date.now() - req.query.start_t,
        until: Date.now(),
        order: 'desc',
        fields: ['message']
      };
      logger.query(q, function(err, results) {
        if (err) throw err;
        res.send(results);
      });
    }
    return;
  }
  metrics.cpuUsage(function (data) {
    logger.info('GET /cpu', {cpu : data});
    return res.send(data);
  });
});

router.get('/speed', function (req, res) {
  metrics.networkSpeed(res, function (data) {
    logger.info('GET /netSpeed', data);
    res.send(data);
  });
});

module.exports = router;
