/* global Screen, Client */
(function () {
  'use strict';

  var client;
  document.getElementById('disconnect-btn').addEventListener('click', function () {
    client.disconnect();
    document.getElementById('screen-wrapper').style.display = 'none';
    document.getElementById('form-wrapper').style.display = 'block';
  });

  document.getElementById('login-btn').addEventListener('click', function () {
    var canvas = document.getElementById('screen');
    var screen = new Screen(canvas);
    client = new Client(screen);
    client.connect({
      host: document.getElementById('host').value,
      port: parseInt(document.getElementById('port').value, 10),
      password: document.getElementById('password').value
    }).then(function () {
      document.getElementById('form-wrapper').style.display = 'none';
      document.getElementById('screen-wrapper').style.display = 'block';
    });
  }, false);

}());
