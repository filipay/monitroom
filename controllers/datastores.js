var Datastore = require('nedb');
var db = {};
db.users = new Datastore({filename: 'db/users.db', autoload: true});
db.stats = new Datastore({filename: 'db/stats.db', autoload: true});

db.stats.ensureIndex({ fieldName: 'mac_addr', unique: true }, function (err) {
});
db.users.ensureIndex({ fieldName: 'mac_addr', unique: true }, function (err) {
});

//Cache latest info
db.users._cache = undefined;

db.users.fetchUsers = function (callback) {
  if (db.users._cache) { callback(db.users._cache); }
  else {
    db.users.find({}, function (err, docs) {
      //TODO log as error instead of just throwing it
      if (err) throw err;
      callback(docs);
    });
  }

};

db.users.updateUsers = function (users, callback) {
  var full_users = [];
  users.forEach(function (user) {
    full_users.push({
      mac_addr: user.mac,
      ip: user.ip,
      vendor: user.vendor,
      last_seen: user.timestamp,
      device_name: ''
    });
  });


  // db.users.update({} );

};


module.exports = db;
