'use strict';

class Line {
    #svgHeight; #svgWidth; #svgDestWidth; #showOuter;
    themeCity; themeLine; #themeColour;
    #yPc; #padding; #stripPc; #longInterval = 0.2;
    #branchSpacing = 21; #txtFlip;
    #stations = {}; #currentStnId; #direction; #platformNum;
    #weightEN; #weightZH; #fontEN; #fontZH;

    constructor (param) {
        this.#svgHeight = param['svg_height'];
        this.#svgWidth = param['svg_width'];
        this.#svgDestWidth = param['svg_dest_width'];
        this.#showOuter = param['show_outer'];

        [this.themeCity, this.themeLine, this.#themeColour] = param['theme'];
        // this.#themeColour = colours[this.themeCity].line[this.themeLine].colour;

        this.#yPc = param['y_pc'];
        this.#padding = param['padding'];
        this.#stripPc = param['strip_pc'];
        this.#txtFlip = param['txt_flip'];

        for (let [stnId, stnInfo] of Object.entries(param['stn_list'])) {
            switch (stnInfo['change_type']) {
                case 'int2':
                    this.#stations[stnId] = new Int2Station(stnId, stnInfo);
                    break;
                case 'int3l':
                    this.#stations[stnId] = new Int3LStation(stnId, stnInfo);
                    break;
                case 'int3r':
                    this.#stations[stnId] = new Int3RStation(stnId, stnInfo);
                    break;
                case 'osi11ul':
                case 'osi11pl':
                    this.#stations[stnId] = new OSI11LStation(stnId, stnInfo);
                    break;
                case 'osi11ur':
                case 'osi11pr':
                    this.#stations[stnId] = new OSI11RStation(stnId, stnInfo);
                    break;
                case 'osi12ul':
                case 'osi12pl':
                    this.#stations[stnId] = new OSI12LStation(stnId, stnInfo);
                    break;
                case 'osi12ur':
                case 'osi12pr':
                    this.#stations[stnId] = new OSI12RStation(stnId, stnInfo);
                    break;
                default:
                    this.#stations[stnId] = new Station(stnId, stnInfo);
            }
        }
        this.#currentStnId = param['current_stn_idx'];
        this.#direction = param['direction'];
        this.#platformNum = param['platform_num'];

        this.#weightEN = param['weightEN'];
        this.#weightZH = param['weightZH'];
        this.#fontEN = param['fontEN'];
        this.#fontZH = param['fontZH'];

        // Calculate other properties of stations
        for (let [stnId, stnInstance] of Object.entries(this.#stations)) {
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
            stnInstance._state = this._stnState(stnId);
            stnInstance.namePos = (this.#txtFlip) ? Number(!this._stnNamePos(stnId)) : this._stnNamePos(stnId);
        }
    }

    set themeColour(rgb) {
        this.#themeColour = rgb;

        var param = getParams();
        param.theme[2] = rgb;
        putParams(param);

        this.fillThemeColour();
    }

    set direction(val) {
        this.#direction = val;

        var param = getParams();
        param.direction = val;
        putParams(param);

        for (let [stnId, stnInstance] of Object.entries(this.#stations)) {
            stnInstance._state = this._stnState(stnId);
        }

        $('#stn_icons').empty();
        this.drawStns();

        $('#line_main').empty();
        $('#line_pass').empty();
        this.drawLine();

        $('#dest_name g:last-child').remove()
        this.drawDestInfo();

        this.loadFonts();
    }

    set platformNum(val) {
        this.#platformNum = val;

        var param = getParams();
        param.platform_num = val;
        putParams(param);

        $('#dest_name > #platform > text').text(val);
    }

    _pathWeight(stnId1, stnId2) {
        // Path weight from stnId1 to stnId2

        // if (stnId1 == stnId2) {return 0;}
        if (!this.#stations[stnId1]._children.includes(stnId2)) {return -Infinity;}

        var w = 1;
        if ([
            'Int3RStation', 
            'OSI11RStation', 
            'OSI12RStation'
        ].includes(this.#stations[stnId1].constructor.name)) {
            w += this.#longInterval;
        }
        if ([
            'Int3LStation', 
            'OSI11LStation', 
            'OSI12LStation'
        ].includes(this.#stations[stnId2].constructor.name)) {
            w += this.#longInterval;
        }
        return w;
    }

    _cpm(from, to) {
        var self = this;
        // Critical Path Method (FuOR)
        if (from==to) {return 0};
        var allLengths = [];
        for (let child of this.#stations[from]._children) {
            allLengths.push(1 + self._cpm(child, to));
        }
        return Math.max(...allLengths)
    }

    _cp(from, to) {
        var self = this;
        if (from == to) {
            return {
                'len': 0, 
                'nodes': [from]
            };
        }
        var allLengths = [];
        var criticalPaths = [];
        this.#stations[from]._children.forEach(child => {
            var cp = self._cp(child, to);
            if (cp.len < 0) {return;}
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

    get y() {
        return this.#yPc * this.#svgHeight / 100; 
    }

    get stripY() {
        return this.#stripPc * this.#svgHeight / 100;
    }

    get turningRadius() {
        return this.#branchSpacing * (Math.sqrt(2) / (Math.sqrt(2)-1));
    }

    get lineXs() {
        return [
            this.#svgWidth * this.#padding / 100, 
            this.#svgWidth * (1 - this.#padding/100)
        ];
    }

    get leftDests() {
        var dests = [];
        for (let stnId in this.#stations) {
            if (!this._stnIndegree(stnId)) {dests.push(stnId)};
        }
        return dests;
    }

    get rightDests() {
        var dests = [];
        for (let stnId in this.#stations) {
            if (!this._stnOutdegree(stnId)) {dests.push(stnId)};
        }
        return dests;
    }

    _stnIndegree(stnId) {
        return this.#stations[stnId]._parents.length;
    }

    _stnOutdegree(stnId) {
        return this.#stations[stnId]._children.length;
    }

    get stnRealXs() {
        var xs = {};
        for (let stnId in this.#stations) {
            xs[stnId] = this._stnRealX(stnId);
        }
        return xs;
    }

    _stnXShare(stnId) {
        var self = this;

        var cp = this.criticalPath;
        if (cp.nodes.includes(stnId)) {return this._cp(cp.nodes[0], stnId).len;}

        var partSource = stnId;
        var partSink = stnId;
        var leftOpenJaw = false;
        var rightOpenJaw = false;

        while (true) {
            var parent = this.#stations[partSource]._parents[0];
            if (!parent) {
                leftOpenJaw = true;
                break;
            }
            partSource = parent;
            if (this._stnOutdegree(partSource) > 1) {
                break;
            }
        }

        while (true) {
            var children = this.#stations[partSink]._children;
            if (children.length) {
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

    get stnRealYs() {
        var ys = {};

        for (let stnId in this.#stations) {
            ys[stnId] = this._stnRealY(stnId);
        }
        return ys;
    }

    _stnYShare(stnId) {
        if (this._stnIndegree(stnId) > 1 || this._stnOutdegree(stnId) > 1) {
            return 0;
        }
        var tmpStn = stnId;
        while (true) {
            var stnPredecessor = this.#stations[tmpStn]._parents[0];
            if (!stnPredecessor) {break;}
            // not left open jaw
            if (this._stnOutdegree(stnPredecessor) > 1) {
                // siblings exist
                if (this.#stations[stnPredecessor]._children.indexOf(tmpStn) == 0) {
                    return 1;
                } else {
                    return -1;
                }
            }
            tmpStn = stnPredecessor;
        }
        while (true) {
            // left open jaw
            var stnSuccessor = this.#stations[tmpStn]._children[0];
            if (this._stnIndegree(stnSuccessor) > 1) {
                // siblings exist
                if (this.#stations[stnSuccessor]._parents.indexOf(tmpStn) == 0) {
                    return 1;
                } else {
                    return -1;
                }
            }
            tmpStn = stnSuccessor;
        }
        return false;
    }

    _stnRealY(stnId) {
        return this.y - this._stnYShare(stnId) * this.#branchSpacing * 2;
    }

    _isSuccessor(stnId1, stnId2) {
        // Is stnId2 a successor of stnId1?
        var self = this;

        var descOfStn1 = this.#stations[stnId1]._children;
        if (!descOfStn1.length) {
            return false;
        } else if (descOfStn1.includes(stnId2)) {
            return true;
        } else {
            for (let desc of descOfStn1) {
                if (self._isSuccessor(desc, stnId2)) {return true;}
            }
        }
        return false;
    }

    _isPredecessor(stnId1, stnId2) {
        // Is stnId2 a predecessor of stnId1?
        var self = this;

        var ansOfStn1 = this.#stations[stnId1]._parents;
        if (!ansOfStn1.length) {
            return false;
        } else if (ansOfStn1.includes(stnId2)) {
            return true;
        } else {
            for (let ans of ansOfStn1) {
                if (self._isPredecessor(ans, stnId2)) {return true;}
            }
        }
        return false;
    }

    _stnState(stnId) {
        if (stnId == this.#currentStnId) {return 0;}
        if (this.#direction == 'r') {
            return this._isSuccessor(this.#currentStnId, stnId) ? 1 : -1;
        } else {
            return this._isPredecessor(this.#currentStnId, stnId) ? 1 : -1;
        }
    }

    _stnNamePos(stnId) {
        var self = this;
        var pos = this.criticalPath.nodes.indexOf(stnId) % 2;
        if (pos == -1) {
            if (this.leftDests.includes(stnId)) {
                pos = 0;
            } else {
                pos = Number(!self._stnNamePos(this.#stations[stnId]._parents[0]));
            }
        }
        return pos;
        return (this.#txtFlip) ? Number(!pos) : pos;
    }

    drawSVGFrame() {
        for (let elem of ['railmap', 'outer']) {
            $(`#${elem}`).attr({
                'width': this.#svgWidth, 
                'height': this.#svgHeight
            });
        }

        for (let elem of ['destination', 'dest_outer']) {
            $(`#${elem}`).attr({
                'width': this.#svgDestWidth, 
                'height': this.#svgHeight
            });
        }
    }

    showFrameOuter() {
        var outerColour = this.#showOuter ? 'black' : 'none';
        $('#outer').attr('stroke', outerColour);
        $('#dest_outer').attr('stroke', outerColour);
    }

    drawStns() {
        for (let [stnId, stnInstance] of Object.entries(this.#stations)) {
            // $('#stn_icons').append(
            //     stnInstance.drawStnIcon()
            // );
            // $('#stn_names').append(
            //     stnInstance.drawStnName()
            // );
            $('#stn_icons').append(stnInstance.html);
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
        // $('#stn_names').html($('#stn_names').html()); // Refresh DOM
    }

    updateStnNameBg() {
        var stnNameDim = getTxtBoxDim(
            $(`#stn_icons > #${this.#currentStnId} > .Name`)[0], 'railmap'
        );
        $('#current_bg').attr({
            'x': stnNameDim.x-2, 
            'y': stnNameDim.y-2, 
            'width': stnNameDim.width+4, 
            'height': stnNameDim.height+4
        })
    }

    drawLine() {
        // for arc
        var r = this.turningRadius;
        var dx = this.turningRadius - this.#branchSpacing;
        var dy = this.#branchSpacing;
        var [lineStart, lineEnd] = this.lineXs;
        var cp = this.criticalPath;
        var extraH = (lineEnd - lineStart) / cp.len * this.#longInterval;
        var dh = ( (lineEnd-lineStart)/cp.len - 2*dx ) / 2;
        if (dh < 0) {
            throw new Error('SVG width too small');
        }

        for (let [leftStnId, leftStnInstance] of Object.entries(this.#stations)) {
            var x1 = this._stnRealX(leftStnId);
            var y1 = this._stnRealY(leftStnId);
            for (let rightStnId of leftStnInstance._children) {
                var x2 = this._stnRealX(rightStnId);
                var y2 = this._stnRealY(rightStnId);

                var lineType = (leftStnInstance._state + this.#stations[rightStnId]._state < 1) ? 'line_pass' : 'line_main';

                if (y1 == y2) {
                    $(`#${lineType}`).append(
                        `<path d="M ${x1},${y1} H ${x2}"/>`
                    );
                } else if (y1 == this.y && y1 > y2) {
                    if (leftStnInstance instanceof Int3RStation) {
                        $(`#${lineType}`).append(
                            `<path d="M ${x1},${y1} h ${extraH + dh} a ${r},${r} 0 0,0 ${dx},${-dy} a ${r},${r} 0 0,1 ${dx},${-dy} H ${x2}"/>`
                        );
                    } else {
                        $(`#${lineType}`).append(
                            `<path d="M ${x1},${y1} h ${dh} a ${r},${r} 0 0,0 ${dx},${-dy} a ${r},${r} 0 0,1 ${dx},${-dy} H ${x2}"/>`
                        );
                    }
                    
                } else if (y1 == this.y && y1 < y2) {
                    if (leftStnInstance instanceof Int3RStation) {
                        $(`#${lineType}`).append(
                            `<path d="M ${x1},${y1} h ${extraH + dh} a ${r},${r} 0 0,1 ${dx},${dy} a ${r},${r} 0 0,0 ${dx},${dy} H ${x2}"/>`
                        );
                    } else {
                        $(`#${lineType}`).append(
                            `<path d="M ${x1},${y1} h ${dh} a ${r},${r} 0 0,1 ${dx},${dy} a ${r},${r} 0 0,0 ${dx},${dy} H ${x2}"/>`
                        );
                    }
                } else if (y2 == this.y && y2 > y1) {
                    if (this.#stations[rightStnId] instanceof Int3LStation) {
                        $(`#${lineType}`).append(
                            `<path d="M ${x2},${y2} h ${-extraH-dh} a ${r},${r} 0 0,1 ${-dx},${-dy} a ${r},${r} 0 0,0 ${-dx},${-dy} H ${x1}"/>`
                        );
                    } else {
                        $(`#${lineType}`).append(
                            `<path d="M ${x2},${y2} h ${-dh} a ${r},${r} 0 0,1 ${-dx},${-dy} a ${r},${r} 0 0,0 ${-dx},${-dy} H ${x1}"/>`
                        );
                    }
                } else {
                    if (this.#stations[rightStnId] instanceof Int3LStation) {
                        $(`#${lineType}`).append(
                            `<path d="M ${x2},${y2} h ${-extraH-dh} a ${r},${r} 0 0,0 ${-dx},${dy} a ${r},${r} 0 0,1 ${-dx},${dy} H ${x1}"/>`
                        );
                    } else {
                        $(`#${lineType}`).append(
                            `<path d="M ${x2},${y2} h ${-dh} a ${r},${r} 0 0,0 ${-dx},${dy} a ${r},${r} 0 0,1 ${-dx},${dy} H ${x1}"/>`
                        );
                    }
                    
                }
            }
        }
        $('#line_main').html($('#line_main').html());
        $('#line_pass').html($('#line_pass').html());
    }

    drawStrip() {
        for (let elem of ['strip', 'dest_strip']) {
            $(`#${elem}`).attr('d', `M 0,${this.stripY} H ${this.#svgWidth}`);
        }
    }

    fillThemeColour() {
        for (let elem of ['line_main', 'strip', 'dest_strip']) {
            $(`#${elem}`).attr('stroke', this.#themeColour);
        }
        $('#dest_name > #platform > circle').attr('fill', this.#themeColour);
    }

    drawDestInfo() {
        $('#dest_name > #platform > text').text(this.#platformNum);

        if (this.#direction == 'l') {
            var destinations = this.leftDests;
            var txtAnchor = 'start';
        } else {
            var destinations = this.rightDests;
            var txtAnchor = 'end';
        }
        var validDest = []
        for (let stnId of destinations) {
            if (this.#stations[stnId]._state >= 0) {validDest.push(stnId)}; 
        }
        var destNameZH = validDest.map(stnId => this.#stations[stnId]._nameZH.replace(/\\/g, ' ')).join('/');
        var destNameEN = validDest.map(stnId => this.#stations[stnId]._nameEN.replace(/\\/g, ' ')).join('/');
        
        $('#dest_name').append(
            `<g text-anchor="${txtAnchor}"> <text class="DestNameZH">往${destNameZH}</text> <text dy="80" class="DestNameEN">to ${destNameEN}</text> </g>`
        );
        $('#dest_name').html($('#dest_name').html());

        var bcr = $('#dest_name > g:last-child')[0].getBoundingClientRect();
        var flagLength = 160 + 150 + bcr.width + 45 + 50;
        var isLeft = (this.#direction == 'l') ? 1 : -1;
        var arrowX = (this.#svgDestWidth - isLeft * flagLength) / 2;
        var arrowRotate = 90 * (1 - isLeft);
        var platformNumX = arrowX + isLeft * (160 + 50 + 75);
        var destNameX = platformNumX + isLeft * (75 + 45);
        $('#dest_name > use').attr('transform', `translate(${arrowX},130)rotate(${arrowRotate})`);
        $('#dest_name > #platform').attr('transform', `translate(${platformNumX},130)`);
        $('#dest_name > g:last-child').attr('transform', `translate(${destNameX},105)`);
    }

    loadFonts() {
        var fontZHToShow = this.#fontEN.concat(this.#fontZH).join(',');
        var fontENToShow = this.#fontEN.join(',');
        
        $('#stn_icons .StnNameZH, .IntNameZH, .OSINameZH').attr('font-family', fontZHToShow);
        $('#stn_icons .StnNameEN, .IntNameEN, .OSINameEN').attr('font-family', fontENToShow);

        $('.DestNameZH').attr('font-family', fontZHToShow);
        $('.DestNameEN').attr('font-family', fontENToShow);
        $('#dest_name > #platform > text').attr('font-family', fontENToShow);
    }
}
