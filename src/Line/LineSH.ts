import { RMGLine } from './Line';
import { RMGStationSH, IntStationSH, OSIStationSH } from '../Station/StationSH';
import { RMGStation } from '../Station/Station';

import { Name, StationInfo } from '../types';

export class RMGLineSH extends RMGLine {
    _svgRuninWidth: number

    constructor(param) {
        super(param);
    }

    _initStnInstance(stnId: string, stnInfo: StationInfo): RMGStation {
        switch (stnInfo.transfer.type) {
            case 'int2':
            case 'int3':
                return new IntStationSH(stnId, stnInfo);
            case 'osi11':
            case 'osi12':
            case 'osi13':
            case 'osi21':
            case 'osi22':
            case 'osi31':
                return new OSIStationSH(stnId, stnInfo);
            default:
                return new RMGStationSH(stnId, stnInfo);
        }
    }

    // draw the destination
    drawDestInfo() {
        $('#station_info_shmetro > #platform > text').text(this._platformNum);

        var bcr = $('#station_info_shmetro > #dest_text')[0].getBoundingClientRect();
        var flagLength = 160 + 150 + bcr.width + 45 + 50;

        // get the height
        let dh = this._svgHeight - 300

        // arrow
        var isLeft = (this._direction == 'l') ? 1 : -1;
        var arrowX = (this._svgDestWidth - isLeft * flagLength) / 20;
        arrowX = (this._direction == 'l') ? arrowX : this._svgDestWidth - 20;
        var arrowRotate = 90 * (1 - isLeft);
        $('#station_info_shmetro > #arrow_left_use').attr(
            'transform', `translate(${arrowX},${135 + dh})rotate(${arrowRotate})`
        )

        // not in use now
        var platformNumX = arrowX + isLeft * (160 + 50 + 75);
        $('#station_info_shmetro > #platform').attr(
            'transform', `translate(${platformNumX},${130 + dh})`
        )

        // list the destination text
        // Todo: fix svg_dest_width*0.8, this has only been tested on 1000 width
        if (this._direction === 'r') {
            var txtAnchor = 'end';
            var destNameX = this._svgDestWidth * 0.8;
        } else {
            var txtAnchor = 'start';
            var destNameX = this._svgDestWidth * 0.2;
        }
        $('#station_info_shmetro > #dest_text').attr({
            transform: `translate(${destNameX},${135 + dh})`,
            'text-anchor': txtAnchor
        });

        // for each left valid destinations, get the name from id
        var [destinations_zh, destinations_en]: String[][] = [[], []]
        this[`${this._direction}ValidDests`].forEach(stn => {
            destinations_zh.push(this.stations[stn].name[0])
            destinations_en.push(this.stations[stn].name[1].replace('\\', ' ')) // Chito: replace \ by space
        });
        $('#station_info_shmetro > #dest_text > text:first-child').text(`往${destinations_zh.join("，")}`)
        $('#station_info_shmetro > #dest_text > text:last-child').text(`To ${destinations_en.join(", ")}`)

        // prepare for the line name
        let lineNameX = this._direction === 'l' ? this._svgDestWidth : 360
        var [lineNameZH, lineNameEN] = this._lineNames;

        // line starts with numbers or letters
        var lineNumber = lineNameZH.match(/(\d*)\w+/)
        if (lineNumber) {
            lineNameX -= 180;
            lineNameZH = "号线"
            $('#station_info_shmetro > #line_number > rect').attr({
                transform: `translate(${lineNameX - 150},${70 + dh})`,
                width: 125, height: 125 // Chito: reset width and height (from pure-chinese name)
            })
            $('#station_info_shmetro > #line_number > text')
                .show().text(lineNumber[0])
                .attr({
                    transform: `translate(${lineNameX - 87.5},${132.5 + dh})`,
                    style: 'letter-spacing:-5px', // Chito: 00 and 88 can fit in the box now (webkit)
                    'text-anchor': 'middle',
                    'dominant-baseline': 'central', // Chito: move baseline of text to the central
                })

            // Chito: If match format X号线, "号线" always black
            // ignore inherit style from g#line_name_text
            $('#station_info_shmetro > #line_name_text text').attr('fill', 'black');
        } else {
            lineNameX -= 280;
            $('#station_info_shmetro > #line_number > rect').attr({
                transform: `translate(${lineNameX - 10},${60 + dh})`,
                width: 260,
                height: 150
            })
            $('#station_info_shmetro > #line_number > text').hide()

            // Chito: If not match format X号线, use inherit style
            $('#station_info_shmetro > #line_name_text text').removeAttr('fill');

            // Todo: set the eng in the middle
            $('#station_info_shmetro > #line_name_text > text:last-child').attr('dx', 10)
        }

        // set the line name
        $('#station_info_shmetro > #line_name_text > text:first-child').text(lineNameZH)
        $('#station_info_shmetro > #line_name_text > text:last-child').text(lineNameEN)
        $('#station_info_shmetro > #line_name_text').attr({
            transform: `translate(${lineNameX},${135 + dh})`,
            'text-anchor': 'start'
        });

        // the last decoration line
        let path = ''
        if (this._direction == 'l') {
            path = `M38,10 H ${this._svgDestWidth - 20} l 0,12 H 24 Z`
        } else {
            path = `M24,10 H ${this._svgDestWidth - 30} l 12,12 H 24 Z`
        }
        $('#line_shmetro_use').attr({
            transform: `translate(0,${220 + dh})`,
            d: path,
        })

        // the platform screen doors flash light
        // #20
        // $('g#station_info_shmetro > rect').attr({ transform: `translate(${this._svgDestWidth / 2},${250 + dh})` })
    }

