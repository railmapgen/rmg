import React from 'react';
import { act, screen } from '@testing-library/react';
import Station from './station';
import { render } from '../../../test-utils';
import { Direction, InterchangeInfo, MonoColour, StationInfo, StationState } from '../../../constants/constants';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import { createMockStoreWithMockStations } from '../../../setupTests';

(Document.prototype as any).fonts = {
    ready: Promise.resolve([]),
};

(SVGElement.prototype as any).getBBox = () => ({ x: -40, width: 80 });

const mockInterchangeInfo: InterchangeInfo = [CityCode.Hongkong, 'twl', '#E2231A', MonoColour.white, '', ''];
const getMockStationInfo = (within: number, outStation: number, end?: Direction): StationInfo => {
    return {
        name: ['ZH name', 'EN name'],
        parents: end === Direction.left ? ['linestart'] : ['stn-par'],
        children: end === Direction.right ? ['lineend'] : ['stn-child'],
        transfer: {
            info: [Array(within).fill(mockInterchangeInfo), Array(outStation).fill(mockInterchangeInfo)],
            osi_names: [['ZH OSI', 'EN OSI']],
        },
    } as StationInfo;
};

const setup = (within: number, outStation: number, end?: Direction) => {
    render(
        <svg>
            <Station stationId="test-id" stationState={StationState.CURRENT} isReversed={false} />
        </svg>,
        { store: createMockStoreWithMockStations({ 'test-id': getMockStationInfo(within, outStation, end) }) }
    );
};

describe('MTR Station', () => {
    describe('MTR Station - OSI link', () => {
        const osiLinkSelector = 'path[stroke-width="2.69"]';

        it('Can render OSI link for 0-1 station as expected', async () => {
            await act(async () => {
                setup(0, 1);
            });

            // normal osi link
            const link = screen.getByTestId('station-icon-wrapper').querySelector(osiLinkSelector);
            expect(link?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 0-2 station as expected', async () => {
            await act(async () => {
                setup(0, 2);
            });

            // normal osi link
            const link = screen.getByTestId('station-icon-wrapper').querySelector(osiLinkSelector);
            expect(link?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 0-1 terminal station as expected', async () => {
            await act(async () => {
                setup(0, 1, Direction.left);
            });

            // normal osi link (do not rotate to horizontal)
            const link = screen.getByTestId('station-icon-wrapper').querySelector(osiLinkSelector);
            expect(link?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 0-2 terminal station as expected', async () => {
            await act(async () => {
                setup(0, 2, Direction.right);
            });

            // normal osi link (do not rotate to horizontal)
            const link = screen.getByTestId('station-icon-wrapper').querySelector(osiLinkSelector);
            expect(link?.getAttribute('d')).toContain('V26');
        });

        it('Can render OSI link for 1-1 terminal station as expected', async () => {
            await act(async () => {
                setup(1, 1, Direction.left);
            });

            // rotate osi link to horizontal (to the left)
            const link = screen.getByTestId('station-icon-wrapper').querySelector(osiLinkSelector);
            expect(link?.getAttribute('d')).toContain('H41');

            const [scaleX] = link?.getAttribute('transform')?.match(/-?\d+/g)!;
            expect(scaleX).toBe('-1');
        });

        it('Can render OSI link for 1-2 terminal station as expected', async () => {
            await act(async () => {
                setup(1, 2, Direction.right);
            });

            // rotate osi link to horizontal (to the right)
            const link = screen.getByTestId('station-icon-wrapper').querySelector(osiLinkSelector);
            expect(link?.getAttribute('d')).toContain('H41');

            const [scaleX] = link?.getAttribute('transform')?.match(/-?\d+/g)!;
            expect(scaleX).toBe('1');
        });
    });
});
