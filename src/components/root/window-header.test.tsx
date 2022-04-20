import React from 'react';
import { render } from '../../test-utils';
import WindowHeader from './window-header';
import { screen } from '@testing-library/react';

describe('WindowHeader', () => {
    it('Can create link for PRD env with current path', () => {
        Object.defineProperty(window, 'location', {
            get() {
                return { hostname: 'localhost', pathname: '/rmg/mtr' };
            },
        });

        render(<WindowHeader />);

        expect(screen.getByText(/Production environment/).getAttribute('href')).toBe(
            'https://railmapgen.github.io/rmg/mtr'
        );
    });
});
