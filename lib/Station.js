'use strict';

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldDestructureSet(receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.set) { if (!("__destrObj" in descriptor)) { descriptor.__destrObj = { set value(v) { descriptor.set.call(receiver, v); } }; } return descriptor.__destrObj; } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } return descriptor; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Station {
  constructor(id, data) {
    _defineProperty(this, "_x", void 0);

    _defineProperty(this, "_y", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "_state", void 0);

    _defineProperty(this, "_namePos", void 0);

    this._id = id;
    this._parents = data.parents;
    this._children = data.children;
    [this._nameZH, this._nameEN] = data.name;
  }

  set x(val) {
    this._x = val;
  }

  set y(val) {
    this._y = val;
  }

  set _state(val) {
    this._state = val;
  }

  set namePos(pos) {
    // 0: upper, 1: lower
    this._namePos = pos;
  }

  get inDegree() {
    return this._parents.length;
  }

  get outDegree() {
    return this._children.length;
  }

  get nameClass() {
    switch (this._state) {
      case -1:
        return 'Pass';

      case 0:
        return 'Current';

      default:
        return 'Future';
    }
  }

  get nameHTML() {
    var nameENLn = this._nameEN.split('\\').length;

    var dy = this._namePos == 1 ? 12 + 11.843775 : -12 - 21.921875 - (nameENLn == 2 ? 10 : 0);
    return $('<g>', {
      'transform': `translate(${this._x},${this._y + dy})`,
      'text-anchor': 'middle',
      'class': `Name ${this.nameClass}`
    }).append($('<text>').addClass('NameZH StnName').text(this._nameZH)).append($('<text>', {
      'dy': 15,
      'class': 'NameEN StnName'
    }).text(this._nameEN.split('\\')[0]).append($('<tspan>', {
      'x': 0,
      'dy': 12
    }).text(nameENLn == 2 ? this._nameEN.split('\\')[1] : '')));
  }

  get iconHTML() {
    var iconType = this._state == -1 ? 'stn_hk_pass' : 'stn_hk';
    return $('<use>', {
      'xlink:href': '#' + iconType,
      'x': this._x,
      'y': this._y
    });
  }

  get ungrpHTML() {
    // return this.iconHTML + this.nameHTML;
    return [this.iconHTML, this.nameHTML];
  }

  get html() {
    return $('<g>', {
      'id': this._id
    }).append(...this.ungrpHTML);
  }

}

class Int2Station extends Station {
  constructor(id, data) {
    super(id, data);

    _intCity.set(this, {
      writable: true,
      value: void 0
    });

    _intLine.set(this, {
      writable: true,
      value: void 0
    });

    _intColour.set(this, {
      writable: true,
      value: void 0
    });

    _intNameZH.set(this, {
      writable: true,
      value: void 0
    });

    _intNameEN.set(this, {
      writable: true,
      value: void 0
    });

    [_classPrivateFieldDestructureSet(this, _intCity).value, _classPrivateFieldDestructureSet(this, _intLine).value, _classPrivateFieldDestructureSet(this, _intColour).value, _classPrivateFieldDestructureSet(this, _intNameZH).value, _classPrivateFieldDestructureSet(this, _intNameEN).value] = data.transfer[1];
  }

  get _dy() {
    return 0;
  }

  get intTickHTML() {
    var tickDirection = this._namePos == 1 ? 'up' : 'down';
    var tickColour = this._state == -1 ? '#aaa' : _classPrivateFieldGet(this, _intColour);
    return $('<use>', {
      'xlink:href': '#intline_' + tickDirection,
      'stroke': tickColour,
      'x': this._x,
      'y': this._y + this._dy,
      'class': 'LineDiagram HK Change'
    });
  }

  get _nameClass() {
    return this._state == -1 ? 'Pass' : 'Future';
  }

  get intNameHTML() {
    var [nameHTML, nameZHLn, nameENLn] = joinIntName([_classPrivateFieldGet(this, _intNameZH), _classPrivateFieldGet(this, _intNameEN)], 15, 7);
    var dy = this._namePos == 0 ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13 * (nameZHLn - 1) - 7 * (nameENLn - 1);
    dy += this._dy; // var nameClass = (this._state == -1) ? 'Pass' : 'Future';

    return $('<g>', {
      'text-anchor': 'middle',
      'transform': `translate(${this._x},${this._y + dy})`,
      'class': `Name ${this._nameClass}`
    }).html(nameHTML);
  }

  get ungrpHTML() {
    return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
  }

}

var _intCity = new WeakMap();

var _intLine = new WeakMap();

