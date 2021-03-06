var app = {};

app.get = {};
app.put = {};

app.get.devices = {};

app.get.devices.api = function(suffix) {
  var td = $('.td-template').empty().clone();
  var tr = $('.tr-template').empty().clone();
  var index = 0;
  $('.tbody-template').html('<h3>Loading...<\h3>');
  $.get(window.location.origin + '/api/devices' + suffix, function (results) {
    console.log(results);
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
};

app.get.devices.live = function() {
  return app.get.devices.api('');
};

app.get.devices.all = function() {
  return app.get.devices.api('/all');
};

$(app.get.devices.all);
