import React from 'react';
import FlagSvgEmoji from './flag-svg-emoji';
import { render } from '../../../test-utils';
import { screen } from '@testing-library/react';

jest.doMock('@railmapgen/rmg-palette-resources/flags/1F1ED-1F1F0.svg', () => ({
    __esModule: true,
    default: 'mock-svg-src-url',
}));

describe('FlagSvgEmoji', () => {
    it('Can resolute expect src url for SVG version of emoji', async () => {
        render(<FlagSvgEmoji countryCode="HK" svgFilename="1F1ED-1F1F0.svg" />);

        await screen.findByAltText('Flag of HK');
        expect(screen.getByAltText('Flag of HK').getAttribute('src')).toBe('mock-svg-src-url');
    });

    it('Can return empty component when src url not found', done => {
        render(<FlagSvgEmoji countryCode="RANDOM" svgFilename="random.svg" />);

        screen
            .findByAltText('Flag of HK')
            .then(() => {
                throw new Error('Element should NOT be found');
            })
            .catch(() => {
                done();
            });
    });
});