    get _prevStnIds(): string[] {
        // reduce from https://stackoverflow.com/questions/43773999/remove-duplicates-from-arrays-using-reduce
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
        return this.routes
            .filter(route => route.includes(this._currentStnId))
            .map(route => route[route.indexOf(this._currentStnId) + (this._direction == 'l' ? 1 : -1)])
            .flat()
            // remove duplicate
            .reduce((acc, cur) => {
                if (!acc.includes(cur)) acc.push(cur)
                return acc
            }, [])
    }

    get _nextStnIds(): string[] {
        return this.routes
            .filter(route => route.includes(this._currentStnId))
            .map(route => route[route.indexOf(this._currentStnId) + (this._direction == 'l' ? -1 : 1)])
            .flat()
            // remove duplicate
            .reduce((acc, cur) => {
                if (!acc.includes(cur)) acc.push(cur)
                return acc
            }, [])
    }

    _runinNextStn(dh: number, nextStnIds: string[]) {
        if (this._direction == 'l') {
            var x = 30
            var dx = 50
            var txtAnchor = 'start'
        } else {
            var x = this._svgRuninWidth - 30
            var dx = -50
            var txtAnchor = 'end'
        }
        $('g#next_stn_text').attr({ transform: `translate(${x}, ${dh + 185})`, 'text-anchor': txtAnchor, })
        $('g#next_stn_text > text:first-child').text(this.stations[nextStnIds[0]].name[0])
        $('g#next_stn_text > text:last-child').text(this.stations[nextStnIds[0]].name[1])

        if (nextStnIds.length > 1) {
            $('g#next_stn_branch_text').attr({ transform: `translate(${x}, ${dh + 75})`, 'text-anchor': txtAnchor, })
            $('g#next_stn_branch_text > text:first-child').text(this.stations[nextStnIds[1]].name[0])
            $('g#next_stn_branch_text > text:last-child').text(this.stations[nextStnIds[1]].name[1])
            dh -= 110  // move next_text to a higher position
        }

        $('g#next_text').attr({ transform: `translate(${x}, ${dh + 140})`, 'text-anchor': txtAnchor, })
        $('g#next_text > text:last-child').attr('dx', dx)
    }

    _runinPrevStn(dh: number, prevStnIds: string[]) {
        if (this._direction == 'l') {
            var x = this._svgRuninWidth - 30
            var dx = -50
            var txtAnchor = 'end'
        } else {
            var x = 30
            var dx = 50
            var txtAnchor = 'start'
        }
        $('g#prev_stn_text').attr({ transform: `translate(${x}, ${dh + 185})`, 'text-anchor': txtAnchor, })
        $('g#prev_stn_text > text:first-child').text(this.stations[prevStnIds[0]].name[0])
        $('g#prev_stn_text > text:last-child').text(this.stations[prevStnIds[0]].name[1])

        if (prevStnIds.length > 1) {
            $('g#prev_stn_branch_text').attr({ transform: `translate(${x}, ${dh + 75})`, 'text-anchor': txtAnchor, })
            $('g#prev_stn_branch_text > text:first-child').text(this.stations[prevStnIds[1]].name[0])
            $('g#prev_stn_branch_text > text:last-child').text(this.stations[prevStnIds[1]].name[1])
            dh -= 110  // move prev_text to a higher position
        }

        $('g#prev_text').attr({ transform: `translate(${x}, ${dh + 140})`, 'text-anchor': txtAnchor, })
        $('g#prev_text > text:last-child').attr('dx', dx)
    }

