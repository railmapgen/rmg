import React from 'react';
import ColourPicker from './colour-picker';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import { act } from 'react-dom/test-utils';
import { render } from '../../../test-utils';
import { fireEvent, screen } from '@testing-library/react';

jest.doMock('@railmapgen/rmg-palette-resources/palettes/hongkong.js', () => ({
    __esModule: true,
    default: [
        {
            id: 'twl',
            name: {
                en: 'Tsuen Wan Line',
                zh: '荃灣綫',
            },
            colour: '#E2231A',
        },
        {
            id: 'ktl',
            name: {
                en: 'Kwun Tong Line',
                zh: '觀塘綫',
            },
            colour: '#00AF41',
            fg: '#000',
        },
    ],
}));

jest.doMock('@railmapgen/rmg-palette-resources/palettes/guangzhou.js', () => ({
    __esModule: true,
    default: [
        {
            id: 'gz1',
            name: {
                en: 'Line 1',
                zh: '1号线',
            },
            colour: '#F3D03E',
            fg: '#000',
        },
        {
            id: 'gz2',
            name: {
                en: 'Line 2',
                zh: '2号线',
            },
            colour: '#00629B',
        },
    ],
}));

const mockCallbacks = {
    onChange: jest.fn(),
};

const setup = () => render(<ColourPicker city={CityCode.Hongkong} {...mockCallbacks} />);

describe('ColourPicker', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Can render line badges inside menu item as expected', async () => {
        setup();
        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText('Tsuen Wan Line')).toHaveStyle({ background: '#E2231A', color: '#FFFFFF' });
        expect(screen.getByText('Kwun Tong Line')).toHaveStyle({ background: '#00AF41', color: '#000000' });
    });

    it('Can search item by other languages and select item as expected', async () => {
        setup();
        await act(async () => {
            await Promise.resolve();
        });

        fireEvent.focus(screen.getByRole('combobox'));
        await screen.findByRole('dialog');

        jest.useFakeTimers();
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '荃灣' } });
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByRole('menuitem', { name: 'Tsuen Wan Line' })).toBeInTheDocument();

        fireEvent.change(screen.getByRole('combobox'), { target: { value: '觀塘' } });
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByRole('menuitem', { name: 'Kwun Tong Line' })).toBeInTheDocument();

        // select ktl
        fireEvent.click(screen.getByText('Kwun Tong Line'));
        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith('ktl', '#00AF41', '#000');
    });

    it('Can reload list of palette when city prop is changed', async () => {
        const { rerender } = setup();
        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText('Tsuen Wan Line')).toBeInTheDocument();

        rerender(<ColourPicker city={CityCode.Guangzhou} {...mockCallbacks} />);
        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText('Line 1')).toBeInTheDocument();
        expect(screen.getByText('Line 2')).toBeInTheDocument();
    });

    it('Can handle invalid city prop as expected', async () => {
        const { rerender } = setup();
        await act(async () => {
            await Promise.resolve();
        });

        fireEvent.focus(screen.getByRole('combobox'));
        await screen.findByRole('dialog');

        expect(screen.getByRole('menuitem', { name: 'Tsuen Wan Line' })).toBeInTheDocument();

        rerender(<ColourPicker city={undefined} {...mockCallbacks} />);
        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    });
});
