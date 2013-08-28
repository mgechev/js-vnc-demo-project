(function () {

    var Config = {
        URL: 'http://localhost:8091'
    };

    function offset(elem) {
        var rect = elem.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    }

    function Screen(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
    }

    Screen.prototype.drawRect = function (rect) {
        var img = new Image(),
            that = this;
        img.width = rect.width;
        img.height = rect.height;
        img.src = 'data:image/png;base64,' + rect.image;
        img.onload = function () {
            that._context.drawImage(this, rect.x, rect.y, rect.width, rect.height);
        };
    };

    Screen.prototype.addMouseHandler = function (cb) {
        var canvasOffset = offset(this._canvas);
        this._canvas.addEventListener('mousedown', function (e) {
            cb.call(null, e.pageX - canvasOffset.left, e.pageY - canvasOffset.top, 1);
            e.preventDefault();
        }, false);
        this._canvas.addEventListener('mouseup', function (e) {
            cb.call(null, e.pageX - canvasOffset.left, e.pageY - canvasOffset.top, 0);
            e.preventDefault();
        }, false);
    };

    Screen.prototype.addKeyboardHandlers = function (cb) {
        document.addEventListener('keydown', function (e) {
            cb.call(null, e.keyCode, 1);
            e.preventDefault();
        }, false);
        document.addEventListener('keydown', function (e) {
            cb.call(null, e.keyCode, 0);
            e.preventDefault();
        }, false);
    };

    Screen.prototype.getCanvas = function () {
        return this._canvas;
    };

    function Client(screen) {
        this._screen = screen;
    }

    Client.prototype._initEventListeners = function () {
        var self = this;
        this._screen.addMouseHandler(function (x, y, button) {
            self._socket.emit('mouse', {
                x: x,
                y: y,
                button: button
            });
        });
        this._screen.addKeyboardHandlers(function (code, isDown) {
            self._socket.emit('keyboard', {
                keyCode: code,
                isDown: isDown
            });
        });
    };

    Client.prototype.connect = function (config) {
        var self = this;
        this._socket = io.connect(Config.URL);
        this._socket.emit('init', {
            host: config.host,
            port: config.port,
            password: config.password
        });
        this._addHandlers(config.callback);
        this._initEventListeners();
    };

    Client.prototype._addHandlers = function (callback) {
        var that = this;
        this._socket.on('init', function (config) {
            var canvas = that._screen.getCanvas();
            canvas.width = config.width;
            canvas.height = config.height;
            if (typeof callback === 'function') callback();
        });
        this._socket.on('frame', function (frame) {
            that._screen.drawRect(frame);
        });
    };


    document.getElementById('loginBtn').addEventListener('click', function () {
        var screen = new Screen(document.getElementById('screen')),
            client = new Client(screen);

        client.connect({
            host: document.getElementById('host').value,
            port: parseInt(document.getElementById('port').value, 10),
            password: document.getElementById('password').value,
            callback: function () {
                document.getElementById('form-wrapper').classList.add('form-wrapper-hidden');
            }
        });
    }, false);

}());
