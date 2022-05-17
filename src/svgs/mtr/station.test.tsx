import React from 'react';
import { screen } from '@testing-library/react';
import Station from './station';
import { render } from '../../test-utils';
import { InterchangeInfo, MonoColour, StationInfo, StationState } from '../../constants/constants';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import { createMockStoreWithMockStations } from '../../setupTests';

(Document.prototype as any).fonts = {
    ready: Promise.resolve(),
};

const mockInterchangeInfo: InterchangeInfo = [CityCode.Hongkong, 'twl', '#E2231A', MonoColour.white, '', ''];
const getMockStationInfo = (within: number, outStation: number): StationInfo => {
    return {
        name: ['ZH name', 'EN name'],
        parents: ['stn-par'],
        children: ['stn-child'],
        transfer: {
            info: [Array(within).fill(mockInterchangeInfo), Array(outStation).fill(mockInterchangeInfo)],
            osi_names: [['ZH OSI', 'EN OSI']],
        },
    } as StationInfo;
};

const getMockStore = (within: number, outStation: number) =>
    createMockStoreWithMockStations({ 'test-id': getMockStationInfo(within, outStation) });

const setup = (within: number, outStation: number, isTerminal: boolean = false) =>
    render(
        <svg>
            <Station stationId="test-id" stationState={StationState.CURRENT} isReversed={false} />
        </svg>,
        { store: getMockStore(within, outStation) }
    );

describe('MTR Station', () => {
    describe('MTR Station - OSI link', () => {
        const osiLinkSelector = 'path[stroke-width="2.69"]';

        it('Can render OSI link for 0-1 station as expected', () => {
            setup(0, 1, false);
            const wrapper = screen.getByTestId('station-icon-wrapper');
            expect(wrapper.querySelector(osiLinkSelector)?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 0-2 station as expected', () => {
            setup(0, 2, false);
            const wrapper = screen.getByTestId('station-icon-wrapper');
            expect(wrapper.querySelector(osiLinkSelector)?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 0-1 terminal station as expected', () => {
            setup(0, 1, true);
            const wrapper = screen.getByTestId('station-icon-wrapper');
            expect(wrapper.querySelector(osiLinkSelector)?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 0-2 terminal station as expected', () => {
            setup(0, 2, true);
            const wrapper = screen.getByTestId('station-icon-wrapper');
            expect(wrapper.querySelector(osiLinkSelector)?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 1-1 terminal station as expected', () => {
            setup(1, 1, true);
            const wrapper = screen.getByTestId('station-icon-wrapper');
            expect(wrapper.querySelector(osiLinkSelector)?.getAttribute('d')).toContain('H41');
        });

        it('Can render OSI link for 1-2 terminal station as expected', () => {
            setup(1, 2, true);
            const wrapper = screen.getByTestId('station-icon-wrapper');
            expect(wrapper.querySelector(osiLinkSelector)?.getAttribute('d')).toContain('H41');
        });
    });

    it('Can draw circle for station with 1 within station interchange as expected', () => {
        setup(1, 0);

        const wrapper = screen.getByTestId('station-icon-wrapper');
        expect(wrapper.querySelectorAll('path')).toHaveLength(1);
    });

    it('Can draw pill for station with 3 within station interchange as expected', () => {
        setup(3, 0);

        const wrapper = screen.getByTestId('station-icon-wrapper');
        expect(wrapper.querySelectorAll('path')).toHaveLength(1);
    });

    it('Can draw circle for station with 1 out of station interchange as expected', () => {
        setup(0, 1);

        const wrapper = screen.getByTestId('station-icon-wrapper');
        expect(wrapper.querySelectorAll('path')).toHaveLength(3);
    });

    describe('MTR Station - OSI Icon', () => {
        const osiIconSelector = 'path:last-of-type';

        it('Can render OSI icon for 0-1 station as expected', () => {
            setup(0, 1, false);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('0');
            expect(y).toBe('26');
            expect(scaleY).toBe('1');
        });

        it('Can render OSI icon for 0-2 station as expected', () => {
            setup(0, 2, false);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('0');
            expect(y).toBe('26');
            expect(scaleY).toBe('1');
        });

        it('Can render OSI icon for 0-1 terminal station as expected', () => {
            setup(0, 1, true);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('0');
            expect(y).toBe('26');
            expect(scaleY).toBe('1');
        });

        it('Can render OSI icon for 0-2 terminal station as expected', () => {
            setup(0, 2, true);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('0');
            expect(y).toBe('26');
            expect(scaleY).toBe('1');
        });

        it('Can render OSI icon for 1-1 station as expected', () => {
            setup(1, 1, false);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('0');
            expect(y).toBe('26');
            expect(scaleY).toBe('1');
        });

        it('Can render OSI icon for 1-2 station as expected', () => {
            setup(1, 2, false);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('0');
            expect(y).toBe('26');
            expect(scaleY).toBe('1');
        });

        it('Can render OSI icon for 1-1 terminal station as expected', () => {
            setup(1, 1, true);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('41');
            expect(y).toBe('0');
            expect(scaleY).toBe('-1');
        });

        it('Can render OSI icon for 1-2 terminal station as expected', () => {
            setup(1, 2, true);
            const [x, y, , scaleY] = screen
                .getByTestId('station-icon-wrapper')
                .querySelector(osiIconSelector)
                ?.getAttribute('transform')
                ?.match(/-?\d+/g)!;
            expect(x).toBe('41');
            expect(y).toBe('0');
            expect(scaleY).toBe('-1');
        });
    });
});
