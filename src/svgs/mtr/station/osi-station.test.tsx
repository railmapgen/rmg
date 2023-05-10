import { CityCode, MonoColour } from '@railmapgen/rmg-palette-resources';
import { Direction, InterchangeGroup } from '../../../constants/constants';
import OsiStation from './osi-station';
import { render } from '../../../test-utils';
import { screen } from '@testing-library/react';

const getInterchangeGroup = (size: number): InterchangeGroup => ({
    lines: Array(size).fill({ theme: [CityCode.Hongkong, 'twl', '#E2231A', MonoColour.white], name: ['', ''] }),
    name: ['ZH name', 'EN name'],
});

describe('MTR OsiStation', () => {
    describe('MTR OsiStation - OSI name', () => {
        const setup = (size: number, direction: Direction, isTerminal = false) =>
            render(
                <svg>
                    <OsiStation
                        interchangeGroup={getInterchangeGroup(size)}
                        direction={direction}
                        isTerminal={isTerminal}
                    />
                </svg>
            );

        it('Can render osi name for 1-left as expected', () => {
            setup(1, Direction.left);

            const x = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)?.[0];
            expect(Number(x)).toBeLessThan(0);
        });

        it('Can render osi name for 1-right as expected', () => {
            setup(1, Direction.right);

            const x = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)?.[0];
            expect(Number(x)).toBeGreaterThan(0);
        });

        it('Can render osi name for 2-left as expected', () => {
            setup(2, Direction.left);

            const x = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)?.[0];
            expect(Number(x)).toBeGreaterThan(0);
        });

        it('Can render osi name for 2-right as expected', () => {
            setup(2, Direction.right);

            const x = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g)?.[0];
            expect(Number(x)).toBeLessThan(0);
        });

        it('Can render osi name for 1-left terminal as expected', () => {
            setup(1, Direction.left, true);

            const coords = screen.getByText('ZH name').closest('g')?.getAttribute('transform')?.match(/-?\d+/g);
            expect(Number(coords?.[0])).toBe(0);
            expect(Number(coords?.[1])).toBeLessThan(0);
        });
    });
});
