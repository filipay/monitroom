var HybridCache = function (app) {
  var self = this;

  if (!app.caster) throw new Error('Missing Caster for Cache');
  if (!app.db) throw new Error('Missing DB for Cache');
  if (!(new app.caster({})).__self__) throw new Error('Caster doesn\'t contain __self__');

  var db = app.db;
  var Caster = app.caster;

  var logger = app.logger || require('./logger');

  self._expiredCheck = null;
  self._key = '';

  self.create = function ( key, callback ) {
    self._key = key;
    self.items = {};
    self.inital_scan = false;
    return db.fetchAll(function(data){
      data.forEach(function (item) {
        var id = item[key];
        self._setId( id, item );
      });
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
    var data_keys = Object.keys(data);

    //If the object exists, get the keys, otherwise use data_keys, since it will be the same length
    var item_keys = self.items[id] ? Object.keys(self.items[id].item.__self__()) : data_keys;

    //If the item keys aren't the same length as data keys, data wants to update specific keys
    //Keep those keys and add exisiting item_keys that are missing from the object
    if (data_keys.length !== item_keys.length) {
      var item = self.items[id].item;
      item_keys.forEach(function( key ) {
        if (!data[key]) {
          data[key] = item[key];
        }
      });
    }
    self.items[id] = {
      timestamp: Date.now(),
      item: new Caster(data)
    };

    return self.items[id];
  };

  self._fetchId = function ( id, callback ) {
    var hit = self.items[id];
    if ( !hit ) {
      var lookup = {};
      lookup[self._key] = id;
      return db.findOne(lookup , function(err, doc) {
        if (err) logger.err('DB err: ' + err);
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

    self._fetchId( id, function(err, hit) {
      hit = self._setId(id, data);

      db.update(lookup, hit.item.__self__(), { upsert: true }, function( err ) {
        if (err) logger.err('Error updating item ID: ' + id);
      });

      if (callback) return callback( err, hit.item );
    });
  };


  self.getLatest = function (age) {
    var list = [];
    var timestamp = Date.now();

    Object.keys(self.items).forEach(function (key) {
      var entry = self.items[key];
      if ( timestamp - entry.timestamp <= age ) {
        list.push(entry.item.__self__());
      }
    });

    return list;
  };

  self.getAll = function(latest_data) {
    var set = {};
    var list = latest_data || self.getLatest(15 * 1000);
    list.map(function(data) {
      set[data[self._key]] = data;
    });

    Object.keys(self.items).forEach(function (key) {
      if (!set[key]) {
        set[key] = self.items[key].item.__self__();

      }
    });
    var everything = Object.keys(set).map(function(key) {
      return set[key];
    });
    return everything;
  };
};

module.exports = function (app) {
  return new HybridCache(app);
};
