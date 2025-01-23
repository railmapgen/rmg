import { getStationStates } from './loop-utils';

const stations = ['a', 'b', 'c', 'd', 'e'];

describe('GZMTR loopUtils', () => {
    it('Can calculate station states as expected (anticlockwise)', () => {
        expect(getStationStates(stations, false, 'b', 'd')).toEqual({
            a: -1,
            b: 0,
            c: 1,
            d: 1,
            e: -1,
        });
        expect(getStationStates(stations, false, 'd', 'b')).toEqual({
            a: 1,
            b: 1,
            c: -1,
            d: 0,
            e: 1,
        });
        expect(getStationStates(stations, false, 'c', 'c')).toEqual({
            a: 1,
            b: 1,
            c: 0,
            d: 1,
            e: 1,
        });
        expect(getStationStates(stations, false, 'c')).toEqual({
            a: 1,
            b: 1,
            c: 0,
            d: 1,
            e: 1,
        });
        expect(getStationStates(stations, false, 'c', 'g')).toEqual({
            a: 1,
            b: 1,
            c: 0,
            d: 1,
            e: 1,
        });
    });

    it('Can calculate station states as expected (clockwise)', () => {
        expect(getStationStates(stations, true, 'b', 'd')).toEqual({
            a: 1,
            b: 0,
            c: -1,
            d: 1,
            e: 1,
        });
        expect(getStationStates(stations, true, 'd', 'b')).toEqual({
            a: -1,
            b: 1,
            c: 1,
            d: 0,
            e: -1,
        });
        expect(getStationStates(stations, true, 'c', 'c')).toEqual({
            a: 1,
            b: 1,
            c: 0,
            d: 1,
            e: 1,
        });
        expect(getStationStates(stations, true, 'c')).toEqual({
            a: 1,
            b: 1,
            c: 0,
            d: 1,
            e: 1,
        });
        expect(getStationStates(stations, true, 'c', 'g')).toEqual({
            a: 1,
            b: 1,
            c: 0,
            d: 1,
            e: 1,
        });
    });
});
