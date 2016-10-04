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

var cache = require('../storage/cache')(app);
cache.create('mac_addr');
app.cache = cache;

var metrics = require('../controllers/metrics')(app);
app.metrics = metrics;

var watch = require('../controllers/watch')(app);

watch.startWatching(watch.DEFAULT_NET_SCAN, 0.5);
watch.startWatching(watch.DEFAULT_CPU_UTIL, 1);
watch.startWatching(watch.DEFAULT_NET_SPEED, 0.5);

//GET shows all devices, both online
router.get('/devices/all', function (req, res) {
  isQuery(req, function( results ){
    if (results) return res.send(results);
    //TODO make sure the latest data merges with the old data
    metrics.networkScan(false, function (devices) {
      res.send(devices);
      return logger.info('GET /devices/all', devices.map(function (device) {
        return device.mac_addr;
      }));
    });
  });
});

//GET showing only online devices
router.get(['/devices','/devices/live'], function(req, res, next) {
  isQuery(req, function( results ){
    if (results) return res.send(results);
    metrics.networkScan(true, function (devices) {
      var macs = devices.reduce(function (prev, curr) {
        prev[curr.mac_addr] = curr;
        return prev;
      }, {});

      res.send(devices);
      return logger.info('GET /devices', logger.infoMerge('devices', macs, req));
    });
  });
});

router.put('/devices/:mac_addr', function (req, res) {
  var update = {
    name : req.body.name,
    mac_addr: req.params.mac_addr
  };
  cache.set(req.params.mac_addr, update, function(err) {
    if (err) {
      res.sendStatus(403);
      return logger.err('Error: PUT /devices', err);
    }

    res.sendStatus(200);
    return logger.info('PUT /devices', logger.infoMerge('put_devices', update, request));
  });

});

router.get('/cpu', function (req, res, next) {
  isQuery(req, function(results) {
    if (results) return res.send(results);
    metrics.cpuUsage(function (data) {
      res.send(data);
      return logger.info('GET /cpu', logger.infoMerge('cpu', data , req));
    });
  });
});

router.get('/speed', function (req, res) {
  isQuery(req, function( results ){
    if (results) return res.send(results);
    metrics.networkSpeed(res, function (data) {
      res.send(data);
      return logger.info('GET /netSpeed', logger.infoMerge('speed', data, req));
    });
  });
});

var isQuery = function(req, callback) {
  if (Object.keys(req.query).length > 0) {
    if (Array.isArray(req.path)) {
      var field = req.path[0].substr(1);
    } else {
      var field = req.path.substr(1);
    }
    req.query.fields = [field];
    return logger.query(req.query, function(err, data) {
      if (err) throw err;
      var results = data['info-file'].filter(function(row) {
        return row[field];
      });

      logger.info('QUERY /' + field, logger.infoMerge('query_'+field, req.query, req));
      return callback(results);
    });
  }
  return undefined;
}

module.exports = router;
