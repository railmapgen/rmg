import React from 'react';
import { CityCode, MonoColour } from '@railmapgen/rmg-palette-resources';
import { Direction, InterchangeInfo } from '../../../constants/constants';
import OsiStation from './osi-station';
import { render } from '../../../test-utils';
import { screen } from '@testing-library/react';

const mockInterchangeInfo: InterchangeInfo = [CityCode.Hongkong, 'twl', '#E2231A', MonoColour.white, '', ''];

describe('MTR OsiStation', () => {
    describe('MTR OsiStation - OSI name', () => {
        const setup = (size: number, direction: Direction, isTerminal: boolean = false) =>
            render(
                <svg>
                    <OsiStation
                        interchangeInfoList={Array(size).fill(mockInterchangeInfo)}
                        direction={direction}
                        isTerminal={isTerminal}
                        stationName={['ZH name', 'EN name']}
                    />
                </svg>
            );

        it('Can render osi name for 1-left as expected', () => {
            setup(1, Direction.left);

            const [x] = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)!;
            expect(Number(x)).toBeLessThan(0);
        });

        it('Can render osi name for 1-right as expected', () => {
            setup(1, Direction.right);

            const [x] = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)!;
            expect(Number(x)).toBeGreaterThan(0);
        });

        it('Can render osi name for 2-left as expected', () => {
            setup(2, Direction.left);

            const [x] = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)!;
            expect(Number(x)).toBeGreaterThan(0);
        });

        it('Can render osi name for 2-right as expected', () => {
            setup(2, Direction.right);

            const [x] = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)!;
            expect(Number(x)).toBeLessThan(0);
        });

        it('Can render osi name for 1-left terminal as expected', () => {
            setup(1, Direction.left, true);

            const [x, y] = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)!;
            expect(Number(x)).toBe(0);
            expect(Number(y)).toBeLessThan(0);
        });
    });
});