    drawRunin() {
        // Todo: use _svgRuninWidth instead of _svgDestWidth
        this._svgRuninWidth = this._svgDestWidth

        // get the height
        let dh = this._svgHeight - 300

        let nextStnIds = this._nextStnIds
        let prevStnIds = this._prevStnIds

        // current stn text
        $('g#current_text > text:first-child').text(this.stations[this._currentStnId].name[0])
        $('g#current_text > text:last-child').text(this.stations[this._currentStnId].name[1].replace('\\', ' '));

        // show all text and hide when necessary
        $('g#next_stn_text, g#next_text, g#prev_stn_text, g#prev_text, g#next_stn_branch_text, g#prev_stn_branch_text').show()

        if (nextStnIds.length == 1 && ['linestart', 'lineend'].includes(nextStnIds[0])) {
            // terminal station
            if (this._direction == 'l')
                $('g#current_text').attr({ transform: `translate(${30}, ${dh + 160})`, 'text-anchor': 'start', })
            else
                $('g#current_text').attr({ transform: `translate(${this._svgRuninWidth - 30}, ${dh + 160})`, 'text-anchor': 'end', })

            this._runinPrevStn(dh, prevStnIds)

            // clear
            $('g#next_stn_text, g#next_text, #run_in_line_shmetro_pass, g#run_in_branch_shmetro, g#run_in_branch_shmetro_pass, g#next_stn_branch_text, g#prev_stn_branch_text').hide()

            // the last decoration line
            $('#run_in_line_shmetro').attr({
                transform: `translate(0,${220 + dh})`,
                fill: 'gray',
                d: `M24,10 H ${this._svgRuninWidth - 20} V 22 H 24 Z`,
            })
        } else if (prevStnIds.length == 1 && ['linestart', 'lineend'].includes(prevStnIds[0])) {
            // origin station
            if (this._direction == 'l')
                $('g#current_text').attr({ transform: `translate(${this._svgRuninWidth - 30}, ${dh + 160})`, 'text-anchor': 'end', })
            else
                $('g#current_text').attr({ transform: `translate(${30}, ${dh + 160})`, 'text-anchor': 'start', })

            this._runinNextStn(dh, nextStnIds)

            // clear
            $('g#prev_stn_text, g#prev_text, #run_in_line_shmetro_pass, g#run_in_branch_shmetro, g#run_in_branch_shmetro_pass, g#next_stn_branch_text, g#prev_stn_branch_text').hide()

            // the last decoration line
            if (this._direction == 'l') var path = `M38,10 H ${this._svgRuninWidth - 20} l 0,12 H 24 Z`
            else var path = `M24,10 H ${this._svgRuninWidth - 30} l 12,12 H 24 Z`
            $('#run_in_line_shmetro').attr({
                transform: `translate(0,${220 + dh})`,
                fill: 'var(--rmg-theme-colour)',
                d: path,
            })
        } else {
            // general station
            $('g#current_text').attr({ transform: `translate(${this._svgRuninWidth / 2}, ${dh + 160})`, 'text-anchor': 'middle', })

            this._runinNextStn(dh, nextStnIds)
            this._runinPrevStn(dh, prevStnIds)

            // the last decoration line
            let middle = this._svgRuninWidth / 2
            let path = '', path_gray = ''
            if (this._direction == 'l') {
                path = `M 38,10 H ${middle} V 22 H 24 Z`
                path_gray = `M ${middle},10 H ${this._svgRuninWidth - 30} l 0,12 H ${middle} Z`

                // for the fvcking branch decoration line
                if (nextStnIds.length > 1) {
                    $('g#run_in_branch_shmetro').attr({ transform: `translate(0,${110 + dh})`, }).show()
                    $('path#run_in_line_branch_shmetro').attr({ d: `M 38,10 H ${this._svgRuninWidth / 6 + 3} V 22 H 24 Z`, })
                    $('#run_in_line_branch_slash_shmetro').attr({ x1: this._svgRuninWidth / 6, y1: 15, x2: this._svgRuninWidth / 3, y2: 125 })
                } else $('g#run_in_branch_shmetro, g#next_stn_branch_text').hide()
                if (prevStnIds.length > 1) {
                    $('g#run_in_branch_shmetro_pass').attr({ transform: `translate(0,${110 + dh})`, }).show()
                    $('path#run_in_line_branch_shmetro_pass').attr({ d: `M ${this._svgRuninWidth / 6 * 5 - 3},10 H ${this._svgRuninWidth - 30} l 0,12 H ${this._svgRuninWidth / 6 * 5 - 3} Z`, })
                    $('#run_in_line_branch_slash_shmetro_pass').attr({ x1: this._svgRuninWidth / 6 * 5, y1: 15, x2: this._svgRuninWidth / 6 * 4, y2: 125 })
                } else $('g#run_in_branch_shmetro_pass, g#prev_stn_branch_text').hide()
            }
            else {
                path = `M ${middle},10 H ${this._svgRuninWidth - 30} l 12,12 H ${middle} Z`
                path_gray = `M 24,10 H ${middle} l 0,12 H 24 Z`

                // for the fvcking branch decoration line
                if (nextStnIds.length > 1) {
                    $('g#run_in_branch_shmetro').attr({ transform: `translate(0,${110 + dh})`, }).show()
                    $('path#run_in_line_branch_shmetro').attr({ d: `M ${this._svgRuninWidth / 6 * 5 - 3},10 H ${this._svgRuninWidth - 30} l 12,12 H ${this._svgRuninWidth / 6 * 5 - 3} Z`, })
                    $('#run_in_line_branch_slash_shmetro').attr({ x1: this._svgRuninWidth / 6 * 5, y1: 15, x2: this._svgRuninWidth / 6 * 4, y2: 125 })
                } else $('g#run_in_branch_shmetro, g#next_stn_branch_text').hide()
                if (prevStnIds.length > 1) {
                    $('g#run_in_branch_shmetro_pass').attr({ transform: `translate(0,${110 + dh})`, }).show()
                    $('path#run_in_line_branch_shmetro_pass').attr({ d: `M 38,10 H ${this._svgRuninWidth / 6 + 3} V 22 H 24 Z`, })
                    $('#run_in_line_branch_slash_shmetro_pass').attr({ x1: this._svgRuninWidth / 6, y1: 15, x2: this._svgRuninWidth / 3, y2: 125 })
                } else $('g#run_in_branch_shmetro_pass, g#prev_stn_branch_text').hide()
            }

            $('#run_in_line_shmetro').attr({
                transform: `translate(0,${220 + dh})`,
                fill: 'var(--rmg-theme-colour)',
                d: path,
            })
            $('#run_in_line_shmetro_pass').attr({
                transform: `translate(0,${220 + dh})`,
                d: path_gray,
            }).show()
        }
    }

