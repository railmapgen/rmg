'use strict';

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldDestructureSet(receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.set) { if (!("__destrObj" in descriptor)) { descriptor.__destrObj = { set value(v) { descriptor.set.call(receiver, v); } }; } return descriptor.__destrObj; } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } return descriptor; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Station {
  constructor(id, data) {
    _defineProperty(this, "STN_NAME_Y", -10.5);

    _defineProperty(this, "STN_NAME_BASE_HEIGHT", 30.390625);

    _defineProperty(this, "STN_NAME_LINE_GAP", 14);

    _defineProperty(this, "STN_NAME_BG_ADJUST", 0.5);

    _defineProperty(this, "_x", void 0);

    _defineProperty(this, "_y", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "_state", void 0);

    _defineProperty(this, "_namePos", void 0);

    _defineProperty(this, "_branch", void 0);

    this._id = id;
    this._parents = data.parents;
    this._children = data.children;
    [this._nameZH, this._nameEN] = data.name;
    this._branch = data.branch;
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
    var nameENs = this._nameEN.split('\\');

    if (this._namePos == 1) {
      var dy = this.STN_NAME_LINE_GAP - this.STN_NAME_Y - this.STN_NAME_BG_ADJUST;
    } else {
      var dy = -this.STN_NAME_LINE_GAP - this.STN_NAME_Y - this.STN_NAME_BASE_HEIGHT - (nameENs.length - 1) * 10;
    } // dy -= this.STN_NAME_BG_ADJUST;


    if (this._state === 0) {
      $('#current_bg').attr({
        y: this._y + dy + this.STN_NAME_Y - 1.5,
        height: this.STN_NAME_BASE_HEIGHT + (nameENs.length - 1) * 10 + 2 + 1.5
      });
    }

    var nameENp = nameENs.shift();
    var nameENElem = $('<text>', {
      dy: 15,
      class: 'rmg-name__en rmg-name__mtr--station'
    }).text(nameENp);

    while (nameENp = nameENs.shift()) {
      nameENElem.append($('<tspan>', {
        x: 0,
        dy: 10,
        'alignment-baseline': 'middle'
      }).text(nameENp));
    }

    return $('<g>', {
      transform: `translate(${this._x},${this._y + dy})`,
      'text-anchor': 'middle',
      'class': `Name ${this.nameClass}`
    }).append($('<text>').addClass('rmg-name__zh rmg-name__mtr--station').text(this._nameZH)).append(nameENElem);
  }

  get iconClass() {
    return this._state == -1 ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future';
  }

  get iconHTML() {
    return $('<use>', {
      'xlink:href': '#stn_hk',
      x: this._x,
      y: this._y,
      class: this.iconClass
    });
  }

  get ungrpHTML() {
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

    _intFg.set(this, {
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

    [_classPrivateFieldDestructureSet(this, _intCity).value, _classPrivateFieldDestructureSet(this, _intLine).value, _classPrivateFieldDestructureSet(this, _intColour).value, _classPrivateFieldDestructureSet(this, _intFg).value, _classPrivateFieldDestructureSet(this, _intNameZH).value, _classPrivateFieldDestructureSet(this, _intNameEN).value] = data.interchange[0][0];
  }

  get _dy() {
    return 0;
  }

  get intTickHTML() {
    var tickRotation = this._namePos == 1 ? 180 : 0;

    var tickColour = _classPrivateFieldGet(this, _intColour);

    var tick = $('<use>', {
      'xlink:href': '#inttick_hk',
      'stroke': tickColour,
      transform: `translate(${this._x},${this._y + this._dy})rotate(${tickRotation})`,
      'class': 'rmg-line rmg-line__mtr rmg-line__change'
    });

    if (this._state == -1) {
      tick.addClass('rmg-line__pass');
    }

    return tick;
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

var _intFg = new WeakMap();

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

    data.interchange[0].forEach(intInfo => {
      _classPrivateFieldGet(this, _intCity2).push(intInfo[0]);

      _classPrivateFieldGet(this, _intLine2).push(intInfo[1]);

      _classPrivateFieldGet(this, _intColour2).push(intInfo[2]);

      _classPrivateFieldGet(this, _intNameZH2).push(intInfo[4]);

      _classPrivateFieldGet(this, _intNameEN2).push(intInfo[5]);
    });
    this._int3Type = data.change_type.substring(5);
  }

  get iconHTML() {
    // var iconType = (this._state == -1) ? 'int3_hk_pass' : 'int3_hk';
    // var iconClass = this._state == -1 ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future';
    var iconRotation = this._namePos != 1 ? 0 : 180;
    return $('<use>', {
      'xlink:href': '#int3_hk',
      'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`,
      class: this.iconClass
    });
  }

  get _tickRotation() {
    return 0;
  }

  get _dy() {
    return 0;
  }

  get _dx() {
    return 0;
  }

  get _tickFlip() {
    return 1;
  }

  get intTickHTML() {
    var elems = [];
    [0, 1].forEach(i => {
      var tickColour = this._state == -1 ? '#aaa' : _classPrivateFieldGet(this, _intColour2)[i];
      var dy = this._namePos != 1 ? 18 * (i + 1) : -18 * (i + 1);
      dy += this._dy;
      dy *= this._tickFlip;
      elems.push($('<use>', {
        'xlink:href': '#inttick_hk',
        stroke: tickColour,
        transform: `translate(${this._x + this._dx},${this._y + dy})rotate(${this._tickRotation})`,
        class: 'rmg-line rmg-line__mtr rmg-line__change'
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

  get _nameClass() {
    return this._state == -1 ? 'Pass' : 'Future';
  }

  get intNameHTML() {
    // var str = '';
    var elems = [];
    var nameClass = this._nameClass;
    [0, 1].forEach(i => {
      var [nameHTML, nameZHLn, nameENLn] = joinIntName([_classPrivateFieldGet(this, _intNameZH2)[i], _classPrivateFieldGet(this, _intNameEN2)[i]], 15, 7); // var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 19.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);

      var dy = this._namePos == 0 ? 18 * (i + 1) : -18 * (i + 1);
      dy += this._dy;
      dy *= this._tickFlip;
      dy += 5.953125 - (19.65625 + 13 * (nameZHLn - 1) + 7 * (nameENLn - 1)) / 2; // dy += this._dy;

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
    data.interchange[0].push(data.interchange[1][1]);
    super(id, data); // [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];

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

    [_classPrivateFieldDestructureSet(this, _osiNameZH).value, _classPrivateFieldDestructureSet(this, _osiNameEN).value] = data.interchange[1][0];

    _classPrivateFieldSet(this, _osiType, data.change_type.substring(6, 7)); // u(npaid) or p(aid);


    _classPrivateFieldSet(this, _osiDirection, data.change_type.substring(7)); // l or r;

  }

  get osiClass() {
    return _classPrivateFieldGet(this, _osiType) == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';
  }

  get iconHTML() {
    var iconRotation = this._namePos != 1 ? 0 : 180;
    return $('<use>', {
      'xlink:href': '#osi11_hk',
      'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`,
      class: [this.iconClass, this.osiClass].join(' ')
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
    }).append($('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(_classPrivateFieldGet(this, _osiNameZH))).append($('<text>', {
      'x': 0,
      'dy': 12,
      'class': 'rmg-name__en rmg-name__mtr--osi'
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
    data.interchange[0].unshift(...data.interchange[1].slice(1, 3));
    super(id, data); // [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];

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

    [_classPrivateFieldDestructureSet(this, _osiNameZH2).value, _classPrivateFieldDestructureSet(this, _osiNameEN2).value] = data.interchange[1][0]; // this.#osiType = data.change_type.substring(6,7); // u(npaid) or p(aid);

    _classPrivateFieldSet(this, _osiType2, data.change_type.split('_').reverse()[0]);

    _classPrivateFieldSet(this, _osiDirection2, data.change_type.substring(7)); // l or r;

  }

  get osiClass() {
    return _classPrivateFieldGet(this, _osiType2) == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';
  }

  get iconHTML() {
    var iconRotation = this._namePos != 1 ? 0 : 180;
    return $('<use>', {
      'xlink:href': '#osi12_hk',
      'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`,
      class: [this.iconClass, this.osiClass].join(' ')
    });
  }

  get _dy() {
    return this._namePos == 0 ? 26 - 18 : -8;
  }

  get _osiDY() {
    return this._namePos == 0 ? 26 + 18 + 10 + 8.34375 : -(26 + 18 + 10) + 8.34375 - 25.03125;
  }

  get _osiTxtAnchor() {
    return 'middle';
  }

  get _osiDX() {
    return 0;
  }

  get osiNameHTML() {
    var nameClass = this._state == -1 ? 'Pass' : 'Future';
    return $('<g>', {
      'text-anchor': this._osiTxtAnchor,
      'transform': `translate(${this._x + this._dx + this._osiDX},${this._y + this._osiDY})`,
      'class': `Name ${nameClass}`
    }).append($('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(_classPrivateFieldGet(this, _osiNameZH2))).append($('<text>', {
      'x': 0,
      'dy': 12,
      'class': 'rmg-name__en rmg-name__mtr--osi'
    }).text(_classPrivateFieldGet(this, _osiNameEN2).split('\\')[0]).append($('<tspan>', {
      'x': 0,
      'dy': 10
    }).text(_classPrivateFieldGet(this, _osiNameEN2).split('\\')[1] || '')));
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

class OSI22EndStation extends OSI12Station {
  constructor(id, data) {
    super(id, data); // data mutated by OSI12Station!!!

    _origIntCity.set(this, {
      writable: true,
      value: void 0
    });

    _origIntLine.set(this, {
      writable: true,
      value: void 0
    });

    _origIntColour.set(this, {
      writable: true,
      value: void 0
    });

    _origIntFg.set(this, {
      writable: true,
      value: void 0
    });

    _origIntNameZH.set(this, {
      writable: true,
      value: void 0
    });

    _origIntNameEN.set(this, {
      writable: true,
      value: void 0
    });

    [_classPrivateFieldDestructureSet(this, _origIntCity).value, _classPrivateFieldDestructureSet(this, _origIntLine).value, _classPrivateFieldDestructureSet(this, _origIntColour).value, _classPrivateFieldDestructureSet(this, _origIntFg).value, _classPrivateFieldDestructureSet(this, _origIntNameZH).value, _classPrivateFieldDestructureSet(this, _origIntNameEN).value] = data.interchange[0][2];
  }

  get origIntTickHTML() {
    var tickRotation = this._namePos == 1 ? 180 : 0;

    var tickColour = _classPrivateFieldGet(this, _origIntColour);

    var tick = $('<use>', {
      'xlink:href': '#inttick_hk',
      stroke: tickColour,
      transform: `translate(${this._x},${this._y})rotate(${tickRotation})`,
      'class': 'rmg-line rmg-line__mtr rmg-line__change'
    });

    if (this._state == -1) {
      tick.addClass('rmg-line__pass');
    }

    return tick;
  }

  get origIntNameHTML() {
    var [nameHTML, nameZHLn, nameENLn] = joinIntName([_classPrivateFieldGet(this, _origIntNameZH), _classPrivateFieldGet(this, _origIntNameEN)], 15, 7);
    var dy = this._namePos == 0 ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13 * (nameZHLn - 1) - 7 * (nameENLn - 1); // dy += this._dy;
    // var nameClass = (this._state == -1) ? 'Pass' : 'Future';

    return $('<g>', {
      'text-anchor': 'middle',
      'transform': `translate(${this._x},${this._y + dy})`,
      'class': `Name ${this._nameClass}`
    }).html(nameHTML);
  }

  get iconHTML() {
    var iconYFlip = this._namePos == 1 ? 1 : -1;
    var iconXFlip = this._children == 'lineend' ? 1 : -1;
    var iconRotation = this._children == 'lineend' ? 0 : 180;
    return $('<use>', {
      'xlink:href': '#osi22end_hk',
      'transform': `translate(${this._x},${this._y})scale(${iconXFlip},${iconYFlip})`,
      class: [this.iconClass, this.osiClass].join(' ')
    });
  }

  get _tickRotation() {
    return this._children == 'lineend' ? -90 : 90;
  }

  get _tickFlip() {
    return -1;
  }

  get _dx() {
    return this._children == 'lineend' ? 41 : -41;
  }

  get _dy() {
    return this._namePos == 0 ? -18 : 18;
  }

  get _intNameDX() {
    return this._children == 'lineend' ? 24 + 41 : -(24 + 41);
  }

  get _txtAnchor() {
    return this._children == 'lineend' ? 'start' : 'end';
  }

  get _osiDY() {
    return this._namePos == 0 ? 10 + 8.34375 : -10 + 8.34375 - 25.03125;
  }

  get _osiTxtAnchor() {
    return this._children == 'lineend' ? 'start' : 'end';
  }

  get _osiDX() {
    return this._children == 'lineend' ? -9 : 9;
  }

  get ungrpHTML() {
    return [this.intTickHTML, this.origIntTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.origIntNameHTML, this.osiNameHTML];
  }

}

var _origIntCity = new WeakMap();

var _origIntLine = new WeakMap();

var _origIntColour = new WeakMap();

var _origIntFg = new WeakMap();

var _origIntNameZH = new WeakMap();

var _origIntNameEN = new WeakMap();

class StationGZ extends Station {
  constructor(id, data) {
    super(id, data);

    _defineProperty(this, "_stnNum", void 0);

    this._stnNum = data.num;
  }

  get nameClass() {
    switch (this._state) {
      case -1:
        return 'Pass';

      case 0:
        return 'CurrentGZ';

      default:
        return 'Future';
    }
  }

  get iconHTML() {
    var [iconType, numClass] = this._state == -1 ? ['stn_gz_pass', 'Pass'] : ['stn_gz', 'Future'];
    return $('<g>', {
      transform: `translate(${this._x},${this._y})`
    }).append($('<use>', {
      'xlink:href': '#' + iconType
    })).append($('<g>', {
      class: 'Name ' + numClass
    }).append($('<text>', {
      class: 'rmg-name__zh rmg-name__gzmtr--line-num'
    })).append($('<text>', {
      class: 'rmg-name__zh rmg-name__gzmtr--station-num',
      x: 9.25
    }).text(this._stnNum)));
  }

  get nameHTML() {
    var nameENLn = this._nameEN.split('\\').length;

    var dx = (24 + (nameENLn - 1) * 12) * Math.cos(-45);
    var dy = -4 - 21.921875 - (nameENLn - 1) * 12 * Math.cos(-45);
    return $('<g>', {
      'transform': `translate(${this._x - dx},${this._y + dy})rotate(-45)`,
      'text-anchor': 'start',
      'class': `Name ${this.nameClass}`
    }).append($('<text>').addClass('rmg-name__zh rmg-name__gzmtr--station').text(this._nameZH)).append($('<text>', {
      'dy': 14,
      'class': 'rmg-name__en rmg-name__gzmtr--station'
    }).text(this._nameEN.split('\\')[0]).append($('<tspan>', {
      'x': 0,
      'dy': 12
    }).text(this._nameEN.split('\\')[1])));
  }

}

class Int2StationGZ extends StationGZ {
  constructor(id, data) {
    super(id, data);

    _defineProperty(this, "_intCity", void 0);

    _defineProperty(this, "_intLine", void 0);

    _defineProperty(this, "_intColour", void 0);

    _defineProperty(this, "_intFg", void 0);

    _defineProperty(this, "_intNameZH", void 0);

    _defineProperty(this, "_intNameEN", void 0);

    [this._intCity, this._intLine, this._intColour, this._intFg, this._intNameZH, this._intNameEN] = [0, 1, 2, 3, 4, 5].map(idx => data.interchange[0].map(x => x[idx]));
  }

  get intTickHTML() {
    var ticks = this._intColour.map((colour, idx) => {
      return $('<use>', {
        'xlink:href': '#inttick_gz',
        stroke: this._state == -1 ? '#aaa' : colour,
        x: this._x - 2 * (this._intColour.length - 1) + 4 * idx,
        y: this._y
      });
    });

    return $('<g>', {
      class: 'rmg-line rmg-line__gzmtr rmg-line__change'
    }).append(...ticks);
  }

  get intNameHTML() {
    var intNameZHs = this._intNameZH[0].match(/[\d]+|[\D]+/g);

    var intTextZHEl = $('<text>', {
      y: 8.5,
      class: 'rmg-name__zh rmg-name__gzmtr--int'
    }).append($('<tspan>', {
      'font-size': '17px',
      'alignment-baseline': 'central'
    }).text(intNameZHs.length == 1 ? '' : intNameZHs[0])).append($('<tspan>', {
      dy: -1,
      'alignment-baseline': 'central'
    }).text(intNameZHs[intNameZHs.length - 1]));

    var intNameZHss = this._intNameZH.map(name => name.match(/[\d]+|[\D]+/g));

    var intTextZHEls = intNameZHss.map((names, idx) => $('<text>', {
      y: 8.5 + idx * 28,
      class: 'rmg-name__zh rmg-name__gzmtr--int'
    }).append($('<tspan>', {
      'font-size': '17px',
      'alignment-baseline': 'central'
    }).text(names.length == 1 ? '' : names[0])).append($('<tspan>', {
      dy: -1,
      'alignment-baseline': 'central'
    }).text(names[names.length - 1])));

    var intTextENEls = this._intNameEN.map((name, idx) => {
      return $('<text>', {
        y: 19.5 + idx * 28,
        class: 'rmg-name__en rmg-name__gzmtr--int'
      }).text(name);
    });

    if (this._intFg[0] == '#fff' || this._state == -1) {
      [intTextZHEls, intTextENEls] = [intTextZHEls, intTextENEls].map(els => {
        return els.map(el => el.addClass('rmg-name__gzmtr--white-fg'));
      });
    }

    var intBoxEls = this._intColour.map((colour, idx) => {
      return $('<use>', {
        'xlink:href': '#intbox_gz',
        fill: this._state == -1 ? '#aaa' : colour,
        y: idx * 28
      });
    });

    return $('<g>', {
      'text-anchor': 'middle',
      transform: `translate(${this._x},${this._y + 23})`
    }).append(...intBoxEls, ...intTextZHEls, ...intTextENEls);
  }

  get ungrpHTML() {
    return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
  }

}

class Int3StationGZ extends Int2StationGZ {
  constructor(id, data) {
    super(id, data);
  }

}

class OSI11StationGZ extends Int2StationGZ {
  constructor(id, data) {
    data.interchange[0] = data.interchange[1].slice(1, 2);
    super(id, data);
  }

}

class OSI12StationGZ extends Int2StationGZ {
  constructor(id, data) {
    data.interchange[0] = data.interchange[1].slice(1, 3);
    super(id, data);
  }

}

class OSI22EndStationGZ extends Int2StationGZ {
  constructor(id, data) {
    data.interchange[0].push(...data.interchange[1].slice(1, 3));
    console.log(data.interchange);
    super(id, data);
  }

}