var _intColour = new WeakMap();

var _intNameZH = new WeakMap();

var _intNameEN = new WeakMap();

class Int3Station extends Station {
  constructor(id, data) {
    super(id, data);

    _intCity2.set(this, {
      writable: true,
      value: []
    });

    _intLine2.set(this, {
      writable: true,
      value: []
    });

    _intColour2.set(this, {
      writable: true,
      value: []
    });

    _intNameZH2.set(this, {
      writable: true,
      value: []
    });

    _intNameEN2.set(this, {
      writable: true,
      value: []
    });

    _defineProperty(this, "_int3Type", void 0);

    data.transfer.slice(1).forEach(intInfo => {
      _classPrivateFieldGet(this, _intCity2).push(intInfo[0]);

      _classPrivateFieldGet(this, _intLine2).push(intInfo[1]);

      _classPrivateFieldGet(this, _intColour2).push(intInfo[2]);

      _classPrivateFieldGet(this, _intNameZH2).push(intInfo[3]);

      _classPrivateFieldGet(this, _intNameEN2).push(intInfo[4]);
    });
    this._int3Type = data.change_type.substring(5);
  }

  get iconHTML() {
    var iconType = this._state == -1 ? 'int3_hk_pass' : 'int3_hk';
    var iconRotation = this._namePos != 1 ? 0 : 180;
    return $('<use>', {
      'xlink:href': '#' + iconType,
      'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`
    });
  }

  get _tickRotation() {
    return 0;
  }

  get _dy() {
    return 0;
  }

  get intTickHTML() {
    var elems = [];
    [0, 1].forEach(i => {
      var tickColour = this._state == -1 ? '#aaa' : _classPrivateFieldGet(this, _intColour2)[i];
      var dy = this._namePos != 1 ? 18 * (i + 1) : -18 * (i + 1);
      dy += this._dy;
      elems.push($('<use>', {
        'xlink:href': '#intline_down',
        'stroke': tickColour,
        'transform': `translate(${this._x},${this._y + dy})rotate(${this._tickRotation})`,
        'class': 'LineDiagram HK Change'
      }));
    });
    return elems;
  }

  get _txtAnchor() {
    return 'middle';
  }

  get _intNameDX() {
    return 0;
  }

  get intNameHTML() {
    // var str = '';
    var elems = [];
    var nameClass = this._state == -1 ? 'Pass' : 'Future';
    [0, 1].forEach(i => {
      var [nameHTML, nameZHLn, nameENLn] = joinIntName([_classPrivateFieldGet(this, _intNameZH2)[i], _classPrivateFieldGet(this, _intNameEN2)[i]], 15, 7); // var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 19.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);

      var dy = (this._namePos == 0 ? 18 * (i + 1) : -18 * (i + 1)) + 5.953125 - (19.65625 + 13 * (nameZHLn - 1) + 7 * (nameENLn - 1)) / 2;
      dy += this._dy;
      elems.push($('<g>', {
        'text-anchor': this._txtAnchor,
        'transform': `translate(${this._x + this._intNameDX},${this._y + dy})`,
        'class': 'Name ' + nameClass
      }).html(nameHTML));
    });
    return elems;
  }

  get ungrpHTML() {
    return [...this.intTickHTML, this.iconHTML, this.nameHTML, ...this.intNameHTML];
  }

}

var _intCity2 = new WeakMap();

var _intLine2 = new WeakMap();

var _intColour2 = new WeakMap();

var _intNameZH2 = new WeakMap();

var _intNameEN2 = new WeakMap();

class Int3LStation extends Int3Station {
  get _tickRotation() {
    return 90;
  }

  get _txtAnchor() {
    return 'end';
  }

  get _intNameDX() {
    return -24;
  }

}

class Int3RStation extends Int3Station {
  get _tickRotation() {
    return -90;
  }

  get _txtAnchor() {
    return 'start';
  }

  get _intNameDX() {
    return 24;
  }

}

class OSI11Station extends Int2Station {
  constructor(id, data) {
    // data.int2 = data.osi11;
    super(id, data);

    _osiNameZH.set(this, {
      writable: true,
      value: void 0
    });

    _osiNameEN.set(this, {
      writable: true,
      value: void 0
    });

    _osiType.set(this, {
      writable: true,
      value: void 0
    });

    _osiDirection.set(this, {
      writable: true,
      value: void 0
    });

    [_classPrivateFieldDestructureSet(this, _osiNameZH).value, _classPrivateFieldDestructureSet(this, _osiNameEN).value] = data.transfer[0];

    _classPrivateFieldSet(this, _osiType, data.change_type.substring(6, 7)); // u(npaid) or p(aid);


    _classPrivateFieldSet(this, _osiDirection, data.change_type.substring(7)); // l or r;

  }

