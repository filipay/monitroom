
  var app = {
    get : {
      devices: function () {
        var td = $('.td-template').clone();
        var tr = $('.tr-template').empty().clone();
        var index = 0;
        $('.tbody-template').html('<h3>Loading...<\h3>');
        $.get('http://localhost:3000/api/scan/live', function (results) {
          $('.tbody-template').empty();
          results.forEach(function (device) {
            var device_tr = tr.clone();

            device_tr.append(td.clone().html(index));
            device_tr.append(td.clone().html(device.name));
            device_tr.append(td.clone().html(device.ip));
            device_tr.append(td.clone().html(device.mac_addr));
            device_tr.append(td.clone().html(device.vendor));
            var last_seen = Math.floor((Date.now() - device.times.end) / (60 * 1000));
            device_tr.append(td.clone().html(last_seen + ' minutes ago'));

            $('.tbody-template').append(device_tr);
            index++;
          });

        });
      }
    }
  };

  $(app.get.devices);
