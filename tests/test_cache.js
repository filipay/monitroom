var HybridCache = require('../storage/cache.js');

var db = {
  table : {
    '00:00:x0:00:00' : {
      mac_addr: '00:00:x0:00:00',
      name: 'Mock'
    }
  },
  findOne: function (item, callback) {
    callback(null, db.table[item.mac_addr]);
  },
  update: function (item, update, callback) {
    db.table[item.mac_addr] = update;
  }
};
var cache = new HybridCache({ db : db });
cache._key = 'mac_addr';
cache.get('00:00:x0:00:00', function(err, item) {
  console.log(item);
});

cache.set('00:00:x0:00:00', {
  mac_addr: '00:00:x0:00:00',
  name: 'Spock'
});

cache.get('00:00:00:00:00', function(err, item) {
  console.log(err);
  console.log(item);
});

cache.get('00:00:x0:00:00', function(err, item) {
  console.log(item);
});

console.log(db.table);
