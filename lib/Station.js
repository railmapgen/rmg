'use strict';

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldDestructureSet(receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.set) { if (!("__destrObj" in descriptor)) { descriptor.__destrObj = { set value(v) { descriptor.set.call(receiver, v); } }; } return descriptor.__destrObj; } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } return descriptor; } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Station =
/*#__PURE__*/
function () {
  function Station(id, data) {
    _classCallCheck(this, Station);

    _defineProperty(this, "_x", void 0);

    _defineProperty(this, "_y", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "_state", void 0);

    _defineProperty(this, "_namePos", void 0);

    _defineProperty(this, "_branch", void 0);

    this._id = id;
    this._parents = data.parents;
    this._children = data.children;

    var _data$name = _slicedToArray(data.name, 2);

    this._nameZH = _data$name[0];
    this._nameEN = _data$name[1];
    this._branch = data.branch;
  }

  _createClass(Station, [{
    key: "x",
    set: function set(val) {
      this._x = val;
    }
  }, {
    key: "y",
    set: function set(val) {
      this._y = val;
    }
  }, {
    key: "_state",
    set: function set(val) {
      this._state = val;
    }
  }, {
    key: "namePos",
    set: function set(pos) {
      // 0: upper, 1: lower
      this._namePos = pos;
    }
  }, {
    key: "inDegree",
    get: function get() {
      return this._parents.length;
    }
  }, {
    key: "outDegree",
    get: function get() {
      return this._children.length;
    }
  }, {
    key: "nameClass",
    get: function get() {
      switch (this._state) {
        case -1:
          return 'Pass';

        case 0:
          return 'Current';

        default:
          return 'Future';
      }
    }
  }, {
    key: "nameHTML",
    get: function get() {
      var nameENLn = this._nameEN.split('\\').length;

      var dy = this._namePos == 1 ? 12 + 11.843775 : -12 - 21.921875 - (nameENLn == 2 ? 10 : 0);
      return $('<g>', {
        'transform': "translate(".concat(this._x, ",").concat(this._y + dy, ")"),
        'text-anchor': 'middle',
        'class': "Name ".concat(this.nameClass)
      }).append($('<text>').addClass('rmg-name__zh rmg-name__mtr--station').text(this._nameZH)).append($('<text>', {
        'dy': 15,
        'class': 'rmg-name__en rmg-name__mtr--station'
      }).text(this._nameEN.split('\\')[0]).append($('<tspan>', {
        'x': 0,
        'dy': 12
      }).text(nameENLn == 2 ? this._nameEN.split('\\')[1] : '')));
    }
  }, {
    key: "iconHTML",
    get: function get() {
      var iconType = this._state == -1 ? 'stn_hk_pass' : 'stn_hk';
      return $('<use>', {
        'xlink:href': '#' + iconType,
        'x': this._x,
        'y': this._y
      });
    }
  }, {
    key: "ungrpHTML",
    get: function get() {
      // return this.iconHTML + this.nameHTML;
      return [this.iconHTML, this.nameHTML];
    }
  }, {
    key: "html",
    get: function get() {
      var _$;

      return (_$ = $('<g>', {
        'id': this._id
      })).append.apply(_$, _toConsumableArray(this.ungrpHTML));
    }
  }]);

  return Station;
}();

