var Datastore = require('nedb');
var db = {};
db.users = new Datastore({filename: 'db/users.db', autoload: true});
db.stats = new Datastore({filename: 'db/stats.db', autoload: true});
db.users.ensureIndex({ fieldName: 'mac_addr', unique: true }, function (err) {
});
db.stats.ensureIndex({ fieldName: 'mac_addr', unique: true }, function (err) {
});

module.export = db;
