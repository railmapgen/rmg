'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Line {
  constructor(param) {
    _svgHeight.set(this, {
      writable: true,
      value: void 0
    });

    _svgWidth.set(this, {
      writable: true,
      value: void 0
    });

    _svgDestWidth.set(this, {
      writable: true,
      value: void 0
    });

    _showOuter.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "themeCity", void 0);

    _defineProperty(this, "themeLine", void 0);

    _defineProperty(this, "_themeColour", void 0);

    _yPc.set(this, {
      writable: true,
      value: void 0
    });

    _padding.set(this, {
      writable: true,
      value: void 0
    });

    _stripPc.set(this, {
      writable: true,
      value: void 0
    });

    _longInterval.set(this, {
      writable: true,
      value: 1
    });

    _branchSpacing.set(this, {
      writable: true,
      value: void 0
    });

    _txtFlip.set(this, {
      writable: true,
      value: void 0
    });

    _stations.set(this, {
      writable: true,
      value: {}
    });

    _currentStnId.set(this, {
      writable: true,
      value: void 0
    });

    _direction.set(this, {
      writable: true,
      value: void 0
    });

    _platformNum.set(this, {
      writable: true,
      value: void 0
    });

    _weightEN.set(this, {
      writable: true,
      value: void 0
    });

    _weightZH.set(this, {
      writable: true,
      value: void 0
    });

    _fontEN.set(this, {
      writable: true,
      value: void 0
    });

    _fontZH.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "_charForm", void 0);

    _lineNames.set(this, {
      writable: true,
      value: void 0
    });

    _destLegacy.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _svgHeight, param['svg_height']);

    _classPrivateFieldSet(this, _svgWidth, param['svg_width']);

    _classPrivateFieldSet(this, _svgDestWidth, param['svg_dest_width']);

    _classPrivateFieldSet(this, _showOuter, param['show_outer']);

    [this.themeCity, this.themeLine, this._themeColour] = param.theme;

    _classPrivateFieldSet(this, _yPc, param['y_pc']);

    _classPrivateFieldSet(this, _padding, param['padding']);

    _classPrivateFieldSet(this, _stripPc, param['strip_pc']);

    _classPrivateFieldSet(this, _branchSpacing, param.branch_spacing);

    _classPrivateFieldSet(this, _txtFlip, param['txt_flip']);

    for (let [stnId, stnInfo] of Object.entries(param['stn_list'])) {
      _classPrivateFieldGet(this, _stations)[stnId] = this._initStnInstance(stnId, stnInfo);
    }

    _classPrivateFieldSet(this, _currentStnId, param['current_stn_idx']);

    _classPrivateFieldSet(this, _direction, param['direction']);

    _classPrivateFieldSet(this, _platformNum, param['platform_num']);

    _classPrivateFieldSet(this, _lineNames, param['line_name']);

    _classPrivateFieldSet(this, _destLegacy, param['dest_legacy']);

    this._charForm = param.char_form; // Calculate other properties of stations

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.x = this._stnRealX(stnId);
      stnInstance.y = this._stnRealY(stnId);
      stnInstance._state = this._stnState(stnId);
      stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);
    }
  }

  _initStnInstance(stnId, stnInfo) {
    switch (stnInfo.change_type) {
      case 'int2':
        return new Int2Station(stnId, stnInfo);

      case 'int3_l':
        return new Int3LStation(stnId, stnInfo);

      case 'int3_r':
        return new Int3RStation(stnId, stnInfo);

      case 'osi11_ul':
      case 'osi11_pl':
        return new OSI11LStation(stnId, stnInfo);

      case 'osi11_ur':
      case 'osi11_pr':
        return new OSI11RStation(stnId, stnInfo);

      case 'osi12_ul':
      case 'osi12_pl':
        return new OSI12LStation(stnId, stnInfo);

      case 'osi12_ur':
      case 'osi12_pr':
        return new OSI12RStation(stnId, stnInfo);

      case 'osi22_end_p':
      case 'osi22_end_u':
        if (stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') {
          return new OSI22EndStation(stnId, stnInfo);
        }

      default:
        return new Station(stnId, stnInfo);
    }
  }

  set svgDestWidth(val) {
    val = Number(val);

    if (isNaN(val)) {
      return;
    }

    if (val <= 0) {
      return;
    }

    _classPrivateFieldSet(this, _svgDestWidth, val);

    setParams('svg_dest_width', val);
    this.drawSVGFrame();
    this.drawStrip();
    this.drawDestInfo();
    this.loadFonts();
  }

  set svgWidth(val) {
    val = Number(val);

    if (isNaN(val)) {
      return;
    }

    if (val <= 0) {
      return;
    }

    _classPrivateFieldSet(this, _svgWidth, val); // this.#svgDestWidth = val;


    var param = getParams();
    param.svg_width = val; // param.svg_dest_width = val;

    putParams(param);
    this.drawSVGFrame();

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.x = this._stnRealX(stnId);
      stnInstance.y = this._stnRealY(stnId);
    }

    Line.clearSVG(this);
    this.drawStns();
    this.updateStnNameBg();
    this.drawLine();
    this.drawStrip(); // this.drawDestInfo();

    this.loadFonts();
  }

  set yPc(val) {
    val = Number(val);

    _classPrivateFieldSet(this, _yPc, val);

    setParams('y_pc', val);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.y = this._stnRealY(stnId);
    }

    Line.clearSVG(this);
    this.drawStns();
    this.updateStnNameBg();
    this.drawLine();
    this.loadFonts();
  }

  set padding(val) {
    val = Number(val);

    _classPrivateFieldSet(this, _padding, val);

    setParams('padding', val);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.x = this._stnRealX(stnId);
    }

    Line.clearSVG(this);
    this.drawStns();
    this.updateStnNameBg();
    this.drawLine();
    this.loadFonts();
  }

  set branchSpacing(val) {
    val = Number(val);

    _classPrivateFieldSet(this, _branchSpacing, val);

    setParams('branch_spacing', val);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.x = this._stnRealX(stnId);
      stnInstance.y = this._stnRealY(stnId);
    }

    Line.clearSVG(this);
    this.drawStns();
    this.updateStnNameBg();
    this.drawLine();
    this.loadFonts();
  }

  set txtFlip(val) {
    _classPrivateFieldSet(this, _txtFlip, val);

    setParams('txt_flip', val);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);
    }

    $('#stn_icons').empty();
    this.drawStns();
    this.updateStnNameBg();
    this.loadFonts();
  }

  set themeColour(rgb) {
    this._themeColour = rgb;
    var param = getParams();
    param.theme[2] = rgb;
    putParams(param);
    this.fillThemeColour();
  }

  set direction(val) {
    _classPrivateFieldSet(this, _direction, val);

    setParams('direction', val);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance._state = this._stnState(stnId);
    }

    Line.clearSVG(this);
    this.drawStns();
    this.drawLine();
    this.drawDestInfo();
    this.loadFonts();
  }

  set platformNum(val) {
    _classPrivateFieldSet(this, _platformNum, val);

    setParams('platform_num', val);
    $('.rmg-platform-num').text(val);
  }

  set charForm(val) {
    this._charForm = val;
    setParams('char_form', val);
    var prevCharForm = $('.rmg-name__zh').eq(0).attr('class').match(/rmg-name__char-\w{2,4}/g)[0];
    $('.rmg-name__zh').removeClass(prevCharForm);
    $('.rmg-name__zh').addClass(`rmg-name__char-${val}`);
  }

  set lineNames(val) {
    _classPrivateFieldSet(this, _lineNames, val);

    setParams('line_name', val);
    this.drawDestInfo();
    this.loadFonts();
  }

  set destLegacy(val) {
    _classPrivateFieldSet(this, _destLegacy, val);

    setParams('dest_legacy', val);
    this.drawDestInfo();
    this.loadFonts();
  }

  set currentStnId(val) {
    _classPrivateFieldSet(this, _currentStnId, val);

    setParams('current_stn_idx', val);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance._state = this._stnState(stnId);
    }

    Line.clearSVG(this);
    this.drawStns();
    this.updateStnNameBg();
    this.drawLine();
    this.drawDestInfo();
    this.loadFonts();
  }

  _rightWideFactor(stnId) {
    var res = 0;
    var stnClasses = ['Int3RStation', 'OSI11RStation', 'OSI12RStation'];

    if (stnClasses.includes(_classPrivateFieldGet(this, _stations)[stnId].constructor.name)) {
      res += _classPrivateFieldGet(this, _longInterval);
    }

    if (this._stnOutdegree(stnId) == 2) {
      res += _classPrivateFieldGet(this, _longInterval) / 2;
    }

    if (this._stnIndegree(_classPrivateFieldGet(this, _stations)[stnId]._children[0]) == 2) {
      res += _classPrivateFieldGet(this, _longInterval) / 2;
    }

    return res;
  }

  _leftWideFactor(stnId) {
    var res = 0;
    var stnClasses = ['Int3LStation', 'OSI11LStation', 'OSI12LStation'];

    if (stnClasses.includes(_classPrivateFieldGet(this, _stations)[stnId].constructor.name)) {
      res += _classPrivateFieldGet(this, _longInterval);
    }

    if (this._stnIndegree(stnId) == 2) {
      res += _classPrivateFieldGet(this, _longInterval) / 2;
    }

    if (this._stnOutdegree(_classPrivateFieldGet(this, _stations)[stnId]._parents[0]) == 2) {
      res += _classPrivateFieldGet(this, _longInterval) / 2;
    }

    return res;
  }

  _pathWeight(stnId1, stnId2) {
    // Path weight from stnId1 to stnId2
    // if (stnId1 == stnId2) {return 0;}
    if (!_classPrivateFieldGet(this, _stations)[stnId1]._children.includes(stnId2)) {
      return -Infinity;
    }

    return 1 + this._rightWideFactor(stnId1) + this._leftWideFactor(stnId2);
  }

  _cpm(from, to) {
    var self = this; // Critical Path Method (FuOR)

    if (from == to) {
      return 0;
    }

    ; // var allLengths = [];

    var allLengths = _classPrivateFieldGet(this, _stations)[from]._children.map(child => allLengths.push(1 + self._cpm(child, to))); // for (let child of this.#stations[from]._children) {
    //     allLengths.push(1 + self._cpm(child, to));
    // }


    return Math.max(...allLengths);
  }

  _cp(from, to) {
    var self = this;

    if (from == to) {
      return {
        len: 0,
        nodes: [from]
      };
    }

    var allLengths = [];
    var criticalPaths = [];

    _classPrivateFieldGet(this, _stations)[from]._children.forEach(child => {
      var cp = self._cp(child, to);

      if (cp.len < 0) {
        return;
      }

      allLengths.push(this._pathWeight(from, child) + cp.len);
      cp.nodes.unshift(from);
      criticalPaths.push(cp.nodes);
    });

    var maxLength = Math.max(...allLengths);
    return {
      'len': maxLength,
      'nodes': criticalPaths[allLengths.indexOf(maxLength)]
    };
  }

  get criticalPath() {
    var allLengths = [];
    var criticalPaths = [];
    this.leftDests.forEach(ld => {
      this.rightDests.forEach(rd => {
        var cp = this._cp(ld, rd);

        allLengths.push(cp.len);
        criticalPaths.push(cp.nodes);
      });
    });
    var maxLen = Math.max(...allLengths);
    return {
      'len': maxLen,
      'nodes': criticalPaths[allLengths.indexOf(maxLen)]
    };
  }

  _topoOrder(from, tpo = []) {
    var self = this;
    tpo.push(from);

    _classPrivateFieldGet(this, _stations)[from]._children.forEach(child => {
      if (this._stnIndegree(child) == 2 && _classPrivateFieldGet(this, _stations)[child]._parents.indexOf(from) == 0) {
        // wait the other branch
        return;
      }

      tpo.concat(self._topoOrder(child, tpo));
    });

    return tpo;
  }

  get tpo() {
    var res = this._topoOrder('linestart');

    return res.slice(1, res.length - 1);
  }

  get y() {
    return _classPrivateFieldGet(this, _yPc) * _classPrivateFieldGet(this, _svgHeight) / 100;
  }

  get stripY() {
    return _classPrivateFieldGet(this, _stripPc) * _classPrivateFieldGet(this, _svgHeight) / 100;
  }

  get turningRadius() {
    return _classPrivateFieldGet(this, _branchSpacing) / 2 * (Math.sqrt(2) / (Math.sqrt(2) - 1));
  }

  get lineXs() {
    return [_classPrivateFieldGet(this, _svgWidth) * _classPrivateFieldGet(this, _padding) / 100, _classPrivateFieldGet(this, _svgWidth) * (1 - _classPrivateFieldGet(this, _padding) / 100)];
  }

  get leftDests() {
    return _classPrivateFieldGet(this, _stations).linestart._children;
  }

  get rightDests() {
    return _classPrivateFieldGet(this, _stations).lineend._parents;
  }

  _stnIndegree(stnId) {
    return _classPrivateFieldGet(this, _stations)[stnId].inDegree;
  }

  _stnOutdegree(stnId) {
    return _classPrivateFieldGet(this, _stations)[stnId].outDegree;
  }

  get stnRealXs() {
    var xs = {};

    for (let stnId in _classPrivateFieldGet(this, _stations)) {
      xs[stnId] = this._stnRealX(stnId);
    }

    return xs;
  }

  _stnXShare(stnId) {
    var self = this;
    var cp = this.criticalPath;

    if (cp.nodes.includes(stnId)) {
      return this._cp(cp.nodes[0], stnId).len;
    }

    var partSource = stnId;
    var partSink = stnId;
    var leftOpenJaw = false;
    var rightOpenJaw = false;

    while (true) {
      var parent = _classPrivateFieldGet(this, _stations)[partSource]._parents[0];

      if (parent == 'linestart') {
        leftOpenJaw = true;
        break;
      }

      partSource = parent;

      if (this._stnOutdegree(partSource) > 1) {
        break;
      }
    }

    while (true) {
      var children = _classPrivateFieldGet(this, _stations)[partSink]._children;

      if (children[0] != 'lineend') {
        partSink = children[0];
      } else {
        rightOpenJaw = true;
        break;
      }

      if (this._stnIndegree(partSink) > 1) {
        break;
      }
    }

    var lengthToSource = this._cp(partSource, stnId).len;

    var lengthToSink = this._cp(stnId, partSink).len;

    if (leftOpenJaw) {
      var actualPartLength = this._cp(cp.nodes[0], partSink).len;

      return self._stnXShare(partSink) - lengthToSink / (lengthToSource + lengthToSink) * actualPartLength;
    } else if (rightOpenJaw) {
      var actualPartLength = this._cp(partSource, cp.nodes.slice(-1)[0]).len;
    } else {
      var actualPartLength = this._cp(partSource, partSink).len;
    }

    return self._stnXShare(partSource) + lengthToSource / (lengthToSource + lengthToSink) * actualPartLength;
  }

  _stnRealX(stnId) {
    var [lineStart, lineEnd] = this.lineXs;
    return lineStart + this._stnXShare(stnId) / this.criticalPath.len * (lineEnd - lineStart);
  }

  _stnYShare(stnId) {
    if (['linestart', 'lineend'].includes(stnId) || this._stnIndegree(stnId) > 1 || this._stnOutdegree(stnId) > 1) {
      return 0;
    }

    var stnPred = _classPrivateFieldGet(this, _stations)[stnId]._parents[0];

    if (stnPred) {
      // parent exist
      if (this._stnOutdegree(stnPred) == 1) {
        // no sibling, then y same as parent
        return this._stnYShare(stnPred);
      } else {
        // sibling exists, then y depends on its idx of being children
        return _classPrivateFieldGet(this, _stations)[stnPred]._children.indexOf(stnId) == 0 ? 1 : -1;
      }
    } else {
      // no parent, must be linestart
      return 0;
    }

    return 0;
  }

  _stnRealY(stnId) {
    return this.y - this._stnYShare(stnId) * _classPrivateFieldGet(this, _branchSpacing);
  }

  _isSuccessor(stnId1, stnId2) {
    // Is stnId2 a successor of stnId1?
    var self = this;

    var descOfStn1 = _classPrivateFieldGet(this, _stations)[stnId1]._children;

    if (!descOfStn1.length) {
      return false;
    } else if (descOfStn1.includes(stnId2)) {
      return true;
    } else {
      for (let desc of descOfStn1) {
        if (self._isSuccessor(desc, stnId2)) {
          return true;
        }
      }
    }

    return false;
  }

  _isPredecessor(stnId1, stnId2) {
    // Is stnId2 a predecessor of stnId1?
    var self = this;

    var ansOfStn1 = _classPrivateFieldGet(this, _stations)[stnId1]._parents;

    if (!ansOfStn1.length) {
      return false;
    } else if (ansOfStn1.includes(stnId2)) {
      return true;
    } else {
      for (let ans of ansOfStn1) {
        if (self._isPredecessor(ans, stnId2)) {
          return true;
        }
      }
    }

    return false;
  }

  _stnState(stnId) {
    if (stnId == _classPrivateFieldGet(this, _currentStnId)) {
      return 0;
    }

    if (_classPrivateFieldGet(this, _direction) == 'r') {
      return this._isSuccessor(_classPrivateFieldGet(this, _currentStnId), stnId) ? 1 : -1;
    } else {
      return this._isPredecessor(_classPrivateFieldGet(this, _currentStnId), stnId) ? 1 : -1;
    }
  }

  _stnNamePos(stnId) {
    var self = this;
    var cp = this.criticalPath.nodes;

    if (stnId == 'linestart') {
      return 1;
    }

    var pos = cp.indexOf(stnId) % 2;

    if (pos == -1) {
      var parId = _classPrivateFieldGet(this, _stations)[stnId]._parents[0];

      if (this._stnOutdegree(parId) == 2) {
        return self._stnNamePos(parId);
      }

      return Number(!self._stnNamePos(parId));
    }

    return pos;
  }

  drawSVGFrame() {
    $('#railmap, #outer').attr({
      width: _classPrivateFieldGet(this, _svgWidth),
      height: _classPrivateFieldGet(this, _svgHeight)
    });
    $('#destination, #dest_outer').attr({
      width: _classPrivateFieldGet(this, _svgDestWidth),
      height: _classPrivateFieldGet(this, _svgHeight)
    });
  }

  showFrameOuter() {
    // var outerColour = this.#showOuter ? 'black' : 'none';
    // $('#outer, #dest_outer').attr('stroke', outerColour);
    if (_classPrivateFieldGet(this, _showOuter)) {
      $('#outer, #dest_outer').show();
    } else {
      $('#outer, #dest_outer').hide();
    }
  }

  drawStns() {
    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      $('#stn_icons').append(stnInstance.html);
    }

    $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
  }

  updateStnNameBg() {
    var stnNameDim = getTxtBoxDim($(`#stn_icons > #${_classPrivateFieldGet(this, _currentStnId)} > .Name`)[0], 'railmap');
    $('#current_bg').attr({
      x: stnNameDim.x - 3,
      y: stnNameDim.y,
      width: stnNameDim.width + 6,
      height: stnNameDim.height + 2
    }).show();
  }

  get stnDX() {
    return this.turningRadius - _classPrivateFieldGet(this, _branchSpacing) / 2;
  }

  get stnDY() {
    return _classPrivateFieldGet(this, _branchSpacing) / 2;
  }

  get stnExtraH() {
    var [lineStart, lineEnd] = this.lineXs;
    return (lineEnd - lineStart) / this.criticalPath.len * _classPrivateFieldGet(this, _longInterval);
  }

  get stnSpareH() {
    var [lineStart, lineEnd] = this.lineXs;
    var dh = ((lineEnd - lineStart) / this.criticalPath.len - 2 * this.stnDX) / 2;

    if (dh < 0) {
      console.warn(`SVG width too small! ${dh}`);
    }

    return dh;
  }

  get pathTurnENE() {
    return `a ${this.turningRadius},${this.turningRadius} 0 0,0 ${this.stnDX},${-this.stnDY}`;
  }

  get pathTurnNEE() {
    return `a ${this.turningRadius},${this.turningRadius} 0 0,1 ${this.stnDX},${-this.stnDY}`;
  }

  get pathTurnESE() {
    return `a ${this.turningRadius},${this.turningRadius} 0 0,1 ${this.stnDX},${this.stnDY}`;
  }

  get pathTurnSEE() {
    return `a ${this.turningRadius},${this.turningRadius} 0 0,0 ${this.stnDX},${this.stnDY}`;
  }

  _linePath(stnIds) {
    var [prevId, prevY, prevX] = [];
    var path = [];
    var {
      stnExtraH,
      stnSpareH,
      pathTurnESE,
      pathTurnSEE,
      pathTurnENE,
      pathTurnNEE,
      stnDX
    } = this;
    stnIds.forEach(stnId => {
      var [x, y] = ['_stnRealX', '_stnRealY'].map(fun => this[fun](stnId));

      if (!prevY) {
        [prevId, prevX, prevY] = [stnId, x, y];
        path.push(`M ${x},${y}`);
        return;
      }

      if (y > prevY) {
        path.push(y == this.y ? `h ${x - prevX - stnExtraH * this._leftWideFactor(stnId) - stnSpareH - stnDX * 2}` : `h ${stnExtraH * this._rightWideFactor(prevId) + stnSpareH}`);
        path.push(pathTurnESE, pathTurnSEE);
      } else if (y < prevY) {
        path.push(y == this.y ? `h ${x - prevX - stnExtraH * this._leftWideFactor(stnId) - stnSpareH - stnDX * 2}` : `h ${stnExtraH * this._rightWideFactor(prevId) + stnSpareH}`);
        path.push(pathTurnENE, pathTurnNEE);
      }

      path.push(`H ${x}`);
      [prevId, prevX, prevY] = [stnId, x, y];
    }); // simplify path

    return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
  }

  drawLine() {
    this.branches.map(branch => {
      var lineMainStns = branch.filter(stnId => _classPrivateFieldGet(this, _stations)[stnId]._state >= 0);
      var linePassStns = branch.filter(stnId => _classPrivateFieldGet(this, _stations)[stnId]._state <= 0);

      if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length == 0 && lineMainStns.length) {
        // if two set disjoint
        if (linePassStns[0] === branch[0]) {
          // -1 -1 1 1
          linePassStns.push(lineMainStns[0]);
        } else {
          // 1 1 -1 -1
          linePassStns.unshift(lineMainStns[lineMainStns.length - 1]);
        }
      }

      $('#line_main').append($('<path>', {
        'd': this._linePath(lineMainStns)
      }));
      $('#line_pass').append($('<path>', {
        'd': this._linePath(linePassStns)
      }));
    });
    $('#line_main').html($('#line_main').html());
    $('#line_pass').html($('#line_pass').html());
  }

  drawStrip() {
    // $('#strip, #dest_strip').attr('d', `M 0,${this.stripY} H ${this.#svgWidth}`)
    $('#strip').attr('d', `M 0,${this.stripY} H ${_classPrivateFieldGet(this, _svgWidth)}`);
    $('#dest_strip').attr('d', `M 0,${this.stripY} H ${_classPrivateFieldGet(this, _svgDestWidth)}`);
  }

  fillThemeColour() {
    $('#line_main, #strip, #dest_strip, #stn_gz').attr('stroke', this._themeColour);
    $('#dest_name > #platform > circle').attr('fill', this._themeColour);
  }

  drawDestInfo() {
    $('#dest_name > #platform > text').text(_classPrivateFieldGet(this, _platformNum));

    if (_classPrivateFieldGet(this, _direction) == 'l') {
      var destinations = this.leftDests;
      var txtAnchor = 'start';
    } else {
      var destinations = this.rightDests;
      var txtAnchor = 'end';
    }

    var validDest = destinations.filter(stnId => _classPrivateFieldGet(this, _stations)[stnId]._state >= 0); // var validDest = []
    // for (let stnId of destinations) {
    //     if (this.#stations[stnId]._state >= 0) {validDest.push(stnId)}; 
    // }

    var [destNameZH, destNameEN] = [].map.call(['_nameZH', '_nameEN'], key => {
      return validDest.map(stnId => _classPrivateFieldGet(this, _stations)[stnId][key].replace(/\\/g, ' ')).join('/');
    });

    if (_classPrivateFieldGet(this, _destLegacy)) {
      var [lineNameZH, lineNameEN] = _classPrivateFieldGet(this, _lineNames);

      lineNameEN += ' ';
    } else {
      var lineNameZH = lineNameEN = '';
    }

    $('#dest_name > g:last-child').empty().attr('text-anchor', txtAnchor).append($('<text>').addClass('rmg-name__zh DestName').text(`${lineNameZH}往${destNameZH}`)).append($('<text>', {
      'dy': 80,
      'class': 'rmg-name__en DestName'
    }).text(`${lineNameEN}to ${destNameEN}`));
    $('#dest_name').html($('#dest_name').html());
    var bcr = $('#dest_name > g:last-child')[0].getBoundingClientRect();
    var flagLength = 160 + 150 + bcr.width + 45 + 50;
    var isLeft = _classPrivateFieldGet(this, _direction) == 'l' ? 1 : -1;
    var arrowX = (_classPrivateFieldGet(this, _svgDestWidth) - isLeft * flagLength) / 2;
    var arrowRotate = 90 * (1 - isLeft);
    var platformNumX = arrowX + isLeft * (160 + 50 + 75);
    var destNameX = platformNumX + isLeft * (75 + 45);
    $('#dest_name > use').attr('transform', `translate(${arrowX},130)rotate(${arrowRotate})`);
    $('#dest_name > #platform').attr('transform', `translate(${platformNumX},130)`);
    $('#dest_name > g:last-child').attr('transform', `translate(${destNameX},105)`);
  }

  loadFonts() {
    $('.rmg-name__zh').addClass(`rmg-name__char-${this._charForm}`);
  }

  updateStnName(stnId, nameZH, nameEN) {
    var param = getParams();
    param.stn_list[stnId].name = [nameZH, nameEN];
    putParams(param);
    _classPrivateFieldGet(this, _stations)[stnId]._nameZH = nameZH;
    _classPrivateFieldGet(this, _stations)[stnId]._nameEN = nameEN;
    $(`#stn_icons #${stnId}`).remove();
    $('#stn_icons').append(_classPrivateFieldGet(this, _stations)[stnId].html);
    $('#stn_icons').html($('#stn_icons').html());

    if (stnId == _classPrivateFieldGet(this, _currentStnId)) {
      this.updateStnNameBg();
    }

    if (this.leftDests.includes(stnId) && _classPrivateFieldGet(this, _direction) == 'l') {
      this.drawDestInfo();
    } else if (this.rightDests.includes(stnId) && _classPrivateFieldGet(this, _direction) == 'r') {
      this.drawDestInfo();
    }

    this.loadFonts();
  }

  updateStnTransfer(stnId, type, info = null) {
    var prevClass = _classPrivateFieldGet(this, _stations)[stnId].constructor.name;

    var param = getParams();
    param.stn_list[stnId].change_type = type;

    if (type == 'none') {
      delete param.stn_list[stnId].transfer;
      delete param.stn_list[stnId].interchange;
    } else {
      // param.stn_list[stnId].transfer = info;
      param.stn_list[stnId].interchange = info;
    }

    putParams(param);
    _classPrivateFieldGet(this, _stations)[stnId] = this._initStnInstance(stnId, param.stn_list[stnId]);

    if (prevClass != _classPrivateFieldGet(this, _stations)[stnId].constructor.name) {
      // Not sure position, redraw all
      for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
        if (['linestart', 'lineend'].includes(stnId)) {
          continue;
        }

        stnInstance.x = this._stnRealX(stnId);
        stnInstance.y = this._stnRealY(stnId);
        stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);
        stnInstance._state = this._stnState(stnId);
      }

      Line.clearSVG(this);
      this.drawStns();
      this.updateStnNameBg();
      this.drawLine();
      this.drawStrip();
    } else {
      _classPrivateFieldGet(this, _stations)[stnId].x = this._stnRealX(stnId);
      _classPrivateFieldGet(this, _stations)[stnId].y = this._stnRealY(stnId);
      _classPrivateFieldGet(this, _stations)[stnId].namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);
      _classPrivateFieldGet(this, _stations)[stnId]._state = this._stnState(stnId);
      $(`#stn_icons #${stnId}`).remove();
      $('#stn_icons').append(_classPrivateFieldGet(this, _stations)[stnId].html);
      $('#stn_icons').html($('#stn_icons').html());
    }

    this.loadFonts();
  }

  removeStn(stnId) {
    var param = getParams();

    var parents = _classPrivateFieldGet(this, _stations)[stnId]._parents;

    var children = _classPrivateFieldGet(this, _stations)[stnId]._children;

    var isLastMainBranchStn = true;

    for (let id in _classPrivateFieldGet(this, _stations)) {
      if ([stnId, 'linestart', 'lineend'].includes(id)) {
        continue;
      }

      if (this._stnYShare(id) == 0) {
        isLastMainBranchStn = false;
        break;
      }
    }

    if (parents.length == 2 && children.length == 2) {
      // To be rewritten, join two branches
      return false;
    } else if (isLastMainBranchStn) {
      // Last main line station
      return false;
    } else if (Object.keys(param.stn_list).length == 4) {
      // Last two stations
      return false;
    } else if (parents.length == 2 || children.length == 2) {
      parents.forEach(parId => {
        param.stn_list[parId].children = children;
        _classPrivateFieldGet(this, _stations)[parId]._children = children;
      });
      children.forEach(childId => {
        param.stn_list[childId].parents = parents;
        _classPrivateFieldGet(this, _stations)[childId]._parents = parents;
      });

      if (parents.length == 1) {
        param.stn_list[parents[0]].branch.right = _classPrivateFieldGet(this, _stations)[stnId]._branch.right;
        _classPrivateFieldGet(this, _stations)[parents[0]]._branch.right = _classPrivateFieldGet(this, _stations)[stnId]._branch.right;
      }

      if (children.length == 1) {
        param.stn_list[children[0]].branch.left = _classPrivateFieldGet(this, _stations)[stnId]._branch.left;
        _classPrivateFieldGet(this, _stations)[children[0]]._branch.left = _classPrivateFieldGet(this, _stations)[stnId]._branch.left;
      }
    } else if (this._stnOutdegree(parents[0]) == 2 && this._stnIndegree(children[0]) == 2) {
      // 1 par 1 child, last station on upper/lower branch
      // branch disappear
      var childIdxOfPar = _classPrivateFieldGet(this, _stations)[parents[0]]._children.indexOf(stnId);

      var parIdxOfChild = _classPrivateFieldGet(this, _stations)[children[0]]._parents.indexOf(stnId);

      param.stn_list[parents[0]].children.splice(childIdxOfPar, 1);

      _classPrivateFieldGet(this, _stations)[parents[0]]._children.splice(childIdxOfPar, 1);

      param.stn_list[children[0]].parents.splice(parIdxOfChild, 1);

      _classPrivateFieldGet(this, _stations)[children[0]]._parents.splice(parIdxOfChild, 1);

      param.stn_list[parents[0]].branch.right = [];
      _classPrivateFieldGet(this, _stations)[parents[0]]._branch.right = [];
      param.stn_list[children[0]].branch.left = [];
      _classPrivateFieldGet(this, _stations)[children[0]]._branch.left = [];
    } else {
      // 1 par 1 child
      parents.forEach(parId => {
        var idx = param.stn_list[parId].children.indexOf(stnId);

        if (children.length) {
          param.stn_list[parId].children[idx] = children[0];
          _classPrivateFieldGet(this, _stations)[parId]._children[idx] = children[0];
        } else {
          // Right dest
          param.stn_list[parId].children.splice(idx, 1);

          _classPrivateFieldGet(this, _stations)[parId]._children.splice(idx, 1);
        }
      });
      children.forEach(childId => {
        var idx = param.stn_list[childId].parents.indexOf(stnId);

        if (parents.length) {
          param.stn_list[childId].parents[idx] = parents[0];
          _classPrivateFieldGet(this, _stations)[childId]._parents[idx] = parents[0];
        } else {
          // Left dest
          param.stn_list[childId].parents.splice(idx, 1);

          _classPrivateFieldGet(this, _stations)[childId]._parents.splice(idx, 1);
        }
      });
    }

    delete param.stn_list[stnId];
    delete _classPrivateFieldGet(this, _stations)[stnId];
    var isCurrentStnChanged = false;

    if (_classPrivateFieldGet(this, _currentStnId) == stnId) {
      var newCurrentStnId = Object.keys(_classPrivateFieldGet(this, _stations))[1];

      _classPrivateFieldSet(this, _currentStnId, newCurrentStnId);

      param.current_stn_idx = newCurrentStnId;
      isCurrentStnChanged = true;
    }

    putParams(param);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.x = this._stnRealX(stnId);
      stnInstance.y = this._stnRealY(stnId);
      stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);

      if (isCurrentStnChanged) {
        stnInstance._state = this._stnState(stnId);
      }
    }

    Line.clearSVG(this);
    this.drawStns();
    this.updateStnNameBg();
    this.drawLine();
    this.drawStrip();
    this.drawDestInfo();
    this.loadFonts();
    return true;
  }

  newStnPossibleLoc(prep, stnId) {
    var deg = prep == 'before' ? this._stnIndegree(stnId) : this._stnOutdegree(stnId);

    switch (deg) {
      case 2:
        // 1 -> 2
        return [1, 1, 1, 0, 0];

      case 1:
        if (this._stnYShare(stnId) == 0) {
          // 1 -> 1
          var state = this.newBranchPossibleEnd(prep, stnId);
          state = state.length ? state : 0;
          return [1, 0, 0, state, state]; // [1,0,0,1,1];
        } else if (_classPrivateFieldGet(this, _stations)[stnId]._y > this.y) {
          if (prep == 'before') {
            return [this._stnOutdegree(_classPrivateFieldGet(this, _stations)[stnId]._parents[0]) - 1, 0, 1, 0, 0];
          } else {
            return [this._stnIndegree(_classPrivateFieldGet(this, _stations)[stnId]._children[0]) - 1, 0, 1, 0, 0];
          }
        } else {
          if (prep == 'before') {
            return [this._stnOutdegree(_classPrivateFieldGet(this, _stations)[stnId]._parents[0]) - 1, 1, 0, 0, 0];
          } else {
            return [this._stnIndegree(_classPrivateFieldGet(this, _stations)[stnId]._children[0]) - 1, 1, 0, 0, 0];
          }
        }

    }

    return [0, 0, 0, 0, 0];
  }

  newBranchPossibleEnd(prep, stnId) {
    var res = [];

    if (prep == 'before') {
      while (this._stnIndegree(stnId) == 1) {
        stnId = _classPrivateFieldGet(this, _stations)[stnId]._parents[0];
        res.unshift(stnId); // if (stnId == 'linestart') {return res;}
        // if (this._stnIndegree(stnId) == 2) {return res;}
      }

      res.pop();
    } else {
      while (this._stnOutdegree(stnId) == 1) {
        stnId = _classPrivateFieldGet(this, _stations)[stnId]._children[0];
        res.push(stnId);
      }

      res.shift();
    }

    return res;
  }

  addStn(prep, stnId, loc, end) {
    var newId = getRandomId();

    while (Object.keys(_classPrivateFieldGet(this, _stations)).includes(newId)) {
      newId = getRandomId();
    }

    var param = getParams();
    var newInfo = {};

    if (prep == 'before') {
      if (loc == 'centre') {
        newInfo.branch = {
          left: _classPrivateFieldGet(this, _stations)[stnId]._branch.left,
          right: []
        };
        _classPrivateFieldGet(this, _stations)[stnId]._branch.left = [];
        param.stn_list[stnId].branch.left = [];
        newInfo.parents = _classPrivateFieldGet(this, _stations)[stnId]._parents;

        if (this._stnIndegree(stnId) == 0 && _classPrivateFieldGet(this, _stations)[stnId]._y != this.y) {
          newInfo.children = this.leftDests;
        } else if (_classPrivateFieldGet(this, _stations)[stnId]._y != this.y) {
          newInfo.children = _classPrivateFieldGet(this, _stations)[_classPrivateFieldGet(this, _stations)[stnId]._parents[0]]._children;
        } else {
          newInfo.children = [stnId];
        }

        newInfo.parents.forEach(par => {
          _classPrivateFieldGet(this, _stations)[par]._children = [newId];
          param.stn_list[par].children = [newId];
        });
        newInfo.children.forEach(child => {
          _classPrivateFieldGet(this, _stations)[child]._parents = [newId];
          param.stn_list[child].parents = [newId];
        });
      } else if (loc == 'upper') {
        newInfo.branch = {
          left: [],
          right: []
        };

        if (this._stnIndegree(stnId) == 2) {
          if (_classPrivateFieldGet(this, _stations)[stnId]._branch.left[1] == _classPrivateFieldGet(this, _stations)[stnId]._parents[0]) {
            _classPrivateFieldGet(this, _stations)[stnId]._branch.left[1] = newId;
            param.stn_list[stnId].branch.left[1] = newId;
          }

          newInfo.parents = _classPrivateFieldGet(this, _stations)[stnId]._parents.slice(0, 1);
          newInfo.children = [stnId];
          newInfo.parents.forEach(par => {
            _classPrivateFieldGet(this, _stations)[par]._children = [newId];
            param.stn_list[par].children = [newId];
          });
          _classPrivateFieldGet(this, _stations)[stnId]._parents[0] = newId;
          param.stn_list[stnId].parents[0] = newId;
        } else {
          // already on branch
          newInfo.parents = _classPrivateFieldGet(this, _stations)[stnId]._parents;
          newInfo.children = [stnId];
          newInfo.parents.forEach(par => {
            _classPrivateFieldGet(this, _stations)[par]._children[0] = newId;
            param.stn_list[par].children[0] = newId;
          });
          newInfo.children.forEach(child => {
            _classPrivateFieldGet(this, _stations)[child]._parents = [newId];
            param.stn_list[child].parents = [newId];
          });
        }
      } else if (loc == 'lower') {
        newInfo.branch = {
          left: [],
          right: []
        };

        if (this._stnIndegree(stnId) == 2) {
          if (_classPrivateFieldGet(this, _stations)[stnId]._branch.left[1] == _classPrivateFieldGet(this, _stations)[stnId]._parents[1]) {
            _classPrivateFieldGet(this, _stations)[stnId]._branch.left[1] = newId;
            param.stn_list[stnId].branch.left[1] = newId;
          }

          newInfo.parents = _classPrivateFieldGet(this, _stations)[stnId]._parents.slice(1);
          newInfo.children = [stnId];
          newInfo.parents.forEach(par => {
            _classPrivateFieldGet(this, _stations)[par]._children = [newId];
            param.stn_list[par].children = [newId];
          });
          _classPrivateFieldGet(this, _stations)[stnId]._parents[1] = newId;
          param.stn_list[stnId].parents[1] = newId;
        } else {
          // already on branch
          newInfo.parents = _classPrivateFieldGet(this, _stations)[stnId]._parents;
          newInfo.children = [stnId];
          newInfo.parents.forEach(par => {
            _classPrivateFieldGet(this, _stations)[par]._children[1] = newId;
            param.stn_list[par].children[1] = newId;
          });
          newInfo.children.forEach(child => {
            _classPrivateFieldGet(this, _stations)[child]._parents = [newId];
            param.stn_list[child].parents = [newId];
          });
        }
      } else if (loc == 'newupper') {
        newInfo.branch = {
          left: [],
          right: []
        };
        _classPrivateFieldGet(this, _stations)[stnId]._branch.left[1] = newId;
        param.stn_list[stnId].branch.left[1] = newId;
        newInfo.parents = [end];
        newInfo.children = [stnId];

        _classPrivateFieldGet(this, _stations)[end]._children.unshift(newId);

        param.stn_list[end].children.unshift(newId);

        _classPrivateFieldGet(this, _stations)[stnId]._parents.unshift(newId);

        param.stn_list[stnId].parents.unshift(newId);
      } else if (loc == 'newlower') {
        newInfo.branch = {
          left: [],
          right: []
        };
        _classPrivateFieldGet(this, _stations)[stnId]._branch.left[1] = newId;
        param.stn_list[stnId].branch.left[1] = newId;
        newInfo.parents = [end];
        newInfo.children = [stnId];

        _classPrivateFieldGet(this, _stations)[end]._children.push(newId);

        param.stn_list[end].children.push(newId);

        _classPrivateFieldGet(this, _stations)[stnId]._parents.push(newId);

        param.stn_list[stnId].parents.push(newId);
      }
    } else {
      if (loc == 'centre') {
        newInfo.branch = {
          left: [],
          right: _classPrivateFieldGet(this, _stations)[stnId]._branch.right
        };
        _classPrivateFieldGet(this, _stations)[stnId]._branch.right = [];
        param.stn_list[stnId].branch.right = [];
        newInfo.children = _classPrivateFieldGet(this, _stations)[stnId]._children;

        if (this._stnOutdegree(stnId) == 0 && _classPrivateFieldGet(this, _stations)[stnId]._y != this.y) {
          newInfo.parents = this.rightDests;
        } else if (_classPrivateFieldGet(this, _stations)[stnId]._y != this.y) {
          newInfo.parents = _classPrivateFieldGet(this, _stations)[_classPrivateFieldGet(this, _stations)[stnId]._children[0]]._parents;
        } else {
          newInfo.parents = [stnId];
        }

        newInfo.children.forEach(child => {
          _classPrivateFieldGet(this, _stations)[child]._parents = [newId];
          param.stn_list[child].parents = [newId];
        });
        newInfo.parents.forEach(par => {
          _classPrivateFieldGet(this, _stations)[par]._children = [newId];
          param.stn_list[par].children = [newId];
        });
      } else if (loc == 'upper') {
        newInfo.branch = {
          left: [],
          right: []
        };

        if (this._stnOutdegree(stnId) == 2) {
          if (_classPrivateFieldGet(this, _stations)[stnId]._branch.right[1] == _classPrivateFieldGet(this, _stations)[stnId]._children[0]) {
            _classPrivateFieldGet(this, _stations)[stnId]._branch.right[1] = newId;
            param.stn_list[stnId].branch.right[1] = newId;
          }

          newInfo.children = _classPrivateFieldGet(this, _stations)[stnId]._children.slice(0, 1);
          newInfo.parents = [stnId];
          newInfo.children.forEach(child => {
            _classPrivateFieldGet(this, _stations)[child]._parents = [newId];
            param.stn_list[child].parents = [newId];
          });
          _classPrivateFieldGet(this, _stations)[stnId]._children[0] = newId;
          param.stn_list[stnId].children[0] = newId;
        } else {
          // already on branch
          newInfo.children = _classPrivateFieldGet(this, _stations)[stnId]._children;
          newInfo.parents = [stnId];
          newInfo.children.forEach(child => {
            _classPrivateFieldGet(this, _stations)[child]._parents[0] = newId;
            param.stn_list[child].parents[0] = newId;
          });
          newInfo.parents.forEach(par => {
            _classPrivateFieldGet(this, _stations)[par]._children = [newId];
            param.stn_list[par].children = [newId];
          });
        }
      } else if (loc == 'lower') {
        newInfo.branch = {
          left: [],
          right: []
        };

        if (this._stnOutdegree(stnId) == 2) {
          if (_classPrivateFieldGet(this, _stations)[stnId]._branch.right[1] == _classPrivateFieldGet(this, _stations)[stnId]._children[1]) {
            _classPrivateFieldGet(this, _stations)[stnId]._branch.right[1] = newId;
            param.stn_list[stnId].branch.right[1] = newId;
          }

          newInfo.children = _classPrivateFieldGet(this, _stations)[stnId]._children.slice(1);
          newInfo.parents = [stnId];
          newInfo.children.forEach(child => {
            _classPrivateFieldGet(this, _stations)[child]._parents = [newId];
            param.stn_list[child].parents = [newId];
          });
          _classPrivateFieldGet(this, _stations)[stnId]._children[1] = newId;
          param.stn_list[stnId].children[1] = newId;
        } else {
          // already on branch
          newInfo.children = _classPrivateFieldGet(this, _stations)[stnId]._children;
          newInfo.parents = [stnId];
          newInfo.children.forEach(child => {
            _classPrivateFieldGet(this, _stations)[child]._parents[1] = newId;
            param.stn_list[child].parents[1] = newId;
          });
          newInfo.parents.forEach(par => {
            _classPrivateFieldGet(this, _stations)[par]._children = [newId];
            param.stn_list[par].children = [newId];
          });
        }
      } else if (loc == 'newupper') {
        newInfo.branch = {
          left: [],
          right: []
        };
        _classPrivateFieldGet(this, _stations)[stnId]._branch.right[1] = newId;
        param.stn_list[stnId].branch.right[1] = newId;
        newInfo.children = [end];
        newInfo.parents = [stnId];

        _classPrivateFieldGet(this, _stations)[end]._parents.unshift(newId);

        param.stn_list[end].parents.unshift(newId);

        _classPrivateFieldGet(this, _stations)[stnId]._children.unshift(newId);

        param.stn_list[stnId].children.unshift(newId);
      } else if (loc == 'newlower') {
        newInfo.branch = {
          left: [],
          right: []
        };
        _classPrivateFieldGet(this, _stations)[stnId]._branch.right[1] = newId;
        param.stn_list[stnId].branch.right[1] = newId;
        newInfo.children = [end];
        newInfo.parents = [stnId];

        _classPrivateFieldGet(this, _stations)[end]._parents.push(newId);

        param.stn_list[end].parents.push(newId);

        _classPrivateFieldGet(this, _stations)[stnId]._children.push(newId);

        param.stn_list[stnId].children.push(newId);
      }
    }

    newInfo.name = [`車站${newId.toUpperCase()}`, `Station ${newId.toUpperCase()}`];
    newInfo.change_type = 'none';
    param.stn_list[newId] = newInfo;
    putParams(param);
    _classPrivateFieldGet(this, _stations)[newId] = this._initStnInstance(newId, newInfo);
    _classPrivateFieldGet(this, _stations)[stnId] = this._initStnInstance(stnId, getParams().stn_list[stnId]);

    for (let [stnId, stnInstance] of Object.entries(_classPrivateFieldGet(this, _stations))) {
      if (['linestart', 'lineend'].includes(stnId)) {
        continue;
      }

      stnInstance.x = this._stnRealX(stnId);
      stnInstance.y = this._stnRealY(stnId);
      stnInstance._state = this._stnState(stnId);
      stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);
    }

    Line.clearSVG(this);
    this.drawStns();
    this.updateStnNameBg();
    this.drawLine();
    this.drawStrip();
    this.drawDestInfo();
    this.loadFonts();
    return [newId, newInfo];
    console.log(newInfo);
    console.log(param);
  }

  static clearSVG() {
    $('#stn_icons, #line_main, #line_pass').empty();
  }

  static initSVG(line) {
    line.drawSVGFrame();
    line.showFrameOuter();
    line.drawStns();
    line.updateStnNameBg();
    line.fillThemeColour();
    line.drawLine();
    line.drawStrip();
    line.drawDestInfo();
    line.loadFonts();
  }

  get branches() {
    var stack = ['linestart'];
    var branches = [[]];
    var branchCount = 0;

    while (stack.length) {
      var curId = stack.shift();
      var prevId = branches[branchCount][0] || null;
      var curBranch = [curId];

      if (prevId) {
        curBranch.unshift(prevId);
      }

      while (true) {
        if (curId == 'lineend') {
          break;
        }

        if (curId != 'linestart' && prevId == _classPrivateFieldGet(this, _stations)[curId]._branch.left[1]) {
          // branch ends  
          break;
        } else {
          prevId = curId;

          var children = _classPrivateFieldGet(this, _stations)[prevId]._children;

          switch (children.length) {
            case 1:
              curId = children[0];
              break;

            case 2:
              branches.push([prevId]);

              if (prevId == 'linestart') {
                var branchNextId = children[1];
              } else {
                var branchNextId = _classPrivateFieldGet(this, _stations)[prevId]._branch.right[1];
              } // var branchNextId = getParams().stn_list[prevId].branch.right[1];


              stack.push(branchNextId);
              curId = children.filter(stnId => stnId != branchNextId)[0];
              break;
          }

          curBranch.push(curId);
        }
      }

      branches[branchCount] = curBranch;
      branchCount++;
    }

    return branches.map(branch => {
      return branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
    });
  }

}

var _svgHeight = new WeakMap();

var _svgWidth = new WeakMap();

var _svgDestWidth = new WeakMap();

var _showOuter = new WeakMap();

var _yPc = new WeakMap();

var _padding = new WeakMap();

var _stripPc = new WeakMap();

var _longInterval = new WeakMap();

var _branchSpacing = new WeakMap();

var _txtFlip = new WeakMap();

var _stations = new WeakMap();

var _currentStnId = new WeakMap();

var _direction = new WeakMap();

var _platformNum = new WeakMap();

var _weightEN = new WeakMap();

var _weightZH = new WeakMap();

var _fontEN = new WeakMap();

var _fontZH = new WeakMap();

var _lineNames = new WeakMap();

var _destLegacy = new WeakMap();

class LineGZ extends Line {
  constructor(param) {
    super(param);
  }

  _initStnInstance(stnId, stnInfo) {
    switch (stnInfo.change_type) {
      case 'int2':
        return new Int2StationGZ(stnId, stnInfo);

      default:
        return new StationGZ(stnId, stnInfo);
    }
  }

  loadFonts() {
    $('.rmg-name__zh, .rmg-name__en').addClass('rmg-name__gzmtr');
  }

  updateStnNameBg() {
    $('#current_bg').hide();
  }

}