    // rewrite this to append dom and then getBoundingClientRect
    // to get the exact position where int icon can be fit
    drawStns() {
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) { continue; }
            $('#stn_icons').append(stnInstance.html);
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM

        for (let [stnId, stnInstance] of Object.entries(this.stations)
            .filter(stn => stn[1] instanceof IntStationSH) as [string, IntStationSH][]) {
            $(`#rmg-name__shmetro--${stnId}`).parent().append(stnInstance.ungrpIconHTML)
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
    }

    // rewrite this to change the y of branch station
    _stnYShare(stnId): number {
        if (this.branches[0].includes(stnId)) return 0;
        else return 3
    }

    _linePath(stnIds: string[], type?: 'main' | 'pass'): string {
        var [prevId, prevY, prevX]: [string?, number?, number?] = []
        var path: { [key: string]: number[] } = {}
        const e = 30

        stnIds.forEach(stnId => {
            var [x, y] = ['_stnRealX', '_stnRealY'].map(fun => this[fun](stnId))
            if (!prevY && prevY !== 0) {
                [prevId, prevX, prevY] = [stnId, x, y];
                path['start'] = [x, y];
                return
            }
            if (y === 0) {
                // merge back to main line
                if (y != prevY) {
                    path['bifurcate'] = [prevX, prevY]
                }
            } else {
                // on the branch line
                if (y != prevY) {
                    path['bifurcate'] = [x, y]
                }
            }
            path['end'] = [x, y];
            [prevId, prevX, prevY] = [stnId, x, y];
        });

        // generate path
        if (!path.hasOwnProperty('start')) {
            // no line generated
            // keys in path: none
            return ''
        } else if (!path.hasOwnProperty('end')) {
            // litte line (only beyond terminal station)
            // keys in path: start
            let [x, y] = path['start']
            if (type === 'main') {
                // current at terminal(end) station, draw the litte main line
                if (this._direction === 'l') {
                    return `M ${x},${y - 6} L ${x - e},${y - 6} l -12,12 L ${x},${y + 6} Z`
                } else {
                    return `M ${x},${y - 6} L ${x + e},${y - 6} l 12,12 L ${x},${y + 6} Z`
                }
            } else {
                // type === 'pass'
                // current at terminal(start) station, draw the litte pass line
                if (this._direction === 'l') {
                    return `M ${x},${y} L ${x + e},${y}`
                } else {
                    return `M ${x - e},${y} L ${x},${y}`
                }
            }
        }
        else if (!path.hasOwnProperty('bifurcate')) {
            // general main line
            // keys in path: start, end
            let [x, y] = path['start'], h = path['end'][0]
            if (type === 'main') {
                if (this._direction === 'l') {
                    return `M ${x - e},${y - 6} H ${h} l 0,12 L ${x - 42},${y + 6} Z`
                } else {
                    return `M ${x},${y - 6} H ${h + e} l 12,12 L ${x},${y + 6} Z`
                }
            } else {
                // type === 'pass'
                if (this._direction === 'l') {
                    return `M ${x - e},${y} H ${h + e}`
                } else {
                    return `M ${x - e},${y} H ${h + e}`
                }
            }
        } else {
            // main line bifurcate here to become the branch line
            // and path return here are only branch line
            // keys in path: start, bifurcate, end

            // Todo: disable lower branch
            let [x, y] = path['start'], h = path['end'][0]
            let [xb, yb] = path['bifurcate'], [xm, ym] = path['end']
            if (type === 'main') {
                if (this._direction === 'l') {
                    if (ym > y) {
                        // main line, left direction, center to upper
                        return `M ${x - e},${y - 6} H ${xm + 6} V ${ym - 6} h -12 V ${y + 6} H ${x - e - 12} Z`
                    } else {
                        // main line, left direction, upper to center
                        // this same as the other, but replace x with xm and xm with x
                        return `M ${xm},${ym - 6} H ${x - 6} V ${y - 6} h 12 V ${ym + 6} H ${xm} Z`
                    }
                } else {
                    if (ym > y) {
                        // main line, right direction, upper to center
                        return `M ${x},${y - 6} H ${xm + 6} V ${ym - 6} h -12 V ${y + 6} H ${x} Z`
                    } else {
                        // main line, right direction, center to upper
                        // this same as the other, but replace x with xm and xm with x
                        return `M ${xm + e},${ym - 6} H ${x - 6} V ${y - 6} h 12 V ${ym + 6} H ${xm + e + 12} Z`
                    }
                }
            } else {
                // type === 'pass'
                if (this._direction === 'l') {
                    if (ym > y) {
                        // pass line, left direction, center to upper
                        return `M ${x - e},${y} H ${xm} V ${ym}`
                    }
                    else {
                        // pass line, left direction, upper to center
                        return `M ${x},${y} V ${ym} H ${xm + e}`
                    }
                } else {
                    if (ym > y) {
                        // pass line, right direction, upper to center
                        return `M ${x - e},${y} H ${xm} V ${ym}`
                    } else {
                        // pass line, right direction, center to upper
                        return `M ${x},${y} V ${ym} H ${xm + e}`
                    }
                }
            }
        }
    }

