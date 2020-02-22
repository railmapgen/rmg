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

        this._frameRate = 24; // TODO: default value or read from params/RMGLine?
        this._duration = 240; // TODO: as above

        // set the start and end to the start and the end of the main branch
        let routes = this._line.routes;
        this._start = routes[0].filter(stnId => stnId !== 'lineend' && stnId !== 'linestart')[0]
        this._end = routes[0].filter(stnId => stnId !== 'lineend' && stnId !== 'linestart').reverse()[0]
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

    protected _createTimeTable() {
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

        // get the servicing stations
        let route = this._line.routes.map(route => {
            let start = route.indexOf(this._start)
            let end = route.indexOf(this._end)

            // not in this route
            if (!start || !end) return

            // swap if start is bigger than end to be used in slice
            if (start > end) [start, end] = [end, start]

            // get the part after the destination
            let route_pass = route.slice(end + 1)

            return route
        }).flat()

        if (!route) return

        // set current stn according to _timeTable
        let currentStnId = ''
        for (let i = 0; i < route.length; i++) {
            if (t < this._timeTable[route[i]][0]) {
                // before this station
                currentStnId = route[i - 1 < 0 ? i - 1 : 0]
                break
            } else if (t < this._timeTable[route[i]][1]) {
                // at this station
                currentStnId = route[i]
                break
            } else {
                // at next station
            }
        }

        if (!currentStnId) return

        this._line.currentStnId = currentStnId

        // set stations' state after the destination to -1
        // and also other stations in branches where do not inculde _end
        // Todo: distinguish out of service stations and pass stations. Maybe set them to -2? 
        Object.keys(this._line.stations)
            .filter(stnId => !route.includes(stnId))
            .map(stnId => this._line.stations[stnId].state = -1)

        this._line.drawAnimation()
    }
}
