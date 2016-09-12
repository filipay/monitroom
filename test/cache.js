var expect = require('chai').expect;

var mock_db = {
  table : {
    '00:00:x0:00:00' : {
      mac_addr: '00:00:x0:00:00',
      name: 'Mock'
    }
  },
  findOne: function (item, callback) {
    callback(null, mock_db.table[item.mac_addr]);
  },
  update: function (item, update, callback) {
    mock_db.table[item.mac_addr] = update;
  }
};

var HybridCache = require('../storage/cache'),
    Caster = require('../models/device'),
    cache;

describe('HybridCache', function() {
  beforeEach(function() {
    cache = HybridCache({ db: mock_db, caster: Caster});
    cache._key = 'mac_addr';
  });

  describe('#get', function() {
    it('should get the object from DB', function() {
      cache.get('00:00:x0:00:00', function(err, item) {
        expect(item.name).to.equal('Mock');
      });
    });

    it('should give error: item not found', function() {
      cache.get('00:00:00:00:00', function(err, item) {
        expect(err.message).to.equal('Item not found.');
      });
    });
  });
  describe('#set', function() {

  });
});
