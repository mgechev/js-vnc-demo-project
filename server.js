var rfb = require('rfb'),
  port = 8090,
  socketIoPort = 8091,
  socketio = require('socket.io').listen(socketIoPort, { log: false }),
  Png = require('./node_modules/node-png/build/Release/png').Png,
  connect = require('connect'),
  clients = [];

function createRfbConnection(config, socket) {
  var r = rfb.createConnection({
    host: config.host,
    port: config.port,
    password: config.password
  });
  addEventHandlers(r, socket);
  return r;
}

function addEventHandlers(r, socket) {
  r.on('connect', function () {
    socket.emit('init', {
      width: r.width,
      height: r.height
    });
    clients.push({
      socket: socket,
      rfb: r
    });
  });
  r.on('rect', function (rect) {
    handleFrame(socket, rect, r);
    r.requestUpdate(false, 0, 0, r.width, r.height);
  });
}

function handleFrame(socket, rect, r) {
  var rgb = new Buffer(rect.width * rect.height * 3, 'binary'),
    offset = 0;

  for (var i = 0; i < rect.data.length; i += 4) {
    rgb[offset++] = rect.data[i + 2];
    rgb[offset++] = rect.data[i + 1];
    rgb[offset++] = rect.data[i];
  }
  var image = new Png(rgb, r.width, r.height, 'rgb');
  image = image.encodeSync();
  socket.emit('frame', {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    image: image.toString('base64')
  });
}

function disconnectClient(socket) {
  clients.forEach(function (pair) {
    if (pair.socket === socket) {
      pair.rfb.end();
    }
  });
  clients = clients.filter(function (pair) {
    return pair.socket === socket;
  });
}

connect.createServer(connect.static('./static')).listen(port);

socketio.sockets.on('connection', function (socket) {
  socket.on('init', function (config) {
    var r = createRfbConnection(config, socket);
    socket.on('mouse', function (evnt) {
      r.pointerEvent(evnt.x, evnt.y, evnt.button);
    });
    socket.on('keyboard', function (evnt) {
      r.keyEvent(evnt.keyCode, evnt.isDown);
    });
    socket.on('disconnect', function () {
      disconnectClient(socket);
    });
  });
});

console.log('Listening on port', port);
console.log('SocketIO listening on port', socketIoPort);
