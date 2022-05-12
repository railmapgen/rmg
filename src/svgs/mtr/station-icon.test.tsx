import React from 'react';
import { screen } from '@testing-library/react';
import StationIcon from './station-icon';
import { render } from '../../test-utils';

describe('MTR StationIcon', () => {
    it('Can draw circle for station with 1 within station interchange as expected', () => {
        render(
            <svg>
                <StationIcon withinTransfer={1} outStationTransfer={0} isPassed={false} />
            </svg>
        );

        const wrapper = screen.getByTestId('station-icon-wrapper');
        expect(wrapper.children).toHaveLength(1);
        expect(screen.getByTestId('station-icon-wrapper').querySelector('circle')).toBeInTheDocument();
    });

    it('Can draw pill for station with 3 within station interchange as expected', () => {
        render(
            <svg>
                <StationIcon withinTransfer={3} outStationTransfer={0} isPassed={false} />
            </svg>
        );

        const wrapper = screen.getByTestId('station-icon-wrapper');
        expect(wrapper.children).toHaveLength(1);
        expect(screen.getByTestId('station-icon-wrapper').querySelector('path')).toBeInTheDocument();
    });

    it('Can draw circle for station with 1 out of station interchange as expected', () => {
        render(
            <svg>
                <StationIcon withinTransfer={0} outStationTransfer={1} isPassed={false} />
            </svg>
        );

        const wrapper = screen.getByTestId('station-icon-wrapper');
        expect(wrapper.children).toHaveLength(3);
        expect(screen.getByTestId('station-icon-wrapper').querySelectorAll('circle')).toHaveLength(2);
    });
});
