import StationSecondaryName from './station-secondary-name';
import { render } from '../../../test-utils';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockGetBBox = vi.fn();
(SVGElement.prototype as any).getBBox = mockGetBBox;

const onUpdate = vi.fn();

const mockBBox = { x: -30, width: 59 } as SVGRect;

describe('StationSecondaryName', () => {
    beforeEach(() => {
        mockGetBBox.mockReturnValueOnce(mockBBox);
    });

    it('Can shift parentheses to expected position', () => {
        render(
            <svg>
                <StationSecondaryName stnName={['1号航站楼', 'Terminal 1']} onUpdate={onUpdate} />
            </svg>
        );

        expect(onUpdate).toBeCalledTimes(1);
        expect(onUpdate).toBeCalledWith(mockBBox);

        expect(screen.getByText('(')?.getAttribute('x')).toBe('-33');
        expect(screen.getByText(')')?.getAttribute('x')).toBe('32');
    });
});
