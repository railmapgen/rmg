'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var Line =
/*#__PURE__*/
function () {
  function Line(param) {
    _classCallCheck(this, Line);

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

    var _param$theme = _slicedToArray(param.theme, 3);

    this.themeCity = _param$theme[0];
    this.themeLine = _param$theme[1];
    this._themeColour = _param$theme[2];

    _classPrivateFieldSet(this, _yPc, param['y_pc']);

    _classPrivateFieldSet(this, _padding, param['padding']);

    _classPrivateFieldSet(this, _stripPc, param['strip_pc']);

    _classPrivateFieldSet(this, _branchSpacing, param.branch_spacing);

    _classPrivateFieldSet(this, _txtFlip, param['txt_flip']);

    for (var _i2 = 0, _Object$entries = Object.entries(param['stn_list']); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
          stnId = _Object$entries$_i[0],
          stnInfo = _Object$entries$_i[1];

      _classPrivateFieldGet(this, _stations)[stnId] = this._initStnInstance(stnId, stnInfo);
    }

    _classPrivateFieldSet(this, _currentStnId, param['current_stn_idx']);

    _classPrivateFieldSet(this, _direction, param['direction']);

    _classPrivateFieldSet(this, _platformNum, param['platform_num']);

    _classPrivateFieldSet(this, _lineNames, param['line_name']);

    _classPrivateFieldSet(this, _destLegacy, param['dest_legacy']); // this.#weightEN = param['weightEN'];
    // this.#weightZH = param['weightZH'];
    // this.#fontEN = param['fontEN'];
    // this.#fontZH = param['fontZH'];


    this._charForm = param.char_form; // Calculate other properties of stations

    for (var _i3 = 0, _Object$entries2 = Object.entries(_classPrivateFieldGet(this, _stations)); _i3 < _Object$entries2.length; _i3++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
          _stnId = _Object$entries2$_i[0],
          stnInstance = _Object$entries2$_i[1];

      if (['linestart', 'lineend'].includes(_stnId)) {
        continue;
      }

      stnInstance.x = this._stnRealX(_stnId);
      stnInstance.y = this._stnRealY(_stnId);
      stnInstance._state = this._stnState(_stnId);
      stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(_stnId)) : this._stnNamePos(_stnId);
    }
  }

  _createClass(Line, [{
    key: "_initStnInstance",
    value: function _initStnInstance(stnId, stnInfo) {
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

        default:
          return new Station(stnId, stnInfo);
      }
    }
  }, {
    key: "_rightWideFactor",
    value: function _rightWideFactor(stnId) {
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
  }, {
    key: "_leftWideFactor",
    value: function _leftWideFactor(stnId) {
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
  }, {
    key: "_pathWeight",
    value: function _pathWeight(stnId1, stnId2) {
      // Path weight from stnId1 to stnId2
      // if (stnId1 == stnId2) {return 0;}
      if (!_classPrivateFieldGet(this, _stations)[stnId1]._children.includes(stnId2)) {
        return -Infinity;
      }

      return 1 + this._rightWideFactor(stnId1) + this._leftWideFactor(stnId2);
    }
  }, {
    key: "_cpm",
    value: function _cpm(from, to) {
      var self = this; // Critical Path Method (FuOR)

      if (from == to) {
        return 0;
      }

      ; // var allLengths = [];

      var allLengths = _classPrivateFieldGet(this, _stations)[from]._children.map(function (child) {
        return allLengths.push(1 + self._cpm(child, to));
      }); // for (let child of this.#stations[from]._children) {
      //     allLengths.push(1 + self._cpm(child, to));
      // }


      return Math.max.apply(Math, _toConsumableArray(allLengths));
    }
  }, {
    key: "_cp",
    value: function _cp(from, to) {
      var _this = this;

      var self = this;

      if (from == to) {
        return {
          'len': 0,
          'nodes': [from]
        };
      }

      var allLengths = [];
      var criticalPaths = [];

      _classPrivateFieldGet(this, _stations)[from]._children.forEach(function (child) {
        var cp = self._cp(child, to);

        if (cp.len < 0) {
          return;
        }

        allLengths.push(_this._pathWeight(from, child) + cp.len);
        cp.nodes.unshift(from);
        criticalPaths.push(cp.nodes);
      });

      var maxLength = Math.max.apply(Math, allLengths);
      return {
        'len': maxLength,
        'nodes': criticalPaths[allLengths.indexOf(maxLength)]
      };
    }
  }, {
    key: "_topoOrder",
    value: function _topoOrder(from) {
      var _this2 = this;

      var tpo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var self = this;
      tpo.push(from);

      _classPrivateFieldGet(this, _stations)[from]._children.forEach(function (child) {
        if (_this2._stnIndegree(child) == 2 && _classPrivateFieldGet(_this2, _stations)[child]._parents.indexOf(from) == 0) {
          // wait the other branch
          return;
        }

        tpo.concat(self._topoOrder(child, tpo));
      });

      return tpo;
    }
  }, {
    key: "_stnIndegree",
    value: function _stnIndegree(stnId) {
      return _classPrivateFieldGet(this, _stations)[stnId].inDegree;
    }
  }, {
    key: "_stnOutdegree",
    value: function _stnOutdegree(stnId) {
      return _classPrivateFieldGet(this, _stations)[stnId].outDegree;
    }
  }, {
    key: "_stnXShare",
    value: function _stnXShare(stnId) {
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
  }, {
    key: "_stnRealX",
    value: function _stnRealX(stnId) {
      var _this$lineXs = _slicedToArray(this.lineXs, 2),
          lineStart = _this$lineXs[0],
          lineEnd = _this$lineXs[1];

      return lineStart + this._stnXShare(stnId) / this.criticalPath.len * (lineEnd - lineStart);
    }
  }, {
    key: "_stnYShare",
    value: function _stnYShare(stnId) {
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
        return 0; // never accessed
        // no parent

        if (this.leftDests.length == 1) {
          // no siblings
          return 0;
        } else {
          // return (this.leftDests.indexOf(stnId) == 0) ? 1 : -1;
          var tmpStn = stnId;

          while (true) {
            var tmpSuc = _classPrivateFieldGet(this, _stations)[tmpStn]._children[0];

            if (this._stnIndegree(tmpSuc) == 2) {
              return _classPrivateFieldGet(this, _stations)[tmpSuc]._parents.indexOf(tmpStn) == 0 ? 1 : -1;
            }

            tmpStn = _classPrivateFieldGet(this, _stations)[tmpStn]._children[0];
          }
        }
      }

      return 0;
    }
  }, {
    key: "_stnRealY",
    value: function _stnRealY(stnId) {
      return this.y - this._stnYShare(stnId) * _classPrivateFieldGet(this, _branchSpacing);
    }
  }, {
    key: "_isSuccessor",
    value: function _isSuccessor(stnId1, stnId2) {
      // Is stnId2 a successor of stnId1?
      var self = this;

      var descOfStn1 = _classPrivateFieldGet(this, _stations)[stnId1]._children;

      if (!descOfStn1.length) {
        return false;
      } else if (descOfStn1.includes(stnId2)) {
        return true;
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = descOfStn1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var desc = _step.value;

            if (self._isSuccessor(desc, stnId2)) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return false;
    }
  }, {
    key: "_isPredecessor",
    value: function _isPredecessor(stnId1, stnId2) {
      // Is stnId2 a predecessor of stnId1?
      var self = this;

      var ansOfStn1 = _classPrivateFieldGet(this, _stations)[stnId1]._parents;

      if (!ansOfStn1.length) {
        return false;
      } else if (ansOfStn1.includes(stnId2)) {
        return true;
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = ansOfStn1[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var ans = _step2.value;

            if (self._isPredecessor(ans, stnId2)) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return false;
    }
  }, {
    key: "_stnState",
    value: function _stnState(stnId) {
      if (stnId == _classPrivateFieldGet(this, _currentStnId)) {
        return 0;
      }

      if (_classPrivateFieldGet(this, _direction) == 'r') {
        return this._isSuccessor(_classPrivateFieldGet(this, _currentStnId), stnId) ? 1 : -1;
      } else {
        return this._isPredecessor(_classPrivateFieldGet(this, _currentStnId), stnId) ? 1 : -1;
      }
    }
  }, {
    key: "_stnNamePos",
    value: function _stnNamePos(stnId) {
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
  }, {
    key: "drawSVGFrame",
    value: function drawSVGFrame() {
      $('#railmap, #outer').attr({
        'width': _classPrivateFieldGet(this, _svgWidth),
        'height': _classPrivateFieldGet(this, _svgHeight)
      });
      $('#destination, #dest_outer').attr({
        'width': _classPrivateFieldGet(this, _svgDestWidth),
        'height': _classPrivateFieldGet(this, _svgHeight)
      });
    }
  }, {
    key: "showFrameOuter",
    value: function showFrameOuter() {
      var outerColour = _classPrivateFieldGet(this, _showOuter) ? 'black' : 'none';
      $('#outer, #dest_outer').attr('stroke', outerColour);
    }
  }, {
    key: "drawStns",
    value: function drawStns() {
      for (var _i4 = 0, _Object$entries3 = Object.entries(_classPrivateFieldGet(this, _stations)); _i4 < _Object$entries3.length; _i4++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i4], 2),
            stnId = _Object$entries3$_i[0],
            stnInstance = _Object$entries3$_i[1];

        if (['linestart', 'lineend'].includes(stnId)) {
          continue;
        }

        $('#stn_icons').append(stnInstance.html);
      }

      $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
    }
  }, {
    key: "updateStnNameBg",
    value: function updateStnNameBg() {
      var stnNameDim = getTxtBoxDim($("#stn_icons > #".concat(_classPrivateFieldGet(this, _currentStnId), " > .Name"))[0], 'railmap');
      $('#current_bg').attr({
        'x': stnNameDim.x - 2,
        'y': stnNameDim.y - 2,
        'width': stnNameDim.width + 4,
        'height': stnNameDim.height + 4
      }).show();
    }
  }, {
    key: "_linePath",
    value: function _linePath(stnIds) {
      var _this3 = this;

      var _ref = [],
          prevId = _ref[0],
          prevY = _ref[1],
          prevX = _ref[2];
      var path = [];
      var stnExtraH = this.stnExtraH,
          stnSpareH = this.stnSpareH,
          pathTurnESE = this.pathTurnESE,
          pathTurnSEE = this.pathTurnSEE,
          pathTurnENE = this.pathTurnENE,
          pathTurnNEE = this.pathTurnNEE,
          stnDX = this.stnDX;
      stnIds.forEach(function (stnId) {
        var _map = ['_stnRealX', '_stnRealY'].map(function (fun) {
          return _this3[fun](stnId);
        }),
            _map2 = _slicedToArray(_map, 2),
            x = _map2[0],
            y = _map2[1];

        if (!prevY) {
          prevId = stnId;
          prevX = x;
          prevY = y;
          path.push("M ".concat(x, ",").concat(y));
          return;
        }

        if (y > prevY) {
          path.push(y == _this3.y ? "h ".concat(x - prevX - stnExtraH * _this3._leftWideFactor(stnId) - stnSpareH - stnDX * 2) : "h ".concat(stnExtraH * _this3._rightWideFactor(prevId) + stnSpareH));
          path.push(pathTurnESE, pathTurnSEE);
        } else if (y < prevY) {
          path.push(y == _this3.y ? "h ".concat(x - prevX - stnExtraH * _this3._leftWideFactor(stnId) - stnSpareH - stnDX * 2) : "h ".concat(stnExtraH * _this3._rightWideFactor(prevId) + stnSpareH));
          path.push(pathTurnENE, pathTurnNEE);
        }

        path.push("H ".concat(x));
        prevId = stnId;
        prevX = x;
        prevY = y;
      }); // simplify path

      return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }
  }, {
    key: "drawLine",
    value: function drawLine() {
      var _this4 = this;

      this.branches.map(function (branch) {
        var lineMainStns = branch.filter(function (stnId) {
          return _classPrivateFieldGet(_this4, _stations)[stnId]._state >= 0;
        });
        var linePassStns = branch.filter(function (stnId) {
          return _classPrivateFieldGet(_this4, _stations)[stnId]._state <= 0;
        });

        if (lineMainStns.filter(function (stnId) {
          return linePassStns.indexOf(stnId) !== -1;
        }).length == 0 && lineMainStns.length) {
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
          'd': _this4._linePath(lineMainStns)
        }));
        $('#line_pass').append($('<path>', {
          'd': _this4._linePath(linePassStns)
        }));
      });
      $('#line_main').html($('#line_main').html());
      $('#line_pass').html($('#line_pass').html());
    }
  }, {
    key: "drawStrip",
    value: function drawStrip() {
      for (var _i5 = 0, _arr2 = ['strip', 'dest_strip']; _i5 < _arr2.length; _i5++) {
        var elem = _arr2[_i5];
        $("#".concat(elem)).attr('d', "M 0,".concat(this.stripY, " H ").concat(_classPrivateFieldGet(this, _svgWidth)));
      }
    }
  }, {
    key: "fillThemeColour",
    value: function fillThemeColour() {
      // for (let elem of ['line_main', 'strip', 'dest_strip']) {
      //     $(`#${elem}`).attr('stroke', this._themeColour);
      // }
      $('#line_main, #strip, #dest_strip, #stn_gz').attr('stroke', this._themeColour);
      $('#dest_name > #platform > circle').attr('fill', this._themeColour);
    }
  }, {
    key: "drawDestInfo",
    value: function drawDestInfo() {
      var _this5 = this;

      $('#dest_name > #platform > text').text(_classPrivateFieldGet(this, _platformNum));

      if (_classPrivateFieldGet(this, _direction) == 'l') {
        var destinations = this.leftDests;
        var txtAnchor = 'start';
      } else {
        var destinations = this.rightDests;
        var txtAnchor = 'end';
      }

      var validDest = destinations.filter(function (stnId) {
        return _classPrivateFieldGet(_this5, _stations)[stnId]._state >= 0;
      }); // var validDest = []
      // for (let stnId of destinations) {
      //     if (this.#stations[stnId]._state >= 0) {validDest.push(stnId)}; 
      // }

      var _map$call = [].map.call(['_nameZH', '_nameEN'], function (key) {
        return validDest.map(function (stnId) {
          return _classPrivateFieldGet(_this5, _stations)[stnId][key].replace(/\\/g, ' ');
        }).join('/');
      }),
          _map$call2 = _slicedToArray(_map$call, 2),
          destNameZH = _map$call2[0],
          destNameEN = _map$call2[1];

      if (_classPrivateFieldGet(this, _destLegacy)) {
        var _classPrivateFieldGet2 = _classPrivateFieldGet(this, _lineNames),
            _classPrivateFieldGet3 = _slicedToArray(_classPrivateFieldGet2, 2),
            lineNameZH = _classPrivateFieldGet3[0],
            lineNameEN = _classPrivateFieldGet3[1];

        lineNameEN += ' ';
      } else {
        var lineNameZH = lineNameEN = '';
      }

      $('#dest_name > g:last-child').empty().attr('text-anchor', txtAnchor).append($('<text>').addClass('rmg-name__zh DestName').text("".concat(lineNameZH, "\u5F80").concat(destNameZH))).append($('<text>', {
        'dy': 80,
        'class': 'rmg-name__en DestName'
      }).text("".concat(lineNameEN, "to ").concat(destNameEN)));
      $('#dest_name').html($('#dest_name').html());
      var bcr = $('#dest_name > g:last-child')[0].getBoundingClientRect();
      var flagLength = 160 + 150 + bcr.width + 45 + 50;
      var isLeft = _classPrivateFieldGet(this, _direction) == 'l' ? 1 : -1;
      var arrowX = (_classPrivateFieldGet(this, _svgDestWidth) - isLeft * flagLength) / 2;
      var arrowRotate = 90 * (1 - isLeft);
      var platformNumX = arrowX + isLeft * (160 + 50 + 75);
      var destNameX = platformNumX + isLeft * (75 + 45);
      $('#dest_name > use').attr('transform', "translate(".concat(arrowX, ",130)rotate(").concat(arrowRotate, ")"));
      $('#dest_name > #platform').attr('transform', "translate(".concat(platformNumX, ",130)"));
      $('#dest_name > g:last-child').attr('transform', "translate(".concat(destNameX, ",105)"));
    }
  }, {
    key: "loadFonts",
    value: function loadFonts() {
      $('.rmg-name__gzmtr').removeClass('rmg-name__gzmtr');
      $('.rmg-name__zh').addClass("rmg-name__char-".concat(this._charForm));
    }
  }, {
    key: "updateStnName",
    value: function updateStnName(stnId, nameZH, nameEN) {
      var param = getParams();
      param.stn_list[stnId].name = [nameZH, nameEN];
      putParams(param);
      _classPrivateFieldGet(this, _stations)[stnId]._nameZH = nameZH;
      _classPrivateFieldGet(this, _stations)[stnId]._nameEN = nameEN;
      $("#stn_icons #".concat(stnId)).remove();
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
  }, {
    key: "updateStnTransfer",
    value: function updateStnTransfer(stnId, type) {
      var info = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

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
        for (var _i6 = 0, _Object$entries4 = Object.entries(_classPrivateFieldGet(this, _stations)); _i6 < _Object$entries4.length; _i6++) {
          var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i6], 2),
              _stnId2 = _Object$entries4$_i[0],
              stnInstance = _Object$entries4$_i[1];

          if (['linestart', 'lineend'].includes(_stnId2)) {
            continue;
          }

          stnInstance.x = this._stnRealX(_stnId2);
          stnInstance.y = this._stnRealY(_stnId2);
          stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(_stnId2)) : this._stnNamePos(_stnId2);
          stnInstance._state = this._stnState(_stnId2);
        }

        $('#stn_icons').empty();
        this.drawStns();
        this.updateStnNameBg();
        $('#line_main').empty();
        $('#line_pass').empty();
        this.drawLine();
        this.drawStrip();
      } else {
        _classPrivateFieldGet(this, _stations)[stnId].x = this._stnRealX(stnId);
        _classPrivateFieldGet(this, _stations)[stnId].y = this._stnRealY(stnId);
        _classPrivateFieldGet(this, _stations)[stnId].namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);
        _classPrivateFieldGet(this, _stations)[stnId]._state = this._stnState(stnId);
        $("#stn_icons #".concat(stnId)).remove();
        $('#stn_icons').append(_classPrivateFieldGet(this, _stations)[stnId].html);
        $('#stn_icons').html($('#stn_icons').html());
      }

      this.loadFonts();
    }
  }, {
    key: "removeStn",
    value: function removeStn(stnId) {
      var _this6 = this;

      var param = getParams();

      var parents = _classPrivateFieldGet(this, _stations)[stnId]._parents;

      var children = _classPrivateFieldGet(this, _stations)[stnId]._children;

      var isLastMainBranchStn = true;

      for (var id in _classPrivateFieldGet(this, _stations)) {
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
        parents.forEach(function (parId) {
          param.stn_list[parId].children = children;
          _classPrivateFieldGet(_this6, _stations)[parId]._children = children;
        });
        children.forEach(function (childId) {
          param.stn_list[childId].parents = parents;
          _classPrivateFieldGet(_this6, _stations)[childId]._parents = parents;
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
        parents.forEach(function (parId) {
          var idx = param.stn_list[parId].children.indexOf(stnId);

          if (children.length) {
            param.stn_list[parId].children[idx] = children[0];
            _classPrivateFieldGet(_this6, _stations)[parId]._children[idx] = children[0];
          } else {
            // Right dest
            param.stn_list[parId].children.splice(idx, 1);

            _classPrivateFieldGet(_this6, _stations)[parId]._children.splice(idx, 1);
          }
        });
        children.forEach(function (childId) {
          var idx = param.stn_list[childId].parents.indexOf(stnId);

          if (parents.length) {
            param.stn_list[childId].parents[idx] = parents[0];
            _classPrivateFieldGet(_this6, _stations)[childId]._parents[idx] = parents[0];
          } else {
            // Left dest
            param.stn_list[childId].parents.splice(idx, 1);

            _classPrivateFieldGet(_this6, _stations)[childId]._parents.splice(idx, 1);
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

      for (var _i7 = 0, _Object$entries5 = Object.entries(_classPrivateFieldGet(this, _stations)); _i7 < _Object$entries5.length; _i7++) {
        var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i7], 2),
            _stnId3 = _Object$entries5$_i[0],
            stnInstance = _Object$entries5$_i[1];

        if (['linestart', 'lineend'].includes(_stnId3)) {
          continue;
        }

        stnInstance.x = this._stnRealX(_stnId3);
        stnInstance.y = this._stnRealY(_stnId3);
        stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(_stnId3)) : this._stnNamePos(_stnId3);

        if (isCurrentStnChanged) {
          stnInstance._state = this._stnState(_stnId3);
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
  }, {
    key: "newStnPossibleLoc",
    value: function newStnPossibleLoc(prep, stnId) {
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

        // case 0:
        //     if (this.#stations[stnId]._y == this.y) {
        //         return [1,0,0,0,0];
        //     } else if (this.#stations[stnId]._y > this.y) {
        //         return [1,0,1,0,0];
        //     } else {
        //         return [1,1,0,0,0];
        //     }
      }

      return [0, 0, 0, 0, 0];
    }
  }, {
    key: "newBranchPossibleEnd",
    value: function newBranchPossibleEnd(prep, stnId) {
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
  }, {
    key: "addStn",
    value: function addStn(prep, stnId, loc, end) {
      var _this7 = this;

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

          newInfo.parents.forEach(function (par) {
            _classPrivateFieldGet(_this7, _stations)[par]._children = [newId];
            param.stn_list[par].children = [newId];
          });
          newInfo.children.forEach(function (child) {
            _classPrivateFieldGet(_this7, _stations)[child]._parents = [newId];
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
            newInfo.parents.forEach(function (par) {
              _classPrivateFieldGet(_this7, _stations)[par]._children = [newId];
              param.stn_list[par].children = [newId];
            });
            _classPrivateFieldGet(this, _stations)[stnId]._parents[0] = newId;
            param.stn_list[stnId].parents[0] = newId;
          } else {
            // already on branch
            newInfo.parents = _classPrivateFieldGet(this, _stations)[stnId]._parents;
            newInfo.children = [stnId];
            newInfo.parents.forEach(function (par) {
              _classPrivateFieldGet(_this7, _stations)[par]._children[0] = newId;
              param.stn_list[par].children[0] = newId;
            });
            newInfo.children.forEach(function (child) {
              _classPrivateFieldGet(_this7, _stations)[child]._parents = [newId];
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
            newInfo.parents.forEach(function (par) {
              _classPrivateFieldGet(_this7, _stations)[par]._children = [newId];
              param.stn_list[par].children = [newId];
            });
            _classPrivateFieldGet(this, _stations)[stnId]._parents[1] = newId;
            param.stn_list[stnId].parents[1] = newId;
          } else {
            // already on branch
            newInfo.parents = _classPrivateFieldGet(this, _stations)[stnId]._parents;
            newInfo.children = [stnId];
            newInfo.parents.forEach(function (par) {
              _classPrivateFieldGet(_this7, _stations)[par]._children[1] = newId;
              param.stn_list[par].children[1] = newId;
            });
            newInfo.children.forEach(function (child) {
              _classPrivateFieldGet(_this7, _stations)[child]._parents = [newId];
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

          newInfo.children.forEach(function (child) {
            _classPrivateFieldGet(_this7, _stations)[child]._parents = [newId];
            param.stn_list[child].parents = [newId];
          });
          newInfo.parents.forEach(function (par) {
            _classPrivateFieldGet(_this7, _stations)[par]._children = [newId];
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
            newInfo.children.forEach(function (child) {
              _classPrivateFieldGet(_this7, _stations)[child]._parents = [newId];
              param.stn_list[child].parents = [newId];
            });
            _classPrivateFieldGet(this, _stations)[stnId]._children[0] = newId;
            param.stn_list[stnId].children[0] = newId;
          } else {
            // already on branch
            newInfo.children = _classPrivateFieldGet(this, _stations)[stnId]._children;
            newInfo.parents = [stnId];
            newInfo.children.forEach(function (child) {
              _classPrivateFieldGet(_this7, _stations)[child]._parents[0] = newId;
              param.stn_list[child].parents[0] = newId;
            });
            newInfo.parents.forEach(function (par) {
              _classPrivateFieldGet(_this7, _stations)[par]._children = [newId];
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
            newInfo.children.forEach(function (child) {
              _classPrivateFieldGet(_this7, _stations)[child]._parents = [newId];
              param.stn_list[child].parents = [newId];
            });
            _classPrivateFieldGet(this, _stations)[stnId]._children[1] = newId;
            param.stn_list[stnId].children[1] = newId;
          } else {
            // already on branch
            newInfo.children = _classPrivateFieldGet(this, _stations)[stnId]._children;
            newInfo.parents = [stnId];
            newInfo.children.forEach(function (child) {
              _classPrivateFieldGet(_this7, _stations)[child]._parents[1] = newId;
              param.stn_list[child].parents[1] = newId;
            });
            newInfo.parents.forEach(function (par) {
              _classPrivateFieldGet(_this7, _stations)[par]._children = [newId];
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

      newInfo.name = ["\u8ECA\u7AD9".concat(newId.toUpperCase()), "Station ".concat(newId.toUpperCase())];
      newInfo.change_type = 'none';
      param.stn_list[newId] = newInfo;
      putParams(param);
      _classPrivateFieldGet(this, _stations)[newId] = this._initStnInstance(newId, newInfo);

      for (var _i8 = 0, _Object$entries6 = Object.entries(_classPrivateFieldGet(this, _stations)); _i8 < _Object$entries6.length; _i8++) {
        var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i8], 2),
            _stnId4 = _Object$entries6$_i[0],
            stnInstance = _Object$entries6$_i[1];

        if (['linestart', 'lineend'].includes(_stnId4)) {
          continue;
        }

        stnInstance.x = this._stnRealX(_stnId4);
        stnInstance.y = this._stnRealY(_stnId4);
        stnInstance._state = this._stnState(_stnId4);
        stnInstance.namePos = _classPrivateFieldGet(this, _txtFlip) ? Number(!this._stnNamePos(_stnId4)) : this._stnNamePos(_stnId4);
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
  }, {
    key: "svgWidth",
    set: function set(val) {
      val = Number(val);

      if (isNaN(val)) {
        return;
      }

      if (val <= 0) {
        return;
      }

      _classPrivateFieldSet(this, _svgWidth, val);

      _classPrivateFieldSet(this, _svgDestWidth, val);

      var param = getParams();
      param.svg_width = val;
      param.svg_dest_width = val;
      putParams(param);
      this.drawSVGFrame();

      for (var _i9 = 0, _Object$entries7 = Object.entries(_classPrivateFieldGet(this, _stations)); _i9 < _Object$entries7.length; _i9++) {
        var _Object$entries7$_i = _slicedToArray(_Object$entries7[_i9], 2),
            stnId = _Object$entries7$_i[0],
            stnInstance = _Object$entries7$_i[1];

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
      this.drawStrip();
      this.drawDestInfo();
      this.loadFonts();
    }
  }, {
    key: "yPc",
    set: function set(val) {
      val = Number(val);

      _classPrivateFieldSet(this, _yPc, val);

      setParams('y_pc', val);

      for (var _i10 = 0, _Object$entries8 = Object.entries(_classPrivateFieldGet(this, _stations)); _i10 < _Object$entries8.length; _i10++) {
        var _Object$entries8$_i = _slicedToArray(_Object$entries8[_i10], 2),
            stnId = _Object$entries8$_i[0],
            stnInstance = _Object$entries8$_i[1];

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
  }, {
    key: "padding",
    set: function set(val) {
      val = Number(val);

      _classPrivateFieldSet(this, _padding, val);

      setParams('padding', val);

      for (var _i11 = 0, _Object$entries9 = Object.entries(_classPrivateFieldGet(this, _stations)); _i11 < _Object$entries9.length; _i11++) {
        var _Object$entries9$_i = _slicedToArray(_Object$entries9[_i11], 2),
            stnId = _Object$entries9$_i[0],
            stnInstance = _Object$entries9$_i[1];

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
  }, {
    key: "branchSpacing",
    set: function set(val) {
      val = Number(val);

      _classPrivateFieldSet(this, _branchSpacing, val);

      setParams('branch_spacing', val);

      for (var _i12 = 0, _Object$entries10 = Object.entries(_classPrivateFieldGet(this, _stations)); _i12 < _Object$entries10.length; _i12++) {
        var _Object$entries10$_i = _slicedToArray(_Object$entries10[_i12], 2),
            stnId = _Object$entries10$_i[0],
            stnInstance = _Object$entries10$_i[1];

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
  }, {
    key: "txtFlip",
    set: function set(val) {
      _classPrivateFieldSet(this, _txtFlip, val);

      setParams('txt_flip', val);

      for (var _i13 = 0, _Object$entries11 = Object.entries(_classPrivateFieldGet(this, _stations)); _i13 < _Object$entries11.length; _i13++) {
        var _Object$entries11$_i = _slicedToArray(_Object$entries11[_i13], 2),
            stnId = _Object$entries11$_i[0],
            stnInstance = _Object$entries11$_i[1];

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
  }, {
    key: "themeColour",
    set: function set(rgb) {
      this._themeColour = rgb;
      var param = getParams();
      param.theme[2] = rgb;
      putParams(param);
      this.fillThemeColour();
    }
  }, {
    key: "direction",
    set: function set(val) {
      _classPrivateFieldSet(this, _direction, val);

      setParams('direction', val);

      for (var _i14 = 0, _Object$entries12 = Object.entries(_classPrivateFieldGet(this, _stations)); _i14 < _Object$entries12.length; _i14++) {
        var _Object$entries12$_i = _slicedToArray(_Object$entries12[_i14], 2),
            stnId = _Object$entries12$_i[0],
            stnInstance = _Object$entries12$_i[1];

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
  }, {
    key: "platformNum",
    set: function set(val) {
      _classPrivateFieldSet(this, _platformNum, val);

      setParams('platform_num', val);
      $('.rmg-platform-num').text(val);
    }
  }, {
    key: "charForm",
    set: function set(val) {
      this._charForm = val;
      setParams('char_form', val);
      var prevCharForm = $('.rmg-name__zh').eq(0).attr('class').match(/rmg-name__char-\w{2,4}/g)[0];
      $('.rmg-name__zh').removeClass(prevCharForm);
      $('.rmg-name__zh').addClass("rmg-name__char-".concat(val));
    }
  }, {
    key: "lineNames",
    set: function set(val) {
      _classPrivateFieldSet(this, _lineNames, val);

      setParams('line_name', val);
      this.drawDestInfo();
      this.loadFonts();
    }
  }, {
    key: "destLegacy",
    set: function set(val) {
      _classPrivateFieldSet(this, _destLegacy, val);

      setParams('dest_legacy', val);
      this.drawDestInfo();
      this.loadFonts();
    }
  }, {
    key: "currentStnId",
    set: function set(val) {
      _classPrivateFieldSet(this, _currentStnId, val);

      setParams('current_stn_idx', val);

      for (var _i15 = 0, _Object$entries13 = Object.entries(_classPrivateFieldGet(this, _stations)); _i15 < _Object$entries13.length; _i15++) {
        var _Object$entries13$_i = _slicedToArray(_Object$entries13[_i15], 2),
            stnId = _Object$entries13$_i[0],
            stnInstance = _Object$entries13$_i[1];

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
  }, {
    key: "criticalPath",
    get: function get() {
      var _this8 = this;

      var allLengths = [];
      var criticalPaths = [];
      this.leftDests.forEach(function (ld) {
        _this8.rightDests.forEach(function (rd) {
          var cp = _this8._cp(ld, rd);

          allLengths.push(cp.len);
          criticalPaths.push(cp.nodes);
        });
      });
      var maxLen = Math.max.apply(Math, allLengths);
      return {
        'len': maxLen,
        'nodes': criticalPaths[allLengths.indexOf(maxLen)]
      };
    }
  }, {
    key: "tpo",
    get: function get() {
      var res = this._topoOrder('linestart');

      return res.slice(1, res.length - 1); // res.pop();
      // res.shift();
      // return res;
    }
  }, {
    key: "y",
    get: function get() {
      return _classPrivateFieldGet(this, _yPc) * _classPrivateFieldGet(this, _svgHeight) / 100;
    }
  }, {
    key: "stripY",
    get: function get() {
      return _classPrivateFieldGet(this, _stripPc) * _classPrivateFieldGet(this, _svgHeight) / 100;
    }
  }, {
    key: "turningRadius",
    get: function get() {
      return _classPrivateFieldGet(this, _branchSpacing) / 2 * (Math.sqrt(2) / (Math.sqrt(2) - 1));
    }
  }, {
    key: "lineXs",
    get: function get() {
      return [_classPrivateFieldGet(this, _svgWidth) * _classPrivateFieldGet(this, _padding) / 100, _classPrivateFieldGet(this, _svgWidth) * (1 - _classPrivateFieldGet(this, _padding) / 100)];
    }
  }, {
    key: "leftDests",
    get: function get() {
      return _classPrivateFieldGet(this, _stations).linestart._children;
    }
  }, {
    key: "rightDests",
    get: function get() {
      return _classPrivateFieldGet(this, _stations).lineend._parents;
    }
  }, {
    key: "stnRealXs",
    get: function get() {
      var xs = {};

      for (var stnId in _classPrivateFieldGet(this, _stations)) {
        xs[stnId] = this._stnRealX(stnId);
      }

      return xs;
    }
  }, {
    key: "stnDX",
    get: function get() {
      return this.turningRadius - _classPrivateFieldGet(this, _branchSpacing) / 2;
    }
  }, {
    key: "stnDY",
    get: function get() {
      return _classPrivateFieldGet(this, _branchSpacing) / 2;
    }
  }, {
    key: "stnExtraH",
    get: function get() {
      var _this$lineXs2 = _slicedToArray(this.lineXs, 2),
          lineStart = _this$lineXs2[0],
          lineEnd = _this$lineXs2[1];

      return (lineEnd - lineStart) / this.criticalPath.len * _classPrivateFieldGet(this, _longInterval);
    }
  }, {
    key: "stnSpareH",
    get: function get() {
      var _this$lineXs3 = _slicedToArray(this.lineXs, 2),
          lineStart = _this$lineXs3[0],
          lineEnd = _this$lineXs3[1];

      var dh = ((lineEnd - lineStart) / this.criticalPath.len - 2 * this.stnDX) / 2;

      if (dh < 0) {
        console.warn("SVG width too small! ".concat(dh));
      }

      return dh;
    }
  }, {
    key: "pathTurnENE",
    get: function get() {
      return "a ".concat(this.turningRadius, ",").concat(this.turningRadius, " 0 0,0 ").concat(this.stnDX, ",").concat(-this.stnDY);
    }
  }, {
    key: "pathTurnNEE",
    get: function get() {
      return "a ".concat(this.turningRadius, ",").concat(this.turningRadius, " 0 0,1 ").concat(this.stnDX, ",").concat(-this.stnDY);
    }
  }, {
    key: "pathTurnESE",
    get: function get() {
      return "a ".concat(this.turningRadius, ",").concat(this.turningRadius, " 0 0,1 ").concat(this.stnDX, ",").concat(this.stnDY);
    }
  }, {
    key: "pathTurnSEE",
    get: function get() {
      return "a ".concat(this.turningRadius, ",").concat(this.turningRadius, " 0 0,0 ").concat(this.stnDX, ",").concat(this.stnDY);
    }
  }, {
    key: "branches",
    get: function get() {
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

          if (curId != 'linestart' && prevId == getParams().stn_list[curId].branch.left[1]) {
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
                  var branchNextId = getParams().stn_list[prevId].branch.right[1];
                } // var branchNextId = getParams().stn_list[prevId].branch.right[1];


                stack.push(branchNextId);
                curId = children.filter(function (stnId) {
                  return stnId != branchNextId;
                })[0];
                break;
            }

            curBranch.push(curId);
          }
        }

        branches[branchCount] = curBranch;
        branchCount++;
      }

      return branches.map(function (branch) {
        return branch.filter(function (stnId) {
          return !['linestart', 'lineend'].includes(stnId);
        });
      });
    }
  }], [{
    key: "clearSVG",
    value: function clearSVG() {
      $('#stn_icons, #line_main, #line_pass').empty();
    }
  }, {
    key: "initSVG",
    value: function initSVG(line) {
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
  }]);

  return Line;
}();

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

var LineGZ =
/*#__PURE__*/
function (_Line) {
  _inherits(LineGZ, _Line);

  function LineGZ(param) {
    _classCallCheck(this, LineGZ);

    return _possibleConstructorReturn(this, _getPrototypeOf(LineGZ).call(this, param));
  }

  _createClass(LineGZ, [{
    key: "_initStnInstance",
    value: function _initStnInstance(stnId, stnInfo) {
      switch (stnInfo.change_type) {
        case 'int2':
          return new Int2StationGZ(stnId, stnInfo);

        default:
          return new StationGZ(stnId, stnInfo);
      }
    }
  }, {
    key: "loadFonts",
    value: function loadFonts() {
      $('.rmg-name__zh').removeClass("rmg-name__char-".concat(this._charForm));
      $('.rmg-name__zh, .rmg-name__en').addClass('rmg-name__gzmtr');
    }
  }, {
    key: "updateStnNameBg",
    value: function updateStnNameBg() {
      $('#current_bg').hide();
    }
  }]);

  return LineGZ;
}(Line);