    // draw the line in railmap
    drawLine() {
        $('.rmg-line').removeClass('rmg-line__mtr').addClass('rmg-line__shmetro');

        this.branches.map(branch => {
            var lineMainStns = branch.filter(stnId => this.stations[stnId].state >= 0);
            var linePassStns = branch.filter(stnId => this.stations[stnId].state <= 0);

            if (lineMainStns.length === 1) {
                linePassStns = branch;
            }

            if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length == 0 && lineMainStns.length) {
                // if two set disjoint
                if (linePassStns[0] === branch[0]) {
                    // -1 -1 1 1
                    linePassStns.push(lineMainStns[0]);
                } else if (lineMainStns[0] === branch[0] && lineMainStns[lineMainStns.length - 1] === branch[branch.length - 1] && linePassStns.length) {
                    linePassStns = branch;
                    lineMainStns = [];
                } else {
                    // 1 1 -1 -1
                    linePassStns.unshift(lineMainStns[lineMainStns.length - 1]);
                }
            }

            // rewrite the second parameter to get the path correctly
            $('#line_main').append(
                $('<path>', {
                    fill: 'var(--rmg-theme-colour)',
                    d: this._linePath(lineMainStns, 'main')
                })
            );
            $('#line_pass').append(
                $('<path>', {
                    stroke: 'gray',
                    'stroke-width': 12,
                    fill: 'none',  // fix mysterious fill problem
                    d: this._linePath(linePassStns, 'pass')
                })
            );
        });

