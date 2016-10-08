var express = require('express');
var router = express.Router();
var fs = require('fs');
var CONFIG = JSON.parse(fs.readFileSync('config.json','utf8'));

var app = {};

var db = require('../storage/datastores');
var log = require('../storage/logger');
var winston = log.winston;
var logger = log.logger;
var device = require('../models/device');

app.CONFIG = CONFIG;
app.db = db.devices;
app.logger = logger;
app.caster = device;

var cache = require('../storage/cache')(app);
cache.create('mac_addr');
app.cache = cache;

var metrics = require('../controllers/metrics')(app);
app.metrics = metrics;

var watch = require('../controllers/watch')(app);

watch.startWatching(watch.DEFAULT_NET_SCAN, CONFIG.intervals.net_scan);
watch.startWatching(watch.DEFAULT_CPU_UTIL, CONFIG.intervals.cpu_util);
watch.startWatching(watch.DEFAULT_NET_SPEED, CONFIG.intervals.net_speed);

//GET shows all devices, both online
router.get('/devices/all', function (req, res) {
  isQuery(req, function( results ){
    if (results) return res.send(results);

    metrics.networkScan(false, function (devices) {
      return res.send(devices);
      // return logger.info('GET /devices/all', devices.map(function (device) {
      //   return device.mac_addr;
      // }));
    });
  });
});

//GET showing only online devices
router.get(['/devices','/devices/live'], function(req, res, next) {
  isQuery(req, function( results ){
    if (results) return res.send(results);
    metrics.networkScan(true, function (devices) {
      res.send(devices);
      return logger.info('GET /devices', logger.infoMerge('devices', {devices : devices}, req));
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
    metrics.networkSpeed(2000,function (data) {
      res.send(data);
      return logger.info('GET /netSpeed', logger.infoMerge('speed', data, req));
    });
  });
});

var isQuery = function(req, callback) {
  if (Object.keys(req.query).length > 0) {
    var path = '';
    if (Array.isArray(req.path)) {
      path = req.path[0].substr(1);
    } else {
      path = req.path.substr(1);
    }
    req.query.fields = ['name','data'];
    return logger.query(req.query, function(err, data) {
      if (err) throw err;
      var filtered = data['info-file'].filter(function(row) {
        if (row) { return row.name === path; }
        return false;
      });
      // var filled = filtered;
      var filled = filtered.fillBlanks(0, 1.2 * 60 * 1000);
      logger.info('QUERY /' + path, logger.infoMerge('query_'+path, req.query, req));
      return callback(filled);
    });
  }
  return callback(undefined);
};

Array.prototype.fillBlanks = function(index, increment) {
    if (this.length === 0 || index === this.length - 1) return this;
    var curr = this[index],
        next = this[index+1];

    var is_ascending = curr.data.timestamp < next.data.timestamp;

    var interval = Math.abs(curr.data.timestamp - next.data.timestamp);
    if (interval > increment) {
      var stump = JSON.parse(JSON.stringify(curr));
      Object.keys(stump.data).forEach(function(key){
        if (key === 'timestamp') {
          stump.data.timestamp = is_ascending ?
          curr.data.timestamp + increment:
          curr.data.timestamp - increment;
        }
        else stump.data[key] = 0;
      });
      this.splice(index + 1, 0, stump);
    }
    return this.fillBlanks(index + 1, increment);
};



module.exports = router;