var Int2Station =
/*#__PURE__*/
function (_Station) {
  _inherits(Int2Station, _Station);

  function Int2Station(id, data) {
    var _this;

    _classCallCheck(this, Int2Station);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Int2Station).call(this, id, data)); // [this.#intCity, this.#intLine, this.#intColour, this.#intNameZH, this.#intNameEN] = data.transfer[1];

    _intCity.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _intLine.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _intColour.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _intNameZH.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _intNameEN.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    var _data$interchange$0$ = _slicedToArray(data.interchange[0][0], 5);

    _classPrivateFieldDestructureSet(_assertThisInitialized(_this), _intCity).value = _data$interchange$0$[0];
    _classPrivateFieldDestructureSet(_assertThisInitialized(_this), _intLine).value = _data$interchange$0$[1];
    _classPrivateFieldDestructureSet(_assertThisInitialized(_this), _intColour).value = _data$interchange$0$[2];
    _classPrivateFieldDestructureSet(_assertThisInitialized(_this), _intNameZH).value = _data$interchange$0$[3];
    _classPrivateFieldDestructureSet(_assertThisInitialized(_this), _intNameEN).value = _data$interchange$0$[4];
    return _this;
  }

  _createClass(Int2Station, [{
    key: "_dy",
    get: function get() {
      return 0;
    }
  }, {
    key: "intTickHTML",
    get: function get() {
      var tickDirection = this._namePos == 1 ? 'up' : 'down'; // var tickColour = (this._state == -1) ? '#aaa' : this.#intColour;

      var tickColour = _classPrivateFieldGet(this, _intColour);

      var tick = $('<use>', {
        'xlink:href': '#intline_' + tickDirection,
        'stroke': tickColour,
        'x': this._x,
        'y': this._y + this._dy,
        'class': 'rmg-line rmg-line__mtr rmg-line__change'
      });

      if (this._state == -1) {
        tick.addClass('rmg-line__pass');
      }

      return tick;
    }
  }, {
    key: "_nameClass",
    get: function get() {
      return this._state == -1 ? 'Pass' : 'Future';
    }
  }, {
    key: "intNameHTML",
    get: function get() {
      var _joinIntName = joinIntName([_classPrivateFieldGet(this, _intNameZH), _classPrivateFieldGet(this, _intNameEN)], 15, 7),
          _joinIntName2 = _slicedToArray(_joinIntName, 3),
          nameHTML = _joinIntName2[0],
          nameZHLn = _joinIntName2[1],
          nameENLn = _joinIntName2[2];

      var dy = this._namePos == 0 ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13 * (nameZHLn - 1) - 7 * (nameENLn - 1);
      dy += this._dy; // var nameClass = (this._state == -1) ? 'Pass' : 'Future';

      return $('<g>', {
        'text-anchor': 'middle',
        'transform': "translate(".concat(this._x, ",").concat(this._y + dy, ")"),
        'class': "Name ".concat(this._nameClass)
      }).html(nameHTML);
    }
  }, {
    key: "ungrpHTML",
    get: function get() {
      return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
    }
  }]);

  return Int2Station;
}(Station);

var _intCity = new WeakMap();

var _intLine = new WeakMap();

var _intColour = new WeakMap();

var _intNameZH = new WeakMap();

var _intNameEN = new WeakMap();

