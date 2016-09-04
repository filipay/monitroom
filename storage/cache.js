var HybridCache = function (app) {
  var self = this;

  var db = app.db;
  var logger = app.logger || require('winston');

  self._expiredCheck = null;
  self._key = '';

  self.items = {};
  
  self.init = function ( key, data ) {
    self._key = key;
    data.forEach(function (item) {
      var id = item[key];
      self._setId( id, item );
    });
  };

  self.setGarbageCheckInterval = function (interval, max_age) {
    if (self._expiredCheck) {
      clearInterval(self._expiredCheck);
    }

    self._expiredCheck = setInterval(function () {
      self._isExpired(max_age);
    }, interval);
  };

  self._isExpired = function (max_age) {
    var timestamp = Date.now();
    Object.keys(self.items).forEach(function(id) {
      var item = self.items[id];

      if (timestamp - item.timestamp > max_age) {
        item.err = new Error('Item expired at: ' + timestamp);
      }
    });
  };

  self._setId = function ( id, data ) {
    self.items[id] = {
      timestamp: Date.now(),
      item: data
    };
    return self.items[id];
  };

  self._fetchId = function ( id, callback ) {
    var hit = self.items[id];
    if ( !hit ) {
      var lookup = {};
      lookup[self._key] = id;
      return db.findOne(lookup , function(err, doc) {
        if (err) logger.err('DB Cache miss for ID: ' + id);
        hit = {};
        if (!doc) hit.err = new Error('Item not found.');
        else hit = self._setId( id, doc);
        return callback(err, hit);
      });

    }
    return callback(null, hit);
  };

  self.get = function( id, callback ) {
    return self._fetchId( id, function(err, hit) {
      if (callback) return callback(hit.err, hit.item);
      return hit.item;
    });
  };

  self.set = function ( id, data, callback ) {
    var lookup = {};
    lookup[self._key] = id;
    db.update(lookup, data, { upsert: true }, function( err ) {
      if (err) logger.err('Error updating item ID: ' + id);
    });
    self._fetchId( id, function(err, hit) {
      hit = self._setId(id, data);
      if (callback) return callback( err, hit.item );
    });
  };
};

module.exports = HybridCache;