        $('#line_main').html($('#line_main').html());
        $('#line_pass').html($('#line_pass').html());

        $('#railmap > #main').attr('transform', `translate(0,${this._svgHeight - 63})`)
    }

    fillThemeColour() {
        super.fillThemeColour();

        $('style#global').text(`:root{--rmg-theme-colour:${this._themeColour};--rmg-theme-fg:${this._fgColour}}`);
    }

    updateStnName(stnId: string, names: Name) {
        super.updateStnName(stnId, names);

        let stnInstance = this.stations[stnId];
        if (stnInstance instanceof IntStationSH) {
            $(`#rmg-name__shmetro--${stnId}`).parent().append(stnInstance.ungrpIconHTML)
            $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
        }

        if (this.stations[this._currentStnId].parents.includes(stnId) || this.stations[this._currentStnId].children.includes(stnId)) {
            this.drawRunin();
        }

        if (this._currentStnId === stnId) {
            this.drawRunin();
        }

        if (this.leftDests.includes(stnId) || this.rightDests.includes(stnId)) {
            this.drawDestInfo();
        }
    }

    updateStnNameBg() {
        $('#current_bg').hide();  // fix the mysterious black rect
    }

    drawAnimation() {
        Object.keys(this.stations).map(stnId => {
            let stnInstance = this.stations[stnId]
            if(stnInstance instanceof IntStationSH) var prefix = 'int2'
            else var prefix = 'stn'
            if (stnInstance.state > 0) {
                // remaining stations
                $(`#${stnId} > g:first-child > use`).attr({'xlink:href': `#${prefix}_sh_animation`})
            } else if (stnInstance.state < 0) {
                // passing stations
                $(`#${stnId} > g:first-child > use`).attr('xlink:href', `#${prefix}_sh_pass_animation`)
            } else if (stnInstance.state == 0) {
                // current station
                $(`#${stnId} > g:first-child > use`).attr('xlink:href', `#${prefix}_sh_current_animation`)
            }
            // $(`#${stnId} use`).html($(`#${stnId} use`).html)
        })
    }

    clearAnimation() {
        // clear the original stations
        $('#stn_icons').empty()
        this.drawStns()
    }

    // rewrite this to make sure the line is draw before color
    static initSVG(line) {
        line.drawSVGFrame();
        line.showFrameOuter();
        line.drawStns();

        // change the func call here
        line.drawLine();
        line.fillThemeColour();
        // change the func call here

        // add this to draw the third canvas
        line.drawRunin()

        line.drawStrip();
        line.drawDestInfo();
        line.updateStnNameBg();
    }

    set lineNames(val: Name) {
        super.lineNames = val
        this.drawDestInfo()
    }

    set currentStnId(val: string) {
        super.currentStnId = val
        this.drawRunin()
    }

    set direction(val: 'l' | 'r') {
        super.direction = val
        this.drawRunin()
    }

    set svgHeight(val: number) {
        super.svgHeight = val
        this.drawLine()
    }

    set svgDestWidth(val: number) {
        super.svgDestWidth = val
        this.drawRunin()
    }
}