var Int3Station =
/*#__PURE__*/
function (_Station2) {
  _inherits(Int3Station, _Station2);

  function Int3Station(id, data) {
    var _this2;

    _classCallCheck(this, Int3Station);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Int3Station).call(this, id, data));

    _intCity2.set(_assertThisInitialized(_this2), {
      writable: true,
      value: []
    });

    _intLine2.set(_assertThisInitialized(_this2), {
      writable: true,
      value: []
    });

    _intColour2.set(_assertThisInitialized(_this2), {
      writable: true,
      value: []
    });

    _intNameZH2.set(_assertThisInitialized(_this2), {
      writable: true,
      value: []
    });

    _intNameEN2.set(_assertThisInitialized(_this2), {
      writable: true,
      value: []
    });

    _defineProperty(_assertThisInitialized(_this2), "_int3Type", void 0);

    data.interchange[0].forEach(function (intInfo) {
      _classPrivateFieldGet(_assertThisInitialized(_this2), _intCity2).push(intInfo[0]);

      _classPrivateFieldGet(_assertThisInitialized(_this2), _intLine2).push(intInfo[1]);

      _classPrivateFieldGet(_assertThisInitialized(_this2), _intColour2).push(intInfo[2]);

      _classPrivateFieldGet(_assertThisInitialized(_this2), _intNameZH2).push(intInfo[3]);

      _classPrivateFieldGet(_assertThisInitialized(_this2), _intNameEN2).push(intInfo[4]);
    }); // data.transfer.slice(1).forEach(intInfo => {
    //     this.#intCity.push(intInfo[0]);
    //     this.#intLine.push(intInfo[1]);
    //     this.#intColour.push(intInfo[2]);
    //     this.#intNameZH.push(intInfo[3]);
    //     this.#intNameEN.push(intInfo[4]);
    // });

    _this2._int3Type = data.change_type.substring(5);
    return _this2;
  }

  _createClass(Int3Station, [{
    key: "iconHTML",
    get: function get() {
      var iconType = this._state == -1 ? 'int3_hk_pass' : 'int3_hk';
      var iconRotation = this._namePos != 1 ? 0 : 180;
      return $('<use>', {
        'xlink:href': '#' + iconType,
        'transform': "translate(".concat(this._x, ",").concat(this._y, ")rotate(").concat(iconRotation, ")")
      });
    }
  }, {
    key: "_tickRotation",
    get: function get() {
      return 0;
    }
  }, {
    key: "_dy",
    get: function get() {
      return 0;
    }
  }, {
    key: "intTickHTML",
    get: function get() {
      var _this3 = this;

      var elems = [];
      [0, 1].forEach(function (i) {
        var tickColour = _this3._state == -1 ? '#aaa' : _classPrivateFieldGet(_this3, _intColour2)[i];
        var dy = _this3._namePos != 1 ? 18 * (i + 1) : -18 * (i + 1);
        dy += _this3._dy;
        elems.push($('<use>', {
          'xlink:href': '#intline_down',
          'stroke': tickColour,
          'transform': "translate(".concat(_this3._x, ",").concat(_this3._y + dy, ")rotate(").concat(_this3._tickRotation, ")"),
          'class': 'rmg-line rmg-line__mtr rmg-line__change'
        }));
      });
      return elems;
    }
  }, {
    key: "_txtAnchor",
    get: function get() {
      return 'middle';
    }
  }, {
    key: "_intNameDX",
    get: function get() {
      return 0;
    }
  }, {
    key: "intNameHTML",
    get: function get() {
      var _this4 = this;

      // var str = '';
      var elems = [];
      var nameClass = this._state == -1 ? 'Pass' : 'Future';
      [0, 1].forEach(function (i) {
        var _joinIntName3 = joinIntName([_classPrivateFieldGet(_this4, _intNameZH2)[i], _classPrivateFieldGet(_this4, _intNameEN2)[i]], 15, 7),
            _joinIntName4 = _slicedToArray(_joinIntName3, 3),
            nameHTML = _joinIntName4[0],
            nameZHLn = _joinIntName4[1],
            nameENLn = _joinIntName4[2]; // var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 19.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);


        var dy = (_this4._namePos == 0 ? 18 * (i + 1) : -18 * (i + 1)) + 5.953125 - (19.65625 + 13 * (nameZHLn - 1) + 7 * (nameENLn - 1)) / 2;
        dy += _this4._dy;
        elems.push($('<g>', {
          'text-anchor': _this4._txtAnchor,
          'transform': "translate(".concat(_this4._x + _this4._intNameDX, ",").concat(_this4._y + dy, ")"),
          'class': 'Name ' + nameClass
        }).html(nameHTML));
      });
      return elems;
    }
  }, {
    key: "ungrpHTML",
    get: function get() {
      return [].concat(_toConsumableArray(this.intTickHTML), [this.iconHTML, this.nameHTML], _toConsumableArray(this.intNameHTML));
    }
  }]);

  return Int3Station;
}(Station);

var _intCity2 = new WeakMap();

var _intLine2 = new WeakMap();

var _intColour2 = new WeakMap();

var _intNameZH2 = new WeakMap();

var _intNameEN2 = new WeakMap();

var Int3LStation =
/*#__PURE__*/
function (_Int3Station) {
  _inherits(Int3LStation, _Int3Station);

  function Int3LStation() {
    _classCallCheck(this, Int3LStation);

    return _possibleConstructorReturn(this, _getPrototypeOf(Int3LStation).apply(this, arguments));
  }

  _createClass(Int3LStation, [{
    key: "_tickRotation",
    get: function get() {
      return 90;
    }
  }, {
    key: "_txtAnchor",
    get: function get() {
      return 'end';
    }
  }, {
    key: "_intNameDX",
    get: function get() {
      return -24;
    }
  }]);

  return Int3LStation;
}(Int3Station);

