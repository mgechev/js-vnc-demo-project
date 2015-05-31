(function (w) {
  'use strict';

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

  w.Screen = Screen;
}(window));
