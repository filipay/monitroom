var expect = require('chai').expect;
var fakes = require('./fakes');
var db = fakes.db;

var HybridCache = require('../storage/cache'),
    Caster = require('../models/device'),
    cache;

describe('HybridCache', function() {
  before(function() {
    cache = HybridCache({ db: db, caster: Caster});
  });

  describe('#create', function() {
    it('should have no data prior create()', function() {
      expect(cache.items).to.equal(undefined);
    });
    it('should import data from db', function() {
      cache.create('mac_addr');
      expect(cache.items['00:00:x0:00:00'].item.name).to.equal('Mock');
    });
  });
  describe('#get', function() {
    beforeEach(function() {
      cache.create('mac_addr');
    });

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
    beforeEach(function() {
      cache.create('mac_addr');
    });
    it('should update the name', function() {
      cache.set('00:00:x0:00:00', { name: 'Spock' }, function (err, item) {
        expect(item.name).to.equal('Spock');
      });
    });

    it('should add the item', function () {
      var mock_item = {
        name : 'Mock-Mobile',
        mac_addr: 'aa:00:x0:00:00'
      };

      cache.set('aa:00:x0:00:00', mock_item, function(err, setItem){
        cache.get('aa:00:x0:00:00', function (err, getItem) {
          expect(getItem.name).to.equal(mock_item.name);
        });
      });
    });
  });


});