var Int3RStation =
/*#__PURE__*/
function (_Int3Station2) {
  _inherits(Int3RStation, _Int3Station2);

  function Int3RStation() {
    _classCallCheck(this, Int3RStation);

    return _possibleConstructorReturn(this, _getPrototypeOf(Int3RStation).apply(this, arguments));
  }

  _createClass(Int3RStation, [{
    key: "_tickRotation",
    get: function get() {
      return -90;
    }
  }, {
    key: "_txtAnchor",
    get: function get() {
      return 'start';
    }
  }, {
    key: "_intNameDX",
    get: function get() {
      return 24;
    }
  }]);

  return Int3RStation;
}(Int3Station);

var OSI11Station =
/*#__PURE__*/
function (_Int2Station) {
  _inherits(OSI11Station, _Int2Station);

  function OSI11Station(id, data) {
    var _this5;

    _classCallCheck(this, OSI11Station);

    // data.int2 = data.osi11;
    data.interchange[0].push(data.interchange[1][1]);
    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(OSI11Station).call(this, id, data)); // [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];

    _osiNameZH.set(_assertThisInitialized(_this5), {
      writable: true,
      value: void 0
    });

    _osiNameEN.set(_assertThisInitialized(_this5), {
      writable: true,
      value: void 0
    });

    _osiType.set(_assertThisInitialized(_this5), {
      writable: true,
      value: void 0
    });

    _osiDirection.set(_assertThisInitialized(_this5), {
      writable: true,
      value: void 0
    });

    var _data$interchange$1$ = _slicedToArray(data.interchange[1][0], 2);

    _classPrivateFieldDestructureSet(_assertThisInitialized(_this5), _osiNameZH).value = _data$interchange$1$[0];
    _classPrivateFieldDestructureSet(_assertThisInitialized(_this5), _osiNameEN).value = _data$interchange$1$[1];

    _classPrivateFieldSet(_assertThisInitialized(_this5), _osiType, data.change_type.substring(6, 7)); // u(npaid) or p(aid);


    _classPrivateFieldSet(_assertThisInitialized(_this5), _osiDirection, data.change_type.substring(7)); // l or r;


    return _this5;
  }

  _createClass(OSI11Station, [{
    key: "iconHTML",
    get: function get() {
      var iconType = "osi11".concat(_classPrivateFieldGet(this, _osiType), "_hk").concat(this._state == -1 ? '_pass' : '');
      var iconRotation = this._namePos != 1 ? 0 : 180;
      return $('<use>', {
        'xlink:href': '#' + iconType,
        'transform': "translate(".concat(this._x, ",").concat(this._y, ")rotate(").concat(iconRotation, ")")
      });
    }
  }, {
    key: "_dy",
    get: function get() {
      return this._namePos == 0 ? 26 : -26;
    }
  }, {
    key: "_txtAnchor",
    get: function get() {
      return 'middle';
    }
  }, {
    key: "_osiNameDX",
    get: function get() {
      return 0;
    }
  }, {
    key: "osiNameHTML",
    get: function get() {
      var dy = this._dy + 8.34375 - 25.03125 / 2;
      return $('<g>', {
        'text-anchor': this._txtAnchor,
        'transform': "translate(".concat(this._x + this._osiNameDX, ",").concat(this._y + dy, ")"),
        'class': 'Name ' + this._nameClass
      }).append($('<text>').addClass('rmg-name__zh OSIName').text(_classPrivateFieldGet(this, _osiNameZH))).append($('<text>', {
        'x': 0,
        'dy': 12,
        'class': 'rmg-name__en OSIName'
      }).text(_classPrivateFieldGet(this, _osiNameEN)));
    }
  }, {
    key: "ungrpHTML",
    get: function get() {
      return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.osiNameHTML];
    }
  }]);

  return OSI11Station;
}(Int2Station);

var _osiNameZH = new WeakMap();

var _osiNameEN = new WeakMap();

