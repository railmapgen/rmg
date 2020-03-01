import { RMGLine } from '../Line/Line'
import { PidsTimeTableUI } from '../types'

export class Pids {
    protected _t?: number
    protected _duration?: number
    protected _frameRate?: number
    protected _start: string
    protected _end: string
    protected _timeTable: {
        [stnId: string]: [number, number]
    } = {}
    protected _line: RMGLine

    constructor(line: RMGLine) {
        this._line = line

        this._frameRate = 24; // TODO: read from params/RMGLine
        this._duration = 60; // TODO: read from params/RMGLine

        // set the start and end to the start and the end of the main branch
        let routes = this._line.routes;
        this._start = routes[0].filter(stnId => stnId !== 'lineend' && stnId !== 'linestart')[0]
        this._end = routes[0].filter(stnId => stnId !== 'lineend' && stnId !== 'linestart').reverse()[0]

        // Todo: remove debug
        this.start = 'kaxg'
        this.end = 'sd6y'

        let _: PidsTimeTableUI = {
            'kaxg': ['00:00:00:01','00:00:00:10'],  // 人民广场
            '7x7k': ['00:00:01:00','00:00:01:05'],  // 新闸路
            'sd6y': ['00:00:01:10','00:00:01:20'],  // 上海火车站
        }
        this.updateTimeTable(_)

        // this.t = '00:00:00:00'
        // this.t = '00:00:00:20'
        // this.t = '00:00:01:00'
        // this.t = '00:00:01:21'
    }

    /**
     * Helper function that transforms the time string to number.
     */
    protected _getFrame(text: string): number {
        // text should be something like '00:00:00:00'
        if (!text.match(/^\d\d:\d\d:\d\d:\d\d$/g)) {return NaN;}
        let textsInt = text.split(':').map(Number);
        return (textsInt[0] * 3600 + textsInt[1] * 60 + textsInt[2]) * this._frameRate + textsInt[3]
    }

    protected _servicingStnIds(){
        // get the servicing stations
        return this._line.routes.map(route => {
            // Todo: get direction instead of direct
            //       GET DIRECTION NOT WORK
            if (this._line.direct == 'l') route = route.reverse()

            let start = route.indexOf(this._start)
            let end = route.indexOf(this._end)

            // not in this route
            if (!start || !end) return

            // swap if start is bigger than end to be used in slice
            if (start > end) [start, end] = [end, start]

            // get the part in service
            route = route.slice(start, end + 1)

            return route
        }).flat()
    }

    protected _createTimeTable() {
        this._timeTable = {}
        this._line.routes.map(route => {
            let start = route.indexOf(this._start)
            let end = route.indexOf(this._end)

            // not in this route
            if (!start || !end) return

            // swap if start is bigger than end to be used in slice
            if (start > end) [start, end] = [end, start]

            // get the part where the train travels
            route = route.slice(start, end + 1)

            // update the time table
            route.map(stnId => this._timeTable[stnId] = [0, 0])
        })
    }

    // Todo: how to declare a dict
    protected updateTimeTable(timeTable: PidsTimeTableUI) {
        for (let stnId in this._timeTable) {
            this._timeTable[stnId] = [
                this._getFrame(timeTable[stnId][0]),
                this._getFrame(timeTable[stnId][1])
            ]
        }
    }

    get timetableStnName() {
        let stnIds = this._servicingStnIds()
        return stnIds
    }

    set start(stnId: string) {
        this._start = stnId
        if (this._end) this._createTimeTable()
    }

    set end(stnId: string) {
        this._end = stnId
        if (this._start) this._createTimeTable()
    }

    set frameRate(val: string) {
        // Assuming the val from html is string
        let _val = Number(val)
        if (_val > 0) this._frameRate = _val
    }

    set duration(val: string) {
        let frames = this._getFrame(val);
        if (!isNaN(frames)) {
            console.log(frames)
            this._duration = frames;
        }
    }

    set t(val: string) {
        let t = this._getFrame(val)
        if (this._duration && t > this._duration) return

        this._t = t

        let route = this._servicingStnIds()

        if (!route) return

        // set current stn according to _timeTable
        let currentStnId = ''
        for (let i = 0; i < route.length; i++) {
            if (t < this._timeTable[route[i]][0]) {
                // before this station
                currentStnId = route[i - 1 > 0 ? i - 1 : 0]
                break
            } else if (t < this._timeTable[route[i]][1]) {
                // at this station
                currentStnId = route[i]
                break
            } else {
                // at next station
            }
        }

        if (!currentStnId) currentStnId = route[route.length-1]

        this._line.currentStnId = currentStnId

        // set stations' state after the destination to -1
        // and also other stations in branches where do not inculde _end
        // Todo: distinguish out of service stations and pass stations. Maybe set them to -2? 
        // Todo: current style do not support multiple pass lines,
        //       which means middle part of stations in service will not work properly
        Object.keys(this._line.stations)
            .filter(stnId => !route.includes(stnId))
            .map(stnId => this._line.stations[stnId].state = -1)

        this._line.drawAnimation()
    }
}
