var db = {
  table : {
    '00:00:x0:00:00' : {
      mac_addr: '00:00:x0:00:00',
      name: 'Mock'
    }
  },
  fetchAll: function(callback) {
    return callback(Object.keys(db.table).map(function(key) {
      return db.table[key];
    }));
  },
  findOne: function (item, callback) {
    callback(null, db.table[item.mac_addr]);
  },
  update: function (item, update, callback) {
    db.table[item.mac_addr] = update;
  }
};

var scanner = function(callback) {
  return callback([{ip: '127.0.0.1', mac_addr: '00:00:00:00:00'}]);
};

var logger = {
  info: function() {},
  error: function() {},
};

module.exports = {
  db: db,
  scanner: scanner,
  logger: logger
};
