var rfb = require('rfb2'),
    socketio = require('socket.io').listen(8091, { log: false }),
    Png = require('./node_modules/node-png/build/Release/png').Png,
    connect = require('connect'),
    clients = [];

connect.createServer(connect.static('./static')).listen(8090);

socketio.sockets.on('connection', function (socket) {
    socket.on('init', function (data) {
        var r = rfb.createConnection({
            host: data.host,
            port: data.port,
            password: data.password
        });
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
        });
        socket.on('mouse', function (evnt) {
            r.pointerEvent(evnt.x, evnt.y, evnt.button);
        });
        socket.on('keyboard', function (evnt) {
            r.keyEvent(evnt.keyCode, evnt.isDown);
        });

    });

    socket.on('disconnect', function () {
        clients.forEach(function (pair) {
            if (pair.socket === socket) {
                pair.rfb.end();
            }
        });
        clients = clients.filter(function (pair) {
            return pair.socket === socket;
        });
    });
});