var _osiType = new WeakMap();

var _osiDirection = new WeakMap();

var OSI11LStation =
/*#__PURE__*/
function (_OSI11Station) {
  _inherits(OSI11LStation, _OSI11Station);

  function OSI11LStation() {
    _classCallCheck(this, OSI11LStation);

    return _possibleConstructorReturn(this, _getPrototypeOf(OSI11LStation).apply(this, arguments));
  }

  _createClass(OSI11LStation, [{
    key: "_txtAnchor",
    // OSI name on left
    get: function get() {
      return 'end';
    }
  }, {
    key: "_osiNameDX",
    get: function get() {
      return -13;
    }
  }]);

  return OSI11LStation;
}(OSI11Station);

var OSI11RStation =
/*#__PURE__*/
function (_OSI11Station2) {
  _inherits(OSI11RStation, _OSI11Station2);

  function OSI11RStation() {
    _classCallCheck(this, OSI11RStation);

    return _possibleConstructorReturn(this, _getPrototypeOf(OSI11RStation).apply(this, arguments));
  }

  _createClass(OSI11RStation, [{
    key: "_txtAnchor",
    // OSI name on right
    get: function get() {
      return 'start';
    }
  }, {
    key: "_osiNameDX",
    get: function get() {
      return 13;
    }
  }]);

  return OSI11RStation;
}(OSI11Station);

var OSI12Station =
/*#__PURE__*/
function (_Int3Station3) {
  _inherits(OSI12Station, _Int3Station3);

  function OSI12Station(id, data) {
    var _data$interchange$;

    var _this6;

    _classCallCheck(this, OSI12Station);

    // data.int3 = data.osi12;
    (_data$interchange$ = data.interchange[0]).push.apply(_data$interchange$, _toConsumableArray(data.interchange[1].slice(1, 3)));

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(OSI12Station).call(this, id, data)); // [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];

    _osiNameZH2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: void 0
    });

    _osiNameEN2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: void 0
    });

    _osiType2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: void 0
    });

    _osiDirection2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: void 0
    });

    var _data$interchange$1$2 = _slicedToArray(data.interchange[1][0], 2);

    _classPrivateFieldDestructureSet(_assertThisInitialized(_this6), _osiNameZH2).value = _data$interchange$1$2[0];
    _classPrivateFieldDestructureSet(_assertThisInitialized(_this6), _osiNameEN2).value = _data$interchange$1$2[1];

    _classPrivateFieldSet(_assertThisInitialized(_this6), _osiType2, data.change_type.substring(6, 7)); // u(npaid) or p(aid);


    _classPrivateFieldSet(_assertThisInitialized(_this6), _osiDirection2, data.change_type.substring(7)); // l or r;


    return _this6;
  }

  _createClass(OSI12Station, [{
    key: "iconHTML",
    get: function get() {
      var iconType = "osi12".concat(_classPrivateFieldGet(this, _osiType2), "_hk").concat(this._state == -1 ? '_pass' : '');
      var iconRotation = this._namePos != 1 ? 0 : 180;
      return $('<use>', {
        'xlink:href': '#' + iconType,
        'transform': "translate(".concat(this._x, ",").concat(this._y, ")rotate(").concat(iconRotation, ")")
      });
    }
  }, {
    key: "_dy",
    get: function get() {
      return this._namePos == 0 ? 26 - 18 : -8;
    }
  }, {
    key: "osiNameHTML",
    get: function get() {
      var dy = this._namePos == 0 ? 26 + 18 + 10 + 8.34375 : -(26 + 18 + 10) + 8.34375 - 25.03125;
      var nameClass = this._state == -1 ? 'Pass' : 'Future';
      return $('<g>', {
        'text-anchor': 'middle',
        'transform': "translate(".concat(this._x, ",").concat(this._y + dy, ")"),
        'class': "Name ".concat(nameClass)
      }).append($('<text>').addClass('rmg-name__zh OSIName').text(_classPrivateFieldGet(this, _osiNameZH2))).append($('<text>', {
        'x': 0,
        'dy': 12,
        'class': 'rmg-name__en OSIName'
      }).text(_classPrivateFieldGet(this, _osiNameEN2).split('\\')[0]).append($('<tspan>', {
        'x': 0,
        'dy': 10
      }).text(_classPrivateFieldGet(this, _osiNameEN2).split('\\')[1] || '')));
    }
  }, {
    key: "ungrpHTML",
    get: function get() {
      return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.osiNameHTML];
    }
  }]);

  return OSI12Station;
}(Int3Station);

