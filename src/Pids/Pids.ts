import { RMGLine } from '../Line/Line'

export class Pids {
    protected _t?: number
    protected _duration?: number
    protected _frameRate?: number
    protected _destination?: string
    protected _timeTable: {
        [stnId: string]: [number, number]
    } = {}
    protected _line: RMGLine

    constructor(line: RMGLine) {
        this._line = line
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

    set destination(stnId: string) {
        if (stnId in this._line.stations) {
            this._destination = stnId
        }
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