  get iconHTML() {
    var iconType = `osi11${_classPrivateFieldGet(this, _osiType)}_hk${this._state == -1 ? '_pass' : ''}`;
    var iconRotation = this._namePos != 1 ? 0 : 180;
    return $('<use>', {
      'xlink:href': '#' + iconType,
      'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`
    });
  }

  get _dy() {
    return this._namePos == 0 ? 26 : -26;
  }

  get _txtAnchor() {
    return 'middle';
  }

  get _osiNameDX() {
    return 0;
  }

  get osiNameHTML() {
    var dy = this._dy + 8.34375 - 25.03125 / 2;
    return $('<g>', {
      'text-anchor': this._txtAnchor,
      'transform': `translate(${this._x + this._osiNameDX},${this._y + dy})`,
      'class': 'Name ' + this._nameClass
    }).append($('<text>').addClass('NameZH OSIName').text(_classPrivateFieldGet(this, _osiNameZH))).append($('<text>', {
      'x': 0,
      'dy': 12,
      'class': 'NameEN OSIName'
    }).text(_classPrivateFieldGet(this, _osiNameEN)));
  }

  get ungrpHTML() {
    return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.osiNameHTML];
  }

}

var _osiNameZH = new WeakMap();

var _osiNameEN = new WeakMap();

var _osiType = new WeakMap();

var _osiDirection = new WeakMap();

class OSI11LStation extends OSI11Station {
  // OSI name on left
  get _txtAnchor() {
    return 'end';
  }

  get _osiNameDX() {
    return -13;
  }

}

class OSI11RStation extends OSI11Station {
  // OSI name on right
  get _txtAnchor() {
    return 'start';
  }

  get _osiNameDX() {
    return 13;
  }

}

class OSI12Station extends Int3Station {
  constructor(id, data) {
    // data.int3 = data.osi12;
    super(id, data);

    _osiNameZH2.set(this, {
      writable: true,
      value: void 0
    });

    _osiNameEN2.set(this, {
      writable: true,
      value: void 0
    });

    _osiType2.set(this, {
      writable: true,
      value: void 0
    });

    _osiDirection2.set(this, {
      writable: true,
      value: void 0
    });

    [_classPrivateFieldDestructureSet(this, _osiNameZH2).value, _classPrivateFieldDestructureSet(this, _osiNameEN2).value] = data.transfer[0];

    _classPrivateFieldSet(this, _osiType2, data.change_type.substring(6, 7)); // u(npaid) or p(aid);


    _classPrivateFieldSet(this, _osiDirection2, data.change_type.substring(7)); // l or r;

  }

  get iconHTML() {
    var iconType = `osi12${_classPrivateFieldGet(this, _osiType2)}_hk${this._state == -1 ? '_pass' : ''}`;
    var iconRotation = this._namePos != 1 ? 0 : 180;
    return $('<use>', {
      'xlink:href': '#' + iconType,
      'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`
    });
  }

  get _dy() {
    return this._namePos == 0 ? 26 - 18 : -8;
  }

  get osiNameHTML() {
    var dy = this._namePos == 0 ? 26 + 18 + 10 + 8.34375 : -(26 + 18 + 10) + 8.34375 - 25.03125;
    var nameClass = this._state == -1 ? 'Pass' : 'Future';
    return $('<g>', {
      'text-anchor': 'middle',
      'transform': `translate(${this._x},${this._y + dy})`,
      'class': `Name ${nameClass}`
    }).append($('<text>').addClass('NameZH OSIName').text(_classPrivateFieldGet(this, _osiNameZH2))).append($('<text>', {
      'x': 0,
      'dy': 12,
      'class': 'NameEN OSIName'
    }).text(_classPrivateFieldGet(this, _osiNameEN2)));
  }

  get ungrpHTML() {
    return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.osiNameHTML];
  }

}

var _osiNameZH2 = new WeakMap();

var _osiNameEN2 = new WeakMap();

var _osiType2 = new WeakMap();

var _osiDirection2 = new WeakMap();

class OSI12LStation extends OSI12Station {
  get _tickRotation() {
    return 90;
  }

  get _txtAnchor() {
    return 'end';
  }

  get _intNameDX() {
    return -24;
  }

}

class OSI12RStation extends OSI12Station {
  get _tickRotation() {
    return -90;
  }

  get _txtAnchor() {
    return 'start';
  }

  get _intNameDX() {
    return 24;
  }

}