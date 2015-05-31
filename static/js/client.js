/* global io */
(function () {
  'use strict';
  var Config = {
      URL: 'http://localhost:8090'
    };
  var keyMap = {
    8: [
      65288,
      65288
    ],
    9: [
      65289,
      65289
    ],
    13: [
      65293,
      65293
    ],
    16: [
      65506,
      65506
    ],
    17: [
      65508,
      65508
    ],
    18: [
      65514,
      65514
    ],
    27: [
      65307,
      65307
    ],
    32: [
      32,
      32
    ],
    33: [
      65365,
      65365
    ],
    34: [
      65366,
      65366
    ],
    35: [
      65367,
      65367
    ],
    36: [
      65360,
      65360
    ],
    37: [
      65361,
      65361
    ],
    38: [
      65362,
      65362
    ],
    39: [
      65363,
      65363
    ],
    40: [
      65364,
      65364
    ],
    45: [
      65379,
      65379
    ],
    46: [
      65535,
      65535
    ],
    48: [
      48,
      41
    ],
    49: [
      49,
      33
    ],
    50: [
      50,
      64
    ],
    51: [
      51,
      35
    ],
    52: [
      52,
      36
    ],
    53: [
      53,
      37
    ],
    54: [
      54,
      94
    ],
    55: [
      55,
      38
    ],
    56: [
      56,
      42
    ],
    57: [
      57,
      40
    ],
    65: [
      97,
      65
    ],
    66: [
      98,
      66
    ],
    67: [
      99,
      67
    ],
    68: [
      100,
      68
    ],
    69: [
      101,
      69
    ],
    70: [
      102,
      70
    ],
    71: [
      103,
      71
    ],
    72: [
      104,
      72
    ],
    73: [
      105,
      73
    ],
    74: [
      106,
      74
    ],
    75: [
      107,
      75
    ],
    76: [
      108,
      76
    ],
    77: [
      109,
      77
    ],
    78: [
      110,
      78
    ],
    79: [
      111,
      79
    ],
    80: [
      112,
      80
    ],
    81: [
      113,
      81
    ],
    82: [
      114,
      82
    ],
    83: [
      115,
      83
    ],
    84: [
      116,
      84
    ],
    85: [
      117,
      85
    ],
    86: [
      118,
      86
    ],
    87: [
      119,
      87
    ],
    88: [
      120,
      88
    ],
    89: [
      121,
      89
    ],
    90: [
      122,
      90
    ],
    97: [
      49,
      49
    ],
    98: [
      50,
      50
    ],
    99: [
      51,
      51
    ],
    100: [
      52,
      52
    ],
    101: [
      53,
      53
    ],
    102: [
      54,
      54
    ],
    103: [
      55,
      55
    ],
    104: [
      56,
      56
    ],
    105: [
      57,
      57
    ],
    106: [
      42,
      42
    ],
    107: [
      61,
      61
    ],
    109: [
      45,
      45
    ],
    110: [
      46,
      46
    ],
    111: [
      47,
      47
    ],
    112: [
      65470,
      65470
    ],
    113: [
      65471,
      65471
    ],
    114: [
      65472,
      65472
    ],
    115: [
      65473,
      65473
    ],
    116: [
      65474,
      65474
    ],
    117: [
      65475,
      65475
    ],
    118: [
      65476,
      65476
    ],
    119: [
      65477,
      65477
    ],
    120: [
      65478,
      65478
    ],
    121: [
      65479,
      65479
    ],
    122: [
      65480,
      65480
    ],
    123: [
      65481,
      65481
    ],
    186: [
      59,
      58
    ],
    187: [
      61,
      43
    ],
    188: [
      44,
      60
    ],
    189: [
      45,
      95
    ],
    190: [
      46,
      62
    ],
    191: [
      47,
      63
    ],
    192: [
      96,
      126
    ],
    219: [
      91,
      123
    ],
    220: [
      92,
      124
    ],
    221: [
      93,
      125
    ],
    222: [
      39,
      34
    ]
  };

  function Screen(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
  }

  Screen.prototype.drawRect = function (rect) {
    var img = new Image();
    var self = this;
    img.width = rect.width;
    img.height = rect.height;
    img.src = 'data:image/png;base64,' + rect.image;
    img.onload = function () {
      self._context.drawImage(this, rect.x, rect.y, rect.width, rect.height);
    };
  };

  Screen.prototype.addMouseHandler = function (cb) {
    var state = 0;
    this._canvas.addEventListener('mousedown', this._onmousedown = function (e) {
      state = 1;
      cb.call(null, e.pageX, e.pageY, state);
      e.preventDefault();
    }, false);
    this._canvas.addEventListener('mouseup', this._onmouseup = function (e) {
      state = 0;
      cb.call(null, e.pageX, e.pageY, state);
      e.preventDefault();
    }, false);
    this._canvas.addEventListener('mousemove', this._onmousemove = function (e) {
      cb.call(null, e.pageX, e.pageY, state);
      e.preventDefault();
    });
  };

  Screen.prototype.addKeyboardHandlers = function (cb) {
    document.addEventListener('keydown', this._onkeydown = function (e) {
      cb.call(null, e.keyCode, e.shiftKey, 1);
      e.preventDefault();
    }, false);
    document.addEventListener('keyup', this._onkeyup = function (e) {
      cb.call(null, e.keyCode, e.shiftKey, 0);
      e.preventDefault();
    }, false);
  };

  Screen.prototype.removeHandlers = function () {
    document.removeEventListener('keydown', this._onkeydown);
    document.removeEventListener('keyup', this._onkeyup);
    this._canvas.removeEventListener('mouseup', this._onmouseup);
    this._canvas.removeEventListener('mousedown', this._onmousedown);
    this._canvas.removeEventListener('mousemove', this._onmousemove);
  };

  Screen.prototype.getCanvas = function () {
    return this._canvas;
  };

  function Client(screen) {
    this._screen = screen;
    this._scaleFactor = 1;
  }

  Client.prototype._initEventListeners = function () {
    var self = this;
    this._screen.addMouseHandler(function (x, y, button) {
      self._socket.emit('mouse', {
        x: x / self._scaleFactor,
        y: y / self._scaleFactor,
        button: button
      });
    });
    this._screen.addKeyboardHandlers(function (code, shift, isDown) {
      var rfbKey = self._toRfbKeyCode(code, shift, isDown);
      if (rfbKey) {
        self._socket.emit('keyboard', {
          keyCode: rfbKey,
          isDown: isDown
        });
      }
    });
  };

  Client.prototype.connect = function (config) {
    this._socket = io.connect(Config.URL, { 'force new connection': true });
    this._socket.emit('init', {
      host: config.host,
      port: config.port,
      password: config.password
    });
    return this._addHandlers();
  };

  Client.prototype._addHandlers = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      var timeout = setTimeout(function () {
        reject();
      }, 2000);
      self._socket.on('init', function (config) {
        var canvas = self._screen.getCanvas();
        canvas.width = config.width;
        canvas.height = config.height;
        self._scaleScreen(config);
        self._initEventListeners();
        resolve();
        clearTimeout(timeout);
      });
      self._socket.on('frame', function (frame) {
        self._screen.drawRect(frame);
      });
    });
  };

  Client.prototype._scaleScreen = function (config) {
    var sw = screen.availWidth / config.width;
    var sh = screen.availHeight / config.height;
    var s = Math.min(sw, sh);
    this._scaleFactor = s;
    var canvas = this._screen.getCanvas();
    var transform = 'scale(' + s + ')';
    canvas.style.mozTransform = transform;
    canvas.style.webkitTransform = transform;
    canvas.style.transform = transform;
  };

  Client.prototype._toRfbKeyCode = function (code, shift) {
    code = code.toString();
    var keys = keyMap[code];
    if (keys) {
      return keys[shift ? 2 : 1];
    }
    return null;
  };

  Client.prototype._removeHandlers = function () {
  };

  Client.prototype.disconnect = function () {
    this._socket.disconnect();
    this._screen.removeHandlers();
  };

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
