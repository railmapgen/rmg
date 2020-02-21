import { RMGLine } from '../Line/Line'

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
        this._start = this._line.routes[0].filter(stnId => stnId !== 'lineend' && stnId !== 'linestart')[0]
        this._end =  this._line.routes[0].filter(stnId => stnId !== 'lineend' && stnId !== 'linestart').reverse()[0]
    }

    /**
     * Helper function that transforms the time string to number.
     */
    protected _getFrame(text: string): number | undefined {
        // text should be something like '00:00:00:00'
        let texts = text.split(':')
        if (texts.length != 4) return undefined
        let textsInt = texts.map(text => Number(text))
        return (textsInt[0] * 3600 + textsInt[1] * 60 + textsInt[2]) * this._frameRate + textsInt[4]
    }

    protected _createTimeTable() {
        this._line.routes
            .map(route => {
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
        this._duration = this._getFrame(val)
    }

    set t(val: string) {
        this._t = this._getFrame(val)

        // Todo: set current stn according to _timeTable
    }
}
