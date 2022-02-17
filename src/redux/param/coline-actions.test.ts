import { checkColineValidity } from './coline-action';
import { StationDict } from '../../constants/constants';

describe('Unit tests for coline action', () => {
    it('Coline-check-validity-single-mainline', () => {
        console.log(`
        /**
         * stn1 - stn2 - stn3
         *  ^
         */`);
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn3'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;

        expect(() =>
            checkColineValidity([['linestart', 'stn1', 'stn2', 'stn3', 'lineend']], 'stn1', 'stn2', mockStationList)
        ).toThrow('addColine():: failed');

        expect(() =>
            checkColineValidity([['linestart', 'stn1', 'stn2', 'stn3', 'lineend']], 'stn2', 'stn3', mockStationList)
        ).toThrow('addColine():: failed');

        expect(() =>
            checkColineValidity([['linestart', 'stn1', 'stn2', 'stn3', 'lineend']], 'stn1', 'stn3', mockStationList)
        ).not.toThrow();
    });

    it('Coline-check-validity-multiple-branch-lines', () => {
        console.log(`
        /**
         * stnA - stnB
         *             \
         *        stn1 - stn2 - stn3 - stn4
         *         ^
         *                           \ stnZ
         * 
         * Coline between any of stn1, stn3, stn4 and stn3 - stnZ should be allowed.
         */`);
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stnA', 'stn1'],
                branch: { left: [], right: ['through', 'stnA'] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3'],
                branch: { left: ['through', 'stnB'], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: ['through', 'stnZ'] },
            },
            stn4: {
                parents: ['stn3'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            stnA: {
                parents: ['linestart'],
                children: ['stnB'],
                branch: { left: [], right: [] },
            },
            stnB: {
                parents: ['stnA'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stnZ: {
                parents: ['stn3'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn4', 'stnZ'],
                children: [],
                branch: { left: ['through', 'stnZ'], right: [] },
            },
        } as any as StationDict;
        const branches = [
            ['linestart', 'stn1', 'stn2', 'stn3', 'stn4', 'lineend'],
            ['linestart', 'stnA', 'stnB', 'stn2'],
            ['stn3', 'stnZ', 'lineend'],
        ];

        expect(() => checkColineValidity(branches, 'stn1', 'stn2', mockStationList)).toThrow('addColine():: failed');

        expect(() => checkColineValidity(branches, 'stn2', 'stn3', mockStationList)).toThrow('addColine():: failed');

        expect(() => checkColineValidity(branches, 'stn1', 'stn3', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn3', 'stn4', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn1', 'stn4', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn2', 'stnZ', mockStationList)).toThrow('addColine():: failed');

        expect(() => checkColineValidity(branches, 'stn3', 'stnZ', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn4', 'stnZ', mockStationList)).toThrow('addColine():: failed');
    });
});