var _osiNameZH2 = new WeakMap();

var _osiNameEN2 = new WeakMap();

var _osiType2 = new WeakMap();

var _osiDirection2 = new WeakMap();

var OSI12LStation =
/*#__PURE__*/
function (_OSI12Station) {
  _inherits(OSI12LStation, _OSI12Station);

  function OSI12LStation() {
    _classCallCheck(this, OSI12LStation);

    return _possibleConstructorReturn(this, _getPrototypeOf(OSI12LStation).apply(this, arguments));
  }

  _createClass(OSI12LStation, [{
    key: "_tickRotation",
    get: function get() {
      return 90;
    }
  }, {
    key: "_txtAnchor",
    get: function get() {
      return 'end';
    }
  }, {
    key: "_intNameDX",
    get: function get() {
      return -24;
    }
  }]);

  return OSI12LStation;
}(OSI12Station);

var OSI12RStation =
/*#__PURE__*/
function (_OSI12Station2) {
  _inherits(OSI12RStation, _OSI12Station2);

  function OSI12RStation() {
    _classCallCheck(this, OSI12RStation);

    return _possibleConstructorReturn(this, _getPrototypeOf(OSI12RStation).apply(this, arguments));
  }

  _createClass(OSI12RStation, [{
    key: "_tickRotation",
    get: function get() {
      return -90;
    }
  }, {
    key: "_txtAnchor",
    get: function get() {
      return 'start';
    }
  }, {
    key: "_intNameDX",
    get: function get() {
      return 24;
    }
  }]);

  return OSI12RStation;
}(OSI12Station);

var StationGZ =
/*#__PURE__*/
function (_Station3) {
  _inherits(StationGZ, _Station3);

  function StationGZ(id, data) {
    _classCallCheck(this, StationGZ);

    return _possibleConstructorReturn(this, _getPrototypeOf(StationGZ).call(this, id, data));
  }

  _createClass(StationGZ, [{
    key: "nameClass",
    get: function get() {
      switch (this._state) {
        case -1:
          return 'Pass';

        case 0:
          return 'CurrentGZ';

        default:
          return 'Future';
      }
    }
  }, {
    key: "iconHTML",
    get: function get() {
      var iconType = this._state == -1 ? 'stn_gz_pass' : 'stn_gz';
      return $('<use>', {
        'xlink:href': '#' + iconType,
        'x': this._x,
        'y': this._y
      });
    }
  }, {
    key: "nameHTML",
    get: function get() {
      var nameENLn = 1;
      var dx = 30 * Math.cos(-45) * 0.8;
      var dy = -4 - 21.921875;
      return $('<g>', {
        'transform': "translate(".concat(this._x - dx, ",").concat(this._y + dy, ")rotate(-45)"),
        'text-anchor': 'start',
        'class': "Name ".concat(this.nameClass)
      }).append($('<text>').addClass('rmg-name__zh rmg-name__gzmtr--station').text(this._nameZH)).append($('<text>', {
        'dy': 14,
        'class': 'rmg-name__en rmg-name__gzmtr--station'
      }).text(this._nameEN.replace('\\', ' ')).append($('<tspan>', {
        'x': 0,
        'dy': 12
      }).text()));
    }
  }]);

  return StationGZ;
}(Station);

var Int2StationGZ =
/*#__PURE__*/
function (_StationGZ) {
  _inherits(Int2StationGZ, _StationGZ);

  function Int2StationGZ(id, data) {
    _classCallCheck(this, Int2StationGZ);

    return _possibleConstructorReturn(this, _getPrototypeOf(Int2StationGZ).call(this, id, data));
  }

  return Int2StationGZ;
}(StationGZ);